-- Function to handle blog creation with proper field mapping to match the schema
CREATE OR REPLACE FUNCTION public.create_media_item(
    _base TEXT,  -- This will be the title
    _child TEXT, -- This will be the content/excerpt
    _type TEXT   -- This will be the type (Blog)
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_media_id UUID;
    new_blog_id UUID;
    new_slug TEXT;
BEGIN
    -- Get the current user ID
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;

    -- Generate a new ID for the media item
    new_media_id := gen_random_uuid();
    
    -- Generate slug from title if provided
    new_slug := CASE 
        WHEN _base IS NOT NULL AND TRIM(_base) != '' 
        THEN LOWER(TRIM(REGEXP_REPLACE(_base, '[^a-zA-Z0-9\\s]', '', 'g')))
        ELSE gen_random_uuid()::text
    END;
    new_slug := REGEXP_REPLACE(new_slug, '\\s+', '-', 'g');

    -- Insert into media_items table
    INSERT INTO public.media_items (
        id,
        title,
        slug,
        summary,
        body,
        body_html,
        body_json,
        type,
        language,
        visibility,
        status,
        seo_title,
        seo_description,
        canonical_url,
        thumbnail_url,
        category,
        tags,
        featured,
        published_at,
        created_at,
        updated_at
    )
    VALUES (
        new_media_id,
        COALESCE(_base, 'Untitled Blog'),
        new_slug,
        COALESCE(_child, ''),
        '',  -- body will be populated separately
        '',  -- body_html will be populated separately
        '{}'::jsonb,
        COALESCE(_type, 'Blog'),
        'en',
        'Public',
        'Draft',
        COALESCE(_base, 'Untitled Blog'),
        '',
        '',
        '',  -- thumbnail_url will be populated separately
        '',
        '{}'::text[],
        FALSE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

    -- Return the new media item ID
    RETURN new_media_id;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.create_media_item(TEXT, TEXT, TEXT) TO authenticated;