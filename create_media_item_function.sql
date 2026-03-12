-- Create Missing create_media_item Function
-- This function is required for blog form submission

-- Create the create_media_item function
CREATE OR REPLACE FUNCTION public.create_media_item(
  p_slug TEXT,
  p_title TEXT,
  p_summary TEXT DEFAULT NULL,
  p_body TEXT DEFAULT NULL,
  p_body_html TEXT DEFAULT NULL,
  p_body_json JSONB DEFAULT NULL,
  p_type TEXT DEFAULT 'Article',
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
  -- Validate required parameters
  IF p_slug IS NULL OR p_title IS NULL THEN
    RAISE EXCEPTION 'Slug and title are required parameters';
  END IF;

  -- Check if slug already exists
  IF EXISTS (SELECT 1 FROM public.media_items WHERE slug = p_slug) THEN
    RAISE EXCEPTION 'Media item with slug "%" already exists', p_slug;
  END IF;

  -- Insert the new media item
  INSERT INTO public.media_items (
    slug, title, summary, body, body_html, body_json, type, status, 
    visibility, language, seo_title, seo_description, canonical_url, 
    published_at, created_at, updated_at, thumbnail_url, tags, 
    category, featured, hero_image, read_time, highlights
  ) VALUES (
    p_slug, p_title, p_summary, p_body, p_body_html, p_body_json, 
    p_type, p_status, p_visibility, p_language, p_seo_title, 
    p_seo_description, p_canonical_url, p_published_at, 
    NOW(), NOW(), p_thumbnail_url, p_tags, p_category, 
    p_featured, p_hero_image, p_read_time, p_highlights
  ) RETURNING id INTO v_media_id;

  -- Return the ID of the created media item
  RETURN v_media_id;
END;
$$;

-- Create a function to create a complete blog post (combines media item and blog-specific data)
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
  );

  -- Return the ID of the created blog post
  RETURN v_media_id;
END;
$$;

-- Create a function to update a media item
CREATE OR REPLACE FUNCTION public.update_media_item(
  p_id UUID,
  p_slug TEXT DEFAULT NULL,
  p_title TEXT DEFAULT NULL,
  p_summary TEXT DEFAULT NULL,
  p_body TEXT DEFAULT NULL,
  p_body_html TEXT DEFAULT NULL,
  p_body_json JSONB DEFAULT NULL,
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
DECLARE
  v_slug TEXT;
BEGIN
  -- Get current slug if not provided
  IF p_slug IS NULL THEN
    SELECT slug INTO v_slug FROM public.media_items WHERE id = p_id;
  ELSE
    v_slug := p_slug;
  END IF;

  -- Check if new slug already exists for another record
  IF p_slug IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.media_items 
    WHERE slug = p_slug AND id != p_id
  ) THEN
    RAISE EXCEPTION 'Media item with slug "%" already exists', p_slug;
  END IF;

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
    published_at = COALESCE(p_published_at, published_at),
    updated_at = NOW(),
    thumbnail_url = COALESCE(p_thumbnail_url, thumbnail_url),
    tags = COALESCE(p_tags, tags),
    category = COALESCE(p_category, category),
    featured = COALESCE(p_featured, featured),
    hero_image = COALESCE(p_hero_image, hero_image),
    read_time = COALESCE(p_read_time, read_time),
    highlights = COALESCE(p_highlights, highlights)
  WHERE id = p_id;

  -- Update the corresponding blog entry if it exists
  UPDATE public.blogs SET
    body_html = COALESCE(p_body_html, body_html),
    body_json = COALESCE(p_body_json, body_json)
  WHERE id = p_id;
END;
$$;

-- Create a function to update a blog post specifically
CREATE OR REPLACE FUNCTION public.update_blog_post(
  p_id UUID,
  p_author_id UUID DEFAULT NULL,
  p_excerpt TEXT DEFAULT NULL,
  p_focus_keyword TEXT DEFAULT NULL,
  p_related_keywords JSONB DEFAULT NULL,
  p_byline TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update the blog-specific data
  UPDATE public.blogs SET
    author_id = COALESCE(p_author_id, author_id),
    excerpt = COALESCE(p_excerpt, excerpt),
    focus_keyword = COALESCE(p_focus_keyword, focus_keyword),
    related_keywords = COALESCE(p_related_keywords, related_keywords),
    byline = COALESCE(p_byline, byline)
  WHERE id = p_id;
END;
$$;

-- Create a function to publish media item
CREATE OR REPLACE FUNCTION public.publish_media(p_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.media_items 
  SET status = 'Published', published_at = COALESCE(published_at, NOW())
  WHERE id = p_id;
END;
$$;

-- Create a function to unpublish media item
CREATE OR REPLACE FUNCTION public.unpublish_media(p_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.media_items 
  SET status = 'Draft', published_at = NULL
  WHERE id = p_id;
END;
$$;

-- Verify that the functions were created
SELECT 
  '✅ Functions created successfully!' as status,
  (SELECT count(*) FROM pg_proc WHERE proname = 'create_media_item') as create_media_item_exists,
  (SELECT count(*) FROM pg_proc WHERE proname = 'create_blog_post') as create_blog_post_exists,
  (SELECT count(*) FROM pg_proc WHERE proname = 'update_media_item') as update_media_item_exists,
  (SELECT count(*) FROM pg_proc WHERE proname = 'update_blog_post') as update_blog_post_exists;