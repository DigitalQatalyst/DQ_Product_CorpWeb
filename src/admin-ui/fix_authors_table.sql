-- Add missing avatar_url column to authors table

-- Add the avatar_url column to the authors table
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- If you want to rename the existing avatar column to avatar_url (if they exist)
-- Uncomment the following line if you need to rename instead of add
-- ALTER TABLE public.authors RENAME COLUMN avatar TO avatar_url;

-- Update the column if needed to transfer data from avatar to avatar_url
-- UPDATE public.authors SET avatar_url = avatar WHERE avatar IS NOT NULL AND avatar_url IS NULL;

-- Make sure the RLS policies are updated to allow access to the new column
-- Drop and recreate policies to ensure they cover all columns
DROP POLICY IF EXISTS "Allow all operations for service role on authors" ON public.authors;
DROP POLICY IF EXISTS "Enable read access for all users on authors" ON public.authors;
DROP POLICY IF EXISTS "Enable insert for authenticated users on authors" ON public.authors;
DROP POLICY IF EXISTS "Enable update for authenticated users on authors" ON public.authors;
DROP POLICY IF EXISTS "Enable delete for authenticated users on authors" ON public.authors;

-- Recreate policies for authors table
CREATE POLICY "Allow all operations for service role on authors" ON public.authors
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable read access for all users on authors" ON public.authors
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users on authors" ON public.authors
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users on authors" ON public.authors
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users on authors" ON public.authors
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Grant all privileges on the authors table
GRANT ALL PRIVILEGES ON TABLE public.authors TO service_role, authenticated;

-- Update the function to use avatar_url instead of avatar when inserting authors
-- We need to recreate the function to handle the correct column name
DROP FUNCTION IF EXISTS public.create_media_item(JSONB, TEXT, JSONB);
DROP FUNCTION IF EXISTS public.update_media_item(UUID, JSONB, TEXT, JSONB);

-- Create the RPC function to create media items with proper type casting
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
                INSERT INTO public.authors (name, title, bio, avatar_url) 
                VALUES (
                    _child->>'author_name',
                    _child->>'author_title',
                    _child->>'author_bio',
                    _child->>'author_avatar'  -- Map author_avatar from form to avatar_url in DB
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

-- Recreate the update function as well
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
    tags_array TEXT[];
BEGIN
    -- Extract slug from _base, update if provided
    new_slug := COALESCE(
        _base->>'slug',
        (SELECT slug FROM public.media_items WHERE id = _id),
        (SELECT LOWER(TRIM(REGEXP_REPLACE(_base->>'title', '[^a-zA-Z0-9\s]', '', 'g'))) WHERE _base ? 'title')
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
        tags = tags_array,
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
        
        -- Handle author creation/updating for blog
        IF _child ? 'author_name' AND _child->>'author_name' IS NOT NULL AND _child->>'author_name' != '' THEN
            -- Check if author exists, if not create one
            PERFORM id FROM public.authors WHERE name = _child->>'author_name' LIMIT 1;
            IF NOT FOUND THEN
                INSERT INTO public.authors (name, title, bio, avatar_url) 
                VALUES (
                    _child->>'author_name',
                    _child->>'author_title',
                    _child->>'author_bio',
                    _child->>'author_avatar'
                );
            END IF;
        END IF;
        
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
            tags_array,
            CASE 
                WHEN _base ? 'published_at' AND _base->>'published_at' IS NOT NULL AND _base->>'published_at' != ''
                THEN (_base->>'published_at')::timestamp
                ELSE CURRENT_TIMESTAMP
            END,
            COALESCE((_child->>'read_time')::integer, (_base->>'read_time')::integer, 0),
            (SELECT id FROM public.authors WHERE name = _child->>'author_name')::UUID,
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
        -- Convert base JSONB tags to text array
        IF _base ? 'tags' AND jsonb_typeof(_base->'tags') = 'array' THEN
            SELECT array_agg(value) INTO tags_array 
            FROM jsonb_array_elements_text(_base->'tags') 
            WHERE value IS NOT NULL AND value != '';
        ELSE
            tags_array := '{}';
        END IF;
        
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
        -- Convert base JSONB tags to text array
        IF _base ? 'tags' AND jsonb_typeof(_base->'tags') = 'array' THEN
            SELECT array_agg(value) INTO tags_array 
            FROM jsonb_array_elements_text(_base->'tags') 
            WHERE value IS NOT NULL AND value != '';
        ELSE
            tags_array := '{}';
        END IF;
        
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

-- Grant execute permissions on the new functions
GRANT EXECUTE ON FUNCTION public.create_media_item(JSONB, TEXT, JSONB) TO service_role, authenticated;
GRANT EXECUTE ON FUNCTION public.update_media_item(UUID, JSONB, TEXT, JSONB) TO service_role, authenticated;

-- Create the missing v_media_all view
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
    a.avatar_url AS author_avatar,
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

-- Create the v_media_with_authors view that combines media_items with authors information
DROP VIEW IF EXISTS public.v_media_with_authors;

CREATE VIEW public.v_media_with_authors AS
SELECT 
    mi.id,
    mi.title,
    mi.slug,
    mi.summary,
    mi.body,
    mi.body_html,
    mi.body_json,
    mi.type,
    mi.language,
    mi.visibility,
    mi.status,
    mi.seo_title,
    mi.seo_description,
    mi.canonical_url,
    mi.thumbnail_url,
    mi.category,
    mi.tags,
    mi.featured,
    mi.published_at,
    mi.created_at,
    mi.updated_at,
    -- Blog-specific fields
    b.excerpt AS blog_excerpt,
    b.content AS blog_content,
    b.hero_image,
    b.read_time,
    b.focus_keyword AS blog_focus_keyword,
    b.related_keywords AS blog_related_keywords,
    -- Author information from blogs
    a.id AS author_id,
    a.name AS author_name,
    a.title AS author_title,
    a.avatar AS author_avatar,  -- Using the avatar column
    a.avatar_url AS author_avatar_url,  -- Using the avatar_url column
    a.bio AS author_bio,
    a.linkedin_url AS author_linkedin,
    -- Fields for other types
    ar.author AS article_author,
    ar.byline AS article_byline,
    ar.content AS article_content,
    ar.read_time AS article_read_time
FROM public.media_items mi
LEFT JOIN public.blogs b ON mi.id = b.id
LEFT JOIN public.authors a ON b.author_id = a.id
LEFT JOIN public.articles ar ON mi.id = ar.id
UNION ALL
SELECT 
    mi.id,
    mi.title,
    mi.slug,
    mi.summary,
    mi.body,
    mi.body_html,
    mi.body_json,
    mi.type,
    mi.language,
    mi.visibility,
    mi.status,
    mi.seo_title,
    mi.seo_description,
    mi.canonical_url,
    mi.thumbnail_url,
    mi.category,
    mi.tags,
    mi.featured,
    mi.published_at,
    mi.created_at,
    mi.updated_at,
    -- For non-blog items, these will be null
    NULL AS blog_excerpt,
    NULL AS blog_content,
    mi.thumbnail_url AS hero_image,
    NULL AS read_time,
    NULL AS blog_focus_keyword,
    NULL AS blog_related_keywords,
    -- Author info from articles if available
    NULL AS author_id,
    ar.author AS author_name,
    NULL AS author_title,
    NULL AS author_avatar,
    NULL AS author_avatar_url,
    NULL AS author_bio,
    NULL AS author_linkedin,
    -- Article fields
    ar.author AS article_author,
    ar.author AS article_byline,
    ar.content AS article_content,
    ar.read_time AS article_read_time
FROM public.media_items mi
LEFT JOIN public.articles ar ON mi.id = ar.id
WHERE mi.id NOT IN (SELECT id FROM public.blogs);

-- Grant permissions on the v_media_with_authors view
GRANT SELECT ON public.v_media_with_authors TO service_role, authenticated;

-- Set up storage configuration for author avatars
-- Create the storage bucket for author avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, owner, public, file_size_limit, allowed_mime_types)
VALUES ('author-avatars', 'author-avatars', NULL, true, 5242880, '{image/png,image/jpeg,image/gif,image/webp}')
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the author-avatars bucket
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access on author avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload author avatars" ON storage.objects;

-- Create policies for author-avatars bucket specifically
CREATE POLICY "Allow public read access on author avatars" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'author-avatars');

CREATE POLICY "Allow authenticated users to upload author avatars" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'author-avatars');

CREATE POLICY "Allow authenticated users to update author avatars" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'author-avatars');

CREATE POLICY "Allow authenticated users to delete author avatars" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'author-avatars');

-- Grant necessary permissions to service_role for storage
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.buckets TO service_role;

-- Add avatar column to authors table if it doesn't exist
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS avatar TEXT;

-- Update the RLS policies to allow service_role full access
DROP POLICY IF EXISTS "Allow all operations for service role on authors" ON public.authors;

CREATE POLICY "Allow all operations for service role on authors" ON public.authors
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);
