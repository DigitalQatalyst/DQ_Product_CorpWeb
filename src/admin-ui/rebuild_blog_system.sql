-- Rebuild Blog System from Scratch
-- This script drops all blog/author related tables and views and recreates them strictly according to requested schema

-- 1. Drop existing objects
DROP VIEW IF EXISTS public.v_blogs_with_authors CASCADE;
DROP VIEW IF EXISTS public.v_media_all CASCADE;
DROP VIEW IF EXISTS public.v_media_with_authors CASCADE;

DROP TABLE IF EXISTS public.blogs CASCADE;
DROP TABLE IF EXISTS public.authors CASCADE;
DROP TABLE IF EXISTS public.articles CASCADE;
DROP TABLE IF EXISTS public.media_items CASCADE;
DROP TABLE IF EXISTS public.author_profiles CASCADE;
DROP TABLE IF EXISTS public.content_submissions CASCADE;
DROP TABLE IF EXISTS public.media_taxonomies CASCADE;
DROP TABLE IF EXISTS public.taxonomies CASCADE;
DROP TABLE IF EXISTS public.media_assets CASCADE;

-- 2. Create Authors Table
CREATE TABLE public.authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    avatar TEXT, -- Public URL or Storage Path
    bio TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Blogs Table
CREATE TABLE public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL, -- HTML Content
    hero_image TEXT, -- Public URL or Storage Path
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    publish_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_time INTEGER DEFAULT 0,
    author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies (Permissive for Admin UI)
CREATE POLICY "Public Read Access" ON public.authors FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.blogs FOR SELECT USING (true);

-- Permissive policies for management (Allows anon for local dev/MSAL testing)
CREATE POLICY "Admin All Access Authors" ON public.authors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Access Blogs" ON public.blogs FOR ALL USING (true) WITH CHECK (true);

-- 6. Create View for easier querying
CREATE VIEW public.v_blogs_all AS
SELECT 
    b.*,
    a.name as author_name,
    a.title as author_title,
    a.avatar as author_avatar,
    a.bio as author_bio
FROM public.blogs b
LEFT JOIN public.authors a ON b.author_id = a.id;

-- 7. Storage Buckets
-- Ensure Supabase extensions are available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Use a DO block to safely create buckets if they don't exist
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public) VALUES ('blog-content', 'blog-content', true) ON CONFLICT (id) DO NOTHING;
END $$;

-- Storage Policies
BEGIN;
  DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
  CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id = 'blog-content');
  
  DROP POLICY IF EXISTS "Admin Upload Access" ON storage.objects;
  CREATE POLICY "Admin Upload Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blog-content');

  DROP POLICY IF EXISTS "Admin Update Access" ON storage.objects;
  CREATE POLICY "Admin Update Access" ON storage.objects FOR UPDATE USING (bucket_id = 'blog-content');

  DROP POLICY IF EXISTS "Admin Delete Access" ON storage.objects;
  CREATE POLICY "Admin Delete Access" ON storage.objects FOR DELETE USING (bucket_id = 'blog-content');
COMMIT;

-- 8. Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON public.authors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
