-- Complete Reset with Proper Blog Table Structure
-- This script drops all media-related tables and recreates them with proper separation
-- Each media type gets its own dedicated table with specific fields

-- Drop all functions first (to avoid dependency issues)
DROP FUNCTION IF EXISTS public.get_media_item_full CASCADE;
DROP FUNCTION IF EXISTS public.update_media_item CASCADE;
DROP FUNCTION IF EXISTS public.create_media_item CASCADE;
DROP FUNCTION IF EXISTS public.normalize_slug CASCADE;
DROP FUNCTION IF EXISTS public._jtxt CASCADE;
DROP FUNCTION IF EXISTS public.enforce_slug_normalization CASCADE;
DROP FUNCTION IF EXISTS public.set_updated_at CASCADE;

-- Drop all views
DROP VIEW IF EXISTS public.v_media_public CASCADE;
DROP VIEW IF EXISTS public.v_media_all CASCADE;

-- Drop all dependent tables (CASCADE will handle dependencies)
DROP TABLE IF EXISTS public.media_assets CASCADE;
DROP TABLE IF EXISTS public.media_taxonomies CASCADE;
DROP TABLE IF EXISTS public.taxonomies CASCADE;
DROP TABLE IF EXISTS public.content_submissions CASCADE;

-- Drop type-specific tables
DROP TABLE IF EXISTS public.blogs CASCADE;
DROP TABLE IF EXISTS public.articles CASCADE;
DROP TABLE IF EXISTS public.news CASCADE;
DROP TABLE IF EXISTS public.guides CASCADE;
DROP TABLE IF EXISTS public.videos CASCADE;
DROP TABLE IF EXISTS public.podcasts CASCADE;
DROP TABLE IF EXISTS public.reports CASCADE;
DROP TABLE IF EXISTS public.tools CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;

-- Drop main table
DROP TABLE IF EXISTS public.media_items CASCADE;
DROP TABLE IF EXISTS public.author_profiles CASCADE;

-- Recreate the database schema with proper separation

-- Ensure required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create base table with common fields only
CREATE TABLE public.media_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE,
  title text NOT NULL,
  summary text,
  type text NOT NULL, -- 'Blog', 'Article', 'News', 'Guide', 'Video', 'Podcast', 'Report', 'Tool', 'Event'
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
  hero_image text,
  tags jsonb DEFAULT '[]'::jsonb,
  category text,
  featured boolean DEFAULT false,
  read_time integer,
  highlights text
);

-- Create updated_at trigger
CREATE TRIGGER trg_media_items_set_updated_at 
  BEFORE UPDATE ON public.media_items 
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Create slug normalization function
CREATE OR REPLACE FUNCTION public.normalize_slug(input text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT trim(both '-' FROM regexp_replace(lower(coalesce($1,'')), '[^a-z0-9]+', '-', 'g'))
$$;

-- Create slug enforcement function
CREATE OR REPLACE FUNCTION public.enforce_slug_normalization()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.normalize_slug(COALESCE(NEW.title, gen_random_uuid()::text));
  ELSE
    NEW.slug := public.normalize_slug(NEW.slug);
  END IF;
  RETURN NEW;
END;
$$;

-- Create slug normalization trigger
CREATE TRIGGER trg_media_items_slug_normalize 
  BEFORE INSERT OR UPDATE OF slug, title ON public.media_items 
  FOR EACH ROW EXECUTE FUNCTION public.enforce_slug_normalization();

-- Create author profiles table
CREATE TABLE public.author_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  title text,
  bio text,
  avatar_url text,
  social_links jsonb,
  linkedin_url text, -- Added specifically for blog authors
  is_guest boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create type-specific tables with foreign key relationships

-- Blogs table (specific fields for blog posts)
CREATE TABLE public.blogs (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  author_id uuid REFERENCES public.author_profiles(id),
  body_html text,
  body_json jsonb,
  excerpt text, -- Specific to blogs - appears in listings
  focus_keyword text, -- SEO optimization
  related_keywords text[], -- Array of related keywords
  byline text -- Alternative to author_id
);

-- Articles table
CREATE TABLE public.articles (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  body_html text,
  body_json jsonb,
  byline text,
  source text
);

-- News table
CREATE TABLE public.news (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  body_html text,
  body_json jsonb,
  byline text,
  source text,
  news_date timestamptz
);

-- Guides table
CREATE TABLE public.guides (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  body_html text,
  body_json jsonb,
  byline text,
  guide_url text -- URL for the downloadable guide
);

-- Videos table
CREATE TABLE public.videos (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  video_url text,
  platform text,
  duration_sec integer,
  transcript_url text
);

-- Podcasts table
CREATE TABLE public.podcasts (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  audio_url text,
  is_video_episode boolean DEFAULT false,
  episode_no integer,
  duration_sec integer,
  transcript_url text
);

-- Reports table
CREATE TABLE public.reports (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  document_url text,
  pages integer,
  file_size_mb numeric
);

-- Tools table
CREATE TABLE public.tools (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  document_url text,
  requirements text,
  file_size_mb numeric
);

-- Events table
CREATE TABLE public.events (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  start_at timestamptz,
  end_at timestamptz,
  venue text,
  registration_url text,
  timezone text,
  event_date DATE,
  event_time TEXT,
  event_location TEXT,
  event_location_details TEXT,
  event_registration_info TEXT,
  event_agenda JSONB
);

-- Supporting tables
CREATE TABLE public.taxonomies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL, -- 'Domain','Stage','Format','Tag'
  label text NOT NULL,
  key text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.media_taxonomies (
  media_id uuid REFERENCES public.media_items(id) ON DELETE CASCADE,
  taxonomy_id uuid REFERENCES public.taxonomies(id) ON DELETE CASCADE,
  PRIMARY KEY (media_id, taxonomy_id)
);

CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id uuid REFERENCES public.media_items(id) ON DELETE CASCADE,
  kind text, -- 'Image','Video','Audio','Doc'
  public_url text NOT NULL,
  storage_path text NOT NULL,
  mime text,
  size_bytes bigint,
  width integer,
  height integer,
  duration_sec integer,
  checksum text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.content_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id uuid REFERENCES public.media_items(id) ON DELETE CASCADE,
  author_id uuid REFERENCES public.author_profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'Submitted', -- 'Submitted', 'InReview', 'Approved', 'Rejected', 'Published'
  reviewer_id uuid,
  review_notes text,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create helper function for jsonb text extraction
CREATE OR REPLACE FUNCTION public._jtxt(j jsonb, key text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT NULLIF(j->>key, '')
$$;

-- Create CRUD functions for the new structure

-- Create media item function
CREATE OR REPLACE FUNCTION public.create_media_item(_base jsonb, _type text, _child jsonb)
RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
  _id uuid;
  t text := lower(coalesce(_type,''));
BEGIN
  -- Insert into base table
  INSERT INTO public.media_items (
    slug, title, summary, type, status, visibility, language,
    seo_title, seo_description, canonical_url, published_at,
    thumbnail_url, hero_image, tags, category, featured, read_time, highlights
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
    public._jtxt(_base,'hero_image'),
    COALESCE(_base->'tags', '[]'::jsonb),
    public._jtxt(_base,'category'),
    COALESCE((_base->>'featured')::boolean, false),
    NULLIF((_base->>'read_time')::integer, 0),
    public._jtxt(_base,'highlights')
  ) RETURNING id INTO _id;

  -- Insert into type-specific table based on type
  IF t = 'blog' THEN
    INSERT INTO public.blogs (id, author_id, body_html, body_json, excerpt, focus_keyword, related_keywords, byline)
    VALUES (
      _id,
      (_child->>'author_id')::uuid,
      public._jtxt(_child,'body_html'),
      _child->'body_json',
      public._jtxt(_child,'excerpt'),
      public._jtxt(_child,'focus_keyword'),
      COALESCE(ARRAY(SELECT json_array_elements_text(_child->'related_keywords'))::text[], ARRAY[]::text[]),
      public._jtxt(_child,'byline')
    );
  ELSIF t = 'article' THEN
    INSERT INTO public.articles (id, body_html, body_json, byline, source)
    VALUES (
      _id,
      public._jtxt(_child,'body_html'),
      _child->'body_json',
      public._jtxt(_child,'byline'),
      public._jtxt(_child,'source')
    );
  ELSIF t = 'news' THEN
    INSERT INTO public.news (id, body_html, body_json, byline, source, news_date)
    VALUES (
      _id,
      public._jtxt(_child,'body_html'),
      _child->'body_json',
      public._jtxt(_child,'byline'),
      public._jtxt(_child,'source'),
      (_child->>'news_date')::timestamptz
    );
  ELSIF t = 'guide' THEN
    INSERT INTO public.guides (id, body_html, body_json, byline, guide_url)
    VALUES (
      _id,
      public._jtxt(_child,'body_html'),
      _child->'body_json',
      public._jtxt(_child,'byline'),
      public._jtxt(_child,'guide_url')
    );
  ELSIF t IN ('video', 'videos') THEN
    INSERT INTO public.videos (id, video_url, platform, duration_sec, transcript_url)
    VALUES (
      _id,
      public._jtxt(_child,'video_url'),
      lower(public._jtxt(_child,'platform')),
      NULLIF((_child->>'duration_sec')::int, 0),
      public._jtxt(_child,'transcript_url')
    );
  ELSIF t IN ('podcast', 'podcasts') THEN
    INSERT INTO public.podcasts (id, audio_url, is_video_episode, episode_no, duration_sec, transcript_url)
    VALUES (
      _id,
      public._jtxt(_child,'audio_url'),
      COALESCE((_child->>'is_video_episode')::boolean, false),
      NULLIF((_child->>'episode_no')::int, 0),
      NULLIF((_child->>'duration_sec')::int, 0),
      public._jtxt(_child,'transcript_url')
    );
  ELSIF t IN ('report', 'reports') THEN
    INSERT INTO public.reports (id, document_url, pages, file_size_mb)
    VALUES (
      _id,
      public._jtxt(_child,'document_url'),
      NULLIF((_child->>'pages')::int, 0),
      NULLIF((_child->>'file_size_mb')::numeric, 0)
    );
  ELSIF t IN ('tool', 'tools', 'toolkit', 'toolkits') THEN
    INSERT INTO public.tools (id, document_url, requirements, file_size_mb)
    VALUES (
      _id,
      public._jtxt(_child,'document_url'),
      public._jtxt(_child,'requirements'),
      NULLIF((_child->>'file_size_mb')::numeric, 0)
    );
  ELSIF t IN ('event', 'events') THEN
    INSERT INTO public.events (id, start_at, end_at, venue, registration_url, timezone, 
                               event_date, event_time, event_location, event_location_details, 
                               event_registration_info, event_agenda)
    VALUES (
      _id,
      (_child->>'start_at')::timestamptz,
      (_child->>'end_at')::timestamptz,
      public._jtxt(_child,'venue'),
      public._jtxt(_child,'registration_url'),
      public._jtxt(_child,'timezone'),
      (_child->>'event_date')::date,
      public._jtxt(_child,'event_time'),
      public._jtxt(_child,'event_location'),
      public._jtxt(_child,'event_location_details'),
      public._jtxt(_child,'event_registration_info'),
      _child->'event_agenda'
    );
  END IF;

  RETURN _id;
END;
$$;

-- Update media item function
CREATE OR REPLACE FUNCTION public.update_media_item(_id uuid, _base jsonb, _type text, _child jsonb)
RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
  t text := lower(coalesce(_type,''));
BEGIN
  -- Update base table
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
    hero_image = COALESCE(public._jtxt(_base,'hero_image'), hero_image),
    tags = COALESCE(_base->'tags', tags),
    category = COALESCE(public._jtxt(_base,'category'), category),
    featured = COALESCE((_base->>'featured')::boolean, featured),
    read_time = COALESCE(NULLIF((_base->>'read_time')::integer, 0), read_time),
    highlights = COALESCE(public._jtxt(_base,'highlights'), highlights)
  WHERE id = _id;

  -- Update or insert into type-specific table based on type
  IF t = 'blog' THEN
    INSERT INTO public.blogs (id, author_id, body_html, body_json, excerpt, focus_keyword, related_keywords, byline)
    VALUES (
      _id,
      (_child->>'author_id')::uuid,
      public._jtxt(_child,'body_html'),
      _child->'body_json',
      public._jtxt(_child,'excerpt'),
      public._jtxt(_child,'focus_keyword'),
      COALESCE(ARRAY(SELECT json_array_elements_text(_child->'related_keywords'))::text[], ARRAY[]::text[]),
      public._jtxt(_child,'byline')
    )
    ON CONFLICT (id) DO UPDATE SET
      author_id = EXCLUDED.author_id,
      body_html = EXCLUDED.body_html,
      body_json = EXCLUDED.body_json,
      excerpt = EXCLUDED.excerpt,
      focus_keyword = EXCLUDED.focus_keyword,
      related_keywords = EXCLUDED.related_keywords,
      byline = EXCLUDED.byline;
  ELSIF t = 'article' THEN
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
    INSERT INTO public.news (id, body_html, body_json, byline, source, news_date)
    VALUES (
      _id,
      public._jtxt(_child,'body_html'),
      _child->'body_json',
      public._jtxt(_child,'byline'),
      public._jtxt(_child,'source'),
      (_child->>'news_date')::timestamptz
    )
    ON CONFLICT (id) DO UPDATE SET
      body_html = EXCLUDED.body_html,
      body_json = EXCLUDED.body_json,
      byline = EXCLUDED.byline,
      source = EXCLUDED.source,
      news_date = EXCLUDED.news_date;
  ELSIF t = 'guide' THEN
    INSERT INTO public.guides (id, body_html, body_json, byline, guide_url)
    VALUES (
      _id,
      public._jtxt(_child,'body_html'),
      _child->'body_json',
      public._jtxt(_child,'byline'),
      public._jtxt(_child,'guide_url')
    )
    ON CONFLICT (id) DO UPDATE SET
      body_html = EXCLUDED.body_html,
      body_json = EXCLUDED.body_json,
      byline = EXCLUDED.byline,
      guide_url = EXCLUDED.guide_url;
  ELSIF t IN ('video', 'videos') THEN
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
  ELSIF t IN ('podcast', 'podcasts') THEN
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
  ELSIF t IN ('report', 'reports') THEN
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
  ELSIF t IN ('tool', 'tools', 'toolkit', 'toolkits') THEN
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
  ELSIF t IN ('event', 'events') THEN
    INSERT INTO public.events (id, start_at, end_at, venue, registration_url, timezone,
                               event_date, event_time, event_location, event_location_details,
                               event_registration_info, event_agenda)
    VALUES (
      _id,
      (_child->>'start_at')::timestamptz,
      (_child->>'end_at')::timestamptz,
      public._jtxt(_child,'venue'),
      public._jtxt(_child,'registration_url'),
      public._jtxt(_child,'timezone'),
      (_child->>'event_date')::date,
      public._jtxt(_child,'event_time'),
      public._jtxt(_child,'event_location'),
      public._jtxt(_child,'event_location_details'),
      public._jtxt(_child,'event_registration_info'),
      _child->'event_agenda'
    )
    ON CONFLICT (id) DO UPDATE SET
      start_at = EXCLUDED.start_at,
      end_at = EXCLUDED.end_at,
      venue = EXCLUDED.venue,
      registration_url = EXCLUDED.registration_url,
      timezone = EXCLUDED.timezone,
      event_date = EXCLUDED.event_date,
      event_time = EXCLUDED.event_time,
      event_location = EXCLUDED.event_location,
      event_location_details = EXCLUDED.event_location_details,
      event_registration_info = EXCLUDED.event_registration_info,
      event_agenda = EXCLUDED.event_agenda;
  END IF;

  RETURN _id;
END;
$$;

-- Create the main view that joins all type-specific tables
CREATE OR REPLACE VIEW public.v_media_all AS
SELECT
  m.id,
  m.slug,
  m.title,
  m.summary,
  m.type,
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
  m.hero_image,
  m.tags,
  m.category,
  m.featured,
  m.read_time,
  m.highlights,
  -- Blog-specific fields
  b.excerpt AS blog_excerpt,
  b.focus_keyword AS blog_focus_keyword,
  b.related_keywords AS blog_related_keywords,
  b.body_html AS blog_body_html,
  b.body_json AS blog_body_json,
  b.byline AS blog_byline,
  -- Join with author info for blogs
  ap.name AS blog_author_name,
  ap.title AS blog_author_title,
  ap.bio AS blog_author_bio,
  ap.avatar_url AS blog_author_avatar,
  ap.linkedin_url AS blog_author_linkedin,
  -- Article-specific fields
  a.body_html AS article_body_html,
  a.body_json AS article_body_json,
  a.byline AS article_byline,
  a.source AS article_source,
  -- News-specific fields
  n.body_html AS news_body_html,
  n.body_json AS news_body_json,
  n.byline AS news_byline,
  n.source AS news_source,
  n.news_date AS news_date,
  -- Guide-specific fields
  g.body_html AS guide_body_html,
  g.body_json AS guide_body_json,
  g.byline AS guide_byline,
  g.guide_url AS guide_url,
  -- Video fields
  v.video_url,
  v.platform,
  v.duration_sec AS video_duration_sec,
  v.transcript_url AS video_transcript_url,
  -- Podcast fields
  p.audio_url,
  p.is_video_episode,
  p.episode_no,
  p.duration_sec AS audio_duration_sec,
  p.transcript_url AS audio_transcript_url,
  -- Report fields
  r.document_url AS report_document_url,
  r.pages AS report_pages,
  r.file_size_mb AS report_file_size_mb,
  -- Tool fields
  t.document_url AS tool_document_url,
  t.requirements AS tool_requirements,
  t.file_size_mb AS tool_file_size_mb,
  -- Event fields
  e.start_at,
  e.end_at,
  e.venue,
  e.registration_url,
  e.timezone,
  e.event_date,
  e.event_time,
  e.event_location,
  e.event_location_details,
  e.event_registration_info,
  e.event_agenda
FROM public.media_items m
LEFT JOIN public.blogs b ON b.id = m.id
LEFT JOIN public.author_profiles ap ON b.author_id = ap.id
LEFT JOIN public.articles a ON a.id = m.id
LEFT JOIN public.news n ON n.id = m.id
LEFT JOIN public.guides g ON g.id = m.id
LEFT JOIN public.videos v ON v.id = m.id
LEFT JOIN public.podcasts p ON p.id = m.id
LEFT JOIN public.reports r ON r.id = m.id
LEFT JOIN public.tools t ON t.id = m.id
LEFT JOIN public.events e ON e.id = m.id;

-- Create public view
CREATE OR REPLACE VIEW public.v_media_public AS
SELECT *
FROM public.v_media_all
WHERE status = 'Published'
  AND visibility = 'Public'
  AND (published_at IS NULL OR published_at <= now());

-- Create helper function
CREATE OR REPLACE FUNCTION public.get_media_item_full(_id uuid)
RETURNS SETOF public.v_media_all LANGUAGE sql STABLE AS $$
  SELECT * FROM public.v_media_all WHERE id = _id
$$;

-- Create indexes for performance
CREATE INDEX idx_media_items_status ON public.media_items(status);
CREATE INDEX idx_media_items_visibility ON public.media_items(visibility);
CREATE INDEX idx_media_items_published_at ON public.media_items(published_at);
CREATE INDEX idx_media_items_slug ON public.media_items(slug);
CREATE INDEX idx_media_items_type ON public.media_items(type);
CREATE INDEX idx_media_items_tags ON public.media_items USING gin(tags);
CREATE INDEX idx_blogs_author_id ON public.blogs(author_id);
CREATE INDEX idx_author_profiles_name ON public.author_profiles(name);

COMMENT ON VIEW public.v_media_all IS 'Flattened view with all media types and their specific fields';
COMMENT ON VIEW public.v_media_public IS 'Public flattened view (Published + Public only)';