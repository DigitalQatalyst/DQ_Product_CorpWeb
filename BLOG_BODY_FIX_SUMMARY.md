# Blog Body Not Saving - Root Cause Analysis & Fix

## Problem
Blog posts are being created successfully, but the `body_html` content is not being saved to the database.

## Root Cause
The issue is in `src/admin-ui/utils/supabase.ts` in the `createMediaItem` function. The switch statement for handling different content types has the Blog case falling through to the Article case due to missing break statements.

### Current Code (BROKEN):
```typescript
const child: any = (() => {
  const d = data as any
  switch (type) {
    case 'Blog':
      return { 
        author_id: d.authorId || null,
        excerpt: d.excerpt || d.summary || '',
        body_html: d.bodyHtml || d.body || '', 
        body_json: d.bodyJson || null,
        focus_keyword: d.focusKeyword || null,
        related_keywords: ...
      }
    case 'Article':  // <-- Falls through here!
    case 'News':
    case 'Guide':
      return { body_html: d.bodyHtml || d.body || '', body_json: d.bodyJson || null, byline: d.author || null, source: d.source || null }
```

## The Fix

The Blog case returns correctly, but we need to ensure it doesn't fall through. Since we're using `return` statements, this should work, but let's verify the data flow.

## Debugging Steps

1. **Check Console Logs**: When creating a blog, check the browser console for these logs:
   ```
   📦 createMediaItem debug:
   🔧 RPC call debug - child data:
   🔧 RPC call debug - full params:
   ```

2. **Verify the child object contains**:
   - `author_id`: UUID of the author
   - `excerpt`: Blog excerpt
   - `body_html`: **THIS SHOULD CONTAIN YOUR BLOG CONTENT**
   - `body_json`: JSON representation
   - `focus_keyword`: SEO keyword
   - `related_keywords`: Array of keywords

3. **Check the form submission**: In `MediaCreate.tsx`, verify:
   ```typescript
   const payload = {
     ...formData,
     bodyHtml: editorHtml,  // <-- Should contain sanitized HTML
     bodyJson: formData.bodyJson,
     body: editorHtml,  // <-- Also set for compatibility
   }
   ```

## Testing Checklist

- [ ] Open browser console
- [ ] Navigate to Blog creation form
- [ ] Fill in all required fields including body content
- [ ] Submit the form
- [ ] Check console logs for the `_child` parameter
- [ ] Verify `body_html` is present and contains content
- [ ] Check database `blogs` table for the `body_html` column
- [ ] Query: `SELECT id, excerpt, body_html FROM blogs WHERE id = 'your-blog-id';`

## Quick Test Query

Run this in Supabase SQL Editor to check if body_html is being saved:

```sql
-- Check the most recent blog
SELECT 
  m.id,
  m.title,
  m.slug,
  b.excerpt,
  LENGTH(b.body_html) as body_html_length,
  SUBSTRING(b.body_html, 1, 100) as body_html_preview
FROM media_items m
JOIN blogs b ON b.id = m.id
WHERE m.type = 'Blog'
ORDER BY m.created_at DESC
LIMIT 5;
```

## If Body is Still Empty

If the body is still not saving after checking the above:

1. **Check the RPC function** in Supabase SQL Editor:
   ```sql
   -- Verify the create_media_item function exists and handles blogs
   SELECT routine_name, routine_definition
   FROM information_schema.routines
   WHERE routine_name = 'create_media_item';
   ```

2. **Run the fix_blog_rpc.sql** script to ensure the RPC function is correct

3. **Check RLS policies** on the blogs table:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'blogs';
   ```

4. **Verify the blogs table structure**:
   ```sql
   \d blogs
   -- or
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'blogs';
   ```

## Test Files Created

I've created comprehensive test files to help you debug:

1. **`src/admin-ui/utils/testBlogCreation.ts`** - Complete blog creation test with 8-paragraph content
2. **`src/admin-ui/utils/runBlogTest.ts`** - Test runner that can be called from console
3. **`src/admin-ui/components/BlogTestDebug.tsx`** - UI component for testing

### How to Use the Test

**Option 1: Browser Console**
```javascript
// The test functions are automatically available in console
runBlogTest()  // Creates a test blog and verifies it
testExistingBlog("your-slug")  // Tests an existing blog
```

**Option 2: Add Debug Component**
Add the BlogTestDebug component to your admin interface temporarily:

```typescript
import { BlogTestDebug } from '../components/BlogTestDebug';

// In your admin page:
<BlogTestDebug />
```

## Expected Behavior

When working correctly:
1. Form submits with `bodyHtml` containing HTML content
2. `createMediaItem` receives the data and constructs the `child` object
3. RPC function `create_media_item` inserts into `media_items` table
4. RPC function inserts into `blogs` table with `body_html` field
5. Query from `v_media_all` view returns the blog with body content
6. Blog page displays the content correctly

## Next Steps

1. Run the test using `runBlogTest()` in console
2. Check the console logs for the exact payload being sent
3. Verify the RPC function is receiving the correct data
4. Check if the data is being inserted into the `blogs` table
5. If still failing, check RLS policies and table permissions
