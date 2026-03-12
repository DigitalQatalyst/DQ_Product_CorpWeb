-- 03_assets_taxonomy.sql
-- Purpose: Assets (many-to-one), taxonomy tables, and optional audit logs
-- Idempotent and safe to re-run.
-- Rollback notes:
--   - DROP TABLE public.media_assets, public.media_taxonomies, public.taxonomies, public.audit_logs (ensure backups first).

-- Assets (many-to-one)
CREATE TABLE IF NOT EXISTS public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id uuid NOT NULL REFERENCES public.media_items(id) ON DELETE CASCADE,
  kind text NOT NULL,
  storage_path text NOT NULL,
  public_url text,
  mime text,
  size_bytes bigint,
  width int,
  height int,
  duration_sec int,
  checksum text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Asset checks (NOT VALID)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'media_assets_kind_check'
  ) THEN
    EXECUTE $$ALTER TABLE public.media_assets
      ADD CONSTRAINT media_assets_kind_check CHECK (
        kind IN ('Image','Video','Audio','Doc')
      ) NOT VALID$$;
  END IF;
END$$;

-- Indexes for assets
CREATE INDEX IF NOT EXISTS idx_media_assets_media_id ON public.media_assets(media_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_kind ON public.media_assets(kind);
CREATE INDEX IF NOT EXISTS idx_media_assets_public_url_not_null ON public.media_assets(public_url) WHERE public_url IS NOT NULL;

-- Taxonomy master table
CREATE TABLE IF NOT EXISTS public.taxonomies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  label text NOT NULL,
  key text NOT NULL
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'taxonomies_kind_check'
  ) THEN
    EXECUTE $$ALTER TABLE public.taxonomies
      ADD CONSTRAINT taxonomies_kind_check CHECK (
        kind IN ('Domain','Stage','Format','Tag')
      ) NOT VALID$$;
  END IF;
END$$;

-- Unique per kind+key
CREATE UNIQUE INDEX IF NOT EXISTS uq_taxonomies_kind_key ON public.taxonomies(kind, key);
CREATE INDEX IF NOT EXISTS idx_taxonomies_kind ON public.taxonomies(kind);

-- Junction table media <-> taxonomy
CREATE TABLE IF NOT EXISTS public.media_taxonomies (
  media_id uuid NOT NULL REFERENCES public.media_items(id) ON DELETE CASCADE,
  taxonomy_id uuid NOT NULL REFERENCES public.taxonomies(id) ON DELETE CASCADE,
  PRIMARY KEY (media_id, taxonomy_id)
);

-- Optional: audit logs (lightweight)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id bigserial PRIMARY KEY,
  action text NOT NULL,
  actor_id uuid,
  at timestamptz NOT NULL DEFAULT now(),
  entity text NOT NULL,
  entity_id uuid,
  diff jsonb
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_at ON public.audit_logs(entity_id, at DESC);

COMMENT ON TABLE public.media_assets IS 'Assets linked to media_items, with Azure Blob storage paths and public URLs.';
COMMENT ON TABLE public.taxonomies IS 'Taxonomy master list. Unique per (kind, key).';
COMMENT ON TABLE public.media_taxonomies IS 'Many-to-many between media_items and taxonomies.';
COMMENT ON TABLE public.audit_logs IS 'Optional audit log of changes.';

