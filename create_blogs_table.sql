-- Create a dedicated blogs table for blog-specific fields
-- This will allow proper separation of blog data while still using v_media_all view

-- Step 1: Create the blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  body_html text,
  body_json jsonb,
  author text, -- Blog author/byline
  category text, -- Blog category
  hero_image text, -- Blog hero image URL
  read_time integer, -- Estimated reading time in minutes
  highlights text, -- Table of contents or key points
  source text, -- Source attribution if needed
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create updated_at trigger for blogs table
CREATE OR REPLACE TRIGGER trg_blogs_set_updated_at 
  BEFORE UPDATE ON public.blogs 
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Step 2: Update the create_media_item function to handle blogs table
CREATE OR REPLACE FUNCTION public.create_media_item(_base jsonb, _type text, _child jsonb)
RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
  _id uuid;
  t text := lower(coalesce(_type,''));
BEGIN
  INSERT INTO public.media_items (
    slug, title, summary, type, status, visibility, language,
    seo_title, seo_description, canonical_url, published_at,
    thumbnail_url, tags, category, featured, hero_image, read_time, highlights
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
    public._jtxt(_base,'category'),
    COALESCE((_base->>'featured')::boolean, false),
    public._jtxt(_base,'hero_image'),
    NULLIF((_base->>'read_time')::int, 0),
    public._jtxt(_base,'highlights')
  ) RETURNING id INTO _id;

  -- Insert child based on type
  IF t = 'blog' THEN
    -- Blogs go to the dedicated blogs table
    INSERT INTO public.blogs (id, body_html, body_json, author, category, hero_image, read_time, highlights, source)
    VALUES (
      _id,
      public._jtxt(_child,'body_html'),
      _child->'body_json',
      public._jtxt(_child,'author'),
      public._jtxt(_child,'category'),
      public._jtxt(_child,'hero_image'),
      NULLIF((_child->>'read_time')::int, 0),
      public._jtxt(_child,'highlights'),
      public._jtxt(_child,'source')
    );
  ELSIF t = 'article' OR t = 'news' OR t = 'guide' THEN
    -- Articles, news, guides go to articles table
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

-- Step 3: Update the v_media_all view to include blogs table
CREATE OR REPLACE VIEW public.v_media_all AS
SELECT
  m.id,
  m.slug,
  m.title,
  m.summary,
  m.status,
  m.visibility,
  m.language,
  m.seo_title,
  m.seo_description,
  m.canonical_url,
  m.published_at,
  m.created_at,
  m.updated_at,
  m.thumbnail_url,
  m.tags,
  m.category,
  m.featured,
  m.hero_image,
  m.read_time,
  m.highlights,
  -- Use explicit type column from media_items table
  COALESCE(m.type, 'Article') AS type,
  -- Article fields (for articles, news, guides)
  a.body_html AS article_body_html,
  a.body_json AS article_body_json,
  a.byline AS article_byline,
  a.source AS article_source,
  -- Blog fields (for blogs)
  b.body_html AS blog_body_html,
  b.body_json AS blog_body_json,
  b.author AS blog_author,
  b.category AS blog_category,
  b.hero_image AS blog_hero_image,
  b.read_time AS blog_read_time,
  b.highlights AS blog_highlights,
  b.source AS blog_source,
  -- Convenience mirrored body fields (prioritize blog fields for blogs, article fields for others)
  COALESCE(b.body_html, a.body_html) AS body_html,
  COALESCE(b.body_json, a.body_json) AS body_json,
  -- Video
  v.video_url,
  v.platform,
  v.duration_sec AS video_duration_sec,
  v.transcript_url AS video_transcript_url,
  -- Podcast
  p.audio_url,
  p.is_video_episode,
  p.episode_no,
  p.duration_sec AS audio_duration_sec,
  p.transcript_url AS audio_transcript_url,
  -- Report
  r.document_url AS report_document_url,
  r.pages AS report_pages,
  r.file_size_mb AS report_file_size_mb,
  -- Tool
  t.document_url AS tool_document_url,
  t.requirements AS tool_requirements,
  t.file_size_mb AS tool_file_size_mb,
  -- Event
  e.start_at,
  e.end_at,
  e.venue,
  e.registration_url,
  e.timezone,
  -- Legacy event fields for compatibility
  (e.start_at)::date AS event_date,
  to_char(e.start_at, 'FMHH24:MI') ||
    CASE WHEN e.end_at IS NOT NULL THEN ' - ' || to_char(e.end_at, 'FMHH24:MI') ELSE '' END AS event_time,
  e.venue AS event_location,
  NULL::text AS event_location_details,
  NULL::text AS event_registration_info,
  NULL::jsonb AS event_agenda,
  -- Legacy fields
  NULL::text AS provider_name,
  NULL::text AS provider_logo_url,
  NULL::text AS image_url,
  NULL::bigint AS file_size_bytes,
  NULL::bigint AS download_count
FROM public.media_items m
LEFT JOIN public.articles a ON a.id = m.id
LEFT JOIN public.blogs b ON b.id = m.id
LEFT JOIN public.videos   v ON v.id = m.id
LEFT JOIN public.podcasts p ON p.id = m.id
LEFT JOIN public.reports  r ON r.id = m.id
LEFT JOIN public.tools    t ON t.id = m.id
LEFT JOIN public.events   e ON e.id = m.id;

-- Step 4: Test the new blogs functionality
DO $test$
DECLARE
  test_id uuid;
BEGIN
  -- Test creating a blog
  SELECT public.create_media_item(
    '{"title": "Test Blog Post", "slug": "test-blog-post", "category": "Technology"}'::jsonb,
    'Blog',
    '{"body_html": "<p>This is a test blog post content</p>", "author": "Test Author", "category": "Technology", "hero_image": "https://example.com/hero.jpg"}'::jsonb
  ) INTO test_id;
  
  -- Check if it was created with correct type and in blogs table
  IF EXISTS (SELECT 1 FROM public.v_media_all WHERE id = test_id AND type = 'Blog') THEN
    RAISE NOTICE 'SUCCESS: Blog creation test passed! ID: %', test_id;
    RAISE NOTICE 'Blog data: %', (SELECT row_to_json(v) FROM public.v_media_all v WHERE id = test_id);
  ELSE
    RAISE NOTICE 'FAILED: Blog was not created with correct type. ID: %', test_id;
  END IF;
  
  -- Clean up test
  DELETE FROM public.media_items WHERE id = test_id;
END;
$test$;

-- Step 5: Show current structure
SELECT 
  'blogs' as table_name,
  count(*) as record_count
FROM public.blogs
UNION ALL
SELECT 
  'articles' as table_name,
  count(*) as record_count  
FROM public.articles
UNION ALL
SELECT 
  'media_items' as table_name,
  count(*) as record_count
FROM public.media_items;