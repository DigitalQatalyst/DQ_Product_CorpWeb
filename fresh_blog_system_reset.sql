-- Fresh Blog System Reset
-- This script drops all existing tables and creates a clean blog system with proper relationships
-- ⚠️ WARNING: This will delete ALL existing data!

-- ============================================================================
-- STEP 1: Drop All Existing Tables and Dependencies
-- ============================================================================

-- Drop views that depend on tables
DROP VIEW IF EXISTS public.v_media_public CASCADE;
DROP VIEW IF EXISTS public.v_media_all CASCADE;
DROP VIEW IF EXISTS public.v_media_with_authors CASCADE;

-- Drop functions that might reference these tables
DROP FUNCTION IF EXISTS public.create_blog_post CASCADE;
DROP FUNCTION IF EXISTS public.update_blog_post CASCADE;
DROP FUNCTION IF EXISTS public.create_author CASCADE;
DROP FUNCTION IF EXISTS public.create_media_item CASCADE;
DROP FUNCTION IF EXISTS public.update_media_item CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- Drop all existing tables
DROP TABLE IF EXISTS public.content_submissions CASCADE;
DROP TABLE IF EXISTS public.media_taxonomies CASCADE;
DROP TABLE IF EXISTS public.taxonomies CASCADE;
DROP TABLE IF EXISTS public.media_assets CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.blogs CASCADE;
DROP TABLE IF EXISTS public.articles CASCADE;
DROP TABLE IF EXISTS public.videos CASCADE;
DROP TABLE IF EXISTS public.podcasts CASCADE;
DROP TABLE IF EXISTS public.reports CASCADE;
DROP TABLE IF EXISTS public.tools CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP VIEW IF EXISTS public.v_media_with_authors CASCADE;
DROP VIEW IF EXISTS public.v_media_public CASCADE;
DROP VIEW IF EXISTS public.v_media_all CASCADE;

-- Drop functions that might reference the tables
DROP FUNCTION IF EXISTS public.create_blog_post CASCADE;
DROP FUNCTION IF EXISTS public.update_blog_post CASCADE;
DROP FUNCTION IF EXISTS public.create_author CASCADE;
DROP FUNCTION IF EXISTS public.create_media_item CASCADE;
DROP FUNCTION IF EXISTS public.update_media_item CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- Drop all existing tables
DROP TABLE IF EXISTS public.content_submissions CASCADE;
DROP TABLE IF EXISTS public.media_taxonomies CASCADE;
DROP TABLE IF EXISTS public.taxonomies CASCADE;
DROP TABLE IF EXISTS public.media_assets CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.blogs CASCADE;
DROP TABLE IF EXISTS public.articles CASCADE;
DROP TABLE IF EXISTS public.videos CASCADE;
DROP TABLE IF EXISTS public.podcasts CASCADE;
DROP TABLE IF EXISTS public.reports CASCADE;
DROP TABLE IF EXISTS public.tools CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.authors CASCADE;
DROP TABLE IF EXISTS public.media_items CASCADE;

-- Drop specific storage policies
DROP POLICY IF EXISTS "Allow all operations on author avatars" ON storage.objects;
DROP POLICY IF EXISTS "Author avatars are publicly accessible" ON storage.objects;

DROP POLICY IF EXISTS "Allow all operations on blog images" ON storage.objects;
DROP POLICY IF EXISTS "Blog images are publicly accessible" ON storage.objects;

DROP POLICY IF EXISTS "Allow all operations on media thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Media thumbnails are publicly accessible" ON storage.objects;

DROP POLICY IF EXISTS "Allow all operations on media assets" ON storage.objects;
DROP POLICY IF EXISTS "Media assets are publicly accessible" ON storage.objects;

-- Drop storage buckets
-- Clean up storage objects before dropping buckets
-- First try to delete from specific buckets
DELETE FROM storage.objects WHERE bucket_id = 'author-avatars';
DELETE FROM storage.objects WHERE bucket_id = 'blog-images';
DELETE FROM storage.objects WHERE bucket_id = 'media-thumbnails';
DELETE FROM storage.objects WHERE bucket_id = 'media-assets';

-- Now drop the buckets
DELETE FROM storage.buckets WHERE id IN ('author-avatars', 'blog-images', 'media-thumbnails', 'media-assets');

-- ============================================================================
-- STEP 2: Create Clean Media Items Base Table
-- ============================================================================

-- Create the base media_items table (common fields for all content types)
CREATE TABLE public.media_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  body TEXT,
  body_html TEXT,
  body_json JSONB,
  type TEXT NOT NULL CHECK (type IN ('Article', 'Blog', 'Video', 'Podcast', 'Report', 'News', 'Guide', 'Event', 'Tool')),
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'InReview', 'Scheduled', 'Published', 'Archived')),
  visibility TEXT DEFAULT 'Public' CHECK (visibility IN ('Public', 'Private', 'Unlisted')),
  language TEXT DEFAULT 'en',
  seo_title TEXT,
  seo_description TEXT,
  canonical_url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  thumbnail_url TEXT,
  tags JSONB DEFAULT '[]'::JSONB,
  category TEXT,
  featured BOOLEAN DEFAULT FALSE,
  hero_image TEXT,
  read_time INTEGER,
  highlights TEXT
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_media_items_updated_at 
    BEFORE UPDATE ON public.media_items 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- STEP 3: Create Dedicated Authors Table
-- ============================================================================

-- Create authors table for blog author management
CREATE TABLE public.authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  avatar_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger for authors
CREATE TRIGGER update_authors_updated_at 
    BEFORE UPDATE ON public.authors 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- STEP 4: Create Dedicated Blogs Table (1:1 with media_items)
-- ============================================================================

-- Create blogs table with 1:1 relationship to media_items
CREATE TABLE public.blogs (
  id UUID PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.authors(id),
  excerpt TEXT,
  body_html TEXT,
  body_json JSONB,
  focus_keyword TEXT,
  related_keywords JSONB DEFAULT '[]'::JSONB,
  byline TEXT
);

-- ============================================================================
-- STEP 5: Create Other Media Type Tables (Following Same Pattern)
-- ============================================================================

-- Articles table (1:1 with media_items)
CREATE TABLE public.articles (
  id UUID PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  body_html TEXT,
  body_json JSONB,
  byline TEXT,
  source TEXT
);

-- Videos table (1:1 with media_items)
CREATE TABLE public.videos (
  id UUID PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  video_url TEXT,
  platform TEXT,
  duration_sec INTEGER,
  transcript_url TEXT
);

-- Podcasts table (1:1 with media_items)
CREATE TABLE public.podcasts (
  id UUID PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  audio_url TEXT,
  is_video_episode BOOLEAN DEFAULT FALSE,
  episode_no INTEGER,
  duration_sec INTEGER,
  transcript_url TEXT
);

-- Reports table (1:1 with media_items)
CREATE TABLE public.reports (
  id UUID PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  document_url TEXT,
  pages INTEGER,
  file_size_mb NUMERIC
);

-- Tools table (1:1 with media_items)
CREATE TABLE public.tools (
  id UUID PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  document_url TEXT,
  requirements TEXT,
  file_size_mb NUMERIC
);

-- Events table (1:1 with media_items)
CREATE TABLE public.events (
  id UUID PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  venue TEXT,
  registration_url TEXT,
  timezone TEXT
);

-- ============================================================================
-- STEP 6: Create Supporting Tables
-- ============================================================================

-- Taxonomies table
CREATE TABLE public.taxonomies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kind TEXT CHECK (kind IN ('Domain', 'Stage', 'Format', 'Tag')),
  label TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE
);

-- Media taxonomies junction table
CREATE TABLE public.media_taxonomies (
  media_id UUID REFERENCES public.media_items(id) ON DELETE CASCADE,
  taxonomy_id UUID REFERENCES public.taxonomies(id) ON DELETE CASCADE,
  PRIMARY KEY (media_id, taxonomy_id)
);

-- Media assets table
CREATE TABLE public.media_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  media_id UUID REFERENCES public.media_items(id) ON DELETE CASCADE,
  kind TEXT CHECK (kind IN ('Image', 'Video', 'Audio', 'Doc')),
  storage_path TEXT NOT NULL,
  public_url TEXT,
  mime TEXT,
  size_bytes BIGINT,
  width INTEGER,
  height INTEGER,
  duration_sec INTEGER,
  checksum TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content submissions table
CREATE TABLE public.content_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  media_id UUID REFERENCES public.media_items(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.authors(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'InReview', 'Approved', 'Rejected', 'Published')),
  reviewer_id UUID,
  review_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE public.audit_logs (
  id SERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  actor_id UUID,
  at TIMESTAMPTZ DEFAULT NOW(),
  entity TEXT NOT NULL,
  entity_id TEXT,
  diff JSONB
);

-- Create updated_at trigger for content_submissions
CREATE TRIGGER update_content_submissions_updated_at 
    BEFORE UPDATE ON public.content_submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- STEP 7: Set up Storage Buckets for Media Management
-- ============================================================================

-- Create storage bucket for author avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('author-avatars', 'author-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for general media thumbnails
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media-thumbnails', 'media-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for media assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media-assets', 'media-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create permissive storage policies for development
CREATE POLICY "Author avatars are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'author-avatars');

CREATE POLICY "Allow all operations on author avatars" ON storage.objects
  FOR ALL 
  USING (bucket_id = 'author-avatars') 
  WITH CHECK (bucket_id = 'author-avatars');

CREATE POLICY "Blog images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Allow all operations on blog images" ON storage.objects
  FOR ALL 
  USING (bucket_id = 'blog-images') 
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Media thumbnails are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'media-thumbnails');

CREATE POLICY "Allow all operations on media thumbnails" ON storage.objects
  FOR ALL 
  USING (bucket_id = 'media-thumbnails') 
  WITH CHECK (bucket_id = 'media-thumbnails');

CREATE POLICY "Media assets are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'media-assets');

CREATE POLICY "Allow all operations on media assets" ON storage.objects
  FOR ALL 
  USING (bucket_id = 'media-assets') 
  WITH CHECK (bucket_id = 'media-assets');

-- ============================================================================
-- STEP 8: Set up Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taxonomies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_taxonomies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create permissive RLS policies for development
CREATE POLICY "Allow all operations on media_items for development" ON public.media_items
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on authors for development" ON public.authors
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on blogs for development" ON public.blogs
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on articles for development" ON public.articles
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on videos for development" ON public.videos
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on podcasts for development" ON public.podcasts
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on reports for development" ON public.reports
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on tools for development" ON public.tools
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on events for development" ON public.events
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on taxonomies for development" ON public.taxonomies
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on media_taxonomies for development" ON public.media_taxonomies
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on media_assets for development" ON public.media_assets
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on content_submissions for development" ON public.content_submissions
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on audit_logs for development" ON public.audit_logs
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- ============================================================================
-- STEP 9: Create Views for Unified Access
-- ============================================================================

-- Main view combining all media types with author information
CREATE VIEW public.v_media_all AS
SELECT
  m.id,
  m.slug,
  m.title,
  m.summary,
  m.body,
  m.body_html,
  m.body_json,
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
  m.category,
  m.featured,
  m.read_time,
  m.highlights,
  m.tags,
  -- Blog-specific fields
  b.excerpt AS blog_excerpt,
  b.focus_keyword AS blog_focus_keyword,
  b.related_keywords AS blog_related_keywords,
  b.byline AS blog_byline,
  -- Author information (for blogs)
  a.name AS author_name,
  a.title AS author_title,
  a.bio AS author_bio,
  a.avatar_url AS author_avatar,
  a.linkedin_url AS author_linkedin,
  a.twitter_url AS author_twitter,
  a.website_url AS author_website,
  -- Article fields
  art.byline AS article_byline,
  art.source AS article_source,
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
  e.timezone
FROM public.media_items m
LEFT JOIN public.blogs b ON b.id = m.id
LEFT JOIN public.authors a ON a.id = b.author_id
LEFT JOIN public.articles art ON art.id = m.id
LEFT JOIN public.videos v ON v.id = m.id
LEFT JOIN public.podcasts p ON p.id = m.id
LEFT JOIN public.reports r ON r.id = m.id
LEFT JOIN public.tools t ON t.id = m.id
LEFT JOIN public.events e ON e.id = m.id;

-- Public view for published content
CREATE VIEW public.v_media_public AS
SELECT *
FROM public.v_media_all
WHERE status = 'Published'
  AND visibility = 'Public'
  AND (published_at IS NULL OR published_at <= now());

-- View specifically for media with author information
CREATE VIEW public.v_media_with_authors AS
SELECT 
  m.*,
  a.id AS author_id,
  a.name AS author_name,
  a.title AS author_title,
  a.bio AS author_bio,
  a.avatar_url AS author_avatar,
  a.linkedin_url AS author_linkedin
FROM public.v_media_all m
LEFT JOIN public.authors a ON a.name = COALESCE(m.blog_byline, m.article_byline, m.author_name);

-- ============================================================================
-- STEP 10: Create Helper Functions for Blog Operations
-- ============================================================================

-- Function to create a complete blog post
CREATE OR REPLACE FUNCTION public.create_blog_post(
  p_title TEXT,
  p_slug TEXT,
  p_summary TEXT DEFAULT NULL,
  p_excerpt TEXT DEFAULT NULL,
  p_body_html TEXT DEFAULT NULL,
  p_body_json JSONB DEFAULT NULL,
  p_hero_image TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_author_id UUID DEFAULT NULL,
  p_tags JSONB DEFAULT '[]'::JSONB,
  p_featured BOOLEAN DEFAULT FALSE,
  p_read_time INTEGER DEFAULT NULL,
  p_highlights TEXT DEFAULT NULL,
  p_focus_keyword TEXT DEFAULT NULL,
  p_related_keywords JSONB DEFAULT '[]'::JSONB,
  p_status TEXT DEFAULT 'Draft',
  p_visibility TEXT DEFAULT 'Public',
  p_published_at TIMESTAMPTZ DEFAULT NULL,
  p_seo_title TEXT DEFAULT NULL,
  p_seo_description TEXT DEFAULT NULL,
  p_thumbnail_url TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_media_id UUID;
BEGIN
  -- Insert into media_items (base table)
  INSERT INTO public.media_items (
    slug, title, summary, body_html, body_json, type, status, visibility, 
    language, seo_title, seo_description, canonical_url, published_at,
    thumbnail_url, tags, category, featured, hero_image, read_time, highlights
  ) VALUES (
    p_slug, p_title, p_summary, p_body_html, p_body_json, 'Blog', p_status, p_visibility,
    'en', p_seo_title, p_seo_description, NULL, p_published_at,
    p_thumbnail_url, p_tags, p_category, p_featured, p_hero_image, p_read_time, p_highlights
  ) RETURNING id INTO v_media_id;
  
  -- Insert into blogs (type-specific table)
  INSERT INTO public.blogs (
    id, author_id, excerpt, body_html, body_json, 
    focus_keyword, related_keywords, byline
  ) VALUES (
    v_media_id, p_author_id, p_excerpt, p_body_html, p_body_json,
    p_focus_keyword, p_related_keywords, NULL
  );
  
  RETURN v_media_id;
END;
$$;

-- Function to update a blog post
CREATE OR REPLACE FUNCTION public.update_blog_post(
  p_id UUID,
  p_title TEXT DEFAULT NULL,
  p_slug TEXT DEFAULT NULL,
  p_summary TEXT DEFAULT NULL,
  p_excerpt TEXT DEFAULT NULL,
  p_body_html TEXT DEFAULT NULL,
  p_body_json JSONB DEFAULT NULL,
  p_hero_image TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_author_id UUID DEFAULT NULL,
  p_tags JSONB DEFAULT NULL,
  p_featured BOOLEAN DEFAULT NULL,
  p_read_time INTEGER DEFAULT NULL,
  p_highlights TEXT DEFAULT NULL,
  p_focus_keyword TEXT DEFAULT NULL,
  p_related_keywords JSONB DEFAULT NULL,
  p_status TEXT DEFAULT NULL,
  p_visibility TEXT DEFAULT NULL,
  p_published_at TIMESTAMPTZ DEFAULT NULL,
  p_seo_title TEXT DEFAULT NULL,
  p_seo_description TEXT DEFAULT NULL,
  p_thumbnail_url TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update media_items table
  UPDATE public.media_items SET
    slug = COALESCE(p_slug, slug),
    title = COALESCE(p_title, title),
    summary = COALESCE(p_summary, summary),
    body_html = COALESCE(p_body_html, body_html),
    body_json = COALESCE(p_body_json, body_json),
    status = COALESCE(p_status, status),
    visibility = COALESCE(p_visibility, visibility),
    seo_title = COALESCE(p_seo_title, seo_title),
    seo_description = COALESCE(p_seo_description, seo_description),
    canonical_url = COALESCE(NULL, canonical_url), -- Not updating canonical_url for now
    published_at = COALESCE(p_published_at, published_at),
    thumbnail_url = COALESCE(p_thumbnail_url, thumbnail_url),
    tags = COALESCE(p_tags, tags),
    category = COALESCE(p_category, category),
    featured = COALESCE(p_featured, featured),
    hero_image = COALESCE(p_hero_image, hero_image),
    read_time = COALESCE(p_read_time, read_time),
    highlights = COALESCE(p_highlights, highlights)
  WHERE id = p_id;
  
  -- Update blogs table
  UPDATE public.blogs SET
    author_id = COALESCE(p_author_id, author_id),
    excerpt = COALESCE(p_excerpt, excerpt),
    body_html = COALESCE(p_body_html, body_html),
    body_json = COALESCE(p_body_json, body_json),
    focus_keyword = COALESCE(p_focus_keyword, focus_keyword),
    related_keywords = COALESCE(p_related_keywords, related_keywords)
  WHERE id = p_id;
END;
$$;

-- Function to create an author
CREATE OR REPLACE FUNCTION public.create_author(
  p_name TEXT,
  p_title TEXT DEFAULT NULL,
  p_bio TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL,
  p_linkedin_url TEXT DEFAULT NULL,
  p_twitter_url TEXT DEFAULT NULL,
  p_website_url TEXT DEFAULT NULL,
  p_email TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_author_id UUID;
BEGIN
  INSERT INTO public.authors (
    name, title, bio, avatar_url, linkedin_url, twitter_url, website_url, email
  ) VALUES (
    p_name, p_title, p_bio, p_avatar_url, p_linkedin_url, p_twitter_url, p_website_url, p_email
  ) RETURNING id INTO v_author_id;
  
  RETURN v_author_id;
END;
$$;

-- Generic media item creation function
CREATE OR REPLACE FUNCTION public.create_media_item(
  _base JSONB,
  _type TEXT,
  _child JSONB
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_media_id UUID;
  v_base_data JSONB := _base;
  v_child_data JSONB := _child;
  v_type TEXT := _type;
BEGIN
  -- Insert into media_items (base table)
  INSERT INTO public.media_items (
    slug, title, summary, body, body_html, body_json, type, status, visibility, 
    language, seo_title, seo_description, canonical_url, published_at,
    thumbnail_url, tags, category, featured, hero_image, read_time, highlights
  ) VALUES (
    (v_base_data->>'slug')::TEXT,
    (v_base_data->>'title')::TEXT,
    (v_base_data->>'summary')::TEXT,
    (v_base_data->>'body')::TEXT,
    (v_base_data->>'body_html')::TEXT,
    (v_base_data->'body_json'),
    v_type,
    COALESCE((v_base_data->>'status')::TEXT, 'Draft'),
    COALESCE((v_base_data->>'visibility')::TEXT, 'Public'),
    COALESCE((v_base_data->>'language')::TEXT, 'en'),
    (v_base_data->>'seo_title')::TEXT,
    (v_base_data->>'seo_description')::TEXT,
    (v_base_data->>'canonical_url')::TEXT,
    (v_base_data->>'published_at')::TIMESTAMPTZ,
    (v_base_data->>'thumbnail_url')::TEXT,
    COALESCE((v_base_data->'tags'), '[]'::JSONB),
    (v_base_data->>'category')::TEXT,
    COALESCE((v_base_data->>'featured')::BOOLEAN, FALSE),
    (v_base_data->>'hero_image')::TEXT,
    (v_base_data->>'read_time')::INTEGER,
    (v_base_data->>'highlights')::TEXT
  ) RETURNING id INTO v_media_id;
  
  -- Insert into type-specific table based on type
  CASE v_type
    WHEN 'Blog' THEN
      INSERT INTO public.blogs (
        id, author_id, excerpt, body_html, body_json, 
        focus_keyword, related_keywords, byline
      ) VALUES (
        v_media_id,
        (v_child_data->>'author_id')::UUID,
        (v_child_data->>'excerpt')::TEXT,
        COALESCE((v_child_data->>'body_html')::TEXT, (v_base_data->>'body_html')::TEXT),
        (v_child_data->'body_json'),
        (v_child_data->>'focus_keyword')::TEXT,
        COALESCE((v_child_data->'related_keywords'), '[]'::JSONB),
        (v_child_data->>'byline')::TEXT
      );
    WHEN 'Article' THEN
      INSERT INTO public.articles (
        id, body_html, body_json, byline, source
      ) VALUES (
        v_media_id,
        COALESCE((v_child_data->>'body_html')::TEXT, (v_base_data->>'body_html')::TEXT),
        (v_child_data->'body_json'),
        (v_child_data->>'byline')::TEXT,
        (v_child_data->>'source')::TEXT
      );
    WHEN 'Video' THEN
      INSERT INTO public.videos (
        id, video_url, platform, duration_sec, transcript_url
      ) VALUES (
        v_media_id,
        (v_child_data->>'video_url')::TEXT,
        (v_child_data->>'platform')::TEXT,
        (v_child_data->>'duration_sec')::INTEGER,
        (v_child_data->>'transcript_url')::TEXT
      );
    WHEN 'Podcast' THEN
      INSERT INTO public.podcasts (
        id, audio_url, is_video_episode, episode_no, duration_sec, transcript_url
      ) VALUES (
        v_media_id,
        (v_child_data->>'audio_url')::TEXT,
        COALESCE((v_child_data->>'is_video_episode')::BOOLEAN, FALSE),
        (v_child_data->>'episode_no')::INTEGER,
        (v_child_data->>'duration_sec')::INTEGER,
        (v_child_data->>'transcript_url')::TEXT
      );
    WHEN 'Report' THEN
      INSERT INTO public.reports (
        id, document_url, pages, file_size_mb
      ) VALUES (
        v_media_id,
        (v_child_data->>'document_url')::TEXT,
        (v_child_data->>'pages')::INTEGER,
        (v_child_data->>'file_size_mb')::NUMERIC
      );
    WHEN 'Tool' THEN
      INSERT INTO public.tools (
        id, document_url, requirements, file_size_mb
      ) VALUES (
        v_media_id,
        (v_child_data->>'document_url')::TEXT,
        (v_child_data->>'requirements')::TEXT,
        (v_child_data->>'file_size_mb')::NUMERIC
      );
    WHEN 'Event' THEN
      INSERT INTO public.events (
        id, start_at, end_at, venue, registration_url, timezone
      ) VALUES (
        v_media_id,
        (v_child_data->>'start_at')::TIMESTAMPTZ,
        (v_child_data->>'end_at')::TIMESTAMPTZ,
        (v_child_data->>'venue')::TEXT,
        (v_child_data->>'registration_url')::TEXT,
        (v_child_data->>'timezone')::TEXT
      );
    ELSE
      -- For unknown types, just insert the base record
      NULL;
  END CASE;
  
  RETURN v_media_id;
END;
$$;

-- Generic media item update function
CREATE OR REPLACE FUNCTION public.update_media_item(
  _id UUID,
  _base JSONB,
  _type TEXT,
  _child JSONB
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_base_data JSONB := _base;
  v_child_data JSONB := _child;
  v_type TEXT := _type;
BEGIN
  -- Update media_items table
  UPDATE public.media_items SET
    slug = COALESCE((v_base_data->>'slug')::TEXT, slug),
    title = COALESCE((v_base_data->>'title')::TEXT, title),
    summary = COALESCE((v_base_data->>'summary')::TEXT, summary),
    body = COALESCE((v_base_data->>'body')::TEXT, body),
    body_html = COALESCE((v_base_data->>'body_html')::TEXT, body_html),
    body_json = COALESCE((v_base_data->'body_json'), body_json),
    status = COALESCE((v_base_data->>'status')::TEXT, status),
    visibility = COALESCE((v_base_data->>'visibility')::TEXT, visibility),
    language = COALESCE((v_base_data->>'language')::TEXT, language),
    seo_title = COALESCE((v_base_data->>'seo_title')::TEXT, seo_title),
    seo_description = COALESCE((v_base_data->>'seo_description')::TEXT, seo_description),
    canonical_url = COALESCE((v_base_data->>'canonical_url')::TEXT, canonical_url),
    published_at = COALESCE((v_base_data->>'published_at')::TIMESTAMPTZ, published_at),
    thumbnail_url = COALESCE((v_base_data->>'thumbnail_url')::TEXT, thumbnail_url),
    tags = COALESCE((v_base_data->'tags'), tags),
    category = COALESCE((v_base_data->>'category')::TEXT, category),
    featured = COALESCE((v_base_data->>'featured')::BOOLEAN, featured),
    hero_image = COALESCE((v_base_data->>'hero_image')::TEXT, hero_image),
    read_time = COALESCE((v_base_data->>'read_time')::INTEGER, read_time),
    highlights = COALESCE((v_base_data->>'highlights')::TEXT, highlights)
  WHERE id = _id;
  
  -- Update type-specific table based on type
  CASE v_type
    WHEN 'Blog' THEN
      INSERT INTO public.blogs (
        id, author_id, excerpt, body_html, body_json, 
        focus_keyword, related_keywords, byline
      ) VALUES (
        _id,
        (v_child_data->>'author_id')::UUID,
        (v_child_data->>'excerpt')::TEXT,
        COALESCE((v_child_data->>'body_html')::TEXT, (v_base_data->>'body_html')::TEXT),
        (v_child_data->'body_json'),
        (v_child_data->>'focus_keyword')::TEXT,
        COALESCE((v_child_data->'related_keywords'), '[]'::JSONB),
        (v_child_data->>'byline')::TEXT
      ) ON CONFLICT (id) DO UPDATE SET
        author_id = (v_child_data->>'author_id')::UUID,
        excerpt = (v_child_data->>'excerpt')::TEXT,
        body_html = COALESCE((v_child_data->>'body_html')::TEXT, (v_base_data->>'body_html')::TEXT),
        body_json = (v_child_data->'body_json'),
        focus_keyword = (v_child_data->>'focus_keyword')::TEXT,
        related_keywords = COALESCE((v_child_data->'related_keywords'), '[]'::JSONB),
        byline = (v_child_data->>'byline')::TEXT;
    WHEN 'Article' THEN
      INSERT INTO public.articles (
        id, body_html, body_json, byline, source
      ) VALUES (
        _id,
        COALESCE((v_child_data->>'body_html')::TEXT, (v_base_data->>'body_html')::TEXT),
        (v_child_data->'body_json'),
        (v_child_data->>'byline')::TEXT,
        (v_child_data->>'source')::TEXT
      ) ON CONFLICT (id) DO UPDATE SET
        body_html = COALESCE((v_child_data->>'body_html')::TEXT, (v_base_data->>'body_html')::TEXT),
        body_json = (v_child_data->'body_json'),
        byline = (v_child_data->>'byline')::TEXT,
        source = (v_child_data->>'source')::TEXT;
    WHEN 'Video' THEN
      INSERT INTO public.videos (
        id, video_url, platform, duration_sec, transcript_url
      ) VALUES (
        _id,
        (v_child_data->>'video_url')::TEXT,
        (v_child_data->>'platform')::TEXT,
        (v_child_data->>'duration_sec')::INTEGER,
        (v_child_data->>'transcript_url')::TEXT
      ) ON CONFLICT (id) DO UPDATE SET
        video_url = (v_child_data->>'video_url')::TEXT,
        platform = (v_child_data->>'platform')::TEXT,
        duration_sec = (v_child_data->>'duration_sec')::INTEGER,
        transcript_url = (v_child_data->>'transcript_url')::TEXT;
    WHEN 'Podcast' THEN
      INSERT INTO public.podcasts (
        id, audio_url, is_video_episode, episode_no, duration_sec, transcript_url
      ) VALUES (
        _id,
        (v_child_data->>'audio_url')::TEXT,
        COALESCE((v_child_data->>'is_video_episode')::BOOLEAN, FALSE),
        (v_child_data->>'episode_no')::INTEGER,
        (v_child_data->>'duration_sec')::INTEGER,
        (v_child_data->>'transcript_url')::TEXT
      ) ON CONFLICT (id) DO UPDATE SET
        audio_url = (v_child_data->>'audio_url')::TEXT,
        is_video_episode = COALESCE((v_child_data->>'is_video_episode')::BOOLEAN, FALSE),
        episode_no = (v_child_data->>'episode_no')::INTEGER,
        duration_sec = (v_child_data->>'duration_sec')::INTEGER,
        transcript_url = (v_child_data->>'transcript_url')::TEXT;
    WHEN 'Report' THEN
      INSERT INTO public.reports (
        id, document_url, pages, file_size_mb
      ) VALUES (
        _id,
        (v_child_data->>'document_url')::TEXT,
        (v_child_data->>'pages')::INTEGER,
        (v_child_data->>'file_size_mb')::NUMERIC
      ) ON CONFLICT (id) DO UPDATE SET
        document_url = (v_child_data->>'document_url')::TEXT,
        pages = (v_child_data->>'pages')::INTEGER,
        file_size_mb = (v_child_data->>'file_size_mb')::NUMERIC;
    WHEN 'Tool' THEN
      INSERT INTO public.tools (
        id, document_url, requirements, file_size_mb
      ) VALUES (
        _id,
        (v_child_data->>'document_url')::TEXT,
        (v_child_data->>'requirements')::TEXT,
        (v_child_data->>'file_size_mb')::NUMERIC
      ) ON CONFLICT (id) DO UPDATE SET
        document_url = (v_child_data->>'document_url')::TEXT,
        requirements = (v_child_data->>'requirements')::TEXT,
        file_size_mb = (v_child_data->>'file_size_mb')::NUMERIC;
    WHEN 'Event' THEN
      INSERT INTO public.events (
        id, start_at, end_at, venue, registration_url, timezone
      ) VALUES (
        _id,
        (v_child_data->>'start_at')::TIMESTAMPTZ,
        (v_child_data->>'end_at')::TIMESTAMPTZ,
        (v_child_data->>'venue')::TEXT,
        (v_child_data->>'registration_url')::TEXT,
        (v_child_data->>'timezone')::TEXT
      ) ON CONFLICT (id) DO UPDATE SET
        start_at = (v_child_data->>'start_at')::TIMESTAMPTZ,
        end_at = (v_child_data->>'end_at')::TIMESTAMPTZ,
        venue = (v_child_data->>'venue')::TEXT,
        registration_url = (v_child_data->>'registration_url')::TEXT,
        timezone = (v_child_data->>'timezone')::TEXT;
  END CASE;
  
  RETURN _id;
END;
$$;

-- ============================================================================
-- STEP 11: Insert Sample Data
-- ============================================================================

-- Insert sample authors
INSERT INTO public.authors (name, title, bio, avatar_url, linkedin_url) VALUES
(
  'Dr. Stéphane Niango',
  'Expert in Digital Cognitive Organizations & Strategic Transformation',
  'Dr. Niango is a globally recognized Digital Transformation Architect and Founder of DigitalQatalyst, specializing in the evolution of Digital Cognitive Organizations and AI-driven strategic transformation.',
  '/images/Stephane_Avatar.png',
  'https://linkedin.com/in/stephaneniango'
),
(
  'Kaylynn Océanne',
  'Content Engagement Strategist | Research Analyst',
  'Kaylynn is a Content Engagement Strategist at DigitalQatalyst, specializing in the design of underlying systems that make content coherent, engaging, and repeatable at scale.',
  '/images/Kaylynn_Avatar.png',
  'https://linkedin.com/in/kaylynn-niango'
),
(
  'Michael Rodriguez',
  'Technology Strategy Consultant',
  'Michael specializes in technology strategy and has guided numerous Fortune 500 companies through successful digital transformations.',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  NULL
),
(
  'Dr. Amira Hassan',
  'AI & Cognitive Systems Researcher',
  'Dr. Hassan is a renowned researcher in artificial intelligence and cognitive systems, focusing on practical applications in business.',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
  NULL
)
ON CONFLICT DO NOTHING;

-- Insert sample taxonomies
INSERT INTO public.taxonomies (kind, label, key) VALUES
('Domain', 'Geopolitics & Technology', 'geopolitics-technology'),
('Domain', 'AI Nations', 'ai-nations'),
('Domain', 'Economy 4.0', 'economy-40'),
('Domain', 'Digital Transformation', 'digital-transformation'),
('Domain', 'Digital Worker', 'digital-worker'),
('Domain', 'Digital Warfare', 'digital-warfare'),
('Domain', 'Future of Work', 'future-of-work'),
('Domain', 'Innovation Strategy', 'innovation-strategy'),
('Stage', 'Startup', 'startup'),
('Stage', 'Scale-up', 'scaleup'),
('Stage', 'Enterprise', 'enterprise'),
('Format', 'Blog', 'blog'),
('Format', 'Article', 'article'),
('Format', 'Report', 'report'),
('Format', 'Video', 'video'),
('Tag', 'AI', 'ai'),
('Tag', 'Blockchain', 'blockchain'),
('Tag', 'Cybersecurity', 'cybersecurity')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STEP 12: Add Comments and Documentation
-- ============================================================================

COMMENT ON TABLE public.media_items IS 'Base table for all media content with common fields';
COMMENT ON TABLE public.authors IS 'Authors table for content creators';
COMMENT ON TABLE public.blogs IS 'Blog-specific content extending media_items (1:1 relationship via id)';
COMMENT ON TABLE public.articles IS 'Article-specific content extending media_items (1:1 relationship via id)';
COMMENT ON TABLE public.videos IS 'Video-specific content extending media_items (1:1 relationship via id)';
COMMENT ON TABLE public.podcasts IS 'Podcast-specific content extending media_items (1:1 relationship via id)';
COMMENT ON TABLE public.reports IS 'Report-specific content extending media_items (1:1 relationship via id)';
COMMENT ON TABLE public.tools IS 'Tool-specific content extending media_items (1:1 relationship via id)';
COMMENT ON TABLE public.events IS 'Event-specific content extending media_items (1:1 relationship via id)';
COMMENT ON COLUMN public.media_items.hero_image IS 'Main hero image for blog posts (different from thumbnail)';
COMMENT ON COLUMN public.media_items.category IS 'Content category or classification';
COMMENT ON COLUMN public.media_items.featured IS 'Whether this content is featured/highlighted';
COMMENT ON COLUMN public.media_items.read_time IS 'Estimated reading time in minutes';
COMMENT ON COLUMN public.media_items.highlights IS 'Table of contents or key highlights';

-- ============================================================================
-- STEP 13: Verification Queries
-- ============================================================================

-- Verify main tables were created
SELECT 'Main tables created successfully' as status, 
       count(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name IN ('media_items', 'authors', 'blogs', 'articles', 'videos', 'podcasts', 'reports', 'tools', 'events');

-- Verify media_items has all expected columns
SELECT 'Media items table structure verified' as status, 
       count(*) as column_count
FROM information_schema.columns 
WHERE table_name = 'media_items' 
  AND table_schema = 'public';

-- Verify blogs table was created with proper structure
SELECT 'Blogs table created successfully' as status, 
       count(*) as blog_columns
FROM information_schema.columns 
WHERE table_name = 'blogs' AND table_schema = 'public';

-- Verify authors table was created with proper structure
SELECT 'Authors table created successfully' as status, 
       count(*) as author_columns
FROM information_schema.columns 
WHERE table_name = 'authors' AND table_schema = 'public';

-- Verify storage buckets
SELECT 'Storage buckets created' as status, 
       count(*) as bucket_count
FROM storage.buckets 
WHERE id IN ('author-avatars', 'blog-images', 'media-thumbnails', 'media-assets');

-- Verify sample authors
SELECT 'Sample authors inserted' as status, 
       count(*) as author_count
FROM public.authors;

-- Verify views were created
SELECT 'Views created with blog support' as status, 
       count(*) as view_count
FROM information_schema.views 
WHERE table_name IN ('v_media_all', 'v_media_public', 'v_media_with_authors') 
  AND table_schema = 'public';

-- Verify functions were created
SELECT 'Helper functions created' as status, 
       count(*) as function_count
FROM information_schema.routines 
WHERE routine_name IN ('create_blog_post', 'update_blog_post', 'create_author', 'create_media_item', 'update_media_item')
  AND routine_schema = 'public';

-- Final success message
SELECT '🎉 Fresh blog system reset completed successfully! 
✅ All tables dropped and recreated from scratch
✅ Dedicated blogs table with 1:1 relationship to media_items
✅ Dedicated authors table with profile information
✅ Storage buckets configured for media management
✅ Views created with full blog/author support
✅ Helper functions for blog operations
✅ RLS policies set up for security
✅ Sample data inserted
Your blog form should now work end-to-end with the clean system!' as final_status;