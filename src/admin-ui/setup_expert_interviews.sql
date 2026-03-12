-- Setup Expert Interviews support in the blogs table
-- This script ensures the blogs table can handle expert interview metadata

-- 1. Ensure the type column exists (already done in some scripts, but for safety)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'type') THEN
        ALTER TABLE public.blogs ADD COLUMN type TEXT DEFAULT 'blog';
    END IF;
END $$;

-- 2. Add expert-specific columns to blogs table
-- These allow for better querying and filtering than just digging into the content JSON
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'location') THEN
        ALTER TABLE public.blogs ADD COLUMN location TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'interview_date') THEN
        ALTER TABLE public.blogs ADD COLUMN interview_date TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- 3. Update the v_blogs_all view to include these new fields
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

-- 4. Create an RPC function for specialized Expert Interview creation if needed
-- This mirrors the logic in BlogCreate.tsx but handles the database side
CREATE OR REPLACE FUNCTION public.create_expert_interview_item(
    p_title text,
    p_slug text,
    p_excerpt text,
    p_content text, -- This should be the JSON string
    p_hero_image text,
    p_author_id uuid,
    p_category_id uuid,
    p_category_name text,
    p_tags text[],
    p_publish_date timestamptz,
    p_read_time integer,
    p_featured boolean,
    p_location text,
    p_interview_date timestamptz
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_id uuid;
BEGIN
    INSERT INTO public.blogs (
        title, slug, excerpt, content, hero_image, author_id, 
        category_id, tags, publish_date, read_time, featured, 
        type, location, interview_date
    ) VALUES (
        p_title, p_slug, p_excerpt, p_content, p_hero_image, p_author_id,
        p_category_id, p_tags, p_publish_date, p_read_time, p_featured,
        'expert-interview', p_location, p_interview_date
    ) RETURNING id INTO v_id;
    
    RETURN v_id;
END;
$$;

-- 5. Grant permissions
GRANT EXECUTE ON FUNCTION public.create_expert_interview_item(text, text, text, text, text, uuid, uuid, text, text[], timestamptz, integer, boolean, text, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_expert_interview_item(text, text, text, text, text, uuid, uuid, text, text[], timestamptz, integer, boolean, text, timestamptz) TO service_role;
