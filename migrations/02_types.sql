-- 02_types.sql
-- Purpose: Type-specific tables with 1:1 relationship to media_items.id
-- Idempotent and safe to re-run.
-- Rollback notes:
--   - DROP TABLE ... CASCADE for each type-specific table after ensuring data migration is reversed if needed.

-- Articles
CREATE TABLE IF NOT EXISTS public.articles (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  body_html text,
  body_json jsonb,
  byline text,
  source text
);

-- Videos
CREATE TABLE IF NOT EXISTS public.videos (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  video_url text,
  platform text,
  duration_sec integer,
  transcript_url text
);

-- Enforce platform allowed values (NOT VALID for idempotence)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'videos_platform_check'
  ) THEN
    EXECUTE "ALTER TABLE public.videos
      ADD CONSTRAINT videos_platform_check CHECK (
        platform IS NULL OR platform IN ('youtube','vimeo','file','other')
      ) NOT VALID";
  END IF;
END$$;

-- Podcasts
CREATE TABLE IF NOT EXISTS public.podcasts (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  audio_url text,
  is_video_episode boolean DEFAULT false,
  episode_no integer,
  duration_sec integer,
  transcript_url text
);

-- Reports
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  document_url text,
  pages integer,
  file_size_mb numeric
);

-- Tools
CREATE TABLE IF NOT EXISTS public.tools (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  document_url text,
  requirements text,
  file_size_mb numeric
);

-- Events
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY REFERENCES public.media_items(id) ON DELETE CASCADE,
  start_at timestamptz,
  end_at timestamptz,
  venue text,
  registration_url text,
  timezone text
);

-- Validate end_at > start_at (NOT VALID)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'events_time_order_check'
  ) THEN
    EXECUTE $$ALTER TABLE public.events
      ADD CONSTRAINT events_time_order_check CHECK (
        end_at IS NULL OR start_at IS NULL OR end_at > start_at
      ) NOT VALID$$;
  END IF;
END$$;

-- Helpful comments
COMMENT ON TABLE public.articles IS 'Article-specific fields. 1:1 with media_items via id.';
COMMENT ON TABLE public.videos IS 'Video-specific fields. 1:1 with media_items via id.';
COMMENT ON TABLE public.podcasts IS 'Podcast-specific fields. 1:1 with media_items via id.';
COMMENT ON TABLE public.reports IS 'Report-specific fields. 1:1 with media_items via id.';
COMMENT ON TABLE public.tools IS 'Tool-specific fields. 1:1 with media_items via id.';
COMMENT ON TABLE public.events IS 'Event-specific fields. 1:1 with media_items via id.';

