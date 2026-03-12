-- Authors table for blog author management
CREATE TABLE IF NOT EXISTS authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  bio TEXT NOT NULL,
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

CREATE TRIGGER update_authors_updated_at 
    BEFORE UPDATE ON authors 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read all authors
CREATE POLICY "Authors are viewable by authenticated users" ON authors
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for authenticated users to insert authors
CREATE POLICY "Authors can be created by authenticated users" ON authors
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for authenticated users to update authors
CREATE POLICY "Authors can be updated by authenticated users" ON authors
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy for authenticated users to delete authors
CREATE POLICY "Authors can be deleted by authenticated users" ON authors
    FOR DELETE USING (auth.role() = 'authenticated');

-- Insert default authors
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
  'Kaylynn is a Content Engagement Strategist at DigitalQatalyst, specializing in the design of underlying systems that make content coherent, engaging, and repeatable at scale. She architects frameworks, design systems, and production workflows that serve as the backbone for consistent, high-quality content delivery.',
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