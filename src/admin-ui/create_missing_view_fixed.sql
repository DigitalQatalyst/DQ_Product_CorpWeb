-- Create the missing v_media_all view

-- First, let's check if the view exists and drop it if it does
DROP VIEW IF EXISTS public.v_media_all;

-- Create the v_media_all view that combines media_items, authors, and blogs
CREATE VIEW public.v_media_all AS
SELECT 
    mi.id,
    mi.title,
    mi.slug,
    mi.summary AS excerpt,
    mi.body AS content,
    mi.thumbnail_url AS hero_image,
    mi.category,
    mi.tags,
    mi.published_at AS publish_date,
    mi.created_at,
    mi.updated_at,
    mi.type,
    mi.status,
    mi.featured,
    -- Author information
    a.id AS author_id,
    a.name AS author_name,
    a.title AS author_title,
    a.avatar_url AS author_avatar,
    a.bio AS author_bio,
    -- Blog-specific fields if applicable
    b.excerpt AS blog_excerpt,
    b.content AS blog_content,
    b.read_time,
    b.status AS blog_status
FROM public.media_items mi
LEFT JOIN public.blogs b ON mi.id = b.id
LEFT JOIN public.authors a ON b.author_id = a.id
UNION ALL
SELECT 
    m.id,
    m.title,
    m.slug,
    m.summary AS excerpt,
    m.body AS content,
    m.thumbnail_url AS hero_image,
    m.category,
    m.tags,
    m.published_at AS publish_date,
    m.created_at,
    m.updated_at,
    m.type,
    m.status,
    m.featured,
    -- Author information from articles table
    NULL AS author_id,
    ar.author AS author_name,
    NULL AS author_title,
    NULL AS author_avatar,
    NULL AS author_bio,
    -- Article-specific fields
    NULL AS blog_excerpt,
    ar.content AS blog_content,
    ar.read_time,
    ar.status AS blog_status
FROM public.media_items m
LEFT JOIN public.articles ar ON m.id = ar.id
WHERE m.id NOT IN (SELECT id FROM public.blogs);

-- Grant permissions on the view
GRANT SELECT ON public.v_media_all TO service_role, authenticated;

-- Verify the view was created
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'v_media_all'
ORDER BY ordinal_position;

-- Test the view
SELECT COUNT(*) FROM public.v_media_all LIMIT 5;
