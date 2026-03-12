-- Diagnostic SQL Script for Blog Body Issue
-- Run this in Supabase SQL Editor to diagnose why blog body is not saving

-- ============================================================================
-- STEP 1: Check if blogs table exists and has correct structure
-- ============================================================================
SELECT 'Step 1: Checking blogs table structure' as step;

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'blogs'
ORDER BY ordinal_position;

-- ============================================================================
-- STEP 2: Check recent blog entries
-- ============================================================================
SELECT 'Step 2: Checking recent blog entries' as step;

SELECT 
  m.id,
  m.title,
  m.slug,
  m.type,
  m.created_at,
  b.author_id,
  LENGTH(COALESCE(b.excerpt, '')) as excerpt_length,
  LENGTH(COALESCE(b.body_html, '')) as body_html_length,
  CASE 
    WHEN b.body_html IS NULL THEN 'NULL'
    WHEN b.body_html = '' THEN 'EMPTY STRING'
    WHEN LENGTH(b.body_html) > 0 THEN 'HAS CONTENT (' || LENGTH(b.body_html) || ' chars)'
  END as body_html_status,
  SUBSTRING(b.body_html, 1, 100) as body_html_preview
FROM media_items m
LEFT JOIN blogs b ON b.id = m.id
WHERE m.type = 'Blog'
ORDER BY m.created_at DESC
LIMIT 10;

-- ============================================================================
-- STEP 3: Check if create_media_item function exists
-- ============================================================================
SELECT 'Step 3: Checking create_media_item function' as step;

SELECT 
  routine_name,
  routine_type,
  data_type as return_type,
  LEFT(routine_definition, 200) as function_preview
FROM information_schema.routines
WHERE routine_schema = 'public' 
  AND routine_name = 'create_media_item';

-- ============================================================================
-- STEP 4: Check RLS policies on blogs table
-- ============================================================================
SELECT 'Step 4: Checking RLS policies on blogs table' as step;

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'blogs';

-- ============================================================================
-- STEP 5: Test inserting a blog directly (bypass RPC)
-- ============================================================================
SELECT 'Step 5: Testing direct blog insert' as step;

DO $$
DECLARE
  test_media_id uuid;
  test_author_id uuid;
BEGIN
  -- Get first available author
  SELECT id INTO test_author_id FROM authors LIMIT 1;
  
  IF test_author_id IS NULL THEN
    RAISE NOTICE 'No authors found. Please create an author first.';
    RETURN;
  END IF;

  -- Insert test media item
  INSERT INTO media_items (
    title, slug, summary, type, status, visibility, language
  ) VALUES (
    'Test Blog Body Insert',
    'test-blog-body-insert-' || floor(random() * 1000)::text,
    'Testing if body_html can be inserted directly',
    'Blog',
    'Draft',
    'Public',
    'en'
  ) RETURNING id INTO test_media_id;

  -- Insert test blog with body_html
  INSERT INTO blogs (
    id, author_id, excerpt, body_html, body_json
  ) VALUES (
    test_media_id,
    test_author_id,
    'This is a test excerpt',
    '<p>This is test paragraph 1.</p><p>This is test paragraph 2.</p><p>This is test paragraph 3.</p>',
    '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Test content"}]}]}'::jsonb
  );

  RAISE NOTICE 'Test blog created with ID: %', test_media_id;
  
  -- Verify the insert
  PERFORM 1 FROM blogs WHERE id = test_media_id AND body_html IS NOT NULL AND LENGTH(body_html) > 0;
  
  IF FOUND THEN
    RAISE NOTICE '✅ SUCCESS: body_html was inserted and retrieved successfully';
  ELSE
    RAISE NOTICE '❌ FAILED: body_html was not inserted or is empty';
  END IF;

EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '❌ ERROR: %', SQLERRM;
END $$;

-- ============================================================================
-- STEP 6: Check the v_media_all view for blog body mapping
-- ============================================================================
SELECT 'Step 6: Checking v_media_all view definition' as step;

SELECT 
  definition
FROM pg_views
WHERE schemaname = 'public' 
  AND viewname = 'v_media_all';

-- ============================================================================
-- STEP 7: Test querying through v_media_all
-- ============================================================================
SELECT 'Step 7: Testing blog retrieval through v_media_all' as step;

SELECT 
  id,
  title,
  slug,
  type,
  LENGTH(COALESCE(body_html, '')) as body_html_length,
  LENGTH(COALESCE(blog_body_html, '')) as blog_body_html_length,
  CASE 
    WHEN body_html IS NOT NULL AND LENGTH(body_html) > 0 THEN '✅ body_html has content'
    WHEN blog_body_html IS NOT NULL AND LENGTH(blog_body_html) > 0 THEN '✅ blog_body_html has content'
    ELSE '❌ No body content found'
  END as body_status
FROM v_media_all
WHERE type = 'Blog'
ORDER BY created_at DESC
LIMIT 5;

-- ============================================================================
-- STEP 8: Summary and Recommendations
-- ============================================================================
SELECT 'Step 8: Diagnostic Summary' as step;

SELECT 
  'Total Blogs' as metric,
  COUNT(*) as value
FROM media_items
WHERE type = 'Blog'
UNION ALL
SELECT 
  'Blogs with body_html' as metric,
  COUNT(*) as value
FROM blogs
WHERE body_html IS NOT NULL AND LENGTH(body_html) > 0
UNION ALL
SELECT 
  'Blogs without body_html' as metric,
  COUNT(*) as value
FROM blogs
WHERE body_html IS NULL OR LENGTH(body_html) = 0;

-- ============================================================================
-- RECOMMENDATIONS
-- ============================================================================
/*
Based on the results above:

1. If blogs table doesn't exist or is missing body_html column:
   - Run: fix_blog_rpc.sql or recreate_authors_and_blogs.sql

2. If direct insert test FAILED:
   - Check RLS policies (they might be blocking inserts)
   - Run: complete_blog_fix.sql to fix RLS policies

3. If direct insert SUCCEEDED but RPC fails:
   - The issue is in the create_media_item function
   - Run: fix_blog_rpc.sql to update the function

4. If body_html is NULL or empty in recent blogs:
   - Check browser console logs when creating a blog
   - Verify the frontend is sending body_html in the _child parameter
   - Use the test files: runBlogTest() in browser console

5. If v_media_all doesn't show body content:
   - The view mapping might be incorrect
   - Run: fix_blog_rpc.sql to recreate the view
*/
