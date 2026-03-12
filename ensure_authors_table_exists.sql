-- Ensure Authors Table Exists
-- This script checks if the authors table exists and creates it if needed
-- Following the database reset and restructure specification

-- First, check if the authors table exists
DO $$
DECLARE
  table_exists INTEGER;
  media_items_exists INTEGER;
BEGIN
  -- Check if authors table exists
  SELECT count(*) INTO table_exists
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'authors';
  
  IF table_exists = 0 THEN
    
    -- Check if media_items table exists
    SELECT count(*) INTO media_items_exists
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'media_items';
    
    IF media_items_exists = 0 THEN
      
      -- Create the base media_items table first
      CREATE TABLE public.media_items (
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

      -- Create updated_at trigger
      CREATE OR REPLACE FUNCTION public.update_updated_at_column()
      RETURNS TRIGGER AS $$
      DECLARE
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      CREATE TRIGGER update_media_items_updated_at 
          BEFORE UPDATE ON public.media_items 
          FOR EACH ROW 
          EXECUTE FUNCTION public.update_updated_at_column();

    END IF;
    
    -- Now create the authors table
    CREATE TABLE public.authors (
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

    -- Create updated_at trigger for authors
    CREATE TRIGGER update_authors_updated_at 
        BEFORE UPDATE ON public.authors 
        FOR EACH ROW 
        EXECUTE FUNCTION public.update_updated_at_column();

    -- Create the blogs table that depends on both media_items and authors
    CREATE TABLE public.blogs (
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
    CREATE POLICY "Author avatars are publicly accessible" ON storage.objects
      FOR SELECT USING (bucket_id = 'author-avatars');

    CREATE POLICY "Allow all operations on author avatars" ON storage.objects
      FOR ALL 
      USING (bucket_id = 'author-avatars') 
      WITH CHECK (bucket_id = 'author-avatars');

    -- Enable RLS on authors table
    ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

    -- Create permissive RLS policy for development
    CREATE POLICY "Allow all operations on authors for development" ON public.authors
      FOR ALL 
      USING (true) 
      WITH CHECK (true);

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
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Authors table and related schema created successfully!';
    
  ELSE
    RAISE NOTICE 'Authors table already exists.';
  END IF;
END $$;

-- Verify that the authors table exists and show its structure
SELECT 
  'Authors table exists and ready for use!' as status,
  count(*) as column_count
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'authors';

-- Show sample authors if any exist
SELECT 
  'Sample authors available:' as status,
  count(*) as author_count
FROM public.authors;

-- Final confirmation
SELECT '✅ Authors table is now available in the database!
You should be able to create authors at http://localhost:3000/admin-ui/authors/new' as confirmation;