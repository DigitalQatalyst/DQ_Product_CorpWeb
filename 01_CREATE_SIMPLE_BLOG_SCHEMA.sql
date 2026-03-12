-- Simple Blog Schema
-- Based on your exact requirements

-- ============================================================================
-- STEP 1: Create Authors Table
-- ============================================================================

CREATE TABLE public.authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(500),
  bio TEXT,
  avatar VARCHAR(500),
  linkedin VARCHAR(500),
  twitter VARCHAR(500),
  website VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

-- Create permissive policy for development
CREATE POLICY "Allow all operations on authors" ON public.authors
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- STEP 2: Create Blogs Table (Simple Schema)
-- ============================================================================

CREATE TABLE public.blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,  -- HTML content
  hero_image VARCHAR(500) NOT NULL,
  category VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  publish_date TIMESTAMP WITH TIME ZONE NOT NULL,
  read_time INTEGER NOT NULL,
  author_id UUID NOT NULL REFERENCES public.authors(id) ON DELETE CASCADE,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for fast lookups
CREATE INDEX idx_blogs_slug ON public.blogs(slug);
CREATE INDEX idx_blogs_author_id ON public.blogs(author_id);
CREATE INDEX idx_blogs_publish_date ON public.blogs(publish_date DESC);

-- Enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create permissive policy for development
CREATE POLICY "Allow all operations on blogs" ON public.blogs
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- STEP 3: Create Updated At Trigger
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_authors_updated_at 
  BEFORE UPDATE ON public.authors 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blogs_updated_at 
  BEFORE UPDATE ON public.blogs 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- STEP 4: Create Storage Buckets
-- ============================================================================

-- Create bucket for author avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('author-avatars', 'author-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create bucket for blog hero images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for author avatars
CREATE POLICY "Author avatars are publicly accessible" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'author-avatars');

CREATE POLICY "Anyone can upload author avatars" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'author-avatars');

CREATE POLICY "Anyone can update author avatars" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'author-avatars');

CREATE POLICY "Anyone can delete author avatars" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'author-avatars');

-- Storage policies for blog images
CREATE POLICY "Blog images are publicly accessible" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'blog-images');

CREATE POLICY "Anyone can upload blog images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Anyone can update blog images" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'blog-images');

CREATE POLICY "Anyone can delete blog images" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'blog-images');

-- ============================================================================
-- STEP 5: Insert Sample Authors
-- ============================================================================

INSERT INTO public.authors (name, title, bio, avatar, linkedin) VALUES
(
  'Dr. Stéphane Niango',
  'Expert in Digital Cognitive Organizations & Strategic Transformation',
  'Dr. Niango is a globally recognized Digital Transformation Architect and Founder of DigitalQatalyst.',
  '/images/Stephane_Avatar.png',
  'https://linkedin.com/in/stephaneniango'
),
(
  'Kaylynn Océanne',
  'Content Engagement Strategist | Research Analyst',
  'Kaylynn is a Content Engagement Strategist at DigitalQatalyst.',
  '/images/Kaylynn_Avatar.png',
  'https://linkedin.com/in/kaylynn-niango'
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STEP 6: Create View for Blog Listing with Author Info
-- ============================================================================

CREATE OR REPLACE VIEW public.v_blogs_with_authors AS
SELECT 
  b.id,
  b.slug,
  b.title,
  b.excerpt,
  b.content,
  b.hero_image,
  b.category,
  b.tags,
  b.publish_date,
  b.read_time,
  b.featured,
  b.created_at,
  b.updated_at,
  -- Author info
  a.id as author_id,
  a.name as author_name,
  a.title as author_title,
  a.bio as author_bio,
  a.avatar as author_avatar,
  a.linkedin as author_linkedin,
  a.twitter as author_twitter,
  a.website as author_website
FROM public.blogs b
LEFT JOIN public.authors a ON a.id = b.author_id
ORDER BY b.publish_date DESC;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 'Schema created successfully!' as status;

SELECT 'Authors table' as table_name, COUNT(*) as row_count FROM public.authors
UNION ALL
SELECT 'Blogs table' as table_name, COUNT(*) as row_count FROM public.blogs;

SELECT 'Storage buckets' as check_name, COUNT(*) as bucket_count 
FROM storage.buckets 
WHERE id IN ('author-avatars', 'blog-images');
