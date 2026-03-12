-- Complete Author System Setup Script
-- Run this script to set up everything needed for the author system

-- ============================================================================
-- STEP 1: Create Authors Table
-- ============================================================================

-- Authors table for blog author management
CREATE TABLE IF NOT EXISTS authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(500),
  bio TEXT,
  avatar_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_authors_updated_at ON authors;
CREATE TRIGGER update_authors_updated_at 
    BEFORE UPDATE ON authors 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 2: Set up RLS Policies (Permissive for Development)
-- ============================================================================

-- Enable RLS
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Authors are viewable by authenticated users" ON authors;
DROP POLICY IF EXISTS "Authors can be created by authenticated users" ON authors;
DROP POLICY IF EXISTS "Authors can be updated by authenticated users" ON authors;
DROP POLICY IF EXISTS "Authors can be deleted by authenticated users" ON authors;
DROP POLICY IF EXISTS "Allow all operations for development" ON authors;

-- Create permissive policy for development
CREATE POLICY "Allow all operations for development" ON authors
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- ============================================================================
-- STEP 3: Set up Storage Bucket for Avatars
-- ============================================================================

-- Create storage bucket for author avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('author-avatars', 'author-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Author avatars are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload author avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update author avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete author avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow all operations on author avatars" ON storage.objects;

-- Create permissive storage policies
CREATE POLICY "Author avatars are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'author-avatars');

CREATE POLICY "Allow all operations on author avatars" ON storage.objects
  FOR ALL 
  USING (bucket_id = 'author-avatars') 
  WITH CHECK (bucket_id = 'author-avatars');

-- ============================================================================
-- STEP 4: Insert Sample Authors
-- ============================================================================

INSERT INTO authors (name, title, bio, avatar_url, linkedin_url) VALUES
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
),
(
  'Michael Rodriguez',
  'Technology Strategy Consultant',
  'Michael specializes in technology strategy and has guided numerous Fortune 500 companies through successful digital transformations.',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  NULL
),
(
  'Dr. Amira Hassan',
  'AI & Cognitive Systems Researcher',
  'Dr. Hassan is a renowned researcher in artificial intelligence and cognitive systems, focusing on practical applications in business.',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
  NULL
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STEP 5: Verification Queries
-- ============================================================================

-- Verify table was created
SELECT 'Authors table created successfully' as status 
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'authors');

-- Verify RLS policies
SELECT 'RLS policies created successfully' as status, count(*) as policy_count
FROM pg_policies 
WHERE tablename = 'authors';

-- Verify storage bucket
SELECT 'Storage bucket created successfully' as status, id, name, public 
FROM storage.buckets 
WHERE id = 'author-avatars';

-- Verify storage policies
SELECT 'Storage policies created successfully' as status, count(*) as policy_count
FROM pg_policies 
WHERE tablename = 'objects' AND policyname LIKE '%author%';

-- Count sample authors
SELECT 'Sample authors inserted successfully' as status, count(*) as author_count
FROM authors;

-- Final success message
SELECT '🎉 Author system setup completed successfully! You can now create and manage authors.' as final_status;