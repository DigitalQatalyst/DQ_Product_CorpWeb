-- Create basic views that are required for media fetching

-- Drop existing views if they exist
DROP VIEW IF EXISTS public.v_media_with_authors CASCADE;
DROP VIEW IF EXISTS public.v_media_all CASCADE;

-- Create the v_media_with_authors view with only essential columns
CREATE VIEW public.v_media_with_authors AS
SELECT 
    mi.id,
    mi.title,
    mi.slug,
    mi.summary,
    mi.body,
    mi.type,
    mi.status,
    mi.visibility,
    mi.published_at,
    mi.created_at,
    mi.updated_at,
    -- Try to include author information if available
    a.name AS author_name,
    a.title AS author_title,
    a.avatar AS author_avatar
FROM public.media_items mi
LEFT JOIN public.blogs b ON mi.id = b.id
LEFT JOIN public.authors a ON (b.author_id = a.id OR mi.id = a.id)
LEFT JOIN public.articles ar ON mi.id = ar.id;

-- Create the v_media_all view with only essential columns
CREATE VIEW public.v_media_all AS
SELECT 
    mi.id,
    mi.title,
    mi.slug,
    mi.summary,
    mi.body,
    mi.type,
    mi.status,
    mi.visibility,
    mi.published_at,
    mi.created_at,
    mi.updated_at,
    -- Try to include blog and author information if available
    b.excerpt AS blog_excerpt,
    b.content AS blog_content,
    a.name AS author_name,
    a.title AS author_title,
    a.avatar AS author_avatar
FROM public.media_items mi
LEFT JOIN public.blogs b ON mi.id = b.id
LEFT JOIN public.authors a ON b.author_id = a.id
LEFT JOIN public.articles ar ON mi.id = ar.id;

-- Grant permissions on the views
GRANT SELECT ON public.v_media_all TO service_role, authenticated;
GRANT SELECT ON public.v_media_with_authors TO service_role, authenticated;

-- Verify the views exist
SELECT 'v_media_with_authors' as view_name, COUNT(*) as row_count FROM public.v_media_with_authors
UNION ALL
SELECT 'v_media_all' as view_name, COUNT(*) as row_count FROM public.v_media_all;