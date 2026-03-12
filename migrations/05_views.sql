-- 05_views.sql
-- Purpose: Backward-compatible views for current app queries
-- Idempotent (uses CREATE OR REPLACE VIEW)
-- Rollback notes:
--   - DROP VIEW IF EXISTS public.v_media_public; DROP VIEW IF EXISTS public.v_media_all;

-- Helper expression to derive a canonical type from child table presence when legacy 'type' is absent
-- We’ll use it inline with COALESCE.

CREATE OR REPLACE VIEW public.v_media_all AS
SELECT
  m.id,
  m.slug,
  COALESCE(m.title, to_jsonb(m)->>'title') AS title,
  COALESCE(m.summary, to_jsonb(m)->>'summary') AS summary,
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
  -- derived/legacy type resolution
  COALESCE(
    to_jsonb(m)->>'type',
    CASE
      WHEN a.id IS NOT NULL THEN 'Article'
      WHEN v.id IS NOT NULL THEN 'Video'
      WHEN p.id IS NOT NULL THEN 'Podcast'
      WHEN r.id IS NOT NULL THEN 'Report'
      WHEN t.id IS NOT NULL THEN 'Tool'
      WHEN e.id IS NOT NULL THEN 'Event'
      ELSE NULL
    END
  ) AS type,
  -- Article fields
  a.body_html AS article_body_html,
  a.body_json AS article_body_json,
  a.byline AS article_byline,
  a.source AS article_source,
  -- General body convenience
  COALESCE(a.body_html, to_jsonb(m)->>'body', to_jsonb(m)->>'body_html') AS body_html,
  COALESCE(a.body_json, to_jsonb(m)->'body_json') AS body_json,
  -- Video fields
  v.video_url,
  v.platform,
  v.duration_sec AS video_duration_sec,
  v.transcript_url AS video_transcript_url,
  -- Podcast fields
  p.audio_url,
  p.is_video_episode,
  p.episode_no,
  p.duration_sec AS audio_duration_sec,
  p.transcript_url AS audio_transcript_url,
  -- Report fields
  r.document_url AS report_document_url,
  r.pages AS report_pages,
  r.file_size_mb AS report_file_size_mb,
  -- Tool fields
  t.document_url AS tool_document_url,
  t.requirements AS tool_requirements,
  t.file_size_mb AS tool_file_size_mb,
  -- Event fields
  e.start_at,
  e.end_at,
  e.venue,
  e.registration_url,
  e.timezone,
  -- Common filter fields used by app (pass-through if present)
  to_jsonb(m)->>'business_stage' AS business_stage,
  to_jsonb(m)->>'domain' AS domain,
  to_jsonb(m)->>'format' AS format,
  to_jsonb(m)->>'popularity' AS popularity,
  -- Legacy convenience passthroughs (if present on base)
  to_jsonb(m)->>'provider_name' AS provider_name,
  to_jsonb(m)->>'provider_logo_url' AS provider_logo_url,
  to_jsonb(m)->>'image_url' AS image_url,
  to_jsonb(m)->>'podcast_url' AS podcast_url,
  (to_jsonb(m)->>'file_size_bytes')::bigint AS file_size_bytes,
  (to_jsonb(m)->>'download_count')::bigint AS download_count,
  -- Legacy event-like fields (from prior single-table design)
  (to_jsonb(m)->>'event_date')::date AS event_date,
  to_jsonb(m)->>'event_time' AS event_time,
  to_jsonb(m)->>'event_location' AS event_location,
  to_jsonb(m)->>'event_location_details' AS event_location_details,
  to_jsonb(m)->>'event_registration_info' AS event_registration_info,
  to_jsonb(m)->'event_agenda' AS event_agenda
FROM public.media_items m
LEFT JOIN public.articles a ON a.id = m.id
LEFT JOIN public.videos v   ON v.id = m.id
LEFT JOIN public.podcasts p ON p.id = m.id
LEFT JOIN public.reports r  ON r.id = m.id
LEFT JOIN public.tools t    ON t.id = m.id
LEFT JOIN public.events e   ON e.id = m.id;

CREATE OR REPLACE VIEW public.v_media_public AS
SELECT *
FROM public.v_media_all
WHERE status = 'Published'
  AND visibility = 'Public'
  AND (published_at IS NULL OR published_at <= now());

COMMENT ON VIEW public.v_media_all IS 'Admin-friendly flattened view of media with type-specific columns left-joined.';
COMMENT ON VIEW public.v_media_public IS 'Public flattened view of media (Published + Public only).';
