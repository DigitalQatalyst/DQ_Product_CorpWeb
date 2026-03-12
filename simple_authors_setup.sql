-- Simple Authors Setup Script
-- This script creates the authors table and related schema if they don't exist

-- Create the update function first (outside any DO blocks)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the media_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.media_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  body TEXT,
  body_html TEXT,
  body_json JSONB,
  type TEXT NOT NULL CHECK (type IN ('Article', 'Blog', 'Video', 'Podcast', 'Report', 'News', 'Guide', 'Event', 'Tool')),
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'InReview', 'Scheduled', 'Published', 'Archived')),
  visibility TEXT DEFAULT 'Public' CHECK (visibility IN ('Public', 'Private', 'Unlisted')),
  language TEXT DEFAULT 'en',
  seo_title TEXT,
  seo_description TEXT,
  canonical_url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  thumbnail_url TEXT,
  tags JSONB DEFAULT '[]'::JSONB,
  category TEXT,
  featured BOOLEAN DEFAULT FALSE,
  hero_image TEXT,
  read_time INTEGER,
  highlights TEXT
);

-- Create trigger for media_items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_media_items_updated_at'
  ) THEN
    CREATE TRIGGER update_media_items_updated_at 
        BEFORE UPDATE ON public.media_items 
        FOR EACH ROW 
        EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Create the authors table
CREATE TABLE IF NOT EXISTS public.authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  avatar_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trigger for authors
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_authors_updated_at'
  ) THEN
    CREATE TRIGGER update_authors_updated_at 
        BEFORE UPDATE ON public.authors 
        FOR EACH ROW 
        EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Create the blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.authors(id),
  excerpt TEXT,
  body_html TEXT,
  body_json JSONB,
  focus_keyword TEXT,
  related_keywords JSONB DEFAULT '[]'::JSONB,
  byline TEXT
);

-- Create storage bucket for author avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('author-avatars', 'author-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create permissive storage policies for development
DO $$
BEGIN
  -- Check if policy exists before creating
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Author avatars are publicly accessible'
  ) THEN
    CREATE POLICY "Author avatars are publicly accessible" ON storage.objects
      FOR SELECT USING (bucket_id = 'author-avatars');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Allow all operations on author avatars'
  ) THEN
    CREATE POLICY "Allow all operations on author avatars" ON storage.objects
      FOR ALL 
      USING (bucket_id = 'author-avatars') 
      WITH CHECK (bucket_id = 'author-avatars');
  END IF;
END $$;

-- Enable RLS on authors table
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

-- Create permissive RLS policy for development
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'authors' 
    AND policyname = 'Allow all operations on authors for development'
  ) THEN
    CREATE POLICY "Allow all operations on authors for development" ON public.authors
      FOR ALL 
      USING (true) 
      WITH CHECK (true);
  END IF;
END $$;

-- Create function to create an author
CREATE OR REPLACE FUNCTION public.create_author(
  p_name TEXT,
  p_title TEXT DEFAULT NULL,
  p_bio TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL,
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
    name, title, bio, avatar_url, linkedin_url, twitter_url, website_url, email
  ) VALUES (
    p_name, p_title, p_bio, p_avatar_url, p_linkedin_url, p_twitter_url, p_website_url, p_email
  ) RETURNING id INTO v_author_id;
  
  RETURN v_author_id;
END;
$$;

-- Insert sample authors if the table is empty
INSERT INTO public.authors (name, title, bio, avatar_url, linkedin_url)
SELECT 'Dr. Stéphane Niango',
       'Expert in Digital Cognitive Organizations & Strategic Transformation',
       'Dr. Niango is a globally recognized Digital Transformation Architect and Founder of DigitalQatalyst, specializing in the evolution of Digital Cognitive Organizations and AI-driven strategic transformation.',
       '/images/Stephane_Avatar.png',
       'https://linkedin.com/in/stephaneniango'
WHERE NOT EXISTS (SELECT 1 FROM public.authors WHERE name = 'Dr. Stéphane Niango');

INSERT INTO public.authors (name, title, bio, avatar_url, linkedin_url)
SELECT 'Kaylynn Océanne',
       'Content Engagement Strategist | Research Analyst',
       'Kaylynn is a Content Engagement Strategist at DigitalQatalyst, specializing in the design of underlying systems that make content coherent, engaging, and repeatable at scale.',
       '/images/Kaylynn_Avatar.png',
       'https://linkedin.com/in/kaylynn-niango'
WHERE NOT EXISTS (SELECT 1 FROM public.authors WHERE name = 'Kaylynn Océanne');

-- Final verification
SELECT 
  '✅ Authors table and related schema created successfully!' as status,
  (SELECT count(*) FROM public.authors) as author_count,
  (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'authors') as table_exists;