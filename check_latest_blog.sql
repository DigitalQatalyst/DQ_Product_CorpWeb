-- Quick check: View the most recent blog and its body content
SELECT 
    m.id,
    m.title,
    m.slug,
    m.type,
    m.status,
    m.category,
    m.hero_image,
    m.read_time,
    m.featured,
    m.published_at,
    m.created_at,
    b.author_id,
    a.name as author_name,
    LENGTH(COALESCE(b.excerpt, '')) as excerpt_length,
    LENGTH(COALESCE(b.body_html, '')) as body_html_length,
    CASE 
        WHEN b.body_html IS NULL THEN '❌ NULL'
        WHEN LENGTH(b.body_html) = 0 THEN '❌ EMPTY'
        WHEN LENGTH(b.body_html) < 100 THEN '⚠️ TOO SHORT'
        ELSE '✅ HAS CONTENT'
    END as body_status,
    LEFT(b.body_html, 200) as body_preview,
    b.focus_keyword,
    array_length(b.related_keywords, 1) as keyword_count
FROM media_items m
JOIN blogs b ON b.id = m.id
LEFT JOIN authors a ON a.id = b.author_id
WHERE m.type = 'Blog'
ORDER BY m.created_at DESC
LIMIT 1;
