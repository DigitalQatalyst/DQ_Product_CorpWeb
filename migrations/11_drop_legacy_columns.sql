-- 11_drop_legacy_columns.sql
-- Purpose: Safely drop legacy columns from media_items after normalization and backfill
-- Idempotent and safe to re-run. Aborts if prechecks fail.
-- Rollback: Re-adding dropped columns will lose original values unless restored from backup. Ensure backups exist.

DO $$
DECLARE
  missing_videos bigint := 0;
  missing_podcasts bigint := 0;
  missing_articles bigint := 0;
  missing_reports bigint := 0;
  missing_tools bigint := 0;
  missing_events bigint := 0;
BEGIN
  -- Only run prechecks if legacy 'type' column still exists
  IF EXISTS (
     SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='media_items' AND column_name='type'
  ) THEN
    SELECT count(*) INTO missing_articles FROM public.media_items m WHERE lower(m.type) IN ('article','news','guide') AND NOT EXISTS (SELECT 1 FROM public.articles a WHERE a.id = m.id);
    SELECT count(*) INTO missing_videos FROM public.media_items m WHERE lower(m.type) IN ('video','videos') AND NOT EXISTS (SELECT 1 FROM public.videos v WHERE v.id = m.id);
    SELECT count(*) INTO missing_podcasts FROM public.media_items m WHERE lower(m.type) IN ('podcast','podcasts') AND NOT EXISTS (SELECT 1 FROM public.podcasts p WHERE p.id = m.id);
    SELECT count(*) INTO missing_reports FROM public.media_items m WHERE lower(m.type) IN ('report','reports') AND NOT EXISTS (SELECT 1 FROM public.reports r WHERE r.id = m.id);
    SELECT count(*) INTO missing_tools FROM public.media_items m WHERE lower(m.type) IN ('tool','tools','toolkit','toolkits') AND NOT EXISTS (SELECT 1 FROM public.tools t WHERE t.id = m.id);
    SELECT count(*) INTO missing_events FROM public.media_items m WHERE lower(m.type) IN ('event','events') AND NOT EXISTS (SELECT 1 FROM public.events e WHERE e.id = m.id);

    IF (missing_articles + missing_videos + missing_podcasts + missing_reports + missing_tools + missing_events) > 0 THEN
      RAISE EXCEPTION 'Refusing to drop legacy columns: missing child rows (articles=% videos=% podcasts=% reports=% tools=% events=%). Re-run backfill (06_backfill.sql) and fix before retrying.',
        missing_articles, missing_videos, missing_podcasts, missing_reports, missing_tools, missing_events;
    END IF;
  END IF;
END$$;

-- With views updated (10_update_views_no_legacy.sql), drop legacy columns if present
ALTER TABLE public.media_items
  DROP COLUMN IF EXISTS body,
  DROP COLUMN IF EXISTS body_html,
  DROP COLUMN IF EXISTS body_json,
  DROP COLUMN IF EXISTS type,
  DROP COLUMN IF EXISTS category,
  DROP COLUMN IF EXISTS video_url,
  DROP COLUMN IF EXISTS podcast_url,
  DROP COLUMN IF EXISTS document_url,
  DROP COLUMN IF EXISTS duration_sec,
  DROP COLUMN IF EXISTS file_size_bytes,
  DROP COLUMN IF EXISTS event_date,
  DROP COLUMN IF EXISTS event_time,
  DROP COLUMN IF EXISTS event_location,
  DROP COLUMN IF EXISTS event_location_details,
  DROP COLUMN IF EXISTS event_registration_info,
  DROP COLUMN IF EXISTS event_agenda;

COMMENT ON TABLE public.media_items IS 'Base media items table (normalized). Legacy columns have been removed.';

