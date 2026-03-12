-- Complete reset and creation of blog and author schema

-- First, drop existing tables if they exist (with CASCADE to handle dependencies)
DROP TABLE IF EXISTS public.blogs CASCADE;
DROP TABLE IF EXISTS public.articles CASCADE;
DROP TABLE IF EXISTS public.media_items CASCADE;
DROP TABLE IF EXISTS public.authors CASCADE;

-- Create authors table according to the schema
CREATE TABLE public.authors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    avatar TEXT,
    bio TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    website_url TEXT,
    email TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create media_items table
CREATE TABLE public.media_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    body TEXT,
    body_html TEXT,
    body_json JSONB,
    type TEXT DEFAULT 'Article' CHECK (type IN ('Article', 'Blog', 'Video', 'Podcast', 'Report', 'Event', 'News', 'Guide', 'Tool')),
    language TEXT DEFAULT 'en',
    visibility TEXT DEFAULT 'Public' CHECK (visibility IN ('Public', 'Private', 'Unlisted')),
    status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'InReview', 'Scheduled', 'Published', 'Archived')),
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

-- Create blogs table with the exact schema you need
CREATE TABLE public.blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    hero_image TEXT,
    category TEXT,
    tags TEXT[],
    publish_date TIMESTAMP WITH TIME ZONE,
    read_time INTEGER DEFAULT 0,
    author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,
    featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'InReview', 'Scheduled', 'Published', 'Archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create articles table
CREATE TABLE public.articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
    status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'InReview', 'Scheduled', 'Published', 'Archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create policies for authors table
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

-- Create policies for media_items table
CREATE POLICY "Allow all operations for service role on media_items" ON public.media_items
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable read access for all users on media_items" ON public.media_items
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users on media_items" ON public.media_items
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users on media_items" ON public.media_items
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users on media_items" ON public.media_items
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create policies for blogs table
CREATE POLICY "Allow all operations for service role on blogs" ON public.blogs
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable read access for all users on blogs" ON public.blogs
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users on blogs" ON public.blogs
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users on blogs" ON public.blogs
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users on blogs" ON public.blogs
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create policies for articles table
CREATE POLICY "Allow all operations for service role on articles" ON public.articles
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable read access for all users on articles" ON public.articles
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users on articles" ON public.articles
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users on articles" ON public.articles
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users on articles" ON public.articles
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Grant all privileges to service_role and authenticated
GRANT ALL PRIVILEGES ON TABLE public.authors TO service_role, authenticated;
GRANT ALL PRIVILEGES ON TABLE public.media_items TO service_role, authenticated;
GRANT ALL PRIVILEGES ON TABLE public.blogs TO service_role, authenticated;
GRANT ALL PRIVILEGES ON TABLE public.articles TO service_role, authenticated;

-- Create indexes for better performance
CREATE INDEX idx_authors_name ON public.authors(name);
CREATE INDEX idx_authors_created_at ON public.authors(created_at);
CREATE INDEX idx_media_items_slug ON public.media_items(slug);
CREATE INDEX idx_media_items_type ON public.media_items(type);
CREATE INDEX idx_media_items_status ON public.media_items(status);
CREATE INDEX idx_media_items_published_at ON public.media_items(published_at);
CREATE INDEX idx_blogs_slug ON public.blogs(slug);
CREATE INDEX idx_blogs_author_id ON public.blogs(author_id);
CREATE INDEX idx_blogs_category ON public.blogs(category);
CREATE INDEX idx_blogs_publish_date ON public.blogs(publish_date);
CREATE INDEX idx_articles_slug ON public.articles(slug);
CREATE INDEX idx_articles_category ON public.articles(category);

-- Now create the RPC functions that match what the frontend expects
-- Drop all possible versions of the functions to avoid conflicts
DROP FUNCTION IF EXISTS public.create_media_item(JSONB, TEXT, JSONB);
DROP FUNCTION IF EXISTS public.create_media_item(TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.update_media_item(UUID, JSONB, TEXT, JSONB);
DROP FUNCTION IF EXISTS public.update_media_item(UUID, TEXT, TEXT, TEXT);

-- Create the RPC function to create media items
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
        COALESCE(_base->'tags', '[]')::text[],
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
                INSERT INTO public.authors (name, title, bio, avatar) 
                VALUES (
                    _child->>'author_name',
                    _child->>'author_title',
                    _child->>'author_bio',
                    _child->>'author_avatar'
                ) RETURNING id INTO new_author_id;
            END IF;
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
            COALESCE(_child->'related_keywords', _base->'tags', '[]')::text[],
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
            COALESCE(_base->'tags', '[]')::text[],
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
            COALESCE(_base->'tags', '[]')::text[],
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

-- Create the update function
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
    -- Extract slug from _base, update if provided
    new_slug := COALESCE(
        _base->>'slug',
        (SELECT slug FROM public.media_items WHERE id = _id),
        (SELECT LOWER(TRIM(REGEXP_REPLACE(_base->>'title', '[^a-zA-Z0-9\s]', '', 'g'))) WHERE _base ? 'title')
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
        tags = COALESCE(_base->'tags', tags)::text[],
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
            COALESCE(_child->'related_keywords', _base->'tags', '[]')::text[],
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
            COALESCE(_base->'tags', '[]')::text[],
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
            COALESCE(_base->'tags', '[]')::text[],
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
