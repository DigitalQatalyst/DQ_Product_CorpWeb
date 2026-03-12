-- Complete database setup for media management system
-- This script drops everything and recreates from scratch

-- Step 1: Drop everything first (CASCADE will handle dependencies)
DROP VIEW IF EXISTS public.v_media_public CASCADE;
DROP VIEW IF EXISTS public.v_media_all CASCADE;
DROP FUNCTION IF EXISTS public.create_media_item(jsonb, text, jsonb) CASCADE;
DROP FUNCTION IF EXISTS public.update_media_item(uuid, jsonb, text, jsonb) CASCADE;
DROP FUNCTION IF EXISTS public.get_media_item_full(uuid) CASCADE;

-- Drop all tables (CASCADE will drop dependent objects)
DROP TABLE IF EXISTS public.media_assets CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.tools CASCADE;
DROP TABLE IF EXISTS public.reports CASCADE;
DROP TABLE IF EXISTS public.podcasts CASCADE;
DROP TABLE IF EXISTS public.videos CASCADE;
DROP TABLE IF EXISTS public.guides CASCADE;
DROP TABLE IF EXISTS public.news CASCADE;
DROP TABLE IF EXISTS public.blogs CASCADE;
DROP TABLE IF EXISTS public.articles CASCADE;
DROP TABLE IF EXISTS public.media_items CASCADE;

-- Drop helper functions
DROP FUNCTION IF EXISTS public.normalize_slug(text) CASCADE;
DROP FUNCTION IF EXISTS public._jtxt(jsonb, text) CASCADE;
DROP FUNCTION IF EXISTS public.set_updated_at() CASCADE;

-- Step 2: Create the updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Step 3: Create base media_items table with type column
CREATE TABLE IF NOT EXISTS public.media_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text,
  title text,
  summary text,
  type text DEFAULT 'Article',
  status text DEFAULT 'Draft',
  visibility text DEFAULT 'Public',
  language text DEFAULT 'en',
  seo_title text,
  seo_description text,
  canonical_url text,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  thumbnail_url text,
  tags jsonb DEFAULT '[]'::jsonb,
  category text,
  featured boolean DEFAULT false,
  hero_image text,
  read_time integer,
  highlights text
);

-- Create updated_at trigger for media_items
CREATE OR REPLACE TRIGGER trg_media_items_set_updated_at 
  BEFORE UPDATE ON public.media_items 
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Step 4: Create child tables for different content types

-- Articles table (for articles, news, guides)
CREATE TABLE IF NOT EXISTS public.articles (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  body_html text,
  body_json jsonb,
  byline text,
  source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_articles_set_updated_at 
  BEFORE UPDATE ON public.articles 
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- News table (dedicated for news)
CREATE TABLE IF NOT EXISTS public.news (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  body_html text,
  body_json jsonb,
  source text,
  announcement_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_news_set_updated_at 
  BEFORE UPDATE ON public.news 
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Guides table (dedicated for guides)
CREATE TABLE IF NOT EXISTS public.guides (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  body_html text,
  body_json jsonb,
  difficulty_level text,
  estimated_time text,
  prerequisites text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_guides_set_updated_at 
  BEFORE UPDATE ON public.guides 
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Blogs table (dedicated for blogs)
CREATE TABLE IF NOT EXISTS public.blogs (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  body_html text,
  body_json jsonb,
  author text,
  category text,
  hero_image text,
  read_time integer,
  highlights text,
  source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_blogs_set_updated_at 
  BEFORE UPDATE ON public.blogs 
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  video_url text,
  platform text,
  duration_sec integer,
  transcript_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_videos_set_updated_at 
  BEFORE UPDATE ON public.videos 
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Podcasts table
CREATE TABLE IF NOT EXISTS public.podcasts (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  audio_url text,
  is_video_episode boolean DEFAULT false,
  episode_no integer,
  duration_sec integer,
  transcript_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_podcasts_set_updated_at 
  BEFORE UPDATE ON public.podcasts 
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  document_url text,
  pages integer,
  file_size_mb numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_reports_set_updated_at 
  BEFORE UPDATE ON public.reports 
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Tools table
CREATE TABLE IF NOT EXISTS public.tools (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  document_url text,
  requirements text,
  file_size_mb numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_tools_set_updated_at 
  BEFORE UPDATE ON public.tools 
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  start_at timestamptz,
  end_at timestamptz,
  venue text,
  registration_url text,
  timezone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_events_set_updated_at 
  BEFORE UPDATE ON public.events 
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Media assets table (for tracking uploaded files)
CREATE TABLE IF NOT EXISTS public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id uuid NOT NULL REFERENCES public.media_items(id) ON DELETE CASCADE,
  kind text NOT NULL, -- 'Image', 'Video', 'Audio', 'Doc'
  public_url text NOT NULL,
  storage_path text NOT NULL,
  mime text,
  size_bytes bigint,
  duration_sec integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER trg_media_assets_set_updated_at 
  BEFORE UPDATE ON public.media_assets 
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Step 5: Create helper functions
CREATE OR REPLACE FUNCTION public.normalize_slug(input text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT trim(both '-' FROM regexp_replace(lower(coalesce($1,'')), '[^a-z0-9]+', '-', 'g'))
$$;

CREATE OR REPLACE FUNCTION public._jtxt(j jsonb, key text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT NULLIF(j->>key, '')
$$;

-- Step 6: Create the main CRUD function
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
  ELSIF t = 'article' THEN
    -- Articles go to articles table
    INSERT INTO public.articles (id, body_html, body_json, byline, source)
    VALUES (
      _id,
      public._jtxt(_child,'body_html'),
      _child->'body_json',
      public._jtxt(_child,'byline'),
      public._jtxt(_child,'source')
    );
  ELSIF t = 'news' THEN
    -- News go to news table
    INSERT INTO public.news (id, body_html, body_json, source, announcement_date)
    VALUES (
      _id,
      public._jtxt(_child,'body_html'),
      _child->'body_json',
      public._jtxt(_child,'source'),
      (_child->>'announcement_date')::timestamptz
    );
  ELSIF t = 'guide' THEN
    -- Guides go to guides table
    INSERT INTO public.guides (id, body_html, body_json, difficulty_level, estimated_time, prerequisites)
    VALUES (
      _id,
      public._jtxt(_child,'body_html'),
      _child->'body_json',
      public._jtxt(_child,'difficulty_level'),
      public._jtxt(_child,'estimated_time'),
      public._jtxt(_child,'prerequisites')
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

-- Create the update function
CREATE OR REPLACE FUNCTION public.update_media_item(_id uuid, _base jsonb, _type text, _child jsonb)
RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
  t text := lower(coalesce(_type,''));
BEGIN
  -- Update base media_items table
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
    category = COALESCE(public._jtxt(_base,'category'), category),
    featured = COALESCE((_base->>'featured')::boolean, featured),
    hero_image = COALESCE(public._jtxt(_base,'hero_image'), hero_image),
    read_time = COALESCE(NULLIF((_base->>'read_time')::int, 0), read_time),
    highlights = COALESCE(public._jtxt(_base,'highlights'), highlights)
  WHERE id = _id;

  -- Update child tables based on type
  IF t = 'article' THEN
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
  ELSIF t = 'news' THEN
    INSERT INTO public.news (id, body_html, body_json, source, announcement_date)
    VALUES (
      _id,
      public._jtxt(_child,'body_html'),
      _child->'body_json',
      public._jtxt(_child,'source'),
      (_child->>'announcement_date')::timestamptz
    )
    ON CONFLICT (id) DO UPDATE SET
      body_html = EXCLUDED.body_html,
      body_json = EXCLUDED.body_json,
      source = EXCLUDED.source,
      announcement_date = EXCLUDED.announcement_date;
  ELSIF t = 'guide' THEN
    INSERT INTO public.guides (id, body_html, body_json, difficulty_level, estimated_time, prerequisites)
    VALUES (
      _id,
      public._jtxt(_child,'body_html'),
      _child->'body_json',
      public._jtxt(_child,'difficulty_level'),
      public._jtxt(_child,'estimated_time'),
      public._jtxt(_child,'prerequisites')
    )
    ON CONFLICT (id) DO UPDATE SET
      body_html = EXCLUDED.body_html,
      body_json = EXCLUDED.body_json,
      difficulty_level = EXCLUDED.difficulty_level,
      estimated_time = EXCLUDED.estimated_time,
      prerequisites = EXCLUDED.prerequisites;
  ELSIF t = 'blog' THEN
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
    )
    ON CONFLICT (id) DO UPDATE SET
      body_html = EXCLUDED.body_html,
      body_json = EXCLUDED.body_json,
      author = EXCLUDED.author,
      category = EXCLUDED.category,
      hero_image = EXCLUDED.hero_image,
      read_time = EXCLUDED.read_time,
      highlights = EXCLUDED.highlights,
      source = EXCLUDED.source;
  ELSIF t = 'video' OR t = 'videos' THEN
    INSERT INTO public.videos (id, video_url, platform, duration_sec, transcript_url)
    VALUES (
      _id,
      public._jtxt(_child,'video_url'),
      lower(public._jtxt(_child,'platform')),
      NULLIF((_child->>'duration_sec')::int, 0),
      public._jtxt(_child,'transcript_url')
    )
    ON CONFLICT (id) DO UPDATE SET
      video_url = EXCLUDED.video_url,
      platform = EXCLUDED.platform,
      duration_sec = EXCLUDED.duration_sec,
      transcript_url = EXCLUDED.transcript_url;
  ELSIF t = 'podcast' OR t = 'podcasts' THEN
    INSERT INTO public.podcasts (id, audio_url, is_video_episode, episode_no, duration_sec, transcript_url)
    VALUES (
      _id,
      public._jtxt(_child,'audio_url'),
      COALESCE((_child->>'is_video_episode')::boolean, false),
      NULLIF((_child->>'episode_no')::int, 0),
      NULLIF((_child->>'duration_sec')::int, 0),
      public._jtxt(_child,'transcript_url')
    )
    ON CONFLICT (id) DO UPDATE SET
      audio_url = EXCLUDED.audio_url,
      is_video_episode = EXCLUDED.is_video_episode,
      episode_no = EXCLUDED.episode_no,
      duration_sec = EXCLUDED.duration_sec,
      transcript_url = EXCLUDED.transcript_url;
  ELSIF t = 'report' OR t = 'reports' THEN
    INSERT INTO public.reports (id, document_url, pages, file_size_mb)
    VALUES (
      _id,
      public._jtxt(_child,'document_url'),
      NULLIF((_child->>'pages')::int, 0),
      NULLIF((_child->>'file_size_mb')::numeric, 0)
    )
    ON CONFLICT (id) DO UPDATE SET
      document_url = EXCLUDED.document_url,
      pages = EXCLUDED.pages,
      file_size_mb = EXCLUDED.file_size_mb;
  ELSIF t = 'tool' OR t = 'tools' OR t = 'toolkit' OR t = 'toolkits' THEN
    INSERT INTO public.tools (id, document_url, requirements, file_size_mb)
    VALUES (
      _id,
      public._jtxt(_child,'document_url'),
      public._jtxt(_child,'requirements'),
      NULLIF((_child->>'file_size_mb')::numeric, 0)
    )
    ON CONFLICT (id) DO UPDATE SET
      document_url = EXCLUDED.document_url,
      requirements = EXCLUDED.requirements,
      file_size_mb = EXCLUDED.file_size_mb;
  ELSIF t = 'event' OR t = 'events' THEN
    INSERT INTO public.events (id, start_at, end_at, venue, registration_url, timezone)
    VALUES (
      _id,
      (_child->>'start_at')::timestamptz,
      (_child->>'end_at')::timestamptz,
      public._jtxt(_child,'venue'),
      public._jtxt(_child,'registration_url'),
      public._jtxt(_child,'timezone')
    )
    ON CONFLICT (id) DO UPDATE SET
      start_at = EXCLUDED.start_at,
      end_at = EXCLUDED.end_at,
      venue = EXCLUDED.venue,
      registration_url = EXCLUDED.registration_url,
      timezone = EXCLUDED.timezone;
  END IF;

  RETURN _id;
END;
$$;

-- Step 7: Create the unified view
-- Drop existing view first to avoid column name conflicts
DROP VIEW IF EXISTS public.v_media_all CASCADE;
DROP VIEW IF EXISTS public.v_media_public CASCADE;

CREATE VIEW public.v_media_all AS
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
  -- Article fields (for articles)
  a.body_html AS article_body_html,
  a.body_json AS article_body_json,
  a.byline AS article_byline,
  a.source AS article_source,
  -- News fields (for news)
  n.body_html AS news_body_html,
  n.body_json AS news_body_json,
  n.source AS news_source,
  n.announcement_date AS news_announcement_date,
  -- Guide fields (for guides)
  g.body_html AS guide_body_html,
  g.body_json AS guide_body_json,
  g.difficulty_level AS guide_difficulty_level,
  g.estimated_time AS guide_estimated_time,
  g.prerequisites AS guide_prerequisites,
  -- Blog fields (for blogs)
  bl.body_html AS blog_body_html,
  bl.body_json AS blog_body_json,
  bl.author AS blog_author,
  bl.category AS blog_category,
  bl.hero_image AS blog_hero_image,
  bl.read_time AS blog_read_time,
  bl.highlights AS blog_highlights,
  bl.source AS blog_source,
  -- Convenience mirrored body fields (prioritize by content type)
  COALESCE(bl.body_html, a.body_html, n.body_html, g.body_html) AS body_html,
  COALESCE(bl.body_json, a.body_json, n.body_json, g.body_json) AS body_json,
  -- Unified source field
  COALESCE(bl.source, a.source, n.source) AS source,
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
LEFT JOIN public.news n ON n.id = m.id
LEFT JOIN public.guides g ON g.id = m.id
LEFT JOIN public.blogs bl ON bl.id = m.id
LEFT JOIN public.videos   v ON v.id = m.id
LEFT JOIN public.podcasts p ON p.id = m.id
LEFT JOIN public.reports  r ON r.id = m.id
LEFT JOIN public.tools    t ON t.id = m.id
LEFT JOIN public.events   e ON e.id = m.id;

-- Step 8: Create public view for published content
CREATE OR REPLACE VIEW public.v_media_public AS
SELECT *
FROM public.v_media_all
WHERE status = 'Published'
  AND visibility = 'Public'
  AND (published_at IS NULL OR published_at <= now());

-- Helper function to get flattened item (created after view exists)
CREATE OR REPLACE FUNCTION public.get_media_item_full(_id uuid)
RETURNS SETOF public.v_media_all LANGUAGE sql STABLE AS $$
  SELECT * FROM public.v_media_all WHERE id = _id
$$;

-- Step 9: Test the setup
DO $test$
DECLARE
  test_id uuid;
BEGIN
  -- Test creating a blog
  SELECT public.create_media_item(
    '{"title": "Test Blog Post", "slug": "test-blog-post"}'::jsonb,
    'Blog',
    '{"body_html": "<p>This is a test blog post</p>", "author": "Test Author"}'::jsonb
  ) INTO test_id;
  
  -- Check if it was created correctly
  IF EXISTS (SELECT 1 FROM public.v_media_all WHERE id = test_id AND type = 'Blog') THEN
    RAISE NOTICE 'SUCCESS: Complete database setup successful!';
    RAISE NOTICE 'Test blog ID: %', test_id;
  ELSE
    RAISE NOTICE 'FAILED: Database setup had issues';
  END IF;
  
  -- Clean up test
  DELETE FROM public.media_items WHERE id = test_id;
END;
$test$;

-- Step 10: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_items_type ON public.media_items(type);
CREATE INDEX IF NOT EXISTS idx_media_items_status ON public.media_items(status);
CREATE INDEX IF NOT EXISTS idx_media_items_visibility ON public.media_items(visibility);
CREATE INDEX IF NOT EXISTS idx_media_items_published_at ON public.media_items(published_at);
CREATE INDEX IF NOT EXISTS idx_media_items_slug ON public.media_items(slug);
CREATE INDEX IF NOT EXISTS idx_media_items_tags ON public.media_items USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_media_assets_media_id ON public.media_assets(media_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_kind ON public.media_assets(kind);

-- Step 11: Show table structure
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('media_items', 'articles', 'news', 'guides', 'blogs', 'videos', 'podcasts', 'reports', 'tools', 'events', 'media_assets')
ORDER BY tablename;