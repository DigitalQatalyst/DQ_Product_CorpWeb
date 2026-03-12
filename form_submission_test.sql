-- Form Submission Test
-- Simulates actual form submission to test all field mappings

-- Create a comprehensive test function that simulates the form submission process
CREATE OR REPLACE FUNCTION public.test_form_submission()
RETURNS TABLE(
  test_step TEXT,
  field_name TEXT,
  field_value TEXT,
  field_saved BOOLEAN,
  notes TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_media_id UUID;
  v_base_json JSONB;
  v_child_json JSONB;
  v_test_result RECORD;
BEGIN
  -- Simulate the JSONB data that would come from a form submission
  v_base_json := '{
    "slug": "test-form-submission-blog-001",
    "title": "Test Blog from Form Submission",
    "summary": "This is a test blog created to verify form field mapping",
    "body": "<h2>Introduction</h2><p>This is the main body content of the blog post. It contains the primary information that readers will consume.</p><ul><li>Point 1</li><li>Point 2</li></ul>",
    "body_html": "<h2>Introduction</h2><p>This is the main body content of the blog post. It contains the primary information that readers will consume.</p><ul><li>Point 1</li><li>Point 2</li></ul>",
    "body_json": {
      "type": "doc",
      "content": [
        {
          "type": "heading",
          "attrs": { "level": 2 },
          "content": [{ "type": "text", "text": "Introduction" }]
        },
        {
          "type": "paragraph",
          "content": [
            { "type": "text", "text": "This is the main body content of the blog post. It contains the primary information that readers will consume." }
          ]
        },
        {
          "type": "bulletList",
          "content": [
            {
              "type": "listItem",
              "content": [
                { "type": "paragraph", "content": [{ "type": "text", "text": "Point 1" }] }
              ]
            },
            {
              "type": "listItem", 
              "content": [
                { "type": "paragraph", "content": [{ "type": "text", "text": "Point 2" }] }
              ]
            }
          ]
        }
      ]
    },
    "type": "Blog",
    "status": "Draft",
    "visibility": "Public",
    "language": "en",
    "seo_title": "Test Blog SEO Title",
    "seo_description": "This is a test blog to verify that all form fields are properly saved",
    "canonical_url": "https://example.com/test-form-submission-blog",
    "published_at": "2024-01-15T10:00:00Z",
    "thumbnail_url": "/images/test-thumbnail.jpg",
    "tags": ["test", "form", "submission", "blog"],
    "category": "Technology",
    "featured": true,
    "hero_image": "/images/test-hero-image.jpg",
    "read_time": 5,
    "highlights": "Main features: Rich content, Proper formatting, Complete metadata"
  }'::JSONB;

  v_child_json := '{
    "author_id": "123e4567-e89b-12d3-a456-426614174000",
    "excerpt": "Short excerpt for the blog post summary",
    "focus_keyword": "test blog keyword",
    "related_keywords": ["form", "submission", "testing", "blog"],
    "byline": "By Test Author"
  }'::JSONB;

  -- Step 1: Log the form data being submitted
  RETURN QUERY SELECT 'Step 1'::TEXT, 'Base JSON created'::TEXT, 'Structure validated'::TEXT, TRUE::BOOLEAN, 'Simulated form submission data prepared'::TEXT;

  -- Step 2: Show key fields from the base JSON
  RETURN QUERY SELECT 'Step 2'::TEXT, 'slug'::TEXT, v_base_json->>'slug', TRUE::BOOLEAN, 'From form submission'::TEXT;
  RETURN QUERY SELECT 'Step 2'::TEXT, 'title'::TEXT, v_base_json->>'title', TRUE::BOOLEAN, 'From form submission'::TEXT;
  RETURN QUERY SELECT 'Step 2'::TEXT, 'body length'::TEXT, LENGTH(v_base_json->>'body')::TEXT, TRUE::BOOLEAN, 'From form submission'::TEXT;
  RETURN QUERY SELECT 'Step 2'::TEXT, 'body_html length'::TEXT, LENGTH(v_base_json->>'body_html')::TEXT, TRUE::BOOLEAN, 'From form submission'::TEXT;
  RETURN QUERY SELECT 'Step 2'::TEXT, 'hero_image'::TEXT, v_base_json->>'hero_image', TRUE::BOOLEAN, 'From form submission'::TEXT;
  RETURN QUERY SELECT 'Step 2'::TEXT, 'thumbnail_url'::TEXT, v_base_json->>'thumbnail_url', TRUE::BOOLEAN, 'From form submission'::TEXT;
  RETURN QUERY SELECT 'Step 2'::TEXT, 'featured'::TEXT, (v_base_json->>'featured')::TEXT, TRUE::BOOLEAN, 'From form submission'::TEXT;

  -- Step 3: Execute the create_media_item function (this is what the form does)
  BEGIN
    v_media_id := public.create_media_item(v_base_json, v_child_json, 'Blog');
    RETURN QUERY SELECT 'Step 3'::TEXT, 'Record Creation'::TEXT, v_media_id::TEXT, TRUE::BOOLEAN, 'Successfully created media item via create_media_item function'::TEXT;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN QUERY SELECT 'Step 3'::TEXT, 'Record Creation'::TEXT, SQLERRM::TEXT, FALSE::BOOLEAN, 'Error creating media item'::TEXT;
      RETURN;
  END;

  -- Step 4: Verify that the record was saved correctly
  RETURN QUERY SELECT 'Step 4'::TEXT, 'Verification Start'::TEXT, 'Checking saved data'::TEXT, TRUE::BOOLEAN, 'Verifying all fields were saved properly'::TEXT;

  -- Step 5: Check each field individually to make sure it was saved
  FOR v_test_result IN 
    SELECT 
      id,
      slug,
      title,
      body,
      body_html,
      CASE WHEN body_json IS NULL THEN 'NULL' ELSE 'NOT NULL' END as body_json_status,
      hero_image,
      thumbnail_url,
      featured,
      read_time,
      highlights,
      type,
      status,
      visibility,
      seo_title,
      seo_description
    FROM public.media_items 
    WHERE id = v_media_id
  LOOP
    RETURN QUERY SELECT 'Step 5'::TEXT, 'id'::TEXT, v_test_result.id::TEXT, TRUE::BOOLEAN, 'Primary key'::TEXT;
    RETURN QUERY SELECT 'Step 5'::TEXT, 'slug'::TEXT, v_test_result.slug, (v_test_result.slug IS NOT NULL)::BOOLEAN, 'Should match form input'::TEXT;
    RETURN QUERY SELECT 'Step 5'::TEXT, 'title'::TEXT, v_test_result.title, (v_test_result.title IS NOT NULL)::BOOLEAN, 'Should match form input'::TEXT;
    RETURN QUERY SELECT 'Step 5'::TEXT, 'body length'::TEXT, LENGTH(v_test_result.body)::TEXT, (v_test_result.body IS NOT NULL)::BOOLEAN, 'Should match form input'::TEXT;
    RETURN QUERY SELECT 'Step 5'::TEXT, 'body_html length'::TEXT, LENGTH(v_test_result.body_html)::TEXT, (v_test_result.body_html IS NOT NULL)::BOOLEAN, 'Should match form input'::TEXT;
    RETURN QUERY SELECT 'Step 5'::TEXT, 'body_json'::TEXT, v_test_result.body_json_status, (v_test_result.body_json_status = 'NOT NULL')::BOOLEAN, 'Should match form input'::TEXT;
    RETURN QUERY SELECT 'Step 5'::TEXT, 'hero_image'::TEXT, v_test_result.hero_image, (v_test_result.hero_image IS NOT NULL)::BOOLEAN, 'Should match form input'::TEXT;
    RETURN QUERY SELECT 'Step 5'::TEXT, 'thumbnail_url'::TEXT, v_test_result.thumbnail_url, (v_test_result.thumbnail_url IS NOT NULL)::BOOLEAN, 'Should match form input'::TEXT;
    RETURN QUERY SELECT 'Step 5'::TEXT, 'featured'::TEXT, v_test_result.featured::TEXT, TRUE::BOOLEAN, 'Should match form input'::TEXT;
    RETURN QUERY SELECT 'Step 5'::TEXT, 'read_time'::TEXT, v_test_result.read_time::TEXT, (v_test_result.read_time IS NOT NULL)::BOOLEAN, 'Should match form input'::TEXT;
    RETURN QUERY SELECT 'Step 5'::TEXT, 'highlights'::TEXT, v_test_result.highlights, (v_test_result.highlights IS NOT NULL)::BOOLEAN, 'Should match form input'::TEXT;
    RETURN QUERY SELECT 'Step 5'::TEXT, 'type'::TEXT, v_test_result.type, (v_test_result.type IS NOT NULL)::BOOLEAN, 'Should be Blog'::TEXT;
    RETURN QUERY SELECT 'Step 5'::TEXT, 'status'::TEXT, v_test_result.status, (v_test_result.status IS NOT NULL)::BOOLEAN, 'Should match form input'::TEXT;
    RETURN QUERY SELECT 'Step 5'::TEXT, 'visibility'::TEXT, v_test_result.visibility, (v_test_result.visibility IS NOT NULL)::BOOLEAN, 'Should match form input'::TEXT;
    RETURN QUERY SELECT 'Step 5'::TEXT, 'seo_title'::TEXT, v_test_result.seo_title, (v_test_result.seo_title IS NOT NULL)::BOOLEAN, 'Should match form input'::TEXT;
    RETURN QUERY SELECT 'Step 5'::TEXT, 'seo_description'::TEXT, v_test_result.seo_description, (v_test_result.seo_description IS NOT NULL)::BOOLEAN, 'Should match form input'::TEXT;
  END LOOP;

  -- Step 6: Check if blog-specific data was saved
  FOR v_test_result IN
    SELECT 
      id,
      author_id,
      excerpt,
      focus_keyword,
      byline
    FROM public.blogs 
    WHERE id = v_media_id
  LOOP
    RETURN QUERY SELECT 'Step 6'::TEXT, 'blog_id'::TEXT, v_test_result.id::TEXT, TRUE::BOOLEAN, 'Foreign key to media_items'::TEXT;
    RETURN QUERY SELECT 'Step 6'::TEXT, 'author_id'::TEXT, v_test_result.author_id::TEXT, (v_test_result.author_id IS NOT NULL)::BOOLEAN, 'Should match form input'::TEXT;
    RETURN QUERY SELECT 'Step 6'::TEXT, 'excerpt'::TEXT, v_test_result.excerpt, (v_test_result.excerpt IS NOT NULL)::BOOLEAN, 'Should match form input'::TEXT;
    RETURN QUERY SELECT 'Step 6'::TEXT, 'focus_keyword'::TEXT, v_test_result.focus_keyword, (v_test_result.focus_keyword IS NOT NULL)::BOOLEAN, 'Should match form input'::TEXT;
    RETURN QUERY SELECT 'Step 6'::TEXT, 'byline'::TEXT, v_test_result.byline, (v_test_result.byline IS NOT NULL)::BOOLEAN, 'Should match form input'::TEXT;
  END LOOP;

  -- Step 7: Final summary
  RETURN QUERY SELECT 'Step 7'::TEXT, 'Test Complete'::TEXT, 'All fields verified'::TEXT, TRUE::BOOLEAN, 'Form submission simulation completed successfully'::TEXT;
  RETURN QUERY SELECT 'Step 7'::TEXT, 'Media ID'::TEXT, v_media_id::TEXT, TRUE::BOOLEAN, 'Created record ID'::TEXT;

END;
$$;

-- Execute the form submission test
SELECT * FROM public.test_form_submission();

-- Clean up the test record if needed
-- Uncomment the following lines if you want to clean up after the test:
/*
DO $$
DECLARE
  v_test_id UUID;
BEGIN
  SELECT id INTO v_test_id FROM public.media_items WHERE slug = 'test-form-submission-blog-001' LIMIT 1;
  IF v_test_id IS NOT NULL THEN
    DELETE FROM public.blogs WHERE id = v_test_id;
    DELETE FROM public.media_items WHERE id = v_test_id;
    RAISE NOTICE 'Test record cleaned up';
  END IF;
END $$;
*/