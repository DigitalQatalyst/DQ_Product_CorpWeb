-- 07_indexes.sql
-- Purpose: Additional performance indexes supporting common queries and views
-- Idempotent and safe to re-run.
-- Rollback notes:
--   - DROP INDEX IF EXISTS ... for each created index.

-- Ordering for consumers
CREATE INDEX IF NOT EXISTS idx_media_items_published_at_desc ON public.media_items (published_at DESC);

-- GIN on tags for tag filters
CREATE INDEX IF NOT EXISTS idx_media_items_tags_gin ON public.media_items USING GIN (tags);

-- Foreign key helper indexes
CREATE INDEX IF NOT EXISTS idx_media_taxonomies_taxonomy_id ON public.media_taxonomies (taxonomy_id);

-- Minor helpers
CREATE INDEX IF NOT EXISTS idx_events_start_at ON public.events(start_at);
CREATE INDEX IF NOT EXISTS idx_events_end_at ON public.events(end_at);

