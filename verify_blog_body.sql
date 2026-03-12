-- Diagnostic Script: Verify Blog Body Content
-- Run this to check if blog body content is being saved correctly

-- ============================================================================
-- STEP 1: Check if blogs table exists and has body_html column
-- ============================================================================
SELECT 
    'Blogs table structure' as check_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'blogs'
  AND column_name IN ('id', 'body_html', 'body_json', 'excerpt', 'author_id')
ORDER BY ordinal_position;

-- ============================================================================
-- STEP 2: Check recent blog posts and their body content
-- ============================================================================
SELECT 
    'Recent blogs with body content' as check_name,
    b.id,
    m.title,
    m.slug,
    m.type,
    LENGTH(b.body_html) as body_html_length,
    LENGTH(b.body_json::text) as body_json_length,
    CASE 
        WHEN b.body_html IS NULL THEN '❌ NULL'
        WHEN LENGTH(b.body_html) = 0 THEN '⚠️ EMPTY'
        WHEN LENGTH(b.body_html) < 100 THEN '⚠️ TOO SHORT'
        ELSE '✅ HAS CONTENT'
    END as body_status,
    LEFT(b.body_html, 100) as body_preview,
    m.created_at
FROM blogs b
JOIN media_items m ON m.id = b.id
ORDER BY m.created_at DESC
LIMIT 10;

-- ============================================================================
-- STEP 3: Check v_media_all view for blog content
-- ============================================================================
SELECT 
    'Blog content in v_media_all view' as check_name,
    id,
    title,
    slug,
    type,
    LENGTH(body_html) as body_html_length,
    LENGTH(blog_body_html) as blog_body_html_length,
    CASE 
        WHEN body_html IS NULL AND blog_body_html IS NULL THEN '❌ NO BODY CONTENT'
        WHEN LENGTH(COALESCE(body_html, blog_body_html, '')) < 100 THEN '⚠️ CONTENT TOO SHORT'
        ELSE '✅ HAS CONTENT'
    END as content_status,
    author_name,
    author_title
FROM v_media_all
WHERE type = 'Blog'
ORDER BY created_at DESC
LIMIT 5;

-- ============================================================================
-- STEP 4: Check for blogs with missing body content
-- ============================================================================
SELECT 
    'Blogs with missing body content' as check_name,
    COUNT(*) as total_blogs,
    SUM(CASE WHEN b.body_html IS NULL OR LENGTH(b.body_html) = 0 THEN 1 ELSE 0 END) as missing_body,
    SUM(CASE WHEN b.body_html IS NOT NULL AND LENGTH(b.body_html) > 0 THEN 1 ELSE 0 END) as has_body
FROM blogs b;

-- ============================================================================
-- STEP 5: Check a specific blog by slug (REPLACE 'your-slug' with actual slug)
-- ============================================================================
-- Uncomment and replace 'your-slug' with your actual blog slug:
/*
SELECT 
    'Specific blog details' as check_name,
    m.id,
    m.title,
    m.slug,
    m.type,
    m.status,
    m.visibility,
    LENGTH(b.body_html) as body_html_length,
    b.body_html as full_body_html,
    b.excerpt,
    b.author_id,
    a.name as author_name,
    m.created_at,
    m.updated_at
FROM media_items m
JOIN blogs b ON b.id = m.id
LEFT JOIN authors a ON a.id = b.author_id
WHERE m.slug = 'your-slug';
*/

-- ============================================================================
-- STEP 6: Check RPC function for blog creation
-- ============================================================================
SELECT 
    'RPC function check' as check_name,
    routine_name,
    routine_type,
    data_type as return_type,
    CASE 
        WHEN routine_definition LIKE '%Blog%' THEN '✅ Handles Blog type'
        ELSE '⚠️ May not handle Blog type'
    END as blog_support
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('create_media_item', 'update_media_item');

-- ============================================================================
-- STEP 7: Sample query to test blog retrieval by slug
-- ============================================================================
-- This simulates what the frontend does:
SELECT 
    'Frontend simulation' as check_name,
    id,
    title,
    slug,
    summary,
    body_html,
    blog_body_html,
    COALESCE(body_html, blog_body_html) as final_body,
    hero_image,
    category,
    read_time,
    published_at,
    author_name,
    author_title,
    author_bio,
    author_avatar
FROM v_media_all
WHERE slug = 'test-blog-post-complete-content-creation'  -- Replace with your slug
  AND type = 'Blog';

-- ============================================================================
-- SUMMARY
-- ============================================================================
SELECT 
    '📊 SUMMARY' as section,
    'Check the results above to diagnose blog body issues' as message,
    'Look for ❌ or ⚠️ indicators' as action;
