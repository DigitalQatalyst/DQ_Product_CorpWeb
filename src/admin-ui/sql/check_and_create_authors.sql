-- Check if authors table exists and create it if it doesn't
DO $$
BEGIN
    -- Check if the authors table exists
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'authors') THEN
        -- Create the authors table
        CREATE TABLE authors (
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

        -- Create updated_at trigger function if it doesn't exist
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $trigger$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $trigger$ language 'plpgsql';

        -- Create trigger
        CREATE TRIGGER update_authors_updated_at 
            BEFORE UPDATE ON authors 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();

        -- Enable RLS
        ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

        -- Create RLS policies
        CREATE POLICY "Authors are viewable by authenticated users" ON authors
            FOR SELECT USING (auth.role() = 'authenticated');

        CREATE POLICY "Authors can be created by authenticated users" ON authors
            FOR INSERT WITH CHECK (auth.role() = 'authenticated');

        CREATE POLICY "Authors can be updated by authenticated users" ON authors
            FOR UPDATE USING (auth.role() = 'authenticated');

        CREATE POLICY "Authors can be deleted by authenticated users" ON authors
            FOR DELETE USING (auth.role() = 'authenticated');

        RAISE NOTICE 'Authors table created successfully with RLS policies';
    ELSE
        RAISE NOTICE 'Authors table already exists';
    END IF;
END
$$;

-- Insert default authors if table is empty
INSERT INTO authors (name, title, bio, avatar_url, linkedin_url) 
SELECT * FROM (VALUES
    ('Dr. Stéphane Niango', 'Expert in Digital Cognitive Organizations & Strategic Transformation', 'Dr. Niango is a globally recognized Digital Transformation Architect and Founder of DigitalQatalyst, specializing in the evolution of Digital Cognitive Organizations and AI-driven strategic transformation.', '/images/Stephane_Avatar.png', 'https://linkedin.com/in/stephaneniango'),
    ('Kaylynn Océanne', 'Content Engagement Strategist | Research Analyst', 'Kaylynn is a Content Engagement Strategist at DigitalQatalyst, specializing in the design of underlying systems that make content coherent, engaging, and repeatable at scale.', '/images/Kaylynn_Avatar.png', 'https://linkedin.com/in/kaylynn-niango'),
    ('Michael Rodriguez', 'Technology Strategy Consultant', 'Michael specializes in technology strategy and has guided numerous Fortune 500 companies through successful digital transformations.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', NULL),
    ('Dr. Amira Hassan', 'AI & Cognitive Systems Researcher', 'Dr. Hassan is a renowned researcher in artificial intelligence and cognitive systems, focusing on practical applications in business.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face', NULL)
) AS default_authors(name, title, bio, avatar_url, linkedin_url)
WHERE NOT EXISTS (SELECT 1 FROM authors LIMIT 1);

-- Check storage bucket for author avatars
DO $$
BEGIN
    -- Insert storage bucket if it doesn't exist
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('author-avatars', 'author-avatars', true)
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Author avatars storage bucket ready';
END
$$;

-- Set up storage policies
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Author avatars are publicly accessible" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can upload author avatars" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can update author avatars" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can delete author avatars" ON storage.objects;

    -- Create storage policies
    CREATE POLICY "Author avatars are publicly accessible" ON storage.objects
        FOR SELECT USING (bucket_id = 'author-avatars');

    CREATE POLICY "Authenticated users can upload author avatars" ON storage.objects
        FOR INSERT WITH CHECK (
            bucket_id = 'author-avatars' 
            AND auth.role() = 'authenticated'
        );

    CREATE POLICY "Authenticated users can update author avatars" ON storage.objects
        FOR UPDATE USING (
            bucket_id = 'author-avatars' 
            AND auth.role() = 'authenticated'
        );

    CREATE POLICY "Authenticated users can delete author avatars" ON storage.objects
        FOR DELETE USING (
            bucket_id = 'author-avatars' 
            AND auth.role() = 'authenticated'
        );

    RAISE NOTICE 'Storage policies created successfully';
END
$$;