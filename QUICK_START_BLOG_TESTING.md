# Quick Start: Blog Testing Guide

## 🚀 Quick Test (5 minutes)

### Step 1: Run the SQL Fix
```bash
# In your Supabase SQL Editor, run:
complete_blog_fix.sql
```

### Step 2: Test Blog Creation

**Option A: Use the Test Suite (Recommended)**
```javascript
// Open browser console on your admin page
runBlogTest()
```

**Option B: Create Manually**
1. Go to Admin UI → Create Media → Blog tab
2. Fill in all required fields:
   - Title
   - Hero Image
   - Author (select from dropdown)
   - Category
   - Publication Date
   - Reading Time
   - Excerpt
   - **Main Blog Content** (use the rich text editor - add at least 8 paragraphs)
3. Click Submit

### Step 3: Verify in Database
```sql
-- Run this in Supabase SQL Editor:
SELECT 
    m.title,
    m.slug,
    LENGTH(b.body_html) as body_length,
    LEFT(b.body_html, 200) as body_preview
FROM media_items m
JOIN blogs b ON b.id = m.id
ORDER BY m.created_at DESC
LIMIT 1;
```

### Step 4: View the Blog
```
Navigate to: /blog/your-blog-slug
```

## ✅ Success Indicators

You'll know it's working when:

1. **Database Check:** `body_length` > 0 (should be several hundred characters)
2. **Blog Page:** Content displays with proper formatting
3. **Author Info:** Author name and details appear
4. **Test Suite:** Returns `success: true`

## ❌ If Something's Wrong

### Problem: Body content is empty in database

**Solution 1: Check the form**
```javascript
// In browser console while on the create page:
console.log('Form data:', formData);
// Look for bodyHtml and body fields
```

**Solution 2: Check the editor**
```javascript
// Make sure EnhancedRichTextEditor onChange is firing:
// Add console.log in MediaCreate.tsx line ~1485
console.log('Editor changed:', { json, html });
```

**Solution 3: Run diagnostic**
```sql
-- Run verify_blog_body.sql in Supabase
```

### Problem: Blog page shows "not found"

**Check 1: Verify slug**
```sql
SELECT slug, status, visibility 
FROM media_items 
WHERE type = 'Blog' 
ORDER BY created_at DESC;
```

**Check 2: Verify v_media_all**
```sql
SELECT * FROM v_media_all 
WHERE slug = 'your-slug';
```

### Problem: Author info missing

**Solution:**
```sql
-- Run complete_blog_fix.sql to fix RLS policies
-- Then verify authors exist:
SELECT id, name, title FROM authors;
```

## 📝 Test Blog Content Template

Use this for manual testing:

```html
<p>This is the opening paragraph that introduces the topic and engages the reader with compelling information about the subject matter.</p>

<h2>First Major Section</h2>

<p>This paragraph expands on the first major point, providing detailed information and context that helps readers understand the core concepts.</p>

<p>Here we continue building on those ideas with practical examples and real-world applications that demonstrate the value of the information.</p>

<h2>Second Major Section</h2>

<p>The fourth paragraph introduces a new angle or perspective, keeping the content fresh and maintaining reader engagement throughout.</p>

<p>This section provides actionable insights and specific strategies that readers can implement immediately in their own work.</p>

<h2>Conclusion</h2>

<p>The penultimate paragraph begins to wrap up the discussion, reinforcing the key takeaways and main points covered.</p>

<p>Finally, we conclude with a strong closing statement that encourages readers to take action and apply what they've learned.</p>
```

## 🔧 Useful Commands

### Browser Console
```javascript
// Test blog creation
runBlogTest()

// Test existing blog
testExistingBlog('your-slug')

// Check form data
console.log(formData)
```

### SQL Queries
```sql
-- List all blogs
SELECT id, title, slug, created_at 
FROM v_media_all 
WHERE type = 'Blog' 
ORDER BY created_at DESC;

-- Check specific blog
SELECT * FROM v_media_all 
WHERE slug = 'your-slug';

-- Verify body content
SELECT 
    title,
    LENGTH(body_html) as length,
    LEFT(body_html, 100) as preview
FROM v_media_all 
WHERE slug = 'your-slug';
```

## 📚 Files Reference

- **Test Suite:** `src/admin-ui/utils/testBlogCreation.ts`
- **Test Runner:** `src/admin-ui/utils/runBlogTest.ts`
- **Debug Component:** `src/admin-ui/components/BlogTestDebug.tsx`
- **Blog Page:** `src/pages/blog/BlogPage.tsx`
- **Create Form:** `src/admin-ui/pages/MediaCreate.tsx`
- **Database Service:** `src/admin-ui/utils/supabase.ts`

## 🎯 Expected Results

After running `runBlogTest()`:

```javascript
{
  success: true,
  creation: {
    blogId: "uuid-here",
    slug: "test-blog-post-complete-content-creation",
    url: "/blog/test-blog-post-complete-content-creation",
    contentAnalysis: {
      paragraphCount: 8,
      headingCount: 3,
      totalLength: 1500+
    }
  },
  retrieval: {
    success: true,
    analysis: {
      hasContent: true,
      wordCount: 200+,
      paragraphCount: 8
    }
  }
}
```

## 🆘 Still Having Issues?

1. Check browser console for errors
2. Run `verify_blog_body.sql` 
3. Check Supabase logs for RPC errors
4. Verify RLS policies with `complete_blog_fix.sql`
5. Ensure authors exist in the database

---

**Time to complete:** ~5 minutes  
**Difficulty:** Easy  
**Prerequisites:** Supabase access, Admin UI access
