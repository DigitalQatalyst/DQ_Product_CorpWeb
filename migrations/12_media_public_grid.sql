-- 12_media_public_grid.sql
-- Purpose: Create a lean, read‑optimized grid view and indexes to speed up
-- Knowledge Hub catalog queries. Implements fields needed for grid cards only
-- and adds keyset-friendly ordering support.

-- Ensure trigram extension is available for optional title search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Read-optimized view for grid/listing (Published + Public only)
CREATE OR REPLACE VIEW public.v_media_public_grid AS
SELECT
  id,
  title,
  -- Prefer explicit summary; fallback to stripped body_html/article_body_html snippet
  COALESCE(
    NULLIF(summary, ''),
    NULLIF(
      LEFT(
        REGEXP_REPLACE(COALESCE(body_html, article_body_html, ''), '<[^>]*>', '', 'g'),
        240
      ),
      ''
    )
  ) AS summary,
  thumbnail_url,
  type,
  tags,
  published_at
FROM public.v_media_public
WHERE status = 'Published'
  AND visibility = 'Public';

COMMENT ON VIEW public.v_media_public_grid IS 'Lean grid view for Knowledge Hub: id, title, summary, thumbnail_url, type, tags, published_at (Published + Public only).';

-- Keyset pagination support: composite index on (published_at DESC, id DESC)
-- against the base table with a partial predicate for published/public rows.
-- Note: Indexes are created on the base table backing v_media_public (media_items).
CREATE INDEX IF NOT EXISTS idx_media_items_pub_grid_keyset
  ON public.media_items (published_at DESC, id DESC)
  WHERE status = 'Published' AND visibility = 'Public' AND published_at IS NOT NULL;

-- Tags filtering using GIN
CREATE INDEX IF NOT EXISTS idx_media_items_tags_gin
  ON public.media_items USING GIN (tags);

-- Optional trigram index for faster ilike/title search
CREATE INDEX IF NOT EXISTS idx_media_items_title_trgm
  ON public.media_items USING GIN (title gin_trgm_ops);
