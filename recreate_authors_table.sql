-- Recreate Authors Table with Proper Schema
-- Drops the existing authors table and recreates it with the correct schema

-- First, drop any dependent objects that might reference the authors table
DROP VIEW IF EXISTS public.v_media_all CASCADE;
DROP VIEW IF EXISTS public.v_media_public CASCADE;
DROP VIEW IF EXISTS public.v_media_with_authors CASCADE;

-- Drop any functions that depend on the authors table
DROP FUNCTION IF EXISTS public.create_blog_post(UUID, TEXT, TEXT, TEXT, TEXT, JSONB, UUID, TEXT, TEXT, JSONB, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TIMESTAMPTZ, TEXT, JSONB, TEXT, BOOLEAN, TEXT, INTEGER, TEXT) CASCADE;

-- Drop the authors table
DROP TABLE IF EXISTS public.authors CASCADE;

-- Create the authors table with the correct schema
CREATE TABLE public.authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  avatar_url TEXT,  -- This column was missing
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the updated_at trigger for authors
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to the authors table
CREATE TRIGGER update_authors_updated_at 
    BEFORE UPDATE ON public.authors 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on authors table
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

-- Create permissive RLS policy for development
CREATE POLICY "Allow all operations on authors for development" ON public.authors
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Recreate the blogs table (since it references authors)
DROP TABLE IF EXISTS public.blogs CASCADE;
CREATE TABLE public.blogs (
  id UUID PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,  -- Changed to SET NULL to avoid cascading issues
  excerpt TEXT,
  body_html TEXT,
  body_json JSONB,
  focus_keyword TEXT,
  related_keywords JSONB DEFAULT '[]'::JSONB,
  byline TEXT
);

-- Recreate the views that depend on the authors table
CREATE VIEW public.v_media_all AS
SELECT 
    mi.id,
    mi.slug,
    mi.title,
    mi.summary,
    mi.body,
    mi.body_html,
    mi.body_json,
    mi.type,
    mi.status,
    mi.visibility,
    mi.language,
    mi.seo_title,
    mi.seo_description,
    mi.canonical_url,
    mi.published_at,
    mi.created_at,
    mi.updated_at,
    mi.thumbnail_url,
    mi.tags,
    mi.category,
    mi.featured,
    mi.hero_image,
    mi.read_time,
    mi.highlights,
    -- Author information
    a.id AS author_id,
    a.name AS author_name,
    a.title AS author_title,
    a.bio AS author_bio,
    a.avatar_url AS author_avatar_url,
    a.linkedin_url AS author_linkedin_url,
    a.twitter_url AS author_twitter_url,
    a.website_url AS author_website_url,
    a.email AS author_email,
    a.is_active AS author_is_active,
    a.created_at AS author_created_at,
    a.updated_at AS author_updated_at,
    -- Blog-specific information
    b.excerpt AS blog_excerpt,
    b.focus_keyword AS blog_focus_keyword,
    b.related_keywords AS blog_related_keywords,
    b.byline AS blog_byline
FROM public.media_items mi
LEFT JOIN public.blogs b ON mi.id = b.id
LEFT JOIN public.authors a ON b.author_id = a.id;

CREATE VIEW public.v_media_public AS
SELECT 
    mi.id,
    mi.slug,
    mi.title,
    mi.summary,
    mi.body_html,
    mi.body_json,
    mi.type,
    mi.status,
    mi.visibility,
    mi.language,
    mi.seo_title,
    mi.seo_description,
    mi.published_at,
    mi.created_at,
    mi.updated_at,
    mi.thumbnail_url,
    mi.tags,
    mi.category,
    mi.featured,
    mi.hero_image,
    mi.read_time,
    mi.highlights,
    -- Author information
    a.id AS author_id,
    a.name AS author_name,
    a.title AS author_title,
    a.bio AS author_bio,
    a.avatar_url AS author_avatar_url,
    a.linkedin_url AS author_linkedin_url,
    a.twitter_url AS author_twitter_url,
    a.website_url AS author_website_url,
    a.email AS author_email,
    -- Blog-specific information
    b.excerpt AS blog_excerpt,
    b.focus_keyword AS blog_focus_keyword,
    b.related_keywords AS blog_related_keywords,
    b.byline AS blog_byline
FROM public.media_items mi
LEFT JOIN public.blogs b ON mi.id = b.id
LEFT JOIN public.authors a ON b.author_id = a.id
WHERE mi.status = 'Published' 
  AND mi.visibility = 'Public'
  AND a.is_active = TRUE;

CREATE VIEW public.v_media_with_authors AS
SELECT 
    mi.id,
    mi.slug,
    mi.title,
    mi.summary,
    mi.body_html,
    mi.body_json,
    mi.type,
    mi.status,
    mi.visibility,
    mi.language,
    mi.published_at,
    mi.created_at,
    mi.updated_at,
    mi.thumbnail_url,
    mi.tags,
    mi.category,
    mi.featured,
    mi.hero_image,
    mi.read_time,
    mi.highlights,
    -- Author information
    a.id AS author_id,
    a.name AS author_name,
    a.title AS author_title,
    a.bio AS author_bio,
    a.avatar_url AS author_avatar_url,
    a.linkedin_url AS author_linkedin_url,
    a.twitter_url AS author_twitter_url,
    a.website_url AS author_website_url,
    a.email AS author_email,
    a.is_active AS author_is_active
FROM public.media_items mi
LEFT JOIN public.blogs b ON mi.id = b.id
LEFT JOIN public.authors a ON b.author_id = a.id
WHERE mi.type IN ('Article', 'Blog');

-- Grant permissions on the views
GRANT SELECT ON public.v_media_all TO authenticated, anon;
GRANT SELECT ON public.v_media_public TO authenticated, anon;
GRANT SELECT ON public.v_media_with_authors TO authenticated, anon;

-- Recreate the create_author function
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
INSERT INTO public.authors (name, title, bio, avatar_url, linkedin_url) VALUES
(
  'Dr. Stéphane Niango',
  'Expert in Digital Cognitive Organizations & Strategic Transformation',
  'Dr. Niango is a globally recognized Digital Transformation Architect and Founder of DigitalQatalyst, specializing in the evolution of Digital Cognitive Organizations and AI-driven strategic transformation.',
  '/images/Stephane_Avatar.png',
  'https://linkedin.com/in/stephaneniango'
),
(
  'Kaylynn Océanne',
  'Content Engagement Strategist | Research Analyst',
  'Kaylynn is a Content Engagement Strategist at DigitalQatalyst, specializing in the design of underlying systems that make content coherent, engaging, and repeatable at scale.',
  '/images/Kaylynn_Avatar.png',
  'https://linkedin.com/in/kaylynn-niango'
)
ON CONFLICT (name) DO NOTHING;

-- Verify the authors table structure
SELECT 
  '✅ Authors table recreated with proper schema!' as status,
  (SELECT count(*) FROM information_schema.tables WHERE table_name = 'authors') as table_exists,
  (SELECT count(*) FROM information_schema.columns WHERE table_name = 'authors' AND column_name = 'avatar_url') as avatar_url_exists,
  (SELECT count(*) FROM information_schema.columns WHERE table_name = 'authors' AND column_name = 'name') as name_exists,
  (SELECT count(*) FROM information_schema.columns WHERE table_name = 'authors' AND column_name = 'bio') as bio_exists,
  (SELECT count(*) FROM information_schema.columns WHERE table_name = 'authors' AND column_name = 'email') as email_exists,
  (SELECT count(*) FROM information_schema.columns WHERE table_name = 'authors' AND column_name = 'linkedin_url') as linkedin_url_exists,
  (SELECT count(*) FROM information_schema.columns WHERE table_name = 'authors' AND column_name = 'twitter_url') as twitter_url_exists,
  (SELECT count(*) FROM information_schema.columns WHERE table_name = 'authors' AND column_name = 'website_url') as website_url_exists,
  (SELECT count(*) FROM public.authors) as total_authors;