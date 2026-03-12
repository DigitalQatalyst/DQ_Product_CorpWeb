-- 10_update_views_no_legacy.sql
-- Purpose: Replace compatibility views to depend only on normalized child tables (no legacy base columns)
-- Idempotent and safe to re-run.
-- Rollback: Recreate previous view definitions if needed.

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
  -- Type inference purely from child tables
  CASE
    WHEN a.id IS NOT NULL THEN 'Article'
    WHEN v.id IS NOT NULL THEN 'Video'
    WHEN p.id IS NOT NULL THEN 'Podcast'
    WHEN r.id IS NOT NULL THEN 'Report'
    WHEN t.id IS NOT NULL THEN 'Tool'
    WHEN e.id IS NOT NULL THEN 'Event'
    ELSE NULL
  END AS type,
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

COMMENT ON VIEW public.v_media_all IS 'Flattened view relying only on normalized child tables (no legacy columns).';
COMMENT ON VIEW public.v_media_public IS 'Public flattened view (Published + Public only).';

