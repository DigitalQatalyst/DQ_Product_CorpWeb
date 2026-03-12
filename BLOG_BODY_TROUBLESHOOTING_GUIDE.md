# Blog Body Not Saving - Complete Troubleshooting Guide

## Quick Diagnosis

Run this in your Supabase SQL Editor:
```sql
\i diagnose_blog_body.sql
```

Or run the test in your browser console:
```javascript
runBlogTest()
```

## Problem Summary

Your blog creation form works, but the `body_html` content is not being saved to the database. This guide will help you identify and fix the issue.

## Step-by-Step Troubleshooting

### Step 1: Verify the Frontend is Sending Data

1. Open your browser's Developer Console (F12)
2. Navigate to the Blog creation form
3. Fill in all fields including the body content
4. Click Submit
5. Look for these console logs:

```
📦 createMediaItem debug:
   data.type: Blog
   resolved type: Blog
🔧 RPC call debug - child data: {
  author_id: "...",
  excerpt: "...",
  body_html: "<p>Your content here...</p>",  <-- THIS SHOULD HAVE CONTENT
  body_json: {...},
  focus_keyword: "...",
  related_keywords: [...]
}
```

**If `body_html` is empty or missing:**
- The form is not capturing the editor content
- Check `MediaCreate.tsx` line ~490 where it sets `bodyHtml`
- Verify the `EnhancedRichTextEditor` is calling `onChange` correctly

**If `body_html` has content:**
- The frontend is working correctly
- The issue is in the backend (database or RPC function)

### Step 2: Check the Database Structure

Run in Supabase SQL Editor:
```sql
-- Check if blogs table has body_html column
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'blogs' AND column_name = 'body_html';
```

**Expected Result:**
```
column_name | data_type
body_html   | text
```

**If column is missing:**
```sql
-- Add the missing column
ALTER TABLE blogs ADD COLUMN body_html TEXT;
```

### Step 3: Check Recent Blog Entries

```sql
SELECT 
  m.title,
  m.slug,
  LENGTH(COALESCE(b.body_html, '')) as body_length,
  CASE 
    WHEN b.body_html IS NULL THEN '❌ NULL'
    WHEN b.body_html = '' THEN '❌ EMPTY'
    ELSE '✅ HAS CONTENT'
  END as status
FROM media_items m
JOIN blogs b ON b.id = m.id
WHERE m.type = 'Blog'
ORDER BY m.created_at DESC
LIMIT 5;
```

**If all blogs show NULL or EMPTY:**
- The RPC function is not inserting body_html
- Continue to Step 4

### Step 4: Test Direct Database Insert

```sql
-- Test if you can insert body_html directly
DO $$
DECLARE
  test_id uuid := gen_random_uuid();
  test_author_id uuid;
BEGIN
  SELECT id INTO test_author_id FROM authors LIMIT 1;
  
  INSERT INTO media_items (id, title, slug, type, status, visibility, language)
  VALUES (test_id, 'Direct Test', 'direct-test-' || floor(random()*1000)::text, 'Blog', 'Draft', 'Public', 'en');
  
  INSERT INTO blogs (id, author_id, excerpt, body_html)
  VALUES (test_id, test_author_id, 'Test excerpt', '<p>Test body content</p>');
  
  -- Verify
  IF EXISTS (SELECT 1 FROM blogs WHERE id = test_id AND body_html IS NOT NULL) THEN
    RAISE NOTICE '✅ Direct insert works! Issue is in RPC function.';
  ELSE
    RAISE NOTICE '❌ Direct insert failed! Check RLS policies.';
  END IF;
END $$;
```

**If direct insert works:**
- The database structure is fine
- The issue is in the `create_media_item` RPC function
- Run `fix_blog_rpc.sql`

**If direct insert fails:**
- RLS policies are blocking the insert
- Run `complete_blog_fix.sql`

### Step 5: Check the RPC Function

```sql
-- View the create_media_item function
SELECT routine_definition
FROM information_schema.routines
WHERE routine_name = 'create_media_item';
```

Look for this section in the Blog case:
```sql
IF t = 'blog' THEN
  INSERT INTO public.blogs (id, author_id, excerpt, body_html, body_json, ...)
  VALUES (
    _id,
    NULLIF((_child->>'author_id')::uuid, ...),
    public._jtxt(_child,'excerpt'),
    public._jtxt(_child,'body_html'),  <-- THIS LINE MUST EXIST
    _child->'body_json',
    ...
  );
```

**If `body_html` line is missing:**
```sql
-- Run the fix
\i fix_blog_rpc.sql
```

### Step 6: Check RLS Policies

```sql
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'blogs';
```

**You should see a permissive policy like:**
```
policyname: "Allow all operations on blogs for development"
cmd: ALL
qual: true
with_check: true
```

**If policies are restrictive:**
```sql
-- Run the RLS fix
\i complete_blog_fix.sql
```

### Step 7: Verify the View Mapping

```sql
-- Check if v_media_all correctly maps blog body
SELECT 
  id,
  title,
  type,
  body_html,
  blog_body_html
FROM v_media_all
WHERE type = 'Blog'
LIMIT 1;
```

**Both `body_html` and `blog_body_html` should have content.**

**If they're NULL:**
```sql
-- Recreate the view
\i fix_blog_rpc.sql
```

## Common Issues and Solutions

### Issue 1: "body_html is empty in console logs"

**Cause:** Form is not capturing editor content

**Solution:**
1. Check that `EnhancedRichTextEditor` is being used (not `RichTextEditor`)
2. Verify the `onChange` handler is updating `formData.bodyHtml`
3. Check line ~1485 in `MediaCreate.tsx`:
   ```typescript
   onChange={(json, html) => {
     setFormData((prev) => ({ 
       ...prev, 
       bodyJson: json, 
       bodyHtml: html,
       body: html  // Ensure this line exists
     }));
   }}
   ```

### Issue 2: "RPC function receives body_html but doesn't save it"

**Cause:** RPC function is not extracting or inserting body_html

**Solution:**
```sql
-- Run this fix
\i fix_blog_rpc.sql
```

### Issue 3: "Direct insert works but RPC fails"

**Cause:** RPC function has incorrect parameter extraction

**Solution:**
Check the RPC function uses:
```sql
public._jtxt(_child,'body_html')  -- Correct
-- NOT
_child->>'body_html'  -- May fail if _jtxt helper is needed
```

### Issue 4: "Everything looks correct but still not saving"

**Cause:** Type mismatch or case sensitivity

**Solution:**
1. Verify the type is exactly 'Blog' (capital B)
2. Check console logs show `resolved type: Blog`
3. Ensure RPC function checks `IF t = 'blog'` (lowercase)
4. The RPC function should use `lower(coalesce(_type,''))` to normalize

## Testing Tools

### Browser Console Test
```javascript
// Run this in browser console
runBlogTest()

// Or test an existing blog
testExistingBlog("your-blog-slug")
```

### SQL Diagnostic
```sql
-- Run complete diagnostic
\i diagnose_blog_body.sql
```

### UI Test Component
Add to your admin interface:
```typescript
import { BlogTestDebug } from './components/BlogTestDebug';

// In your page
<BlogTestDebug />
```

## Files to Run (in order)

If you're still having issues, run these SQL files in order:

1. **`complete_blog_fix.sql`** - Fixes RLS policies
2. **`fix_blog_rpc.sql`** - Fixes RPC function and view
3. **`diagnose_blog_body.sql`** - Runs diagnostics

## Success Criteria

After fixing, you should see:

1. ✅ Console logs show `body_html` with content
2. ✅ Direct database query shows body_html in blogs table
3. ✅ v_media_all view returns body_html
4. ✅ Blog page displays the content
5. ✅ Test blog creation succeeds with `runBlogTest()`

## Still Not Working?

If you've tried everything above and it's still not working:

1. **Export your current blog data** (if any)
2. **Run the nuclear option:**
   ```sql
   \i recreate_authors_and_blogs.sql
   ```
   This will drop and recreate the entire blog system

3. **Re-import your data**

4. **Test with a fresh blog post**

## Need More Help?

Check these files for detailed information:
- `BLOG_BODY_FIX_SUMMARY.md` - Root cause analysis
- `diagnose_blog_body.sql` - Diagnostic queries
- `fix_blog_rpc.sql` - RPC function fix
- `complete_blog_fix.sql` - RLS policy fix

Run the test suite:
- `src/admin-ui/utils/testBlogCreation.ts` - Test functions
- `src/admin-ui/utils/runBlogTest.ts` - Test runner
- `src/admin-ui/components/BlogTestDebug.tsx` - UI test component
