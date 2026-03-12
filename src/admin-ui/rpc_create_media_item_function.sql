-- RPC function to create media items with proper field mapping
CREATE OR REPLACE FUNCTION public.create_media_item(
    _base JSONB DEFAULT '{}',
    _type TEXT DEFAULT 'Article',
    _child JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_media_id UUID;
    new_slug TEXT;
    new_author_id UUID;
BEGIN


    -- Generate a new ID for the media item
    new_media_id := gen_random_uuid();
    
    -- Extract slug from _base, generate if not provided
    new_slug := COALESCE(
        _base->>'slug',
        LOWER(TRIM(REGEXP_REPLACE(_base->>'title', '[^a-zA-Z0-9\s]', '', 'g'))),
        new_media_id::text
    );
    new_slug := REGEXP_REPLACE(new_slug, '\s+', '-', 'g');
    new_slug := REGEXP_REPLACE(new_slug, '-+', '-', 'g');
    new_slug := TRIM(new_slug, '-');

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
    SELECT
        new_media_id,
        COALESCE(_base->>'title', 'Untitled'),
        new_slug,
        COALESCE(_base->>'summary', ''),
        COALESCE(_base->>'body', ''),
        COALESCE(_base->>'body_html', ''),
        COALESCE(_base->>'body_json', '{}')::jsonb,
        COALESCE(_base->>'type', _type, 'Article'),
        COALESCE(_base->>'language', 'en'),
        COALESCE(_base->>'visibility', 'Public'),
        COALESCE(_base->>'status', 'Draft'),
        COALESCE(_base->>'seo_title', ''),
        COALESCE(_base->>'seo_description', ''),
        COALESCE(_base->>'canonical_url', ''),
        COALESCE(_base->>'thumbnail_url', ''),
        COALESCE(_base->>'category', ''),
        COALESCE(_base->'tags', '[]')::jsonb,
        COALESCE((_base->>'featured')::boolean, FALSE),
        CASE 
            WHEN _base ? 'published_at' AND _base->>'published_at' IS NOT NULL AND _base->>'published_at' != ''
            THEN (_base->>'published_at')::timestamp
            ELSE CURRENT_TIMESTAMP
        END,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP;

    -- Handle type-specific operations
    IF _type = 'Blog' THEN
        -- Handle blog-specific data
        INSERT INTO public.blogs (
            id,
            slug,
            title,
            excerpt,
            content,
            hero_image,
            category,
            tags,
            publish_date,
            read_time,
            author_id,
            featured,
            status,
            created_at,
            updated_at
        )
        SELECT
            new_media_id,
            new_slug,
            COALESCE(_base->>'title', 'Untitled'),
            COALESCE(_child->>'excerpt', _base->>'summary', ''),
            COALESCE(_child->>'body_html', _base->>'body', ''),
            COALESCE(_child->>'hero_image', _base->>'thumbnail_url', ''),
            COALESCE(_base->>'category', ''),
            COALESCE(_child->'related_keywords', _base->'tags', '[]')::jsonb,
            CASE 
                WHEN _base ? 'published_at' AND _base->>'published_at' IS NOT NULL AND _base->>'published_at' != ''
                THEN (_base->>'published_at')::timestamp
                ELSE CURRENT_TIMESTAMP
            END,
            COALESCE((_child->>'read_time')::integer, (_base->>'read_time')::integer, 0),
            COALESCE(_child->>'author_id', NULL)::UUID,
            COALESCE((_base->>'featured')::boolean, FALSE),
            COALESCE(_base->>'status', 'Draft'),
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP;
            
    ELSIF _type IN ('Article', 'News', 'Guide') THEN
        -- Handle article/news/guide-specific data
        INSERT INTO public.articles (
            id,
            slug,
            title,
            excerpt,
            content,
            hero_image,
            category,
            tags,
            publish_date,
            read_time,
            author,
            featured,
            status,
            created_at,
            updated_at
        )
        SELECT
            new_media_id,
            new_slug,
            COALESCE(_base->>'title', 'Untitled'),
            COALESCE(_base->>'summary', ''),
            COALESCE(_base->>'body_html', _base->>'body', ''),
            COALESCE(_base->>'thumbnail_url', ''),
            COALESCE(_base->>'category', ''),
            COALESCE(_base->'tags', '[]')::jsonb,
            CASE 
                WHEN _base ? 'published_at' AND _base->>'published_at' IS NOT NULL AND _base->>'published_at' != ''
                THEN (_base->>'published_at')::timestamp
                ELSE CURRENT_TIMESTAMP
            END,
            COALESCE((_base->>'read_time')::integer, 0),
            COALESCE(_child->>'byline', _base->>'author', ''),
            COALESCE((_base->>'featured')::boolean, FALSE),
            COALESCE(_base->>'status', 'Draft'),
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP;
            
    ELSE
        -- For other types, insert a generic record if needed
        INSERT INTO public.articles (
            id,
            slug,
            title,
            excerpt,
            content,
            hero_image,
            category,
            tags,
            publish_date,
            read_time,
            author,
            featured,
            status,
            created_at,
            updated_at
        )
        SELECT
            new_media_id,
            new_slug,
            COALESCE(_base->>'title', 'Untitled'),
            COALESCE(_base->>'summary', ''),
            COALESCE(_base->>'body_html', _base->>'body', ''),
            COALESCE(_base->>'thumbnail_url', ''),
            COALESCE(_base->>'category', ''),
            COALESCE(_base->'tags', '[]')::jsonb,
            CASE 
                WHEN _base ? 'published_at' AND _base->>'published_at' IS NOT NULL AND _base->>'published_at' != ''
                THEN (_base->>'published_at')::timestamp
                ELSE CURRENT_TIMESTAMP
            END,
            COALESCE((_base->>'read_time')::integer, 0),
            COALESCE(_base->>'author', ''),
            COALESCE((_base->>'featured')::boolean, FALSE),
            COALESCE(_base->>'status', 'Draft'),
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP;
    END IF;

    -- Return the new media item ID
    RETURN new_media_id;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.create_media_item(JSONB, TEXT, JSONB) TO authenticated;