-- SEPARATE BLOGS TABLE
-- This moves Blogs out of the articles table into their own table to prevent any confusion.

-- 1. Create the dedicated Blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
    id uuid NOT NULL,
    body_html text,
    body_json jsonb,
    byline text, -- Author
    source text,
    read_time int,
    hero_image text, -- Specific to blogs
    CONSTRAINT blogs_pkey PRIMARY KEY (id),
    CONSTRAINT blogs_id_fkey FOREIGN KEY (id) REFERENCES public.media_items(id) ON DELETE CASCADE
);

-- 2. Migrate existing 'Blog' data from articles to blogs
INSERT INTO public.blogs (id, body_html, body_json, byline, source, read_time)
SELECT a.id, a.body_html, a.body_json, a.byline, a.source, a.read_time
FROM public.articles a
JOIN public.media_items m ON m.id = a.id
WHERE m.type = 'Blog';

-- Remove migrated data from articles
DELETE FROM public.articles a
USING public.media_items m
WHERE m.id = a.id AND m.type = 'Blog';

-- 3. Update View to include Blogs table
CREATE OR REPLACE VIEW public.v_media_all AS
SELECT
  m.id,
  m.slug,
  m.title,
  m.summary,
  m.status,
  m.visibility,
  m.language,
  m.seo_title,
  m.seo_description,
  m.canonical_url,
  m.published_at,
  m.created_at,
  m.updated_at,
  m.thumbnail_url,
  m.hero_image,
  m.tags,
  m.category,
  m.featured,
  m.highlights,
  m.type,

  -- Flattened Child Columns
  
  -- Article fields
  a.body_html AS article_body,
  a.byline AS article_author,
  
  -- Blog fields (New)
  b.body_html AS blog_body,
  b.byline AS blog_author,
  
  -- Unified fields (for backward compatibility / ease of use)
  COALESCE(a.body_html, b.body_html) AS body_html,
  COALESCE(a.body_json, b.body_json) AS body_json,
  COALESCE(a.byline, b.byline) AS byline,
  COALESCE(a.source, b.source) AS source,
  COALESCE(a.read_time, b.read_time) AS read_time,
  
  -- Video
  v.video_url,
  v.platform,
  v.duration_sec AS video_duration_sec,
  v.transcript_url AS video_transcript_url,
  
  -- Podcast
  p.audio_url,
  p.episode_no,
  p.is_video_episode,
  p.duration_sec AS audio_duration_sec,
  p.transcript_url AS audio_transcript_url,
  
  -- Event
  e.start_at,
  e.end_at,
  e.venue,
  e.location_details,
  e.registration_info,
  e.registration_url,
  e.timezone,
  e.agenda,
  
  -- Report/Tool
  COALESCE(r.document_url, t.document_url) AS document_url,
  COALESCE(r.file_size_mb, t.file_size_mb) AS file_size_mb,
  r.pages,
  t.requirements

FROM public.media_items m
LEFT JOIN public.articles a ON a.id = m.id AND m.type = 'Article'
LEFT JOIN public.blogs b ON b.id = m.id AND m.type = 'Blog'
LEFT JOIN public.videos v ON v.id = m.id
LEFT JOIN public.podcasts p ON p.id = m.id
LEFT JOIN public.events e ON e.id = m.id
LEFT JOIN public.reports r ON r.id = m.id
LEFT JOIN public.tools t ON t.id = m.id;

-- 4. Update Function to Insert into Blogs table
CREATE OR REPLACE FUNCTION public.create_media_item(_base jsonb, _type text, _child jsonb)
RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
  _id uuid;
  t text := lower(coalesce(_type,''));
BEGIN
  -- Insert into Base
  INSERT INTO public.media_items (
    slug, title, summary, type, status, visibility, language,
    seo_title, seo_description, canonical_url, published_at,
    thumbnail_url, hero_image, tags, category, featured, highlights
  ) VALUES (
    COALESCE(public._jtxt(_base,'slug'), public.normalize_slug(public._jtxt(_base,'title'))),
    COALESCE(public._jtxt(_base,'title'), 'Untitled'),
    public._jtxt(_base,'summary'),
    COALESCE(_type, 'Article'),
    COALESCE(public._jtxt(_base,'status'), 'Draft'),
    COALESCE(public._jtxt(_base,'visibility'), 'Public'),
    COALESCE(public._jtxt(_base,'language'), 'en'),
    public._jtxt(_base,'seo_title'),
    public._jtxt(_base,'seo_description'),
    public._jtxt(_base,'canonical_url'),
    (_base->>'published_at')::timestamptz,
    public._jtxt(_base,'thumbnail_url'),
    public._jtxt(_base,'hero_image'),
    COALESCE(_base->'tags', '[]'::jsonb),
    public._jtxt(_base,'category'),
    COALESCE((_base->>'featured')::boolean, false),
    public._jtxt(_base,'highlights')
  ) RETURNING id INTO _id;

  -- Insert into Specific Child Table
  IF t = 'article' OR t = 'news' THEN
    INSERT INTO public.articles (id, body_html, body_json, byline, source, read_time)
    VALUES (_id, public._jtxt(_child,'body_html'), _child->'body_json', public._jtxt(_child,'byline'), public._jtxt(_child,'source'), NULLIF((_child->>'read_time')::int, 0));
    
  ELSIF t = 'blog' THEN
    INSERT INTO public.blogs (id, body_html, body_json, byline, source, read_time, hero_image)
    VALUES (_id, public._jtxt(_child,'body_html'), _child->'body_json', public._jtxt(_child,'byline'), public._jtxt(_child,'source'), NULLIF((_child->>'read_time')::int, 0), public._jtxt(_base,'hero_image'));
    
  ELSIF t = 'video' THEN
    INSERT INTO public.videos (id, video_url, platform, duration_sec)
    VALUES (_id, public._jtxt(_child,'video_url'), public._jtxt(_child,'platform'), NULLIF((_child->>'duration_sec')::int, 0));
    
  ELSIF t = 'podcast' THEN
    INSERT INTO public.podcasts (id, audio_url, episode_no, is_video_episode, duration_sec)
    VALUES (_id, public._jtxt(_child,'audio_url'), NULLIF((_child->>'episode_no')::int, 0), COALESCE((_child->>'is_video_episode')::boolean, false), NULLIF((_child->>'duration_sec')::int, 0));
    
  ELSIF t = 'event' THEN
    INSERT INTO public.events (id, start_at, end_at, venue, location_details, registration_info, registration_url)
    VALUES (_id, (_child->>'start_at')::timestamptz, (_child->>'end_at')::timestamptz, public._jtxt(_child,'venue'), public._jtxt(_child,'location_details'), public._jtxt(_child,'registration_info'), public._jtxt(_child,'registration_url'));
    
  ELSIF t = 'report' OR t = 'guide' THEN -- Guides often are reports
    INSERT INTO public.reports (id, document_url, pages, file_size_mb)
    VALUES (_id, public._jtxt(_child,'document_url'), NULLIF((_child->>'pages')::int, 0), NULLIF((_child->>'file_size_mb')::numeric, 0));
    
  ELSIF t = 'tool' OR t = 'toolkits & templates' THEN
    INSERT INTO public.tools (id, document_url, requirements, file_size_mb)
    VALUES (_id, public._jtxt(_child,'document_url'), public._jtxt(_child,'requirements'), NULLIF((_child->>'file_size_mb')::numeric, 0));
  END IF;

  RETURN _id;
END;
$$;

-- 5. Update UPDATE Function
CREATE OR REPLACE FUNCTION public.update_media_item(_id uuid, _base jsonb, _type text, _child jsonb)
RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
  t text := lower(coalesce(_type,''));
BEGIN
  UPDATE public.media_items SET
    slug = COALESCE(public._jtxt(_base,'slug'), slug),
    title = COALESCE(public._jtxt(_base,'title'), title),
    summary = COALESCE(public._jtxt(_base,'summary'), summary),
    -- type = COALESCE(_type, type), -- Type typically doesn't change, but if it does, it implies moving tables (complex). Assuming stability.
    status = COALESCE(public._jtxt(_base,'status'), status),
    visibility = COALESCE(public._jtxt(_base,'visibility'), visibility),
    language = COALESCE(public._jtxt(_base,'language'), language),
    seo_title = COALESCE(public._jtxt(_base,'seo_title'), seo_title),
    seo_description = COALESCE(public._jtxt(_base,'seo_description'), seo_description),
    canonical_url = COALESCE(public._jtxt(_base,'canonical_url'), canonical_url),
    published_at = COALESCE((_base->>'published_at')::timestamptz, published_at),
    thumbnail_url = COALESCE(public._jtxt(_base,'thumbnail_url'), thumbnail_url),
    hero_image = COALESCE(public._jtxt(_base,'hero_image'), hero_image),
    tags = COALESCE(_base->'tags', tags),
    category = COALESCE(public._jtxt(_base,'category'), category),
    featured = COALESCE((_base->>'featured')::boolean, featured),
    highlights = COALESCE(public._jtxt(_base,'highlights'), highlights),
    updated_at = now()
  WHERE id = _id;

  -- Upsert Child
  -- Need to handle case where we might switch from Article to Blog (delete from one, insert into other)
  -- For now, simple upsert into target table
  
  IF t = 'article' OR t = 'news' THEN
    INSERT INTO public.articles (id, body_html, body_json, byline, source, read_time)
    VALUES (_id, public._jtxt(_child,'body_html'), _child->'body_json', public._jtxt(_child,'byline'), public._jtxt(_child,'source'), NULLIF((_child->>'read_time')::int, 0))
    ON CONFLICT (id) DO UPDATE SET body_html = EXCLUDED.body_html, body_json = EXCLUDED.body_json;
    
  ELSIF t = 'blog' THEN
    INSERT INTO public.blogs (id, body_html, body_json, byline, source, read_time, hero_image)
    VALUES (_id, public._jtxt(_child,'body_html'), _child->'body_json', public._jtxt(_child,'byline'), public._jtxt(_child,'source'), NULLIF((_child->>'read_time')::int, 0), public._jtxt(_base,'hero_image'))
    ON CONFLICT (id) DO UPDATE SET body_html = EXCLUDED.body_html, body_json = EXCLUDED.body_json;
    
  ELSIF t = 'video' THEN
    INSERT INTO public.videos (id, video_url)
    VALUES (_id, public._jtxt(_child,'video_url'))
    ON CONFLICT (id) DO UPDATE SET video_url = EXCLUDED.video_url;
    
  ELSIF t = 'podcast' THEN
    INSERT INTO public.podcasts (id, audio_url)
    VALUES (_id, public._jtxt(_child,'audio_url'))
    ON CONFLICT (id) DO UPDATE SET audio_url = EXCLUDED.audio_url;

  ELSIF t = 'event' THEN
    INSERT INTO public.events (id, start_at)
    VALUES (_id, (_child->>'start_at')::timestamptz)
    ON CONFLICT (id) DO UPDATE SET start_at = EXCLUDED.start_at;

  ELSIF t = 'report' OR t = 'guide' THEN
    INSERT INTO public.reports (id, document_url)
    VALUES (_id, public._jtxt(_child,'document_url'))
    ON CONFLICT (id) DO UPDATE SET document_url = EXCLUDED.document_url;
    
  ELSIF t = 'tool' OR t = 'toolkits & templates' THEN
    INSERT INTO public.tools (id, document_url)
    VALUES (_id, public._jtxt(_child,'document_url'))
    ON CONFLICT (id) DO UPDATE SET document_url = EXCLUDED.document_url;
  END IF;

  RETURN _id;
END;
$$;

-- Reload and Grant
NOTIFY pgrst, 'reload schema';
GRANT EXECUTE ON FUNCTION public.create_media_item(jsonb, text, jsonb) TO postgres, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.update_media_item(uuid, jsonb, text, jsonb) TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.blogs TO postgres, anon, authenticated, service_role;
