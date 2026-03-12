-- Function to handle media item creation with proper field mapping
CREATE OR REPLACE FUNCTION public.create_media_item(
    _base TEXT,
    _child TEXT,
    _type TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_media_id UUID;
    author_id UUID := NULL;
BEGIN
    -- Get the current user ID
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;

    -- If _base contains author information, we'll need to parse it
    -- For now, we'll create a simple media item based on the type
    
    -- Generate a new ID for the media item
    new_media_id := gen_random_uuid();

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
        COALESCE(_base, 'Untitled'),
        COALESCE(gen_random_uuid()::text, gen_random_uuid()::text),
        COALESCE(_child, ''),
        '',
        '',
        '{}'::jsonb,
        COALESCE(_type, 'Article'),
        'en',
        'Public',
        'Draft',
        COALESCE(_base, 'Untitled'),
        '',
        '',
        '',
        '',
        '{}'::text[],
        FALSE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

    RETURN new_media_id;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.create_media_item(TEXT, TEXT, TEXT) TO authenticated;