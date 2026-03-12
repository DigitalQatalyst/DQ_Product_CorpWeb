-- 1. Create Tables for News and Guides
CREATE TABLE IF NOT EXISTS public.news (
    id uuid NOT NULL,
    source text,
    announcement_date date,
    CONSTRAINT news_pkey PRIMARY KEY (id),
    CONSTRAINT news_id_fkey FOREIGN KEY (id) REFERENCES public.media_items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.guides (
    id uuid NOT NULL,
    document_url text,
    file_size_mb numeric,
    CONSTRAINT guides_pkey PRIMARY KEY (id),
    CONSTRAINT guides_id_fkey FOREIGN KEY (id) REFERENCES public.media_items(id) ON DELETE CASCADE
);

-- 2. Migrate existing data (Move from Articles/Reports to new tables)
INSERT INTO public.news (id, source)
SELECT a.id, a.source FROM public.articles a JOIN public.media_items m ON m.id = a.id WHERE m.type = 'News'
ON CONFLICT (id) DO NOTHING;

DELETE FROM public.articles a USING public.media_items m WHERE m.id = a.id AND m.type = 'News';

INSERT INTO public.guides (id, document_url, file_size_mb)
SELECT r.id, r.document_url, r.file_size_mb FROM public.reports r JOIN public.media_items m ON m.id = r.id WHERE m.type = 'Guide'
ON CONFLICT (id) DO NOTHING;

DELETE FROM public.reports r USING public.media_items m WHERE m.id = r.id AND m.type = 'Guide';

-- 3. Update the Unified View to include News and Guides columns
CREATE OR REPLACE VIEW public.v_media_all AS
SELECT
  m.id, m.slug, m.title, m.summary, m.status, m.visibility, m.language,
  m.seo_title, m.seo_description, m.canonical_url, m.published_at,
  m.created_at, m.updated_at, m.thumbnail_url, m.hero_image, m.tags,
  m.category, m.featured, m.highlights, m.type,

  -- News Fields
  n.source AS news_source,
  n.announcement_date AS news_date,
  
  -- Guide Fields
  g.document_url AS guide_url,
  
  -- Flattened common fields
  COALESCE(a.body_html, b.body_html) AS body_html,
  COALESCE(a.body_json, b.body_json) AS body_json,
  COALESCE(a.byline, b.byline) AS byline,
  COALESCE(a.source, b.source, n.source) AS source,
  
  -- Ensure Thumbnail works for everything
  m.thumbnail_url as card_image,

  -- Other type fields (Videos, Podcasts, etc. assumed existing)
  v.video_url, v.platform, v.duration_sec AS video_duration_sec,
  p.audio_url, p.episode_no, p.duration_sec AS audio_duration_sec,
  e.start_at, e.venue, r.document_url AS report_url, r.pages,
  t.document_url AS tool_url, t.requirements,

  -- Unified Document URL
  COALESCE(r.document_url, g.document_url, t.document_url) AS document_url,
  COALESCE(r.file_size_mb, g.file_size_mb, t.file_size_mb) AS file_size_mb

FROM public.media_items m
LEFT JOIN public.articles a ON a.id = m.id AND m.type = 'Article'
LEFT JOIN public.blogs b ON b.id = m.id AND m.type = 'Blog'
LEFT JOIN public.news n ON n.id = m.id AND m.type = 'News'
LEFT JOIN public.videos v ON v.id = m.id
LEFT JOIN public.podcasts p ON p.id = m.id
LEFT JOIN public.events e ON e.id = m.id
LEFT JOIN public.reports r ON r.id = m.id AND m.type = 'Report'
LEFT JOIN public.guides g ON g.id = m.id AND m.type = 'Guide'
LEFT JOIN public.tools t ON t.id = m.id;

-- 4. Update the Create/Update Functions to handle News/Guides
CREATE OR REPLACE FUNCTION public.create_media_item(_base jsonb, _type text, _child jsonb)
RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
  _id uuid;
  t text := lower(coalesce(_type,''));
BEGIN
  -- Insert into Base (includes hero_image and thumbnail_url)
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

  -- Child Tables
  IF t = 'news' THEN
    INSERT INTO public.news (id, source, announcement_date)
    VALUES (_id, public._jtxt(_child,'source'), (_child->>'announcement_date')::date);
  ELSIF t = 'guide' THEN
    INSERT INTO public.guides (id, document_url, file_size_mb)
    VALUES (_id, public._jtxt(_child,'document_url'), NULLIF((_child->>'file_size_mb')::numeric, 0));
  ELSIF t = 'article' THEN
    INSERT INTO public.articles (id, body_html, body_json, byline, source, read_time)
    VALUES (_id, public._jtxt(_child,'body_html'), _child->'body_json', public._jtxt(_child,'byline'), public._jtxt(_child,'source'), NULLIF((_child->>'read_time')::int, 0));
    -- ... (Include other types as needed, or assume they are handled by previous script if run globally)
  ELSIF t = 'blog' THEN
     INSERT INTO public.blogs (id, body_html, body_json, byline, source, read_time, hero_image)
     VALUES (_id, public._jtxt(_child,'body_html'), _child->'body_json', public._jtxt(_child,'byline'), public._jtxt(_child,'source'), NULLIF((_child->>'read_time')::int, 0), public._jtxt(_base,'hero_image'));
  ELSIF t = 'report' THEN
    INSERT INTO public.reports (id, document_url, pages, file_size_mb)
    VALUES (_id, public._jtxt(_child,'document_url'), NULLIF((_child->>'pages')::int, 0), NULLIF((_child->>'file_size_mb')::numeric, 0));
  END IF;

  RETURN _id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_media_item(_id uuid, _base jsonb, _type text, _child jsonb)
RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
  t text := lower(coalesce(_type,''));
BEGIN
  -- Update Base (includes hero_image)
  UPDATE public.media_items SET
    slug = COALESCE(public._jtxt(_base,'slug'), slug),
    title = COALESCE(public._jtxt(_base,'title'), title),
    summary = COALESCE(public._jtxt(_base,'summary'), summary),
    hero_image = COALESCE(public._jtxt(_base,'hero_image'), hero_image),
    thumbnail_url = COALESCE(public._jtxt(_base,'thumbnail_url'), thumbnail_url),
    tags = COALESCE(_base->'tags', tags),
    category = COALESCE(public._jtxt(_base,'category'), category),
    updated_at = now()
  WHERE id = _id;

  IF t = 'news' THEN
    INSERT INTO public.news (id, source, announcement_date)
    VALUES (_id, public._jtxt(_child,'source'), (_child->>'announcement_date')::date)
    ON CONFLICT (id) DO UPDATE SET source = EXCLUDED.source, announcement_date = EXCLUDED.announcement_date;
  ELSIF t = 'guide' THEN
    INSERT INTO public.guides (id, document_url, file_size_mb)
    VALUES (_id, public._jtxt(_child,'document_url'), NULLIF((_child->>'file_size_mb')::numeric, 0))
    ON CONFLICT (id) DO UPDATE SET document_url = EXCLUDED.document_url;
  ELSIF t = 'article' THEN
    UPDATE public.articles SET body_html = public._jtxt(_child,'body_html') WHERE id = _id;
  END IF;
  
  RETURN _id;
END;
$$;
