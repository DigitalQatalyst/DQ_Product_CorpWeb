-- Recreate Authors and Blogs Tables from Scratch
-- This script drops existing tables and recreates them with the proper structure
-- ⚠️ WARNING: This will delete all existing author and blog data!

-- ============================================================================
-- STEP 1: Drop Existing Tables and Dependencies
-- ============================================================================

-- Drop views that depend on these tables
DROP VIEW IF EXISTS public.v_media_public CASCADE;
DROP VIEW IF EXISTS public.v_media_all CASCADE;

-- Drop blogs table (this will cascade to remove foreign key constraints)
DROP TABLE IF EXISTS public.blogs CASCADE;

-- Drop authors table (this will cascade to remove foreign key constraints)
DROP TABLE IF EXISTS public.authors CASCADE;

-- Drop functions that might reference these tables
DROP FUNCTION IF EXISTS public.create_blog_post CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- ============================================================================
-- STEP 2: Create Authors Table (Based on Complete Author Setup)
-- ============================================================================

-- Authors table for blog author management
CREATE TABLE public.authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(500),
  bio TEXT,
  avatar_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger for authors
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_authors_updated_at 
    BEFORE UPDATE ON public.authors 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- STEP 3: Add Blog-Specific Fields to media_items Table
-- ============================================================================

-- Add blog-specific fields to the main media_items table
DO $$
BEGIN
  -- Hero image field (separate from thumbnail)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='media_items' AND column_name='hero_image') THEN
    ALTER TABLE public.media_items ADD COLUMN hero_image text;
    RAISE NOTICE 'Added hero_image column to media_items';
  END IF;
  
  -- Category field for blog categorization
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='media_items' AND column_name='category') THEN
    ALTER TABLE public.media_items ADD COLUMN category text;
    RAISE NOTICE 'Added category column to media_items';
  END IF;
  
  -- Featured flag for highlighting important posts
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='media_items' AND column_name='featured') THEN
    ALTER TABLE public.media_items ADD COLUMN featured boolean DEFAULT false;
    RAISE NOTICE 'Added featured column to media_items';
  END IF;
  
  -- Read time in minutes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='media_items' AND column_name='read_time') THEN
    ALTER TABLE public.media_items ADD COLUMN read_time integer;
    RAISE NOTICE 'Added read_time column to media_items';
  END IF;
  
  -- Highlights/Table of Contents
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='media_items' AND column_name='highlights') THEN
    ALTER TABLE public.media_items ADD COLUMN highlights text;
    RAISE NOTICE 'Added highlights column to media_items';
  END IF;
END$$;

-- ============================================================================
-- STEP 4: Create Blogs Table (Following Migration Pattern)
-- ============================================================================

-- Create blogs table with proper 1:1 relationship to media_items
CREATE TABLE public.blogs (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  author_id uuid REFERENCES public.authors(id),
  excerpt text,
  body_html text,
  body_json jsonb,
  focus_keyword text,
  related_keywords jsonb DEFAULT '[]'::jsonb
);

-- ============================================================================
-- STEP 5: Set up RLS Policies for Both Tables
-- ============================================================================

-- Enable RLS on authors table
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for authors (development-friendly)
CREATE POLICY "Allow all operations on authors for development" ON public.authors
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- Enable RLS on blogs table
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for blogs (development-friendly)
CREATE POLICY "Allow all operations on blogs for development" ON public.blogs
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- ============================================================================
-- STEP 6: Set up Storage Bucket for Author Avatars
-- ============================================================================

-- Create storage bucket for author avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('author-avatars', 'author-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies to avoid conflicts
DROP POLICY IF EXISTS "Author avatars are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload author avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update author avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete author avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow all operations on author avatars" ON storage.objects;

-- Create permissive storage policies for author avatars
CREATE POLICY "Author avatars are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'author-avatars');

CREATE POLICY "Allow all operations on author avatars" ON storage.objects
  FOR ALL 
  USING (bucket_id = 'author-avatars') 
  WITH CHECK (bucket_id = 'author-avatars');

-- ============================================================================
-- STEP 7: Set up Storage Bucket for Blog Hero Images
-- ============================================================================

-- Create storage bucket for blog hero images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create permissive storage policies for blog images
CREATE POLICY "Blog images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Allow all operations on blog images" ON storage.objects
  FOR ALL 
  USING (bucket_id = 'blog-images') 
  WITH CHECK (bucket_id = 'blog-images');

-- ============================================================================
-- STEP 8: Recreate Views with Blog and Author Support
-- ============================================================================

-- Recreate the main view with full blog and author support
CREATE VIEW public.v_media_all AS
SELECT
  m.id,
  m.slug,
  COALESCE(m.title, to_jsonb(m)->>'title') AS title,
  COALESCE(m.summary, to_jsonb(m)->>'summary') AS summary,
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
  -- Type resolution (Blog gets priority)
  COALESCE(
    to_jsonb(m)->>'type',
    CASE
      WHEN b.id IS NOT NULL THEN 'Blog'
      WHEN a.id IS NOT NULL THEN 'Article'
      WHEN v.id IS NOT NULL THEN 'Video'
      WHEN p.id IS NOT NULL THEN 'Podcast'
      WHEN r.id IS NOT NULL THEN 'Report'
      WHEN t.id IS NOT NULL THEN 'Tool'
      WHEN e.id IS NOT NULL THEN 'Event'
      ELSE NULL
    END
  ) AS type,
  -- Blog fields
  b.author_id AS blog_author_id,
  b.excerpt AS blog_excerpt,
  b.body_html AS blog_body_html,
  b.body_json AS blog_body_json,
  b.focus_keyword AS blog_focus_keyword,
  b.related_keywords AS blog_related_keywords,
  -- Author information (joined from authors table)
  auth.name AS author_name,
  auth.title AS author_title,
  auth.bio AS author_bio,
  auth.avatar_url AS author_avatar,
  auth.email AS author_email,
  auth.linkedin_url AS author_linkedin,
  auth.twitter_url AS author_twitter,
  auth.website_url AS author_website,
  auth.is_active AS author_is_active,
  -- Article fields (existing)
  a.body_html AS article_body_html,
  a.body_json AS article_body_json,
  a.byline AS article_byline,
  a.source AS article_source,
  -- General body convenience (prioritize blog, then article)
  COALESCE(b.body_html, a.body_html, to_jsonb(m)->>'body', to_jsonb(m)->>'body_html') AS body_html,
  COALESCE(b.body_json, a.body_json, to_jsonb(m)->'body_json') AS body_json,
  -- Video fields (existing)
  v.video_url,
  v.platform,
  v.duration_sec AS video_duration_sec,
  v.transcript_url AS video_transcript_url,
  -- Podcast fields (existing)
  p.audio_url,
  p.is_video_episode,
  p.episode_no,
  p.duration_sec AS audio_duration_sec,
  p.transcript_url AS audio_transcript_url,
  -- Report fields (existing)
  r.document_url AS report_document_url,
  r.pages AS report_pages,
  r.file_size_mb AS report_file_size_mb,
  -- Tool fields (existing)
  t.document_url AS tool_document_url,
  t.requirements AS tool_requirements,
  t.file_size_mb AS tool_file_size_mb,
  -- Event fields (existing)
  e.start_at,
  e.end_at,
  e.venue,
  e.registration_url,
  e.timezone,
  -- Legacy fields (existing)
  to_jsonb(m)->>'business_stage' AS business_stage,
  to_jsonb(m)->>'domain' AS domain,
  to_jsonb(m)->>'format' AS format,
  to_jsonb(m)->>'popularity' AS popularity,
  to_jsonb(m)->>'provider_name' AS provider_name,
  to_jsonb(m)->>'provider_logo_url' AS provider_logo_url,
  to_jsonb(m)->>'image_url' AS image_url,
  to_jsonb(m)->>'podcast_url' AS podcast_url,
  (to_jsonb(m)->>'file_size_bytes')::bigint AS file_size_bytes,
  (to_jsonb(m)->>'download_count')::bigint AS download_count,
  (to_jsonb(m)->>'event_date')::date AS event_date,
  to_jsonb(m)->>'event_time' AS event_time,
  to_jsonb(m)->>'event_location' AS event_location,
  to_jsonb(m)->>'event_location_details' AS event_location_details,
  to_jsonb(m)->>'event_registration_info' AS event_registration_info,
  to_jsonb(m)->'event_agenda' AS event_agenda
FROM public.media_items m
LEFT JOIN public.blogs b ON b.id = m.id
LEFT JOIN public.authors auth ON auth.id = b.author_id
LEFT JOIN public.articles a ON a.id = m.id
LEFT JOIN public.videos v   ON v.id = m.id
LEFT JOIN public.podcasts p ON p.id = m.id
LEFT JOIN public.reports r  ON r.id = m.id
LEFT JOIN public.tools t    ON t.id = m.id
LEFT JOIN public.events e   ON e.id = m.id;

-- Recreate the public view
CREATE VIEW public.v_media_public AS
SELECT *
FROM public.v_media_all
WHERE status = 'Published'
  AND visibility = 'Public'
  AND (published_at IS NULL OR published_at <= now());

-- ============================================================================
-- STEP 9: Create Helper Functions
-- ============================================================================

-- Function to create a complete blog post
CREATE OR REPLACE FUNCTION public.create_blog_post(
  p_title text,
  p_slug text DEFAULT NULL,
  p_excerpt text DEFAULT NULL,
  p_body_html text DEFAULT NULL,
  p_body_json jsonb DEFAULT NULL,
  p_hero_image text DEFAULT NULL,
  p_category text DEFAULT NULL,
  p_author_id uuid DEFAULT NULL,
  p_tags jsonb DEFAULT '[]'::jsonb,
  p_featured boolean DEFAULT false,
  p_read_time integer DEFAULT NULL,
  p_highlights text DEFAULT NULL,
  p_focus_keyword text DEFAULT NULL,
  p_related_keywords jsonb DEFAULT '[]'::jsonb,
  p_status text DEFAULT 'Draft',
  p_visibility text DEFAULT 'Public',
  p_published_at timestamptz DEFAULT NULL,
  p_seo_title text DEFAULT NULL,
  p_seo_description text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  v_media_id uuid;
BEGIN
  -- Insert into media_items (base table)
  INSERT INTO public.media_items (
    title, slug, summary, hero_image, category, featured, read_time, 
    highlights, tags, status, visibility, published_at, seo_title, seo_description
  ) VALUES (
    p_title, p_slug, p_excerpt, p_hero_image, p_category, p_featured, 
    p_read_time, p_highlights, p_tags, p_status, p_visibility, p_published_at,
    p_seo_title, p_seo_description
  ) RETURNING id INTO v_media_id;
  
  -- Insert into blogs (type-specific table)
  INSERT INTO public.blogs (
    id, author_id, excerpt, body_html, body_json, 
    focus_keyword, related_keywords
  ) VALUES (
    v_media_id, p_author_id, p_excerpt, p_body_html, p_body_json,
    p_focus_keyword, p_related_keywords
  );
  
  RETURN v_media_id;
END;
$$;

-- ============================================================================
-- STEP 10: Insert Sample Authors
-- ============================================================================

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

-- ============================================================================
-- STEP 11: Add Comments and Documentation
-- ============================================================================

COMMENT ON TABLE public.authors IS 'Authors table with avatar upload support and social links';
COMMENT ON TABLE public.blogs IS 'Blog-specific content extending media_items (1:1 relationship via id)';
COMMENT ON COLUMN public.media_items.hero_image IS 'Main hero image for blog posts (different from thumbnail)';
COMMENT ON COLUMN public.media_items.category IS 'Blog category or content classification';
COMMENT ON COLUMN public.media_items.featured IS 'Whether this content is featured/highlighted';
COMMENT ON COLUMN public.media_items.read_time IS 'Estimated reading time in minutes';
COMMENT ON COLUMN public.media_items.highlights IS 'Table of contents or key highlights';

-- ============================================================================
-- STEP 12: Verification Queries
-- ============================================================================

-- Verify authors table
SELECT 'Authors table recreated successfully' as status, 
       count(*) as author_columns
FROM information_schema.columns 
WHERE table_name = 'authors' AND table_schema = 'public';

-- Verify blogs table
SELECT 'Blogs table created successfully' as status, 
       count(*) as blog_columns
FROM information_schema.columns 
WHERE table_name = 'blogs' AND table_schema = 'public';

-- Verify media_items has new columns
SELECT 'Media items enhanced for blogs' as status, 
       count(*) as new_columns
FROM information_schema.columns 
WHERE table_name = 'media_items' 
  AND table_schema = 'public'
  AND column_name IN ('hero_image', 'category', 'featured', 'read_time', 'highlights');

-- Verify storage buckets
SELECT 'Storage buckets created' as status, 
       count(*) as bucket_count
FROM storage.buckets 
WHERE id IN ('author-avatars', 'blog-images');

-- Verify sample authors
SELECT 'Sample authors inserted' as status, 
       count(*) as author_count
FROM public.authors;

-- Verify views were recreated
SELECT 'Views recreated with blog support' as status
WHERE EXISTS (
  SELECT 1 FROM information_schema.views 
  WHERE table_name = 'v_media_all' AND table_schema = 'public'
);

-- Final success message
SELECT '🎉 Authors and Blogs tables recreated successfully! 
✅ Author creation with image upload ready
✅ Blog creation with author linking ready  
✅ Storage buckets configured
✅ Views updated with full blog support
Your blog form should now work end-to-end!' as final_status;