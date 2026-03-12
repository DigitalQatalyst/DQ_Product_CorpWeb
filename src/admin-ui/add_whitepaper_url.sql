-- Add whitepaper_url column to blogs table for articles
-- This allows articles to link to related whitepapers

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'whitepaper_url') THEN
        ALTER TABLE public.blogs ADD COLUMN whitepaper_url TEXT;
    END IF;
END $$;

-- Update the v_blogs_all view to include the new column
DROP VIEW IF EXISTS public.v_blogs_all CASCADE;

CREATE OR REPLACE VIEW public.v_blogs_all AS
SELECT 
    b.*,
    a.name as author_name,
    a.title as author_title,
    a.avatar as author_avatar,
    a.bio as author_bio,
    c.name as category_name,
    c.slug as category_slug
FROM public.blogs b
LEFT JOIN public.authors a ON b.author_id = a.id
LEFT JOIN public.categories c ON b.category_id = c.id;

-- Grant permissions
GRANT SELECT ON public.v_blogs_all TO authenticated;
GRANT SELECT ON public.v_blogs_all TO anon;
