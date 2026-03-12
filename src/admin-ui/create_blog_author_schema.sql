-- Complete reset and creation of blog and author schema

-- Drop existing tables if they exist (with CASCADE to handle dependencies)
DROP TABLE IF EXISTS public.blogs CASCADE;
DROP TABLE IF EXISTS public.authors CASCADE;
DROP TABLE IF EXISTS public.media_items CASCADE;
DROP TABLE IF EXISTS public.articles CASCADE;

-- Create authors table
CREATE TABLE public.authors (
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
    is_active BOOLEAN DEFAULT true,
    is_guest BOOLEAN DEFAULT false,
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

-- Create blogs table
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
    author_id UUID REFERENCES public.authors(id),
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
CREATE INDEX idx_media_items_slug ON public.media_items(slug);
CREATE INDEX idx_media_items_type ON public.media_items(type);
CREATE INDEX idx_media_items_status ON public.media_items(status);
CREATE INDEX idx_media_items_published_at ON public.media_items(published_at);
CREATE INDEX idx_blogs_slug ON public.blogs(slug);
CREATE INDEX idx_blogs_author_id ON public.blogs(author_id);
CREATE INDEX idx_blogs_category ON public.blogs(category);
CREATE INDEX idx_articles_slug ON public.articles(slug);
