-- Add 'type' column to blogs table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'type') THEN
        ALTER TABLE public.blogs ADD COLUMN type TEXT DEFAULT 'blog';
    END IF;
END $$;

-- Update existing blogs to have 'blog' type if null
UPDATE public.blogs SET type = 'blog' WHERE type IS NULL;

-- Recreate the view to include the new column
DROP VIEW IF EXISTS public.v_blogs_all;
CREATE VIEW public.v_blogs_all AS
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
