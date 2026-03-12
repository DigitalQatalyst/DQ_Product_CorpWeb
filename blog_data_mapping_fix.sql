-- Blog Data Mapping Fix
-- Ensures proper saving and retrieval of blog data including body content and hero image

-- First, let's make sure the tables have the right structure and constraints
-- Check if the media_items table has all required columns
DO $$
DECLARE
  col_exists INTEGER;
BEGIN
  -- Add body_json column if it doesn't exist
  SELECT count(*) INTO col_exists
  FROM information_schema.columns 
  WHERE table_schema = 'public' 
    AND table_name = 'media_items'
    AND column_name = 'body_json';
  IF col_exists = 0 THEN
    ALTER TABLE public.media_items ADD COLUMN body_json JSONB DEFAULT NULL;
  END IF;

  -- Add hero_image column if it doesn't exist
  SELECT count(*) INTO col_exists
  FROM information_schema.columns 
  WHERE table_schema = 'public' 
    AND table_name = 'media_items'
    AND column_name = 'hero_image';
  IF col_exists = 0 THEN
    ALTER TABLE public.media_items ADD COLUMN hero_image TEXT DEFAULT NULL;
  END IF;

  -- Add read_time column if it doesn't exist
  SELECT count(*) INTO col_exists
  FROM information_schema.columns 
  WHERE table_schema = 'public' 
    AND table_name = 'media_items'
    AND column_name = 'read_time';
  IF col_exists = 0 THEN
    ALTER TABLE public.media_items ADD COLUMN read_time INTEGER DEFAULT NULL;
  END IF;

  -- Add highlights column if it doesn't exist
  SELECT count(*) INTO col_exists
  FROM information_schema.columns 
  WHERE table_schema = 'public' 
    AND table_name = 'media_items'
    AND column_name = 'highlights';
  IF col_exists = 0 THEN
    ALTER TABLE public.media_items ADD COLUMN highlights TEXT DEFAULT NULL;
  END IF;
END $$;

-- Make sure the blogs table has the right structure
DO $$
DECLARE
  col_exists INTEGER;
BEGIN
  -- Add excerpt column if it doesn't exist
  SELECT count(*) INTO col_exists
  FROM information_schema.columns 
  WHERE table_schema = 'public' 
    AND table_name = 'blogs'
    AND column_name = 'excerpt';
  IF col_exists = 0 THEN
    ALTER TABLE public.blogs ADD COLUMN excerpt TEXT DEFAULT NULL;
  END IF;

  -- Add focus_keyword column if it doesn't exist
  SELECT count(*) INTO col_exists
  FROM information_schema.columns 
  WHERE table_schema = 'public' 
    AND table_name = 'blogs'
    AND column_name = 'focus_keyword';
  IF col_exists = 0 THEN
    ALTER TABLE public.blogs ADD COLUMN focus_keyword TEXT DEFAULT NULL;
  END IF;

  -- Add related_keywords column if it doesn't exist
  SELECT count(*) INTO col_exists
  FROM information_schema.columns 
  WHERE table_schema = 'public' 
    AND table_name = 'blogs'
    AND column_name = 'related_keywords';
  IF col_exists = 0 THEN
    ALTER TABLE public.blogs ADD COLUMN related_keywords JSONB DEFAULT '[]'::JSONB;
  END IF;

  -- Add byline column if it doesn't exist
  SELECT count(*) INTO col_exists
  FROM information_schema.columns 
  WHERE table_schema = 'public' 
    AND table_name = 'blogs'
    AND column_name = 'byline';
  IF col_exists = 0 THEN
    ALTER TABLE public.blogs ADD COLUMN byline TEXT DEFAULT NULL;
  END IF;
END $$;

-- Update the views to ensure they properly join all necessary data
-- Drop and recreate the views to ensure proper structure
DROP VIEW IF EXISTS public.v_media_all;
DROP VIEW IF EXISTS public.v_media_public;
DROP VIEW IF EXISTS public.v_media_with_authors;

-- Recreate v_media_all with proper column selection
CREATE VIEW public.v_media_all AS
SELECT 
    mi.id,
    mi.slug,
    mi.title,
    mi.summary,
    mi.body,
    mi.body_html,
    mi.body_json,
    mi.type,
    mi.status,
    mi.visibility,
    mi.language,
    mi.seo_title,
    mi.seo_description,
    mi.canonical_url,
    mi.published_at,
    mi.created_at,
    mi.updated_at,
    mi.thumbnail_url,
    mi.tags,
    mi.category,
    mi.featured,
    mi.hero_image,
    mi.read_time,
    mi.highlights,
    -- Author information
    a.id AS author_id,
    a.name AS author_name,
    a.title AS author_title,
    a.bio AS author_bio,
    a.avatar_url AS author_avatar_url,
    a.linkedin_url AS author_linkedin_url,
    a.twitter_url AS author_twitter_url,
    a.website_url AS author_website_url,
    a.email AS author_email,
    a.is_active AS author_is_active,
    a.created_at AS author_created_at,
    a.updated_at AS author_updated_at,
    -- Blog-specific information
    b.excerpt AS blog_excerpt,
    b.focus_keyword AS blog_focus_keyword,
    b.related_keywords AS blog_related_keywords,
    b.byline AS blog_byline
FROM public.media_items mi
LEFT JOIN public.blogs b ON mi.id = b.id
LEFT JOIN public.authors a ON b.author_id = a.id;

-- Recreate v_media_public with proper column selection
CREATE VIEW public.v_media_public AS
SELECT 
    mi.id,
    mi.slug,
    mi.title,
    mi.summary,
    mi.body_html,
    mi.body_json,
    mi.type,
    mi.status,
    mi.visibility,
    mi.language,
    mi.seo_title,
    mi.seo_description,
    mi.published_at,
    mi.created_at,
    mi.updated_at,
    mi.thumbnail_url,
    mi.tags,
    mi.category,
    mi.featured,
    mi.hero_image,
    mi.read_time,
    mi.highlights,
    -- Author information
    a.id AS author_id,
    a.name AS author_name,
    a.title AS author_title,
    a.bio AS author_bio,
    a.avatar_url AS author_avatar_url,
    a.linkedin_url AS author_linkedin_url,
    a.twitter_url AS author_twitter_url,
    a.website_url AS author_website_url,
    a.email AS author_email,
    -- Blog-specific information
    b.excerpt AS blog_excerpt,
    b.focus_keyword AS blog_focus_keyword,
    b.related_keywords AS blog_related_keywords,
    b.byline AS blog_byline
FROM public.media_items mi
LEFT JOIN public.blogs b ON mi.id = b.id
LEFT JOIN public.authors a ON b.author_id = a.id
WHERE mi.status = 'Published' 
  AND mi.visibility = 'Public'
  AND a.is_active = TRUE;

-- Recreate v_media_with_authors with proper column selection
CREATE VIEW public.v_media_with_authors AS
SELECT 
    mi.id,
    mi.slug,
    mi.title,
    mi.summary,
    mi.body_html,
    mi.body_json,
    mi.type,
    mi.status,
    mi.visibility,
    mi.language,
    mi.published_at,
    mi.created_at,
    mi.updated_at,
    mi.thumbnail_url,
    mi.tags,
    mi.category,
    mi.featured,
    mi.hero_image,
    mi.read_time,
    mi.highlights,
    -- Author information
    a.id AS author_id,
    a.name AS author_name,
    a.title AS author_title,
    a.bio AS author_bio,
    a.avatar_url AS author_avatar_url,
    a.linkedin_url AS author_linkedin_url,
    a.twitter_url AS author_twitter_url,
    a.website_url AS author_website_url,
    a.email AS author_email,
    a.is_active AS author_is_active
FROM public.media_items mi
LEFT JOIN public.blogs b ON mi.id = b.id
LEFT JOIN public.authors a ON b.author_id = a.id
WHERE mi.type IN ('Article', 'Blog');

-- Ensure proper permissions on the views
GRANT SELECT ON public.v_media_all TO authenticated, anon;
GRANT SELECT ON public.v_media_public TO authenticated, anon;
GRANT SELECT ON public.v_media_with_authors TO authenticated, anon;

-- Update the create_blog_post function to ensure proper data storage
CREATE OR REPLACE FUNCTION public.create_blog_post(
  p_slug TEXT,
  p_title TEXT,
  p_summary TEXT DEFAULT NULL,
  p_body TEXT DEFAULT NULL,
  p_body_html TEXT DEFAULT NULL,
  p_body_json JSONB DEFAULT NULL,
  p_author_id UUID DEFAULT NULL,
  p_excerpt TEXT DEFAULT NULL,
  p_focus_keyword TEXT DEFAULT NULL,
  p_related_keywords JSONB DEFAULT NULL,
  p_byline TEXT DEFAULT NULL,
  p_status TEXT DEFAULT 'Draft',
  p_visibility TEXT DEFAULT 'Public',
  p_language TEXT DEFAULT 'en',
  p_seo_title TEXT DEFAULT NULL,
  p_seo_description TEXT DEFAULT NULL,
  p_canonical_url TEXT DEFAULT NULL,
  p_published_at TIMESTAMPTZ DEFAULT NULL,
  p_thumbnail_url TEXT DEFAULT NULL,
  p_tags JSONB DEFAULT '[]'::JSONB,
  p_category TEXT DEFAULT NULL,
  p_featured BOOLEAN DEFAULT FALSE,
  p_hero_image TEXT DEFAULT NULL,
  p_read_time INTEGER DEFAULT NULL,
  p_highlights TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_media_id UUID;
BEGIN
  -- Create the base media item first
  v_media_id := public.create_media_item(
    p_slug, p_title, p_summary, p_body, p_body_html, p_body_json, 
    'Blog', p_status, p_visibility, p_language, p_seo_title, 
    p_seo_description, p_canonical_url, p_published_at, 
    p_thumbnail_url, p_tags, p_category, p_featured, 
    p_hero_image, p_read_time, p_highlights
  );

  -- Insert the blog-specific data
  INSERT INTO public.blogs (
    id, author_id, excerpt, body_html, body_json, 
    focus_keyword, related_keywords, byline
  ) VALUES (
    v_media_id, p_author_id, p_excerpt, p_body_html, p_body_json, 
    p_focus_keyword, COALESCE(p_related_keywords, '[]'::JSONB), p_byline
  ) ON CONFLICT (id) DO UPDATE SET
    author_id = EXCLUDED.author_id,
    excerpt = EXCLUDED.excerpt,
    body_html = EXCLUDED.body_html,
    body_json = EXCLUDED.body_json,
    focus_keyword = EXCLUDED.focus_keyword,
    related_keywords = EXCLUDED.related_keywords,
    byline = EXCLUDED.byline;

  -- Return the ID of the created blog post
  RETURN v_media_id;
END;
$$;

-- Update the update_blog_post function to ensure proper data updates
CREATE OR REPLACE FUNCTION public.update_blog_post(
  p_id UUID,
  p_slug TEXT DEFAULT NULL,
  p_title TEXT DEFAULT NULL,
  p_summary TEXT DEFAULT NULL,
  p_body TEXT DEFAULT NULL,
  p_body_html TEXT DEFAULT NULL,
  p_body_json JSONB DEFAULT NULL,
  p_author_id UUID DEFAULT NULL,
  p_excerpt TEXT DEFAULT NULL,
  p_focus_keyword TEXT DEFAULT NULL,
  p_related_keywords JSONB DEFAULT NULL,
  p_byline TEXT DEFAULT NULL,
  p_status TEXT DEFAULT NULL,
  p_visibility TEXT DEFAULT NULL,
  p_language TEXT DEFAULT NULL,
  p_seo_title TEXT DEFAULT NULL,
  p_seo_description TEXT DEFAULT NULL,
  p_canonical_url TEXT DEFAULT NULL,
  p_published_at TIMESTAMPTZ DEFAULT NULL,
  p_thumbnail_url TEXT DEFAULT NULL,
  p_tags JSONB DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_featured BOOLEAN DEFAULT NULL,
  p_hero_image TEXT DEFAULT NULL,
  p_read_time INTEGER DEFAULT NULL,
  p_highlights TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update the media item
  UPDATE public.media_items SET
    slug = COALESCE(p_slug, slug),
    title = COALESCE(p_title, title),
    summary = COALESCE(p_summary, summary),
    body = COALESCE(p_body, body),
    body_html = COALESCE(p_body_html, body_html),
    body_json = COALESCE(p_body_json, body_json),
    status = COALESCE(p_status, status),
    visibility = COALESCE(p_visibility, visibility),
    language = COALESCE(p_language, language),
    seo_title = COALESCE(p_seo_title, seo_title),
    seo_description = COALESCE(p_seo_description, seo_description),
    canonical_url = COALESCE(p_canonical_url, canonical_url),
    published_at = CASE 
      WHEN p_published_at IS NOT NULL THEN p_published_at::TIMESTAMPTZ 
      ELSE published_at 
    END,
    updated_at = NOW(),
    thumbnail_url = COALESCE(p_thumbnail_url, thumbnail_url),
    tags = COALESCE(p_tags, tags),
    category = COALESCE(p_category, category),
    featured = COALESCE(p_featured, featured),
    hero_image = COALESCE(p_hero_image, hero_image),
    read_time = COALESCE(p_read_time, read_time),
    highlights = COALESCE(p_highlights, highlights)
  WHERE id = p_id;

  -- Update the blog-specific data
  INSERT INTO public.blogs (
    id, author_id, excerpt, body_html, body_json, 
    focus_keyword, related_keywords, byline
  ) VALUES (
    p_id, p_author_id, p_excerpt, p_body_html, p_body_json, 
    p_focus_keyword, COALESCE(p_related_keywords, '[]'::JSONB), p_byline
  ) ON CONFLICT (id) DO UPDATE SET
    author_id = COALESCE(EXCLUDED.author_id, blogs.author_id),
    excerpt = COALESCE(EXCLUDED.excerpt, blogs.excerpt),
    body_html = COALESCE(EXCLUDED.body_html, blogs.body_html),
    body_json = COALESCE(EXCLUDED.body_json, blogs.body_json),
    focus_keyword = COALESCE(EXCLUDED.focus_keyword, blogs.focus_keyword),
    related_keywords = COALESCE(EXCLUDED.related_keywords, blogs.related_keywords),
    byline = COALESCE(EXCLUDED.byline, blogs.byline);
END;
$$;

-- Verify the structure and data
SELECT 
  '✅ Blog data mapping fixed!' as status,
  (SELECT count(*) FROM information_schema.tables WHERE table_name = 'media_items') as media_items_exists,
  (SELECT count(*) FROM information_schema.tables WHERE table_name = 'blogs') as blogs_exists,
  (SELECT count(*) FROM information_schema.tables WHERE table_name = 'authors') as authors_exists,
  (SELECT count(*) FROM information_schema.views WHERE table_name = 'v_media_all') as v_media_all_exists,
  (SELECT count(*) FROM information_schema.views WHERE table_name = 'v_media_public') as v_media_public_exists,
  (SELECT count(*) FROM information_schema.columns WHERE table_name = 'media_items' AND column_name = 'hero_image') as hero_image_exists,
  (SELECT count(*) FROM information_schema.columns WHERE table_name = 'media_items' AND column_name = 'body_json') as body_json_exists;