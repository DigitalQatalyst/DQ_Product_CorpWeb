-- Create missing views that are required for media fetching

-- First, make sure we have the base tables
CREATE TABLE IF NOT EXISTS public.media_items (
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

CREATE TABLE IF NOT EXISTS public.authors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    avatar TEXT,
    avatar_url TEXT,
    bio TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    website_url TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blogs (
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

CREATE TABLE IF NOT EXISTS public.articles (
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

-- Drop existing views if they exist
DROP VIEW IF EXISTS public.v_media_with_authors CASCADE;
DROP VIEW IF EXISTS public.v_media_all CASCADE;

-- Create the v_media_all view first
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
    -- Fields for other types
    ar.author AS article_author,
    ar.content AS article_content,
    ar.read_time AS article_read_time
FROM public.media_items mi
LEFT JOIN public.blogs b ON mi.id = b.id
LEFT JOIN public.authors a ON b.author_id = a.id
LEFT JOIN public.articles ar ON mi.id = ar.id;

-- Grant permissions on the views
GRANT SELECT ON public.v_media_all TO service_role, authenticated;
GRANT SELECT ON public.v_media_with_authors TO service_role, authenticated;

-- Verify the views exist
SELECT 'v_media_with_authors' as view_name, COUNT(*) as row_count FROM public.v_media_with_authors
UNION ALL
SELECT 'v_media_all' as view_name, COUNT(*) as row_count FROM public.v_media_all;