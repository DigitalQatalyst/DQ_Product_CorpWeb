-- Body Content Mapping Fix
-- Ensures that body, body_html, and body_json fields are properly saved from form submissions

-- First, let's verify the current state of our media_items table
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'media_items' 
  AND column_name IN ('body', 'body_html', 'body_json')
ORDER BY ordinal_position;

-- Let's also check if there are any data validation or constraint issues
SELECT 
  'Current media_items table structure' as info,
  count(*) as total_columns
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'media_items';

-- Update the create_media_item function to ensure all body fields are captured properly
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
  -- Extract values from the _base JSONB parameter with explicit handling for body fields
  v_slug := _base->>'slug';
  v_title := _base->>'title';
  v_summary := _base->>'summary';
  
  -- Explicitly handle body fields - these are the critical ones that were showing as blank
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

  -- Log the body content for debugging purposes (this will help us verify if the data is being received)
  RAISE NOTICE 'Creating media item with slug: %, body length: %, body_html length: %, body_json null: %', 
               v_slug, 
               COALESCE(LENGTH(v_body), 0), 
               COALESCE(LENGTH(v_body_html), 0), 
               (v_body_json IS NULL);

  -- Check if slug already exists
  IF EXISTS (SELECT 1 FROM public.media_items WHERE slug = v_slug) THEN
    RAISE EXCEPTION 'Media item with slug "%" already exists', v_slug;
  END IF;

  -- Insert the new media item with explicit body field assignment
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
      COALESCE(_child->>'body_html', v_body_html),  -- Use body_html from _child if available, otherwise from base
      COALESCE(_child->'body_json', v_body_json),   -- Use body_json from _child if available, otherwise from base
      _child->>'focus_keyword',
      COALESCE(_child->'related_keywords', '[]'::JSONB),
      _child->>'byline'
    );
  END IF;

  -- Return the ID of the created media item
  RETURN v_media_id;
END;
$$;

-- Update the update_media_item function to ensure all body fields are updated properly
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
  -- Extract values from the _base JSONB parameter with explicit handling for body fields
  v_slug := _base->>'slug';
  v_title := _base->>'title';
  v_summary := _base->>'summary';
  
  -- Explicitly handle body fields - these are the critical ones that were showing as blank
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

  -- Log the body content for debugging purposes
  RAISE NOTICE 'Updating media item with id: %, body length: %, body_html length: %, body_json null: %', 
               _id, 
               COALESCE(LENGTH(v_body), 0), 
               COALESCE(LENGTH(v_body_html), 0), 
               (v_body_json IS NULL);

  -- Update the media item with explicit body field assignment
  UPDATE public.media_items SET
    slug = COALESCE(v_slug, slug),
    title = COALESCE(v_title, title),
    summary = COALESCE(v_summary, summary),
    body = v_body,  -- Explicitly set body field (don't use COALESCE to avoid overwriting with NULL)
    body_html = v_body_html,  -- Explicitly set body_html field
    body_json = v_body_json,  -- Explicitly set body_json field
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
      COALESCE(_child->>'body_html', v_body_html),  -- Use body_html from _child if available, otherwise from base
      COALESCE(_child->'body_json', v_body_json),   -- Use body_json from _child if available, otherwise from base
      _child->>'focus_keyword',
      COALESCE(_child->'related_keywords', '[]'::JSONB),
      _child->>'byline'
    ) ON CONFLICT (id) DO UPDATE SET
      author_id = COALESCE((_child->>'author_id')::UUID, blogs.author_id),
      excerpt = COALESCE(_child->>'excerpt', blogs.excerpt),
      body_html = COALESCE(_child->>'body_html', blogs.body_html),  -- Ensure body_html is updated
      body_json = COALESCE(_child->'body_json', blogs.body_json),   -- Ensure body_json is updated
      focus_keyword = COALESCE(_child->>'focus_keyword', blogs.focus_keyword),
      related_keywords = COALESCE(_child->'related_keywords', blogs.related_keywords),
      byline = COALESCE(_child->>'byline', blogs.byline);
  END IF;
END;
$$;

-- Test function to check if data is being passed correctly
CREATE OR REPLACE FUNCTION public.test_body_content_mapping(
  test_slug TEXT DEFAULT 'test-content-slug',
  test_body TEXT DEFAULT 'Test body content',
  test_body_html TEXT DEFAULT '<p>Test body HTML content</p>',
  test_body_json JSONB DEFAULT '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Test body JSON content"}]}]}'
)
RETURNS TABLE(
  id UUID,
  slug TEXT,
  body TEXT,
  body_html TEXT,
  body_json JSONB,
  message TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_test_id UUID;
  v_base JSONB;
BEGIN
  -- Create test JSONB object
  v_base := jsonb_build_object(
    'slug', test_slug,
    'title', 'Test Content for Body Mapping',
    'summary', 'Test summary for body mapping verification',
    'body', test_body,
    'body_html', test_body_html,
    'body_json', test_body_json,
    'type', 'Article',
    'status', 'Draft'
  );

  -- Create a test media item
  v_test_id := public.create_media_item(v_base);

  -- Return the created record to verify content was saved
  RETURN QUERY
  SELECT 
    mi.id,
    mi.slug,
    mi.body,
    mi.body_html,
    mi.body_json,
    'Body content mapping test completed'::TEXT as message
  FROM public.media_items mi
  WHERE mi.id = v_test_id;
END;
$$;

-- Verify that the functions were updated
SELECT 
  '✅ Body content mapping functions updated!' as status,
  (SELECT count(*) FROM pg_proc WHERE proname = 'create_media_item') as create_media_item_exists,
  (SELECT count(*) FROM pg_proc WHERE proname = 'update_media_item') as update_media_item_exists,
  (SELECT count(*) FROM pg_proc WHERE proname = 'test_body_content_mapping') as test_function_exists;

-- Run a quick test to verify the mapping works
-- Uncomment the next line to run a test (optional):
-- SELECT * FROM public.test_body_content_mapping();