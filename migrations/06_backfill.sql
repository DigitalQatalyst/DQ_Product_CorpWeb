-- 06_backfill.sql
-- Purpose: Data backfill from legacy single-table columns to new type-specific tables
-- Idempotent and safe to re-run (INSERTs guarded by NOT EXISTS)
-- Rollback notes:
--   - To rollback, DELETE FROM child tables for rows that were inserted by this backfill (based on id sets).

-- Helper: parse common duration strings to seconds
CREATE OR REPLACE FUNCTION public.parse_duration_to_seconds(s text)
RETURNS int LANGUAGE plpgsql AS $$
DECLARE
  m text;
  h int; mi int; se int;
BEGIN
  IF s IS NULL OR trim(s) = '' THEN RETURN NULL; END IF;
  -- HH:MM:SS or MM:SS
  IF s ~ '^[0-9]{1,2}:[0-9]{2}:[0-9]{2}$' THEN
    h := split_part(s,':',1)::int; mi := split_part(s,':',2)::int; se := split_part(s,':',3)::int;
    RETURN (h*3600 + mi*60 + se);
  ELSIF s ~ '^[0-9]{1,2}:[0-9]{2}$' THEN
    mi := split_part(s,':',1)::int; se := split_part(s,':',2)::int;
    RETURN (mi*60 + se);
  END IF;
  -- e.g., "1h 23m 45s", "23m", "90s"
  m := lower(s);
  h := COALESCE(NULLIF(regexp_replace(m, '.*?([0-9]+)\s*h.*', '\1'), m)::int, NULL);
  mi := COALESCE(NULLIF(regexp_replace(m, '.*?([0-9]+)\s*m.*', '\1'), m)::int, NULL);
  se := COALESCE(NULLIF(regexp_replace(m, '.*?([0-9]+)\s*s.*', '\1'), m)::int, NULL);
  IF h IS NOT NULL OR mi IS NOT NULL OR se IS NOT NULL THEN
    RETURN COALESCE(h,0)*3600 + COALESCE(mi,0)*60 + COALESCE(se,0);
  END IF;
  -- ISO8601 PT#H#M#S (basic subset)
  IF m ~ '^pt' THEN
    h := COALESCE(NULLIF(regexp_replace(m, '.*?([0-9]+)h.*', '\1'), m)::int, 0);
    mi := COALESCE(NULLIF(regexp_replace(m, '.*?([0-9]+)m.*', '\1'), m)::int, 0);
    se := COALESCE(NULLIF(regexp_replace(m, '.*?([0-9]+)s.*', '\1'), m)::int, 0);
    RETURN h*3600 + mi*60 + se;
  END IF;
  RETURN NULL;
END;$$;

-- Map legacy type strings to canonical categories
CREATE OR REPLACE FUNCTION public._canonical_type(m_row public.media_items)
RETURNS text LANGUAGE sql STABLE AS $$
  WITH t AS (
    SELECT lower(coalesce(to_jsonb(m_row)->>'type','')) AS t
  )
  SELECT CASE
    WHEN t.t IN ('video','videos') THEN 'Video'
    WHEN t.t IN ('podcast','podcasts') THEN 'Podcast'
    WHEN t.t IN ('event','events') THEN 'Event'
    WHEN t.t IN ('report','reports') THEN 'Report'
    WHEN t.t IN ('tool','tools','toolkits & templates','toolkits','templates') THEN 'Tool'
    WHEN t.t IN ('guide','guides','news','article','articles') THEN 'Article'
    ELSE NULL
  END FROM t;
$$;

-- Backfill: Articles
INSERT INTO public.articles (id, body_html, body_json, byline, source)
SELECT
  m.id,
  COALESCE(to_jsonb(m)->>'body_html', to_jsonb(m)->>'body') AS body_html,
  to_jsonb(m)->'body_json' AS body_json,
  to_jsonb(m)->>'byline' AS byline,
  to_jsonb(m)->>'source' AS source
FROM public.media_items m
WHERE public._canonical_type(m) = 'Article'
  AND NOT EXISTS (SELECT 1 FROM public.articles a WHERE a.id = m.id);

-- Backfill: Videos
INSERT INTO public.videos (id, video_url, platform, duration_sec, transcript_url)
SELECT
  m.id,
  to_jsonb(m)->>'video_url' AS video_url,
  lower(COALESCE(to_jsonb(m)->>'platform', to_jsonb(m)->>'video_platform')) AS platform,
  COALESCE(
    (to_jsonb(m)->>'duration_sec')::int,
    public.parse_duration_to_seconds(to_jsonb(m)->>'duration'),
    public.parse_duration_to_seconds(to_jsonb(m)->>'video_duration')
  ) AS duration_sec,
  COALESCE(to_jsonb(m)->>'transcript_url', to_jsonb(m)->>'video_transcript_url') AS transcript_url
FROM public.media_items m
WHERE public._canonical_type(m) = 'Video'
  AND NOT EXISTS (SELECT 1 FROM public.videos v WHERE v.id = m.id);

-- Backfill: Podcasts
INSERT INTO public.podcasts (id, audio_url, is_video_episode, episode_no, duration_sec, transcript_url)
SELECT
  m.id,
  COALESCE(to_jsonb(m)->>'audio_url', to_jsonb(m)->>'podcast_url') AS audio_url,
  COALESCE((to_jsonb(m)->>'is_video_episode')::boolean, false) AS is_video_episode,
  (to_jsonb(m)->>'episode_no')::int AS episode_no,
  COALESCE(
    (to_jsonb(m)->>'duration_sec')::int,
    public.parse_duration_to_seconds(to_jsonb(m)->>'duration'),
    public.parse_duration_to_seconds(to_jsonb(m)->>'audio_duration')
  ) AS duration_sec,
  COALESCE(to_jsonb(m)->>'transcript_url', to_jsonb(m)->>'audio_transcript_url') AS transcript_url
FROM public.media_items m
WHERE public._canonical_type(m) = 'Podcast'
  AND NOT EXISTS (SELECT 1 FROM public.podcasts p WHERE p.id = m.id);

-- Backfill: Reports
INSERT INTO public.reports (id, document_url, pages, file_size_mb)
SELECT
  m.id,
  to_jsonb(m)->>'document_url' AS document_url,
  (to_jsonb(m)->>'pages')::int AS pages,
  COALESCE((to_jsonb(m)->>'file_size_mb')::numeric, (to_jsonb(m)->>'file_size_bytes')::numeric / 1048576.0) AS file_size_mb
FROM public.media_items m
WHERE public._canonical_type(m) = 'Report'
  AND NOT EXISTS (SELECT 1 FROM public.reports r WHERE r.id = m.id);

-- Backfill: Tools
INSERT INTO public.tools (id, document_url, requirements, file_size_mb)
SELECT
  m.id,
  to_jsonb(m)->>'document_url' AS document_url,
  to_jsonb(m)->>'requirements' AS requirements,
  COALESCE((to_jsonb(m)->>'file_size_mb')::numeric, (to_jsonb(m)->>'file_size_bytes')::numeric / 1048576.0) AS file_size_mb
FROM public.media_items m
WHERE public._canonical_type(m) = 'Tool'
  AND NOT EXISTS (SELECT 1 FROM public.tools t WHERE t.id = m.id);

-- Backfill: Events
INSERT INTO public.events (id, start_at, end_at, venue, registration_url, timezone)
SELECT
  m.id,
  COALESCE((to_jsonb(m)->>'start_at')::timestamptz, (to_jsonb(m)->>'event_start_at')::timestamptz) AS start_at,
  COALESCE((to_jsonb(m)->>'end_at')::timestamptz, (to_jsonb(m)->>'event_end_at')::timestamptz) AS end_at,
  COALESCE(to_jsonb(m)->>'venue', to_jsonb(m)->>'event_location') AS venue,
  COALESCE(to_jsonb(m)->>'registration_url', to_jsonb(m)->>'event_registration_url') AS registration_url,
  to_jsonb(m)->>'timezone' AS timezone
FROM public.media_items m
WHERE public._canonical_type(m) = 'Event'
  AND NOT EXISTS (SELECT 1 FROM public.events e WHERE e.id = m.id);

-- Note: We intentionally keep legacy columns (thumbnail_url, tags, and any others) until validation, per scope.

