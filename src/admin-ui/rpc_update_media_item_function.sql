-- RPC function to update media items with proper field mapping
CREATE OR REPLACE FUNCTION public.update_media_item(
    _id UUID,
    _base JSONB DEFAULT '{}',
    _type TEXT DEFAULT 'Article',
    _child JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_slug TEXT;
BEGIN


    -- Extract slug from _base, generate if not provided
    new_slug := COALESCE(
        _base->>'slug',
        LOWER(TRIM(REGEXP_REPLACE(_base->>'title', '[^a-zA-Z0-9\s]', '', 'g'))),
        (SELECT slug FROM public.media_items WHERE id = _id)
    );
    new_slug := REGEXP_REPLACE(new_slug, '\s+', '-', 'g');
    new_slug := REGEXP_REPLACE(new_slug, '-+', '-', 'g');
    new_slug := TRIM(new_slug, '-');

    -- Update the media_items table
    UPDATE public.media_items
    SET
        title = COALESCE(_base->>'title', title),
        slug = new_slug,
        summary = COALESCE(_base->>'summary', summary),
        body = COALESCE(_base->>'body', body),
        body_html = COALESCE(_base->>'body_html', body_html),
        body_json = COALESCE(_base->>'body_json', body_json)::jsonb,
        type = COALESCE(_base->>'type', type),
        language = COALESCE(_base->>'language', language),
        visibility = COALESCE(_base->>'visibility', visibility),
        status = COALESCE(_base->>'status', status),
        seo_title = COALESCE(_base->>'seo_title', seo_title),
        seo_description = COALESCE(_base->>'seo_description', seo_description),
        canonical_url = COALESCE(_base->>'canonical_url', canonical_url),
        thumbnail_url = COALESCE(_base->>'thumbnail_url', thumbnail_url),
        category = COALESCE(_base->>'category', category),
        tags = COALESCE(_base->'tags', tags)::jsonb,
        featured = COALESCE((_base->>'featured')::boolean, featured),
        published_at = CASE 
            WHEN _base ? 'published_at' AND _base->>'published_at' IS NOT NULL AND _base->>'published_at' != ''
            THEN (_base->>'published_at')::timestamp
            ELSE published_at
        END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = _id;

    -- Handle type-specific operations
    IF _type = 'Blog' THEN
        -- Update blog-specific data
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
            _id,
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
            CURRENT_TIMESTAMP
        ON CONFLICT (id) 
        DO UPDATE SET
            slug = EXCLUDED.slug,
            title = EXCLUDED.title,
            excerpt = EXCLUDED.excerpt,
            content = EXCLUDED.content,
            hero_image = EXCLUDED.hero_image,
            category = EXCLUDED.category,
            tags = EXCLUDED.tags,
            publish_date = EXCLUDED.publish_date,
            read_time = EXCLUDED.read_time,
            author_id = EXCLUDED.author_id,
            featured = EXCLUDED.featured,
            status = EXCLUDED.status,
            updated_at = EXCLUDED.updated_at;

    ELSIF _type IN ('Article', 'News', 'Guide') THEN
        -- Update article/news/guide-specific data
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
            _id,
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
            CURRENT_TIMESTAMP
        ON CONFLICT (id) 
        DO UPDATE SET
            slug = EXCLUDED.slug,
            title = EXCLUDED.title,
            excerpt = EXCLUDED.excerpt,
            content = EXCLUDED.content,
            hero_image = EXCLUDED.hero_image,
            category = EXCLUDED.category,
            tags = EXCLUDED.tags,
            publish_date = EXCLUDED.publish_date,
            read_time = EXCLUDED.read_time,
            author = EXCLUDED.author,
            featured = EXCLUDED.featured,
            status = EXCLUDED.status,
            updated_at = EXCLUDED.updated_at;

    ELSE
        -- For other types, update generic article record
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
            _id,
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
            CURRENT_TIMESTAMP
        ON CONFLICT (id) 
        DO UPDATE SET
            slug = EXCLUDED.slug,
            title = EXCLUDED.title,
            excerpt = EXCLUDED.excerpt,
            content = EXCLUDED.content,
            hero_image = EXCLUDED.hero_image,
            category = EXCLUDED.category,
            tags = EXCLUDED.tags,
            publish_date = EXCLUDED.publish_date,
            read_time = EXCLUDED.read_time,
            author = EXCLUDED.author,
            featured = EXCLUDED.featured,
            status = EXCLUDED.status,
            updated_at = EXCLUDED.updated_at;
    END IF;

    -- Return the updated media item ID
    RETURN _id;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.update_media_item(UUID, JSONB, TEXT, JSONB) TO authenticated;