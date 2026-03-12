-- Complete Blog and Authors Schema Reset and Setup

-- Disable RLS temporarily during reset
ALTER TABLE public.media_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles DISABLE ROW LEVEL SECURITY;

-- Drop existing views and functions first
DROP VIEW IF EXISTS public.v_media_all CASCADE;
DROP VIEW IF EXISTS public.v_media_with_authors CASCADE;
DROP FUNCTION IF EXISTS public.create_media_item(jsonb, text, jsonb) CASCADE;
DROP FUNCTION IF EXISTS public.update_media_item(uuid, jsonb, text, jsonb) CASCADE;

-- Drop tables in correct order to respect foreign key constraints
DROP TABLE IF EXISTS public.blogs CASCADE;
DROP TABLE IF EXISTS public.articles CASCADE;
DROP TABLE IF EXISTS public.authors CASCADE;
DROP TABLE IF EXISTS public.media_items CASCADE;

-- Recreate media_items table
CREATE TABLE public.media_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    body TEXT,
    body_html TEXT,
    body_json JSONB,
    type TEXT DEFAULT 'Article',
    language TEXT DEFAULT 'en',
    visibility TEXT DEFAULT 'Public',
    status TEXT DEFAULT 'Draft',
    seo_title TEXT,
    seo_description TEXT,
    canonical_url TEXT,
    thumbnail_url TEXT,
    category TEXT,
    tags TEXT[],
    featured BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create authors table
CREATE TABLE public.authors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    avatar TEXT,           -- This is the column required by the project configuration
    avatar_url TEXT,       -- This is for compatibility
    bio TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    website_url TEXT,
    email TEXT,
    is_active BOOLEAN DEFAULT true,
    is_guest BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blogs table
CREATE TABLE public.blogs (
    id UUID PRIMARY KEY REFERENCES media_items(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    hero_image TEXT,
    category TEXT,
    tags TEXT[],
    publish_date TIMESTAMP WITH TIME ZONE,
    read_time INTEGER DEFAULT 0,
    author_id UUID REFERENCES authors(id),
    featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'Draft',
    focus_keyword TEXT,
    related_keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create articles table  
CREATE TABLE public.articles (
    id UUID PRIMARY KEY REFERENCES media_items(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    hero_image TEXT,
    category TEXT,
    tags TEXT[],
    publish_date TIMESTAMP WITH TIME ZONE,
    read_time INTEGER DEFAULT 0,
    author TEXT,
    featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'Draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_media_items_type ON public.media_items(type);
CREATE INDEX idx_media_items_status ON public.media_items(status);
CREATE INDEX idx_media_items_published_at ON public.media_items(published_at);
CREATE INDEX idx_blogs_author_id ON public.blogs(author_id);
CREATE INDEX idx_blogs_publish_date ON public.blogs(publish_date);

-- Create the v_media_all view
CREATE VIEW public.v_media_all AS
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
    b.focus_keyword,
    b.related_keywords,
    b.author_id,
    -- Author information
    a.name AS author_name,
    a.title AS author_title,
    a.avatar AS author_avatar,
    a.avatar_url AS author_avatar_url,
    a.bio AS author_bio,
    a.linkedin_url AS author_linkedin,
    a.is_active AS author_is_active,
    a.is_guest AS author_is_guest,
    -- Article fields
    ar.author AS article_author,
    ar.content AS article_content,
    ar.read_time AS article_read_time
FROM public.media_items mi
LEFT JOIN public.blogs b ON mi.id = b.id
LEFT JOIN public.authors a ON b.author_id = a.id
LEFT JOIN public.articles ar ON mi.id = ar.id;

-- Create the v_media_with_authors view
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
    a.avatar AS author_avatar,
    a.avatar_url AS author_avatar_url,
    a.bio AS author_bio,
    a.linkedin_url AS author_linkedin,
    a.is_active AS author_is_active,
    a.is_guest AS author_is_guest,
    -- Fields for other types
    ar.author AS article_author,
    ar.content AS article_content,
    ar.read_time AS article_read_time
FROM public.media_items mi
LEFT JOIN public.blogs b ON mi.id = b.id
LEFT JOIN public.authors a ON b.author_id = a.id
LEFT JOIN public.articles ar ON mi.id = ar.id;

-- Create the create_media_item function
CREATE OR REPLACE FUNCTION public.create_media_item(
    _base JSONB DEFAULT '{}',
    _type TEXT DEFAULT 'Article',
    _child JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
        CASE WHEN _base ? 'body_json' THEN (_base->'body_json')::jsonb ELSE '{}'::jsonb END,
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
            WHEN _base ? 'published_at' AND (_base->>'published_at') IS NOT NULL AND (_base->>'published_at') != ''
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
                INSERT INTO public.authors (name, title, bio, avatar, avatar_url, is_active, is_guest) 
                VALUES (
                    _child->>'author_name',
                    COALESCE(_child->>'author_title', ''),
                    COALESCE(_child->>'author_bio', ''),
                    COALESCE(_child->>'avatar', ''),  -- Map to avatar column
                    COALESCE(_child->>'avatar_url', COALESCE(_child->>'avatar', '')),   -- Map to avatar_url column
                    COALESCE((_child->>'is_active')::boolean, true),
                    COALESCE((_child->>'is_guest')::boolean, false)
                ) RETURNING id INTO new_author_id;
            ELSE
                -- Use existing author ID
                new_author_id := (SELECT id FROM public.authors WHERE name = _child->>'author_name' LIMIT 1);
                
                -- Update existing author with new information if provided
                UPDATE public.authors 
                SET 
                    title = COALESCE(_child->>'author_title', title),
                    bio = COALESCE(_child->>'author_bio', bio),
                    avatar = COALESCE(_child->>'avatar', avatar),
                    avatar_url = COALESCE(_child->>'avatar_url', COALESCE(_child->>'avatar', avatar_url)),
                    is_active = COALESCE((_child->>'is_active')::boolean, is_active),
                    is_guest = COALESCE((_child->>'is_guest')::boolean, is_guest)
                WHERE name = _child->>'author_name';
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
            focus_keyword,
            related_keywords,
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
            COALESCE(_child->>'focus_keyword', ''),
            tags_array,
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
                WHEN _base ? 'published_at' AND (_base->>'published_at') IS NOT NULL AND (_base->>'published_at') != ''
                THEN (_base->>'published_at')::timestamp
                ELSE CURRENT_TIMESTAMP
            END,
            COALESCE((_base->>'read_time')::integer, 0),
            COALESCE(_child->>'author', _base->>'author', ''),
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
                WHEN _base ? 'published_at' AND (_base->>'published_at') IS NOT NULL AND (_base->>'published_at') != ''
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

-- Create the update_media_item function
CREATE OR REPLACE FUNCTION public.update_media_item(
    _id UUID,
    _base JSONB DEFAULT '{}',
    _type TEXT DEFAULT 'Article',
    _child JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
        body_json = CASE WHEN _base ? 'body_json' THEN (_base->'body_json')::jsonb ELSE body_json END,
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
            WHEN _base ? 'published_at' AND (_base->>'published_at') IS NOT NULL AND (_base->>'published_at') != ''
            THEN (_base->>'published_at')::timestamp
            ELSE published_at
        END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = _id;

    -- Handle type-specific operations
    IF _type = 'Blog' THEN
        -- First, ensure the media_items record exists (this should always be true in an update)
        PERFORM 1 FROM public.media_items WHERE id = _id;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Media item with ID % does not exist in media_items table', _id;
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
        
        -- Handle author creation/updating for blog
        IF _child ? 'author_name' AND _child->>'author_name' IS NOT NULL AND _child->>'author_name' != '' THEN
            -- Check if author exists, if not create one, otherwise update
            PERFORM id FROM public.authors WHERE name = _child->>'author_name' LIMIT 1;
            IF NOT FOUND THEN
                INSERT INTO public.authors (name, title, bio, avatar, avatar_url) 
                VALUES (
                    _child->>'author_name',
                    COALESCE(_child->>'author_title', ''),
                    COALESCE(_child->>'author_bio', ''),
                    COALESCE(_child->>'avatar', ''),
                    COALESCE(_child->>'avatar_url', COALESCE(_child->>'avatar', ''))
                );
            ELSE
                -- Update existing author with new information if provided
                UPDATE public.authors 
                SET 
                    title = COALESCE(_child->>'author_title', title),
                    bio = COALESCE(_child->>'author_bio', bio),
                    avatar = COALESCE(_child->>'avatar', avatar),
                    avatar_url = COALESCE(_child->>'avatar_url', COALESCE(_child->>'avatar', avatar_url))
                WHERE name = _child->>'author_name';
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
            focus_keyword,
            related_keywords,
            created_at,
            updated_at
        )
        VALUES (
            _id,
            new_slug,
            COALESCE(_base->>'title', 'Untitled'),
            COALESCE(_child->>'excerpt', _base->>'summary', ''),
            COALESCE(_child->>'body_html', _base->>'body', ''),
            COALESCE(_child->>'hero_image', _base->>'thumbnail_url', ''),
            COALESCE(_base->>'category', ''),
            tags_array,
            CASE 
                WHEN _base ? 'published_at' AND (_base->>'published_at') IS NOT NULL AND (_base->>'published_at') != ''
                THEN (_base->>'published_at')::timestamp
                ELSE CURRENT_TIMESTAMP
            END,
            COALESCE((_child->>'read_time')::integer, (_base->>'read_time')::integer, 0),
            (SELECT id FROM public.authors WHERE name = _child->>'author_name' LIMIT 1),
            COALESCE((_base->>'featured')::boolean, FALSE),
            COALESCE(_base->>'status', 'Draft'),
            COALESCE(_child->>'focus_keyword', ''),
            tags_array,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )
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
            focus_keyword = EXCLUDED.focus_keyword,
            related_keywords = EXCLUDED.related_keywords,
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
            COALESCE(_child->>'author', _base->>'author', ''),
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
                WHEN _base ? 'published_at' AND (_base->>'published_at') IS NOT NULL AND (_base->>'published_at') != ''
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

-- Set up storage configuration for author avatars
INSERT INTO storage.buckets (id, name, owner, public, file_size_limit, allowed_mime_types)
VALUES ('author-avatars', 'author-avatars', NULL, true, 5242880, '{image/png,image/jpeg,image/gif,image/webp}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create or replace storage policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow public read access on author avatars" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to upload author avatars" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to update author avatars" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to delete author avatars" ON storage.objects;
EXCEPTION
  WHEN undefined_table THEN
    -- If storage.objects doesn't exist, ignore the exception
    NULL;
END $$;

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

-- Re-enable RLS for other tables only
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
-- Temporarily disable RLS on authors table to fix immediate issue
-- ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create or replace RLS policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow all operations for service role on media_items" ON public.media_items;
  DROP POLICY IF EXISTS "Allow all operations for service role on authors" ON public.authors;
  DROP POLICY IF EXISTS "Allow all operations for service role on blogs" ON public.blogs;
  DROP POLICY IF EXISTS "Allow all operations for service role on articles" ON public.articles;
  DROP POLICY IF EXISTS "Enable read access for all users on media_items" ON public.media_items;
  DROP POLICY IF EXISTS "Enable read access for all users on authors" ON public.authors;
  DROP POLICY IF EXISTS "Allow authenticated users to manage authors" ON public.authors;
EXCEPTION
  WHEN undefined_table THEN
    -- If table doesn't exist, ignore the exception
    NULL;
END $$;

-- Grant full access to service_role first (critical order)
CREATE POLICY "Allow all operations for service role on media_items" ON public.media_items
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all operations for service role on authors" ON public.authors
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all operations for service role on blogs" ON public.blogs
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all operations for service role on articles" ON public.articles
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Allow service role to manage authors with full bypass (highest priority)
CREATE POLICY "Allow service role full access to authors" ON public.authors
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to manage content
CREATE POLICY "Allow authenticated users to manage authors" ON public.authors
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Enable read access for all users
CREATE POLICY "Enable read access for all users on media_items" ON public.media_items
    FOR SELECT
    USING (true);

CREATE POLICY "Enable read access for all users on authors" ON public.authors
    FOR SELECT
    USING (true);

-- Grant necessary permissions
-- Using OR REPLACE syntax to handle existing permissions
DO $$
BEGIN
  -- Schema usage
  BEGIN
    GRANT USAGE ON SCHEMA public TO service_role, authenticated;
  EXCEPTION
    WHEN duplicate_object THEN
      -- Permission already exists, ignore
      NULL;
  END;
  
  -- Table permissions
  BEGIN
    GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
  EXCEPTION
    WHEN duplicate_object THEN
      -- Permission already exists, ignore
      NULL;
  END;
  
  -- Sequence permissions
  BEGIN
    GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
  EXCEPTION
    WHEN duplicate_object THEN
      -- Permission already exists, ignore
      NULL;
  END;
  
  -- Function permissions
  BEGIN
    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role, authenticated;
  EXCEPTION
    WHEN duplicate_object THEN
      -- Permission already exists, ignore
      NULL;
  END;
  
  -- Specifically grant to our functions
  BEGIN
    GRANT EXECUTE ON FUNCTION public.create_media_item(jsonb, text, jsonb) TO service_role, authenticated;
    GRANT EXECUTE ON FUNCTION public.update_media_item(uuid, jsonb, text, jsonb) TO service_role, authenticated;
  EXCEPTION
    WHEN others THEN
      -- May not exist yet, ignore
      NULL;
  END;
  
  -- Select permissions
  BEGIN
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
  EXCEPTION
    WHEN duplicate_object THEN
      -- Permission already exists, ignore
      NULL;
  END;
  
  -- DML permissions
  BEGIN
    GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
  EXCEPTION
    WHEN duplicate_object THEN
      -- Permission already exists, ignore
      NULL;
  END;
END $$;

-- Set default privileges for service_role
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;

-- Grant permissions on views
DO $$
BEGIN
  BEGIN
    GRANT SELECT ON public.v_media_all TO service_role, authenticated;
  EXCEPTION
    WHEN duplicate_object THEN
      -- Permission already exists, ignore
      NULL;
  END;
  
  BEGIN
    GRANT SELECT ON public.v_media_with_authors TO service_role, authenticated;
  EXCEPTION
    WHEN duplicate_object THEN
      -- Permission already exists, ignore
      NULL;
  END;
END $$;

-- Verify tables were created
SELECT 'media_items' as table_name, COUNT(*) as row_count FROM public.media_items
UNION ALL
SELECT 'authors' as table_name, COUNT(*) as row_count FROM public.authors
UNION ALL
SELECT 'blogs' as table_name, COUNT(*) as row_count FROM public.blogs
UNION ALL
SELECT 'articles' as table_name, COUNT(*) as row_count FROM public.articles;

-- Verify views have data
SELECT 'v_media_all' as view_name, COUNT(*) as row_count FROM public.v_media_all
UNION ALL
SELECT 'v_media_with_authors' as view_name, COUNT(*) as row_count FROM public.v_media_with_authors;
