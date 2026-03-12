-- Fix the missing database functions
-- This script will create all the missing functions needed for media management

-- First, let's check and fix the tags column type if needed
DO $$
BEGIN
  -- Check if tags column exists and what type it is
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'media_items' 
    AND column_name = 'tags' 
    AND data_type = 'ARRAY'
  ) THEN
    -- Convert text[] to jsonb
    RAISE NOTICE 'Converting tags column from text[] to jsonb';
    
    -- Drop dependent functions and views first
    DROP FUNCTION IF EXISTS public.get_media_item_full;
    DROP VIEW IF EXISTS public.v_media_public;
    DROP VIEW IF EXISTS public.v_media_all;
    
    -- First drop the default constraint
    ALTER TABLE public.media_items ALTER COLUMN tags DROP DEFAULT;
    
    -- Convert the column type
    ALTER TABLE public.media_items 
    ALTER COLUMN tags TYPE jsonb 
    USING CASE 
      WHEN tags IS NULL THEN '[]'::jsonb
      ELSE array_to_json(tags)::jsonb
    END;
    
    -- Add the new default
    ALTER TABLE public.media_items ALTER COLUMN tags SET DEFAULT '[]'::jsonb;
    
    -- Recreate the views
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
      m.tags,
      -- Use explicit type column, with fallback to child table inference
      COALESCE(m.type, 
        CASE
          WHEN a.id IS NOT NULL THEN 'Article'
          WHEN v.id IS NOT NULL THEN 'Video'
          WHEN p.id IS NOT NULL THEN 'Podcast'
          WHEN r.id IS NOT NULL THEN 'Report'
          WHEN t.id IS NOT NULL THEN 'Tool'
          WHEN e.id IS NOT NULL THEN 'Event'
          ELSE 'Article'
        END
      ) AS type,
      -- Article fields only from articles
      a.body_html AS article_body_html,
      a.body_json AS article_body_json,
      a.byline AS article_byline,
      a.source AS article_source,
      -- Convenience mirrored body fields (no legacy fallback)
      a.body_html AS body_html,
      a.body_json AS body_json,
      -- Video
      v.video_url,
      v.platform,
      v.duration_sec AS video_duration_sec,
      v.transcript_url AS video_transcript_url,
      -- Podcast
      p.audio_url,
      p.is_video_episode,
      p.episode_no,
      p.duration_sec AS audio_duration_sec,
      p.transcript_url AS audio_transcript_url,
      -- Report
      r.document_url AS report_document_url,
      r.pages AS report_pages,
      r.file_size_mb AS report_file_size_mb,
      -- Tool
      t.document_url AS tool_document_url,
      t.requirements AS tool_requirements,
      t.file_size_mb AS tool_file_size_mb,
      -- Event (derived fallbacks replacing legacy event_* columns)
      e.start_at,
      e.end_at,
      e.venue,
      e.registration_url,
      e.timezone,
      -- Derived legacy-like fields for compatibility
      (e.start_at)::date AS event_date,
      to_char(e.start_at, 'FMHH24:MI') ||
        CASE WHEN e.end_at IS NOT NULL THEN ' - ' || to_char(e.end_at, 'FMHH24:MI') ELSE '' END AS event_time,
      e.venue AS event_location,
      NULL::text AS event_location_details,
      NULL::text AS event_registration_info,
      NULL::jsonb AS event_agenda,
      -- Optional legacy provider passthroughs preserved if still in base (else null)
      NULL::text AS provider_name,
      NULL::text AS provider_logo_url,
      NULL::text AS image_url,
      NULL::bigint AS file_size_bytes,
      NULL::bigint AS download_count
    FROM public.media_items m
    LEFT JOIN public.articles a ON a.id = m.id
    LEFT JOIN public.videos   v ON v.id = m.id
    LEFT JOIN public.podcasts p ON p.id = m.id
    LEFT JOIN public.reports  r ON r.id = m.id
    LEFT JOIN public.tools    t ON t.id = m.id
    LEFT JOIN public.events   e ON e.id = m.id;

    CREATE OR REPLACE VIEW public.v_media_public AS
    SELECT *
    FROM public.v_media_all
    WHERE status = 'Published'
      AND visibility = 'Public'
      AND (published_at IS NULL OR published_at <= now());
    
  ELSIF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'media_items' 
    AND column_name = 'tags'
  ) THEN
    -- Add tags column if it doesn't exist
    ALTER TABLE public.media_items ADD COLUMN tags jsonb DEFAULT '[]'::jsonb;
  END IF;
  
  -- Add type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'media_items' 
    AND column_name = 'type'
  ) THEN
    ALTER TABLE public.media_items ADD COLUMN type text DEFAULT 'Article';
  END IF;
END$$;

-- Drop the existing functions (if they exist with wrong signature)
DROP FUNCTION IF EXISTS public.update_media_item;
DROP FUNCTION IF EXISTS public.create_media_item;
DROP FUNCTION IF EXISTS public.get_media_item_full;

-- Create normalize_slug function (if not exists)
CREATE OR REPLACE FUNCTION public.normalize_slug(input text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT trim(both '-' FROM regexp_replace(lower(coalesce($1,'')), '[^a-z0-9]+', '-', 'g'))
$$;

-- Create helper to coerce jsonb->>text to null when missing (if not exists)
CREATE OR REPLACE FUNCTION public._jtxt(j jsonb, key text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT NULLIF(j->>key, '')
$$;

-- Create media item: inserts base and one child (if provided), returns id
CREATE OR REPLACE FUNCTION public.create_media_item(_base jsonb, _type text, _child jsonb)
RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
  _id uuid;
  t text := lower(coalesce(_type,''));
BEGIN
  INSERT INTO public.media_items (
    slug, title, summary, type, status, visibility, language,
    seo_title, seo_description, canonical_url, published_at,
    thumbnail_url, tags
  ) VALUES (
    public.normalize_slug(public._jtxt(_base,'slug')),
    COALESCE(public._jtxt(_base,'title'), ''),
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
    COALESCE(_base->'tags', '[]'::jsonb)
  ) RETURNING id INTO _id;

  -- Insert child based on type
  IF t = 'article' OR t = 'blog' OR t = 'news' OR t = 'guide' THEN
    INSERT INTO public.articles (id, body_html, body_json, byline, source)
    VALUES (
      _id,
      public._jtxt(_child,'body_html'),
      _child->'body_json',
      public._jtxt(_child,'byline'),
      public._jtxt(_child,'source')
    );
  ELSIF t = 'video' OR t = 'videos' THEN
    INSERT INTO public.videos (id, video_url, platform, duration_sec, transcript_url)
    VALUES (
      _id,
      public._jtxt(_child,'video_url'),
      lower(public._jtxt(_child,'platform')),
      NULLIF((_child->>'duration_sec')::int, 0),
      public._jtxt(_child,'transcript_url')
    );
  ELSIF t = 'podcast' OR t='podcasts' THEN
    INSERT INTO public.podcasts (id, audio_url, is_video_episode, episode_no, duration_sec, transcript_url)
    VALUES (
      _id,
      public._jtxt(_child,'audio_url'),
      COALESCE((_child->>'is_video_episode')::boolean, false),
      NULLIF((_child->>'episode_no')::int, 0),
      NULLIF((_child->>'duration_sec')::int, 0),
      public._jtxt(_child,'transcript_url')
    );
  ELSIF t = 'report' OR t='reports' THEN
    INSERT INTO public.reports (id, document_url, pages, file_size_mb)
    VALUES (
      _id,
      public._jtxt(_child,'document_url'),
      NULLIF((_child->>'pages')::int, 0),
      NULLIF((_child->>'file_size_mb')::numeric, 0)
    );
  ELSIF t = 'tool' OR t='tools' OR t='toolkit' OR t='toolkits' THEN
    INSERT INTO public.tools (id, document_url, requirements, file_size_mb)
    VALUES (
      _id,
      public._jtxt(_child,'document_url'),
      public._jtxt(_child,'requirements'),
      NULLIF((_child->>'file_size_mb')::numeric, 0)
    );
  ELSIF t = 'event' OR t='events' THEN
    INSERT INTO public.events (id, start_at, end_at, venue, registration_url, timezone)
    VALUES (
      _id,
      (_child->>'start_at')::timestamptz,
      (_child->>'end_at')::timestamptz,
      public._jtxt(_child,'venue'),
      public._jtxt(_child,'registration_url'),
      public._jtxt(_child,'timezone')
    );
  END IF;

  RETURN _id;
END;
$$;

-- Recreate the update_media_item function with correct signature
CREATE OR REPLACE FUNCTION public.update_media_item(_id uuid, _base jsonb, _type text, _child jsonb)
RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
  t text := lower(coalesce(_type,''));
BEGIN
  UPDATE public.media_items SET
    slug = COALESCE(public.normalize_slug(public._jtxt(_base,'slug')), slug),
    title = COALESCE(public._jtxt(_base,'title'), title),
    summary = COALESCE(public._jtxt(_base,'summary'), summary),
    type = COALESCE(_type, type),
    status = COALESCE(public._jtxt(_base,'status'), status),
    visibility = COALESCE(public._jtxt(_base,'visibility'), visibility),
    language = COALESCE(public._jtxt(_base,'language'), language),
    seo_title = COALESCE(public._jtxt(_base,'seo_title'), seo_title),
    seo_description = COALESCE(public._jtxt(_base,'seo_description'), seo_description),
    canonical_url = COALESCE(public._jtxt(_base,'canonical_url'), canonical_url),
    published_at = COALESCE((_base->>'published_at')::timestamptz, published_at),
    thumbnail_url = COALESCE(public._jtxt(_base,'thumbnail_url'), thumbnail_url),
    tags = COALESCE(_base->'tags', tags)
  WHERE id = _id;

  IF t = 'article' OR t = 'blog' OR t='news' OR t='guide' THEN
    INSERT INTO public.articles (id, body_html, body_json, byline, source)
    VALUES (
      _id,
      public._jtxt(_child,'body_html'),
      _child->'body_json',
      public._jtxt(_child,'byline'),
      public._jtxt(_child,'source')
    )
    ON CONFLICT (id) DO UPDATE SET
      body_html = EXCLUDED.body_html,
      body_json = EXCLUDED.body_json,
      byline = EXCLUDED.byline,
      source = EXCLUDED.source;
  ELSIF t = 'video' OR t='videos' THEN
    INSERT INTO public.videos (id, video_url, platform, duration_sec, transcript_url)
    VALUES (
      _id,
      public._jtxt(_child,'video_url'),
      lower(public._jtxt(_child,'platform')),
      NULLIF((_child->>'duration_sec')::int, 0),
      public._jtxt(_child,'transcript_url')
    )
    ON CONFLICT (id) DO UPDATE SET
      video_url = EXCLUDED.video_url,
      platform = EXCLUDED.platform,
      duration_sec = EXCLUDED.duration_sec,
      transcript_url = EXCLUDED.transcript_url;
  ELSIF t = 'podcast' OR t='podcasts' THEN
    INSERT INTO public.podcasts (id, audio_url, is_video_episode, episode_no, duration_sec, transcript_url)
    VALUES (
      _id,
      public._jtxt(_child,'audio_url'),
      COALESCE((_child->>'is_video_episode')::boolean, false),
      NULLIF((_child->>'episode_no')::int, 0),
      NULLIF((_child->>'duration_sec')::int, 0),
      public._jtxt(_child,'transcript_url')
    )
    ON CONFLICT (id) DO UPDATE SET
      audio_url = EXCLUDED.audio_url,
      is_video_episode = EXCLUDED.is_video_episode,
      episode_no = EXCLUDED.episode_no,
      duration_sec = EXCLUDED.duration_sec,
      transcript_url = EXCLUDED.transcript_url;
  ELSIF t = 'report' OR t='reports' THEN
    INSERT INTO public.reports (id, document_url, pages, file_size_mb)
    VALUES (
      _id,
      public._jtxt(_child,'document_url'),
      NULLIF((_child->>'pages')::int, 0),
      NULLIF((_child->>'file_size_mb')::numeric, 0)
    )
    ON CONFLICT (id) DO UPDATE SET
      document_url = EXCLUDED.document_url,
      pages = EXCLUDED.pages,
      file_size_mb = EXCLUDED.file_size_mb;
  ELSIF t = 'tool' OR t='tools' OR t='toolkit' OR t='toolkits' THEN
    INSERT INTO public.tools (id, document_url, requirements, file_size_mb)
    VALUES (
      _id,
      public._jtxt(_child,'document_url'),
      public._jtxt(_child,'requirements'),
      NULLIF((_child->>'file_size_mb')::numeric, 0)
    )
    ON CONFLICT (id) DO UPDATE SET
      document_url = EXCLUDED.document_url,
      requirements = EXCLUDED.requirements,
      file_size_mb = EXCLUDED.file_size_mb;
  ELSIF t = 'event' OR t='events' THEN
    INSERT INTO public.events (id, start_at, end_at, venue, registration_url, timezone)
    VALUES (
      _id,
      (_child->>'start_at')::timestamptz,
      (_child->>'end_at')::timestamptz,
      public._jtxt(_child,'venue'),
      public._jtxt(_child,'registration_url'),
      public._jtxt(_child,'timezone')
    )
    ON CONFLICT (id) DO UPDATE SET
      start_at = EXCLUDED.start_at,
      end_at = EXCLUDED.end_at,
      venue = EXCLUDED.venue,
      registration_url = EXCLUDED.registration_url,
      timezone = EXCLUDED.timezone;
  END IF;

  RETURN _id;
END;
$$;

-- Helper: get flattened item
CREATE OR REPLACE FUNCTION public.get_media_item_full(_id uuid)
RETURNS SETOF public.v_media_all LANGUAGE sql STABLE AS $$
  SELECT * FROM public.v_media_all WHERE id = _id
$$;