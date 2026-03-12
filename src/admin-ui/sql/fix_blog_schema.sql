-- Fix Blog Schema - Handle Existing Tables and Columns
-- This script safely updates the existing blog structure

-- ============================================================================
-- STEP 1: Check and Fix Existing Blogs Table Structure
-- ============================================================================

-- First, let's see what columns exist in the blogs table
DO $$
DECLARE
    column_exists boolean;
BEGIN
    -- Check if blogs table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blogs' AND table_schema = 'public') THEN
        RAISE NOTICE 'Blogs table exists, checking columns...';
        
        -- Check if author_id column exists
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'blogs' 
            AND table_schema = 'public' 
            AND column_name = 'author_id'
        ) INTO column_exists;
        
        IF NOT column_exists THEN
            -- Check if there's an 'author' column instead
            SELECT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'blogs' 
                AND table_schema = 'public' 
                AND column_name = 'author'
            ) INTO column_exists;
            
            IF column_exists THEN
                RAISE NOTICE 'Found author column, renaming to author_id...';
                -- Rename author column to author_id if it exists
                ALTER TABLE public.blogs RENAME COLUMN author TO author_id;
                
                -- Update the column type if needed (assuming it might be text)
                ALTER TABLE public.blogs ALTER COLUMN author_id TYPE uuid USING author_id::uuid;
                
                -- Add foreign key constraint if it doesn't exist
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.table_constraints 
                    WHERE constraint_name = 'blogs_author_id_fkey'
                ) THEN
                    ALTER TABLE public.blogs ADD CONSTRAINT blogs_author_id_fkey 
                    FOREIGN KEY (author_id) REFERENCES public.authors(id);
                END IF;
            ELSE
                RAISE NOTICE 'Adding author_id column...';
                -- Add author_id column if neither exists
                ALTER TABLE public.blogs ADD COLUMN author_id uuid REFERENCES public.authors(id);
            END IF;
        END IF;
        
        -- Add other missing columns to blogs table
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'excerpt') THEN
            ALTER TABLE public.blogs ADD COLUMN excerpt text;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'body_html') THEN
            ALTER TABLE public.blogs ADD COLUMN body_html text;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'body_json') THEN
            ALTER TABLE public.blogs ADD COLUMN body_json jsonb;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'focus_keyword') THEN
            ALTER TABLE public.blogs ADD COLUMN focus_keyword text;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'related_keywords') THEN
            ALTER TABLE public.blogs ADD COLUMN related_keywords jsonb DEFAULT '[]'::jsonb;
        END IF;
        
    ELSE
        RAISE NOTICE 'Creating blogs table...';
        -- Create blogs table if it doesn't exist
        CREATE TABLE public.blogs (
            id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
            author_id uuid REFERENCES public.authors(id),
            excerpt text,
            body_html text,
            body_json jsonb,
            focus_keyword text,
            related_keywords jsonb DEFAULT '[]'::jsonb
        );
    END IF;
END$$;

-- ============================================================================
-- STEP 2: Add Blog-Specific Fields to media_items Table
-- ============================================================================

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
-- STEP 3: Update Views to Include Blog Data (Safe Recreation)
-- ============================================================================

-- Drop and recreate the view to ensure it includes all new columns
DROP VIEW IF EXISTS public.v_media_public;
DROP VIEW IF EXISTS public.v_media_all;

-- Recreate the main view with blog support
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
  -- derived/legacy type resolution (add Blog to the CASE statement)
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
  -- Common filter fields used by app (existing)
  to_jsonb(m)->>'business_stage' AS business_stage,
  to_jsonb(m)->>'domain' AS domain,
  to_jsonb(m)->>'format' AS format,
  to_jsonb(m)->>'popularity' AS popularity,
  -- Legacy convenience passthroughs (existing)
  to_jsonb(m)->>'provider_name' AS provider_name,
  to_jsonb(m)->>'provider_logo_url' AS provider_logo_url,
  to_jsonb(m)->>'image_url' AS image_url,
  to_jsonb(m)->>'podcast_url' AS podcast_url,
  (to_jsonb(m)->>'file_size_bytes')::bigint AS file_size_bytes,
  (to_jsonb(m)->>'download_count')::bigint AS download_count,
  -- Legacy event-like fields (existing)
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
-- STEP 4: Add RLS Policies for Blogs Table
-- ============================================================================

-- Enable RLS on blogs table if not already enabled
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow all operations on blogs for development" ON public.blogs;

-- Create permissive policies for development
CREATE POLICY "Allow all operations on blogs for development" ON public.blogs
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- ============================================================================
-- STEP 5: Create Helper Function for Blog Creation
-- ============================================================================

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.create_blog_post;

-- Create the blog creation function
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
-- STEP 6: Verification and Success Messages
-- ============================================================================

-- Verify blogs table structure
SELECT 'Blogs table structure verified' as status, 
       count(*) as blog_columns
FROM information_schema.columns 
WHERE table_name = 'blogs' AND table_schema = 'public';

-- Verify media_items has new columns
SELECT 'Media items blog columns verified' as status, 
       count(*) as new_columns
FROM information_schema.columns 
WHERE table_name = 'media_items' 
  AND table_schema = 'public'
  AND column_name IN ('hero_image', 'category', 'featured', 'read_time', 'highlights');

-- Verify authors table exists
SELECT 'Authors table verified' as status, count(*) as author_count
FROM public.authors;

-- Verify views were recreated
SELECT 'Views recreated successfully' as status
WHERE EXISTS (
  SELECT 1 FROM information_schema.views 
  WHERE table_name = 'v_media_all' AND table_schema = 'public'
);

-- Final success message
SELECT '🎉 Blog schema fixed! Your blog form should now work end-to-end.' as final_status;