-- Recreate Authors Table with Simple Schema
-- This will drop and recreate the authors table with only 5 fields

-- Drop the existing authors table
DROP TABLE IF EXISTS public.authors CASCADE;

-- Create authors table with simple schema
CREATE TABLE public.authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  avatar VARCHAR(500) NOT NULL,
  bio TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

-- Create permissive policy for development
CREATE POLICY "Allow all operations on authors" ON public.authors
  FOR ALL USING (true) WITH CHECK (true);

-- Insert sample authors
INSERT INTO public.authors (name, title, avatar, bio) VALUES
(
  'Dr. Stéphane Niango',
  'Expert in Digital Cognitive Organizations & Strategic Transformation',
  '/images/Stephane_Avatar.png',
  'Dr. Niango is a globally recognized Digital Transformation Architect and Founder of DigitalQatalyst, specializing in the evolution of Digital Cognitive Organizations and AI-driven strategic transformation.'
),
(
  'Kaylynn Océanne',
  'Content Engagement Strategist | Research Analyst',
  '/images/Kaylynn_Avatar.png',
  'Kaylynn is a Content Engagement Strategist at DigitalQatalyst, specializing in the design of underlying systems that make content coherent, engaging, and repeatable at scale.'
);

-- Verify
SELECT 'Authors table recreated successfully!' as status;
SELECT * FROM public.authors;
