-- Create the v_media_with_authors view if it doesn't exist

-- Drop the view if it exists
DROP VIEW IF EXISTS public.v_media_with_authors;

-- Create the v_media_with_authors view that combines media_items with authors information
CREATE VIEW public.v_media_with_authors AS
SELECT 
    mi.id,
    mi.title,
    mi.slug,
    mi.summary,
    mi.body,
    mi.body_html,
    mi.body_json,
    mi.type,
    mi.language,
    mi.visibility,
    mi.status,
    mi.seo_title,
    mi.seo_description,
    mi.canonical_url,
    mi.thumbnail_url,
    mi.category,
    mi.tags,
    mi.featured,
    mi.published_at,
    mi.created_at,
    mi.updated_at,
    -- Blog-specific fields
    b.excerpt AS blog_excerpt,
    b.content AS blog_content,
    b.hero_image,
    b.read_time,
    b.focus_keyword AS blog_focus_keyword,
    b.related_keywords AS blog_related_keywords,
    -- Author information from blogs
    a.id AS author_id,
    a.name AS author_name,
    a.title AS author_title,
    a.avatar AS author_avatar,  -- Using the avatar column
    a.avatar_url AS author_avatar_url,  -- Using the avatar_url column
    a.bio AS author_bio,
    a.linkedin_url AS author_linkedin,
    -- Fields for other types
    ar.author AS article_author,
    ar.byline AS article_byline,
    ar.content AS article_content,
    ar.read_time AS article_read_time
FROM public.media_items mi
LEFT JOIN public.blogs b ON mi.id = b.id
LEFT JOIN public.authors a ON b.author_id = a.id
LEFT JOIN public.articles ar ON mi.id = ar.id
UNION ALL
SELECT 
    mi.id,
    mi.title,
    mi.slug,
    mi.summary,
    mi.body,
    mi.body_html,
    mi.body_json,
    mi.type,
    mi.language,
    mi.visibility,
    mi.status,
    mi.seo_title,
    mi.seo_description,
    mi.canonical_url,
    mi.thumbnail_url,
    mi.category,
    mi.tags,
    mi.featured,
    mi.published_at,
    mi.created_at,
    mi.updated_at,
    -- For non-blog items, these will be null
    NULL AS blog_excerpt,
    NULL AS blog_content,
    mi.thumbnail_url AS hero_image,
    NULL AS read_time,
    NULL AS blog_focus_keyword,
    NULL AS blog_related_keywords,
    -- Author info from articles if available
    NULL AS author_id,
    ar.author AS author_name,
    NULL AS author_title,
    NULL AS author_avatar,
    NULL AS author_avatar_url,
    NULL AS author_bio,
    NULL AS author_linkedin,
    -- Article fields
    ar.author AS article_author,
    ar.author AS article_byline,
    ar.content AS article_content,
    ar.read_time AS article_read_time
FROM public.media_items mi
LEFT JOIN public.articles ar ON mi.id = ar.id
WHERE mi.id NOT IN (SELECT id FROM public.blogs);

-- Grant permissions on the view
GRANT SELECT ON public.v_media_with_authors TO service_role, authenticated;

-- Verify the view was created
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'v_media_with_authors'
ORDER BY ordinal_position;

-- Test the view
SELECT COUNT(*) FROM public.v_media_with_authors LIMIT 5;
