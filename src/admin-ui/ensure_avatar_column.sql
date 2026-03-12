-- Ensure the authors table has the correct avatar column

-- Add avatar column if it doesn't exist
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS avatar TEXT;

-- If avatar_url column exists, we might want to migrate data or alias
-- For now, let's ensure both exist for compatibility
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update the RLS policies to allow service_role full access
DROP POLICY IF EXISTS "Allow all operations for service role on authors" ON public.authors;

CREATE POLICY "Allow all operations for service role on authors" ON public.authors
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Update the create_media_item function to properly handle avatar field
-- We need to drop and recreate the function to ensure it handles avatar correctly
DROP FUNCTION IF EXISTS public.create_media_item(JSONB, TEXT, JSONB);
DROP FUNCTION IF EXISTS public.update_media_item(UUID, JSONB, TEXT, JSONB);

-- Recreate the function with proper avatar handling
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
    tags_array TEXT[];
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

    -- Convert JSONB tags to text array
    IF _base ? 'tags' AND jsonb_typeof(_base->'tags') = 'array' THEN
        SELECT array_agg(value) INTO tags_array 
        FROM jsonb_array_elements_text(_base->'tags') 
        WHERE value IS NOT NULL AND value != '';
    ELSE
        tags_array := '{}';
    END IF;

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
        tags_array,
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
        -- First, let's make sure the author exists or create if needed
        IF _child ? 'author_id' AND _child->>'author_id' IS NOT NULL THEN
            new_author_id := (_child->>'author_id')::UUID;
        ELSIF _child ? 'author_name' AND _child->>'author_name' IS NOT NULL AND _child->>'author_name' != '' THEN
            -- Try to find existing author or create new one
            SELECT id INTO new_author_id FROM public.authors WHERE name = _child->>'author_name' LIMIT 1;
            IF new_author_id IS NULL THEN
                INSERT INTO public.authors (name, title, bio, avatar, avatar_url) 
                VALUES (
                    _child->>'author_name',
                    _child->>'author_title',
                    _child->>'author_bio',
                    _child->>'author_avatar',  -- Map author_avatar to avatar column
                    _child->>'author_avatar'   -- Also map to avatar_url column
                ) RETURNING id INTO new_author_id;
            END IF;
        END IF;
        
        -- Convert child JSONB tags to text array
        IF _child ? 'related_keywords' AND jsonb_typeof(_child->'related_keywords') = 'array' THEN
            SELECT array_agg(value) INTO tags_array 
            FROM jsonb_array_elements_text(_child->'related_keywords') 
            WHERE value IS NOT NULL AND value != '';
        ELSIF _base ? 'tags' AND jsonb_typeof(_base->'tags') = 'array' THEN
            SELECT array_agg(value) INTO tags_array 
            FROM jsonb_array_elements_text(_base->'tags') 
            WHERE value IS NOT NULL AND value != '';
        ELSE
            tags_array := '{}';
        END IF;
        
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
            tags_array,
            CASE 
                WHEN _base ? 'published_at' AND _base->>'published_at' IS NOT NULL AND _base->>'published_at' != ''
                THEN (_base->>'published_at')::timestamp
                ELSE CURRENT_TIMESTAMP
            END,
            COALESCE((_child->>'read_time')::integer, (_base->>'read_time')::integer, 0),
            new_author_id,
            COALESCE((_base->>'featured')::boolean, FALSE),
            COALESCE(_base->>'status', 'Draft'),
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP;
            
    ELSIF _type IN ('Article', 'News', 'Guide') THEN
        -- Convert base JSONB tags to text array
        IF _base ? 'tags' AND jsonb_typeof(_base->'tags') = 'array' THEN
            SELECT array_agg(value) INTO tags_array 
            FROM jsonb_array_elements_text(_base->'tags') 
            WHERE value IS NOT NULL AND value != '';
        ELSE
            tags_array := '{}';
        END IF;
        
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
            tags_array,
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
        -- Convert base JSONB tags to text array
        IF _base ? 'tags' AND jsonb_typeof(_base->'tags') = 'array' THEN
            SELECT array_agg(value) INTO tags_array 
            FROM jsonb_array_elements_text(_base->'tags') 
            WHERE value IS NOT NULL AND value != '';
        ELSE
            tags_array := '{}';
        END IF;
        
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
            tags_array,
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

-- Grant execute permissions on the function
GRANT EXECUTE ON FUNCTION public.create_media_item(JSONB, TEXT, JSONB) TO service_role, authenticated;

-- Update the author creation function in the service to ensure avatar is properly handled
-- Also update the view to include the avatar column
DROP VIEW IF EXISTS public.v_media_all;
CREATE VIEW public.v_media_all AS
SELECT 
    mi.id,
    mi.title,
    mi.slug,
    mi.summary AS excerpt,
    mi.body AS content,
    mi.thumbnail_url AS hero_image,
    mi.category,
    mi.tags,
    mi.published_at AS publish_date,
    mi.created_at,
    mi.updated_at,
    mi.type,
    mi.status,
    mi.featured,
    -- Author information
    a.id AS author_id,
    a.name AS author_name,
    a.title AS author_title,
    a.avatar AS author_avatar,  -- Include the avatar column
    a.avatar_url AS author_avatar_url,  -- Include the avatar_url column
    a.bio AS author_bio,
    -- Blog-specific fields if applicable
    b.excerpt AS blog_excerpt,
    b.content AS blog_content,
    b.read_time,
    b.status AS blog_status
FROM public.media_items mi
LEFT JOIN public.blogs b ON mi.id = b.id
LEFT JOIN public.authors a ON b.author_id = a.id
UNION ALL
SELECT 
    m.id,
    m.title,
    m.slug,
    m.summary AS excerpt,
    m.body AS content,
    m.thumbnail_url AS hero_image,
    m.category,
    m.tags,
    m.published_at AS publish_date,
    m.created_at,
    m.updated_at,
    m.type,
    m.status,
    m.featured,
    -- Author information from articles table
    NULL AS author_id,
    ar.author AS author_name,
    NULL AS author_title,
    NULL AS author_avatar,
    NULL AS author_avatar_url,
    NULL AS author_bio,
    -- Article-specific fields
    NULL AS blog_excerpt,
    ar.content AS blog_content,
    ar.read_time,
    ar.status AS blog_status
FROM public.media_items m
LEFT JOIN public.articles ar ON m.id = ar.id
WHERE m.id NOT IN (SELECT id FROM public.blogs);

-- Grant permissions on the view
GRANT SELECT ON public.v_media_all TO service_role, authenticated;
