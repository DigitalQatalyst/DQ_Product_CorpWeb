-- Complete Drop and Recreate of Blog and Author Schema
-- Drops ALL tables and recreates only blog and author tables based on the new schema

-- Drop all dependent objects first
DROP VIEW IF EXISTS public.v_media_all CASCADE;
DROP VIEW IF EXISTS public.v_media_public CASCADE;
DROP VIEW IF EXISTS public.v_media_with_authors CASCADE;

-- Drop all functions
DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN
        SELECT proname, oid::regprocedure
        FROM pg_proc 
        WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || func_record.oid::regprocedure || ' CASCADE';
    END LOOP;
END $$;

-- Drop all tables in reverse dependency order
DROP TABLE IF EXISTS public.blogs CASCADE;
DROP TABLE IF EXISTS public.authors CASCADE;
DROP TABLE IF EXISTS public.media_items CASCADE;

-- Drop any remaining tables
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(table_record.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- Drop all storage policies
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'storage'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(policy_record.policyname) || ' ON storage.objects';
    END LOOP;
END $$;

-- Delete all storage objects
DELETE FROM storage.objects;

-- Delete all storage buckets
DELETE FROM storage.buckets;

-- Now recreate the schema based on the new blog and author schemas:

-- 1. Create the authors table based on the schema: { id: string; name: string; title: string; avatar: string; bio: string; }
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
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create the blogs table based on the schema: {
--   id: string;
--   slug: string;
--   title: string;
--   excerpt: string;
--   content: string;        // HTML content
--   heroImage: string;
--   category: string;
--   tags: string[];
--   publishDate: string;
--   readTime: number;
--   author: BlogAuthor;
--   featured: boolean;
-- }
CREATE TABLE public.blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,  -- HTML content
  hero_image TEXT,  -- converted from camelCase heroImage
  category TEXT,
  tags TEXT[],  -- Array of strings
  publish_date TIMESTAMPTZ,  -- converted from camelCase publishDate
  read_time INTEGER,  -- converted from camelCase readTime
  author_id UUID REFERENCES public.authors(id),  -- Reference to authors table
  featured BOOLEAN DEFAULT FALSE,  -- converted from camelCase featured
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to both tables
CREATE TRIGGER update_authors_updated_at 
    BEFORE UPDATE ON public.authors 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blogs_updated_at 
    BEFORE UPDATE ON public.blogs 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on both tables
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create permissive RLS policies for development
CREATE POLICY "Allow all operations on authors for development" ON public.authors
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on blogs for development" ON public.blogs
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Create storage bucket for blog images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for author avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('author-avatars', 'author-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create permissive storage policies for development
CREATE POLICY "Blog images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Allow all operations on blog images" ON storage.objects
  FOR ALL 
  USING (bucket_id = 'blog-images') 
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Author avatars are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'author-avatars');

CREATE POLICY "Allow all operations on author avatars" ON storage.objects
  FOR ALL 
  USING (bucket_id = 'author-avatars') 
  WITH CHECK (bucket_id = 'author-avatars');

-- Create functions to support the new schema

-- Function to create an author
CREATE OR REPLACE FUNCTION public.create_author(
  p_name TEXT,
  p_title TEXT DEFAULT NULL,
  p_avatar TEXT DEFAULT NULL,
  p_bio TEXT DEFAULT NULL,
  p_linkedin_url TEXT DEFAULT NULL,
  p_twitter_url TEXT DEFAULT NULL,
  p_website_url TEXT DEFAULT NULL,
  p_email TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_author_id UUID;
BEGIN
  INSERT INTO public.authors (
    name, title, avatar, bio, linkedin_url, twitter_url, website_url, email
  ) VALUES (
    p_name, p_title, p_avatar, p_bio, p_linkedin_url, p_twitter_url, p_website_url, p_email
  ) RETURNING id INTO v_author_id;
  
  RETURN v_author_id;
END;
$$;

-- Function to create a blog post
CREATE OR REPLACE FUNCTION public.create_blog(
  p_slug TEXT,
  p_title TEXT,
  p_excerpt TEXT DEFAULT NULL,
  p_content TEXT DEFAULT NULL,  -- HTML content
  p_hero_image TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  p_publish_date TIMESTAMPTZ DEFAULT NULL,
  p_read_time INTEGER DEFAULT NULL,
  p_author_id UUID DEFAULT NULL,
  p_featured BOOLEAN DEFAULT FALSE,
  p_status TEXT DEFAULT 'Draft'
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_blog_id UUID;
BEGIN
  INSERT INTO public.blogs (
    slug, title, excerpt, content, hero_image, category, tags, 
    publish_date, read_time, author_id, featured, status
  ) VALUES (
    p_slug, p_title, p_excerpt, p_content, p_hero_image, p_category, 
    p_tags, p_publish_date, p_read_time, p_author_id, p_featured, p_status
  ) RETURNING id INTO v_blog_id;
  
  RETURN v_blog_id;
END;
$$;

-- Insert sample authors
INSERT INTO public.authors (name, title, avatar, bio, linkedin_url)
SELECT 'Dr. Stéphane Niango',
       'Expert in Digital Cognitive Organizations & Strategic Transformation',
       '/images/Stephane_Avatar.png',
       'Dr. Niango is a globally recognized Digital Transformation Architect and Founder of DigitalQatalyst, specializing in the evolution of Digital Cognitive Organizations and AI-driven strategic transformation.',
       'https://linkedin.com/in/stephaneniango'
WHERE NOT EXISTS (SELECT 1 FROM public.authors WHERE name = 'Dr. Stéphane Niango');

INSERT INTO public.authors (name, title, avatar, bio, linkedin_url)
SELECT 'Kaylynn Océanne',
       'Content Engagement Strategist | Research Analyst',
       '/images/Kaylynn_Avatar.png',
       'Kaylynn is a Content Engagement Strategist at DigitalQatalyst, specializing in the design of underlying systems that make content coherent, engaging, and repeatable at scale.',
       'https://linkedin.com/in/kaylynn-niango'
WHERE NOT EXISTS (SELECT 1 FROM public.authors WHERE name = 'Kaylynn Océanne');

-- Insert a sample blog post
INSERT INTO public.blogs (slug, title, excerpt, content, hero_image, category, tags, read_time, author_id, featured)
SELECT 'introduction-to-digital-transformation',
       'Introduction to Digital Transformation',
       'An overview of digital transformation concepts and strategies',
       '<h1>Introduction to Digital Transformation</h1><p>Digital transformation is the process of using digital technologies to create new or modify existing business processes, culture, and customer experiences.</p>',
       '/images/digital-transformation-hero.jpg',
       'Technology',
       ARRAY['digital', 'transformation', 'strategy'],
       5,
       (SELECT id FROM public.authors WHERE name = 'Dr. Stéphane Niango' LIMIT 1),
       TRUE
WHERE NOT EXISTS (SELECT 1 FROM public.blogs WHERE slug = 'introduction-to-digital-transformation');

-- Verify the schema was created correctly
SELECT 
  '✅ Complete reset successful!' as status,
  (SELECT count(*) FROM information_schema.tables WHERE table_name = 'authors') as authors_table_exists,
  (SELECT count(*) FROM information_schema.tables WHERE table_name = 'blogs') as blogs_table_exists,
  (SELECT count(*) FROM information_schema.columns WHERE table_name = 'authors' AND column_name = 'avatar') as authors_avatar_exists,
  (SELECT count(*) FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'hero_image') as blogs_hero_image_exists,
  (SELECT count(*) FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'content') as blogs_content_exists,
  (SELECT count(*) FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'read_time') as blogs_read_time_exists,
  (SELECT count(*) FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'featured') as blogs_featured_exists,
  (SELECT count(*) FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'tags') as blogs_tags_exists,
  (SELECT count(*) FROM pg_proc WHERE proname = 'create_author') as create_author_function_exists,
  (SELECT count(*) FROM pg_proc WHERE proname = 'create_blog') as create_blog_function_exists,
  (SELECT count(*) FROM public.authors) as total_authors,
  (SELECT count(*) FROM public.blogs) as total_blogs;