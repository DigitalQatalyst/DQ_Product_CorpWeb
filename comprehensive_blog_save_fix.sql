-- Comprehensive Blog Save Fix
-- Diagnoses and fixes issues with data not being saved properly

-- First, let's check the current state of our database tables
SELECT 
  'media_items table analysis' as info,
  count(*) as total_records,
  count(body) as body_not_null,
  count(body_html) as body_html_not_null,
  count(body_json) as body_json_not_null,
  count(hero_image) as hero_image_not_null,
  count(thumbnail_url) as thumbnail_url_not_null
FROM public.media_items;

-- Check for any recent blog records to see what's missing
SELECT 
  id,
  slug,
  title,
  LENGTH(body) as body_length,
  LENGTH(body_html) as body_html_length,
  CASE WHEN body_json IS NULL THEN 'NULL' ELSE 'NOT NULL' END as body_json_status,
  hero_image,
  thumbnail_url,
  created_at
FROM public.media_items 
WHERE type = 'Blog' 
ORDER BY created_at DESC 
LIMIT 5;

-- Enhanced create_media_item function with comprehensive logging
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
  -- Extract values from the _base JSONB parameter with comprehensive logging
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

  -- Comprehensive logging to debug what's being received
  RAISE NOTICE 'CREATE_MEDIA_ITEM DEBUG:';
  RAISE NOTICE '  Slug: %', v_slug;
  RAISE NOTICE '  Title: %', v_title;
  RAISE NOTICE '  Summary: %', v_summary;
  RAISE NOTICE '  Body length: %', COALESCE(LENGTH(v_body), 0);
  RAISE NOTICE '  Body_HTML length: %', COALESCE(LENGTH(v_body_html), 0);
  RAISE NOTICE '  Body_JSON status: %', CASE WHEN v_body_json IS NULL THEN 'NULL' ELSE 'NOT NULL' END;
  RAISE NOTICE '  Status: %', v_status;
  RAISE NOTICE '  Visibility: %', v_visibility;
  RAISE NOTICE '  Hero Image: %', v_hero_image;
  RAISE NOTICE '  Thumbnail URL: %', v_thumbnail_url;
  RAISE NOTICE '  Tags: %', v_tags;
  RAISE NOTICE '  Category: %', v_category;
  RAISE NOTICE '  Featured: %', v_featured;
  RAISE NOTICE '  Read Time: %', v_read_time;
  RAISE NOTICE '  Highlights: %', v_highlights;

  -- Validate required parameters
  IF v_slug IS NULL OR v_title IS NULL THEN
    RAISE EXCEPTION 'Slug (%) and title (%) are required parameters', v_slug, v_title;
  END IF;

  -- Check if slug already exists
  IF EXISTS (SELECT 1 FROM public.media_items WHERE slug = v_slug) THEN
    RAISE EXCEPTION 'Media item with slug "%" already exists', v_slug;
  END IF;

  -- Insert the new media item with explicit assignment of all fields
  INSERT INTO public.media_items (
    slug, title, summary, body, body_html, body_json, type, status, 
    visibility, language, seo_title, seo_description, canonical_url, 
    published_at, created_at, updated_at, thumbnail_url, tags, 
    category, featured, hero_image, read_time, highlights
  ) VALUES (
    v_slug, 
    v_title, 
    v_summary, 
    v_body,  -- Explicitly assign body
    v_body_html,  -- Explicitly assign body_html
    v_body_json,  -- Explicitly assign body_json
    _type, 
    v_status, 
    v_visibility, 
    v_language, 
    v_seo_title, 
    v_seo_description, 
    v_canonical_url, 
    CASE WHEN v_published_at IS NOT NULL THEN v_published_at::TIMESTAMPTZ ELSE NULL END, 
    NOW(), 
    NOW(), 
    v_thumbnail_url,  -- Explicitly assign thumbnail_url
    v_tags,  -- Explicitly assign tags
    v_category,  -- Explicitly assign category
    COALESCE(v_featured, FALSE),  -- Explicitly assign featured
    v_hero_image,  -- Explicitly assign hero_image
    v_read_time,  -- Explicitly assign read_time
    v_highlights  -- Explicitly assign highlights
  ) RETURNING id INTO v_media_id;

  -- Handle blog-specific data if _type is 'Blog' and _child contains blog data
  IF _type = 'Blog' AND _child != '{}'::JSONB THEN
    RAISE NOTICE 'Processing blog-specific data for ID: %', v_media_id;
    
    INSERT INTO public.blogs (
      id, author_id, excerpt, body_html, body_json, 
      focus_keyword, related_keywords, byline
    ) VALUES (
      v_media_id,
      (_child->>'author_id')::UUID,
      _child->>'excerpt',
      COALESCE(_child->>'body_html', v_body_html),  -- Use from _child if available, fallback to base
      COALESCE(_child->'body_json', v_body_json),   -- Use from _child if available, fallback to base
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

  -- Log successful creation
  RAISE NOTICE 'Successfully created media item with ID: %', v_media_id;
  
  -- Return the ID of the created media item
  RETURN v_media_id;
END;
$$;

-- Enhanced update_media_item function with comprehensive logging
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
  -- Extract values from the _base JSONB parameter with comprehensive logging
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

  -- Comprehensive logging to debug what's being received for updates
  RAISE NOTICE 'UPDATE_MEDIA_ITEM DEBUG for ID %:', _id;
  RAISE NOTICE '  Slug: %', v_slug;
  RAISE NOTICE '  Title: %', v_title;
  RAISE NOTICE '  Summary: %', v_summary;
  RAISE NOTICE '  Body length: %', COALESCE(LENGTH(v_body), 0);
  RAISE NOTICE '  Body_HTML length: %', COALESCE(LENGTH(v_body_html), 0);
  RAISE NOTICE '  Body_JSON status: %', CASE WHEN v_body_json IS NULL THEN 'NULL' ELSE 'NOT NULL' END;
  RAISE NOTICE '  Status: %', v_status;
  RAISE NOTICE '  Visibility: %', v_visibility;
  RAISE NOTICE '  Hero Image: %', v_hero_image;
  RAISE NOTICE '  Thumbnail URL: %', v_thumbnail_url;
  RAISE NOTICE '  Tags: %', v_tags;
  RAISE NOTICE '  Category: %', v_category;
  RAISE NOTICE '  Featured: %', v_featured;
  RAISE NOTICE '  Read Time: %', v_read_time;
  RAISE NOTICE '  Highlights: %', v_highlights;

  -- Update the media item with explicit assignment of all fields
  UPDATE public.media_items SET
    slug = COALESCE(v_slug, slug),
    title = COALESCE(v_title, title),
    summary = COALESCE(v_summary, summary),
    body = v_body,  -- Explicitly set body field
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
    thumbnail_url = v_thumbnail_url,  -- Explicitly set thumbnail_url field
    tags = v_tags,  -- Explicitly set tags field
    category = v_category,  -- Explicitly set category field
    featured = v_featured,  -- Explicitly set featured field
    hero_image = v_hero_image,  -- Explicitly set hero_image field
    read_time = v_read_time,  -- Explicitly set read_time field
    highlights = v_highlights  -- Explicitly set highlights field
  WHERE id = _id;

  -- Log the update result
  IF FOUND THEN
    RAISE NOTICE 'Successfully updated media item with ID: %', _id;
  ELSE
    RAISE EXCEPTION 'Media item with ID % not found', _id;
  END IF;

  -- Update blog-specific data if _type is 'Blog' and _child contains blog data
  IF _type = 'Blog' AND _child != '{}'::JSONB THEN
    RAISE NOTICE 'Processing blog-specific data update for ID: %', _id;
    
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

-- Diagnostic function to test the data flow
CREATE OR REPLACE FUNCTION public.diagnostic_test_blog_save()
RETURNS TABLE(
  step TEXT,
  info TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_test_id UUID;
  v_test_json JSONB;
BEGIN
  -- Create test JSONB data
  v_test_json := '{
    "slug": "test-diagnostic-blog",
    "title": "Diagnostic Test Blog",
    "summary": "This is a test blog for diagnostics",
    "body": "<p>This is the body content of the test blog</p>",
    "body_html": "<p>This is the HTML body content of the test blog</p>",
    "body_json": {"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "This is the JSON body content of the test blog"}]}]},
    "type": "Blog",
    "status": "Draft",
    "hero_image": "/images/test-hero.jpg",
    "thumbnail_url": "/images/test-thumb.jpg",
    "tags": ["test", "diagnostic"],
    "category": "Technology",
    "featured": true,
    "read_time": 5,
    "highlights": "This is a highlight"
  }'::JSONB;

  -- Return the steps
  RETURN QUERY VALUES
    ('Step 1', 'Created test JSONB data'),
    ('Step 2', 'JSONB slug: ' || (v_test_json->>'slug')),
    ('Step 3', 'JSONB title: ' || (v_test_json->>'title')),
    ('Step 4', 'JSONB body length: ' || LENGTH((v_test_json->>'body'))),
    ('Step 5', 'JSONB body_html length: ' || LENGTH((v_test_json->>'body_html'))),
    ('Step 6', 'JSONB hero_image: ' || (v_test_json->>'hero_image')),
    ('Step 7', 'JSONB thumbnail_url: ' || (v_test_json->>'thumbnail_url'));

  -- Attempt to create a test record
  BEGIN
    v_test_id := public.create_media_item(v_test_json);
    RETURN QUERY VALUES
      ('Step 8', 'Successfully created test record with ID: ' || v_test_id::TEXT);
  EXCEPTION
    WHEN OTHERS THEN
      RETURN QUERY VALUES
        ('Step 8', 'Error creating test record: ' || SQLERRM);
  END;
END;
$$;

-- Run the diagnostic
SELECT * FROM public.diagnostic_test_blog_save();

-- Final verification
SELECT 
  '✅ Comprehensive blog save fix applied!' as status,
  (SELECT count(*) FROM pg_proc WHERE proname = 'create_media_item') as create_func_exists,
  (SELECT count(*) FROM pg_proc WHERE proname = 'update_media_item') as update_func_exists,
  (SELECT count(*) FROM pg_proc WHERE proname = 'diagnostic_test_blog_save') as diagnostic_func_exists;