-- Create the Exact Missing create_media_item Function
-- Function signature: create_media_item(_base, _child, _type) based on the error message

-- Drop the function if it exists (in case we need to recreate with correct signature)
DROP FUNCTION IF EXISTS public.create_media_item(jsonb, jsonb, text);

-- Create the create_media_item function with the exact signature needed
CREATE OR REPLACE FUNCTION public.create_media_item(
  _base JSONB,
  _child JSONB DEFAULT '{}',
  _type TEXT DEFAULT 'Article'
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_media_id UUID;
  v_slug TEXT;
  v_title TEXT;
  v_summary TEXT;
  v_body TEXT;
  v_body_html TEXT;
  v_body_json JSONB;
  v_status TEXT;
  v_visibility TEXT;
  v_language TEXT;
  v_seo_title TEXT;
  v_seo_description TEXT;
  v_canonical_url TEXT;
  v_published_at TIMESTAMPTZ;
  v_thumbnail_url TEXT;
  v_tags JSONB;
  v_category TEXT;
  v_featured BOOLEAN;
  v_hero_image TEXT;
  v_read_time INTEGER;
  v_highlights TEXT;
BEGIN
  -- Extract values from the _base JSONB parameter
  v_slug := _base->>'slug';
  v_title := _base->>'title';
  v_summary := _base->>'summary';
  v_body := _base->>'body';
  v_body_html := _base->>'body_html';
  v_body_json := _base->'body_json';
  v_status := COALESCE(_base->>'status', 'Draft');
  v_visibility := COALESCE(_base->>'visibility', 'Public');
  v_language := COALESCE(_base->>'language', 'en');
  v_seo_title := _base->>'seo_title';
  v_seo_description := _base->>'seo_description';
  v_canonical_url := _base->>'canonical_url';
  v_published_at := _base->>'published_at';
  v_thumbnail_url := _base->>'thumbnail_url';
  v_tags := COALESCE(_base->'tags', '[]'::JSONB);
  v_category := _base->>'category';
  v_featured := (_base->>'featured')::BOOLEAN;
  v_hero_image := _base->>'hero_image';
  v_read_time := (_base->>'read_time')::INTEGER;
  v_highlights := _base->>'highlights';

  -- Validate required parameters
  IF v_slug IS NULL OR v_title IS NULL THEN
    RAISE EXCEPTION 'Slug and title are required parameters';
  END IF;

  -- Check if slug already exists
  IF EXISTS (SELECT 1 FROM public.media_items WHERE slug = v_slug) THEN
    RAISE EXCEPTION 'Media item with slug "%" already exists', v_slug;
  END IF;

  -- Insert the new media item
  INSERT INTO public.media_items (
    slug, title, summary, body, body_html, body_json, type, status, 
    visibility, language, seo_title, seo_description, canonical_url, 
    published_at, created_at, updated_at, thumbnail_url, tags, 
    category, featured, hero_image, read_time, highlights
  ) VALUES (
    v_slug, v_title, v_summary, v_body, v_body_html, v_body_json, 
    _type, v_status, v_visibility, v_language, v_seo_title, 
    v_seo_description, v_canonical_url, 
    CASE WHEN v_published_at IS NOT NULL THEN v_published_at::TIMESTAMPTZ ELSE NULL END, 
    NOW(), NOW(), v_thumbnail_url, v_tags, v_category, 
    COALESCE(v_featured, FALSE), v_hero_image, v_read_time, v_highlights
  ) RETURNING id INTO v_media_id;

  -- Handle blog-specific data if _type is 'Blog' and _child contains blog data
  IF _type = 'Blog' AND _child != '{}'::JSONB THEN
    INSERT INTO public.blogs (
      id, author_id, excerpt, body_html, body_json, 
      focus_keyword, related_keywords, byline
    ) VALUES (
      v_media_id,
      (_child->>'author_id')::UUID,
      _child->>'excerpt',
      COALESCE(_child->>'body_html', v_body_html),
      COALESCE(_child->'body_json', v_body_json),
      _child->>'focus_keyword',
      COALESCE(_child->'related_keywords', '[]'::JSONB),
      _child->>'byline'
    );
  END IF;

  -- Return the ID of the created media item
  RETURN v_media_id;
END;
$$;

-- Also create an update function with similar signature if needed
CREATE OR REPLACE FUNCTION public.update_media_item(
  _id UUID,
  _base JSONB,
  _child JSONB DEFAULT '{}',
  _type TEXT DEFAULT 'Article'
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  v_slug TEXT;
  v_title TEXT;
  v_summary TEXT;
  v_body TEXT;
  v_body_html TEXT;
  v_body_json JSONB;
  v_status TEXT;
  v_visibility TEXT;
  v_language TEXT;
  v_seo_title TEXT;
  v_seo_description TEXT;
  v_canonical_url TEXT;
  v_published_at TIMESTAMPTZ;
  v_thumbnail_url TEXT;
  v_tags JSONB;
  v_category TEXT;
  v_featured BOOLEAN;
  v_hero_image TEXT;
  v_read_time INTEGER;
  v_highlights TEXT;
BEGIN
  -- Extract values from the _base JSONB parameter
  v_slug := _base->>'slug';
  v_title := _base->>'title';
  v_summary := _base->>'summary';
  v_body := _base->>'body';
  v_body_html := _base->>'body_html';
  v_body_json := _base->'body_json';
  v_status := _base->>'status';
  v_visibility := _base->>'visibility';
  v_language := _base->>'language';
  v_seo_title := _base->>'seo_title';
  v_seo_description := _base->>'seo_description';
  v_canonical_url := _base->>'canonical_url';
  v_published_at := _base->>'published_at';
  v_thumbnail_url := _base->>'thumbnail_url';
  v_tags := _base->'tags';
  v_category := _base->>'category';
  v_featured := (_base->>'featured')::BOOLEAN;
  v_hero_image := _base->>'hero_image';
  v_read_time := (_base->>'read_time')::INTEGER;
  v_highlights := _base->>'highlights';

  -- Update the media item
  UPDATE public.media_items SET
    slug = COALESCE(v_slug, slug),
    title = COALESCE(v_title, title),
    summary = COALESCE(v_summary, summary),
    body = COALESCE(v_body, body),
    body_html = COALESCE(v_body_html, body_html),
    body_json = COALESCE(v_body_json, body_json),
    type = COALESCE(_type, type),
    status = COALESCE(v_status, status),
    visibility = COALESCE(v_visibility, visibility),
    language = COALESCE(v_language, language),
    seo_title = COALESCE(v_seo_title, seo_title),
    seo_description = COALESCE(v_seo_description, seo_description),
    canonical_url = COALESCE(v_canonical_url, canonical_url),
    published_at = CASE 
      WHEN v_published_at IS NOT NULL THEN v_published_at::TIMESTAMPTZ 
      ELSE published_at 
    END,
    updated_at = NOW(),
    thumbnail_url = COALESCE(v_thumbnail_url, thumbnail_url),
    tags = COALESCE(v_tags, tags),
    category = COALESCE(v_category, category),
    featured = COALESCE(v_featured, featured),
    hero_image = COALESCE(v_hero_image, hero_image),
    read_time = COALESCE(v_read_time, read_time),
    highlights = COALESCE(v_highlights, highlights)
  WHERE id = _id;

  -- Update blog-specific data if _type is 'Blog' and _child contains blog data
  IF _type = 'Blog' AND _child != '{}'::JSONB THEN
    INSERT INTO public.blogs (
      id, author_id, excerpt, body_html, body_json, 
      focus_keyword, related_keywords, byline
    ) VALUES (
      _id,
      (_child->>'author_id')::UUID,
      _child->>'excerpt',
      COALESCE(_child->>'body_html', v_body_html),
      COALESCE(_child->'body_json', v_body_json),
      _child->>'focus_keyword',
      COALESCE(_child->'related_keywords', '[]'::JSONB),
      _child->>'byline'
    ) ON CONFLICT (id) DO UPDATE SET
      author_id = COALESCE((_child->>'author_id')::UUID, blogs.author_id),
      excerpt = COALESCE(_child->>'excerpt', blogs.excerpt),
      body_html = COALESCE(_child->>'body_html', blogs.body_html),
      body_json = COALESCE(_child->'body_json', blogs.body_json),
      focus_keyword = COALESCE(_child->>'focus_keyword', blogs.focus_keyword),
      related_keywords = COALESCE(_child->'related_keywords', blogs.related_keywords),
      byline = COALESCE(_child->>'byline', blogs.byline);
  END IF;
END;
$$;

-- Verify that the functions were created
SELECT 
  '✅ Exact functions created successfully!' as status,
  (SELECT count(*) FROM pg_proc WHERE proname = 'create_media_item') as create_media_item_exists,
  (SELECT count(*) FROM pg_proc WHERE proname = 'update_media_item') as update_media_item_exists;