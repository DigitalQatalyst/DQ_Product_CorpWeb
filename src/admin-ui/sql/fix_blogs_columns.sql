-- Add missing columns to blogs table to support all content types (Corrected for Stand-alone Schema)
-- This fixes the error: "Could not find the 'whitepaper_url' column of 'blogs' in the schema cache"

DO $$
BEGIN
    -- Add type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blogs' AND column_name = 'type') THEN
        ALTER TABLE public.blogs ADD COLUMN type TEXT DEFAULT 'blog';
    END IF;

    -- Add whitepaper_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blogs' AND column_name = 'whitepaper_url') THEN
        ALTER TABLE public.blogs ADD COLUMN whitepaper_url TEXT;
    END IF;

    -- Add location column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blogs' AND column_name = 'location') THEN
        ALTER TABLE public.blogs ADD COLUMN location TEXT;
    END IF;

    -- Add interview_date column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blogs' AND column_name = 'interview_date') THEN
        ALTER TABLE public.blogs ADD COLUMN interview_date TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Add category_id column if it doesn't exist (for projects using UUID categories)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'blogs' AND column_name = 'category_id') THEN
        ALTER TABLE public.blogs ADD COLUMN category_id UUID;
    END IF;
END $$;

-- Update the v_blogs_all view to include the new columns and join with categories if they exist
DROP VIEW IF EXISTS public.v_blogs_all CASCADE;

CREATE OR REPLACE VIEW public.v_blogs_all AS
SELECT 
    b.*,
    a.name as author_name,
    a.title as author_title,
    a.avatar as author_avatar,
    a.bio as author_bio
FROM public.blogs b
LEFT JOIN public.authors a ON b.author_id = a.id;

-- Grant permissions (for public access if needed)
GRANT SELECT ON public.v_blogs_all TO authenticated;
GRANT SELECT ON public.v_blogs_all TO anon;
