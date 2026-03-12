-- ============================================================================
-- ULTIMATE BLOG FIX - Complete Database Setup
-- Run this ONCE in Supabase SQL Editor to fix everything
-- ============================================================================

-- Step 1: Ensure blogs table has all required columns
-- ============================================================================
DO $$
BEGIN
  -- Add body_html if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='blogs' AND column_name='body_html') THEN
    ALTER TABLE blogs ADD COLUMN body_html TEXT;
    RAISE NOTICE '✅ Added body_html column to blogs table';
  END IF;
  
  -- Add body_json if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='blogs' AND column_name='body_json') THEN
    ALTER TABLE blogs ADD COLUMN body_json JSONB;
    RAISE NOTICE '✅ Added body_json column to blogs table';
  END IF;
  
  -- Add excerpt if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='blogs' AND column_name='excerpt') THEN
    ALTER TABLE blogs ADD COLUMN excerpt TEXT;
    RAISE NOTICE '✅ Added excerpt column to blogs table';
  END IF;
  
  -- Add author_id if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='blogs' AND column_name='author_id') THEN
    ALTER TABLE blogs ADD COLUMN author_id UUID REFERENCES authors(id);
    RAISE NOTICE '✅ Added author_id column to blogs table';
  END IF;
  
  -- Add focus_keyword if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='blogs' AND column_name='focus_keyword') THEN
    ALTER TABLE blogs ADD COLUMN focus_keyword TEXT;
    RAISE NOTICE '✅ Added focus_keyword column to blogs table';
  END IF;
  
  -- Add related_keywords if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='blogs' AND column_name='related_keywords') THEN
    ALTER TABLE blogs ADD COLUMN related_keywords JSONB DEFAULT '[]'::jsonb;
    RAISE NOTICE '✅ Added related_keywords column to blogs table';
  END IF;
END $$;

-- Step 2: Fix RLS Policies on blogs table
-- ============================================================================
-- Drop all existing policies
DROP POLICY IF EXISTS "Allow all operations on blogs for development" ON blogs;
DROP POLICY IF EXISTS "Blogs are viewable by authenticated users" ON blogs;
DROP POLICY IF EXISTS "Blogs can be created by authenticated users" ON blogs;
DROP POLICY IF EXISTS "Blogs can be updated by authenticated users" ON blogs;
DROP POLICY IF EXISTS "Blogs can be deleted by authenticated users" ON blogs;

-- Enable RLS
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Create permissive policy for development
CREATE POLICY "Allow all operations on blogs for development" ON blogs
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

RAISE NOTICE '✅ RLS policies fixed on blogs table';

-- Step 3: Create or Replace the create_media_item RPC function
-- ============================================================================
CREATE OR REPLACE FUNCTION public.create_media_item(_base jsonb, _type text, _child jsonb)
RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
  _id uuid;
  t text := lower(coalesce(_type,''));
BEGIN
  -- Insert into media_items
  INSERT INTO public.media_items (
    slug, title, summary, type, status, visibility, language,
    seo_title, seo_description, canonical_url, published_at,
    thumbnail_url, tags, hero_image, category, featured, read_time, highlights
  ) VALUES (
    public.normalize_slug(public._jtxt(_base,'slug')),
    COALESCE(public._jtxt(_base,'title'), ''),
    public._jtxt(_base,'summary'),
    COALESCE(_type, 'Article'),
    COALESCE(public._jtxt(_base,'status'), 'Draft'),
    COALESCE(public._jtxt(_base,'visibility'), 'Public'),
    COALESCE(public._jtxt(_base,'language'), 'en'),
    public._jtxt(_base,'seo_title'),
    public._jtxt(_base,'seo_description'),
    public._jtxt(_base,'canonical_url'),
    (_base->>'published_at')::timestamptz,
    public._jtxt(_base,'thumbnail_url'),
    COALESCE(_base->'tags', '[]'::jsonb),
    public._jtxt(_base,'hero_image'),
    public._jtxt(_base,'category'),
    COALESCE((_base->>'featured')::boolean, false),
    NULLIF((_base->>'read_time')::int, 0),
    public._jtxt(_base,'highlights')
  ) RETURNING id INTO _id;

  -- Insert child based on type
  IF t = 'blog' THEN
    -- Insert into blogs table with ALL fields
    INSERT INTO public.blogs (
      id, 
      author_id, 
      excerpt, 
      body_html, 
      body_json, 
      focus_keyword, 
      related_keywords
    ) VALUES (
      _id,
      NULLIF((_child->>'author_id')::uuid, '00000000-0000-0000-0000-000000000000'::uuid),
      public._jtxt(_child,'excerpt'),
      public._jtxt(_child,'body_html'),  -- THIS IS CRITICAL
      _child->'body_json',
      public._jtxt(_child,'focus_keyword'),
      COALESCE(_child->'related_keywords', '[]'::jsonb)
    );
    
    -- Log for debugging
    RAISE NOTICE 'Blog created: ID=%, body_html_length=%', _id, LENGTH(public._jtxt(_child,'body_html'));
    
  ELSIF t = 'article' OR t = 'news' OR t = 'guide' THEN
    INSERT INTO public.articles (id, body_html, body_json, byline, source)
    VALUES (
      _id,
      public._jtxt(_child,'body_html'),
      _child->'body_json',
      public._jtxt(_child,'byline'),
      public._jtxt(_child,'source')
    );
  ELSIF t = 'video' OR t = 'videos' THEN
    INSERT INTO public.videos (id, video_url, platform, duration_sec, transcript_url)
    VALUES (
      _id,
      public._jtxt(_child,'video_url'),
      lower(public._jtxt(_child,'platform')),
      NULLIF((_child->>'duration_sec')::int, 0),
      public._jtxt(_child,'transcript_url')
    );
  ELSIF t = 'podcast' OR t='podcasts' THEN
    INSERT INTO public.podcasts (id, audio_url, is_video_episode, episode_no, duration_sec, transcript_url)
    VALUES (
      _id,
      public._jtxt(_child,'audio_url'),
      COALESCE((_child->>'is_video_episode')::boolean, false),
      NULLIF((_child->>'episode_no')::int, 0),
      NULLIF((_child->>'duration_sec')::int, 0),
      public._jtxt(_child,'transcript_url')
    );
  ELSIF t = 'report' OR t='reports' THEN
    INSERT INTO public.reports (id, document_url, pages, file_size_mb)
    VALUES (
      _id,
      public._jtxt(_child,'document_url'),
      NULLIF((_child->>'pages')::int, 0),
      NULLIF((_child->>'file_size_mb')::numeric, 0)
    );
  ELSIF t = 'tool' OR t='tools' OR t='toolkit' OR t='toolkits' THEN
    INSERT INTO public.tools (id, document_url, requirements, file_size_mb)
    VALUES (
      _id,
      public._jtxt(_child,'document_url'),
      public._jtxt(_child,'requirements'),
      NULLIF((_child->>'file_size_mb')::numeric, 0)
    );
  ELSIF t = 'event' OR t='events' THEN
    INSERT INTO public.events (id, start_at, end_at, venue, registration_url, timezone)
    VALUES (
      _id,
      (_child->>'start_at')::timestamptz,
      (_child->>'end_at')::timestamptz,
      public._jtxt(_child,'venue'),
      public._jtxt(_child,'registration_url'),
      public._jtxt(_child,'timezone')
    );
  END IF;

  RETURN _id;
END;
$$;

RAISE NOTICE '✅ create_media_item RPC function updated';

-- Step 4: Create or Replace the update_media_item RPC function
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_media_item(_id uuid, _base jsonb, _type text, _child jsonb)
RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
  t text := lower(coalesce(_type,''));
BEGIN
  -- Update media_items
  UPDATE public.media_items SET
    slug = COALESCE(public.normalize_slug(public._jtxt(_base,'slug')), slug),
    title = COALESCE(public._jtxt(_base,'title'), title),
    summary = COALESCE(public._jtxt(_base,'summary'), summary),
    type = COALESCE(_type, type),
    status = COALESCE(public._jtxt(_base,'status'), status),
    visibility = COALESCE(public._jtxt(_base,'visibility'), visibility),
    language = COALESCE(public._jtxt(_base,'language'), language),
    seo_title = COALESCE(public._jtxt(_base,'seo_title'), seo_title),
    seo_description = COALESCE(public._jtxt(_base,'seo_description'), seo_description),
    canonical_url = COALESCE(public._jtxt(_base,'canonical_url'), canonical_url),
    published_at = COALESCE((_base->>'published_at')::timestamptz, published_at),
    thumbnail_url = COALESCE(public._jtxt(_base,'thumbnail_url'), thumbnail_url),
    tags = COALESCE(_base->'tags', tags),
    hero_image = COALESCE(public._jtxt(_base,'hero_image'), hero_image),
    category = COALESCE(public._jtxt(_base,'category'), category),
    featured = COALESCE((_base->>'featured')::boolean, featured),
    read_time = COALESCE(NULLIF((_base->>'read_time')::int, 0), read_time),
    highlights = COALESCE(public._jtxt(_base,'highlights'), highlights)
  WHERE id = _id;

  -- Update child based on type
  IF t = 'blog' THEN
    -- Upsert into blogs table
    INSERT INTO public.blogs (
      id, 
      author_id, 
      excerpt, 
      body_html, 
      body_json, 
      focus_keyword, 
      related_keywords
    ) VALUES (
      _id,
      NULLIF((_child->>'author_id')::uuid, '00000000-0000-0000-0000-000000000000'::uuid),
      public._jtxt(_child,'excerpt'),
      public._jtxt(_child,'body_html'),
      _child->'body_json',
      public._jtxt(_child,'focus_keyword'),
      COALESCE(_child->'related_keywords', '[]'::jsonb)
    )
    ON CONFLICT (id) DO UPDATE SET
      author_id = EXCLUDED.author_id,
      excerpt = EXCLUDED.excerpt,
      body_html = EXCLUDED.body_html,
      body_json = EXCLUDED.body_json,
      focus_keyword = EXCLUDED.focus_keyword,
      related_keywords = EXCLUDED.related_keywords;
      
  ELSIF t = 'article' OR t = 'news' OR t = 'guide' THEN
    INSERT INTO public.articles (id, body_html, body_json, byline, source)
    VALUES (
      _id,
      public._jtxt(_child,'body_html'),
      _child->'body_json',
      public._jtxt(_child,'byline'),
      public._jtxt(_child,'source')
    )
    ON CONFLICT (id) DO UPDATE SET
      body_html = EXCLUDED.body_html,
      body_json = EXCLUDED.body_json,
      byline = EXCLUDED.byline,
      source = EXCLUDED.source;
  END IF;

  RETURN _id;
END;
$$;

RAISE NOTICE '✅ update_media_item RPC function updated';

-- Step 5: Verify the setup
-- ============================================================================
DO $$
DECLARE
  blog_count int;
  column_count int;
  policy_count int;
BEGIN
  -- Check blogs table columns
  SELECT COUNT(*) INTO column_count
  FROM information_schema.columns
  WHERE table_name = 'blogs' 
    AND column_name IN ('body_html', 'body_json', 'excerpt', 'author_id', 'focus_keyword', 'related_keywords');
  
  IF column_count = 6 THEN
    RAISE NOTICE '✅ All required columns exist in blogs table';
  ELSE
    RAISE NOTICE '⚠️ Missing columns in blogs table (found % of 6)', column_count;
  END IF;
  
  -- Check RLS policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE tablename = 'blogs';
  
  IF policy_count > 0 THEN
    RAISE NOTICE '✅ RLS policies configured (% policies)', policy_count;
  ELSE
    RAISE NOTICE '⚠️ No RLS policies found on blogs table';
  END IF;
  
  -- Check existing blogs
  SELECT COUNT(*) INTO blog_count FROM blogs;
  RAISE NOTICE 'ℹ️ Current blog count: %', blog_count;
  
END $$;

-- Step 6: Test with a sample blog (optional - uncomment to test)
-- ============================================================================
/*
DO $$
DECLARE
  test_id uuid;
  test_author_id uuid;
BEGIN
  -- Get first author
  SELECT id INTO test_author_id FROM authors LIMIT 1;
  
  IF test_author_id IS NULL THEN
    RAISE NOTICE '⚠️ No authors found. Create an author first.';
    RETURN;
  END IF;
  
  -- Create test blog
  test_id := public.create_media_item(
    jsonb_build_object(
      'title', 'Test Blog - Ultimate Fix',
      'slug', 'test-blog-ultimate-fix-' || floor(random() * 1000)::text,
      'summary', 'Testing the ultimate blog fix',
      'status', 'Draft',
      'visibility', 'Public',
      'language', 'en',
      'category', 'Testing',
      'read_time', 5,
      'featured', true
    ),
    'Blog',
    jsonb_build_object(
      'author_id', test_author_id::text,
      'excerpt', 'This is a test excerpt for the ultimate fix',
      'body_html', '<p>First paragraph of test content.</p><h2>Test Heading</h2><p>Second paragraph with more content.</p><p>Third paragraph to verify everything works.</p>',
      'focus_keyword', 'test blog',
      'related_keywords', '["testing", "blog", "fix"]'::jsonb
    )
  );
  
  -- Verify
  PERFORM 1 FROM blogs WHERE id = test_id AND LENGTH(body_html) > 0;
  
  IF FOUND THEN
    RAISE NOTICE '✅ TEST PASSED: Blog created with ID % and body_html saved successfully', test_id;
  ELSE
    RAISE NOTICE '❌ TEST FAILED: Blog created but body_html is empty';
  END IF;
  
END $$;
*/

-- ============================================================================
-- FINAL STATUS
-- ============================================================================
SELECT '🎉 ULTIMATE BLOG FIX COMPLETE!' as status,
       'Run the test section above (uncomment) to verify everything works' as next_step;

-- Show recent blogs
SELECT 
  'Recent Blogs' as section,
  m.title,
  m.slug,
  LENGTH(b.body_html) as body_length,
  CASE 
    WHEN b.body_html IS NULL THEN '❌ NULL'
    WHEN LENGTH(b.body_html) = 0 THEN '⚠️ EMPTY'
    ELSE '✅ HAS CONTENT'
  END as status
FROM media_items m
JOIN blogs b ON b.id = m.id
ORDER BY m.created_at DESC
LIMIT 5;
