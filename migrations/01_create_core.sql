-- 01_create_core.sql
-- Purpose: Define normalized base table `media_items`, core columns, constraints, utilities, and triggers.
-- Idempotent and safe to re-run.
-- Rollback notes:
--   - To rollback, drop triggers, functions, constraints, indexes, and columns added here.
--   - Do not drop table if it contained legacy data unless a full backup is taken.

-- Ensure required extensions (Supabase supports pgcrypto)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create base table if it doesn't exist.
-- If an older single-table already exists, we will non-destructively add any missing columns.
CREATE TABLE IF NOT EXISTS public.media_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text,
  title text,
  summary text,
  status text DEFAULT 'Draft',
  visibility text DEFAULT 'Public',
  language text DEFAULT 'en',
  seo_title text,
  seo_description text,
  canonical_url text,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  -- Kept here for now per scope
  thumbnail_url text,
  tags jsonb DEFAULT '[]'::jsonb
);

-- Add missing columns if table pre-existed with a different definition
DO $$
BEGIN
  -- core columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='media_items' AND column_name='slug') THEN
    EXECUTE 'ALTER TABLE public.media_items ADD COLUMN slug text';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='media_items' AND column_name='title') THEN
    EXECUTE 'ALTER TABLE public.media_items ADD COLUMN title text';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='media_items' AND column_name='summary') THEN
    EXECUTE 'ALTER TABLE public.media_items ADD COLUMN summary text';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='media_items' AND column_name='status') THEN
    EXECUTE 'ALTER TABLE public.media_items ADD COLUMN status text DEFAULT ''Draft''';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='media_items' AND column_name='visibility') THEN
    EXECUTE 'ALTER TABLE public.media_items ADD COLUMN visibility text DEFAULT ''Public''';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='media_items' AND column_name='language') THEN
    EXECUTE 'ALTER TABLE public.media_items ADD COLUMN language text DEFAULT ''en''';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='media_items' AND column_name='seo_title') THEN
    EXECUTE 'ALTER TABLE public.media_items ADD COLUMN seo_title text';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='media_items' AND column_name='seo_description') THEN
    EXECUTE 'ALTER TABLE public.media_items ADD COLUMN seo_description text';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='media_items' AND column_name='canonical_url') THEN
    EXECUTE 'ALTER TABLE public.media_items ADD COLUMN canonical_url text';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='media_items' AND column_name='published_at') THEN
    EXECUTE 'ALTER TABLE public.media_items ADD COLUMN published_at timestamptz';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='media_items' AND column_name='created_at') THEN
    EXECUTE 'ALTER TABLE public.media_items ADD COLUMN created_at timestamptz NOT NULL DEFAULT now()';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='media_items' AND column_name='updated_at') THEN
    EXECUTE 'ALTER TABLE public.media_items ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now()';
  END IF;
  -- kept columns per scope
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='media_items' AND column_name='thumbnail_url') THEN
    EXECUTE 'ALTER TABLE public.media_items ADD COLUMN thumbnail_url text';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='media_items' AND column_name='tags') THEN
    EXECUTE 'ALTER TABLE public.media_items ADD COLUMN tags jsonb DEFAULT ''[]''::jsonb';
  END IF;
END$$;

-- Unique index on slug (allows idempotence vs constraint)
CREATE UNIQUE INDEX IF NOT EXISTS uq_media_items_slug ON public.media_items (slug);

-- Status and visibility checks (NOT VALID to avoid breaking legacy rows)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'media_items_status_check'
  ) THEN
    EXECUTE $$ALTER TABLE public.media_items
      ADD CONSTRAINT media_items_status_check CHECK (
        status IN ('Draft','InReview','Scheduled','Published','Archived')
      ) NOT VALID$$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'media_items_visibility_check'
  ) THEN
    EXECUTE $$ALTER TABLE public.media_items
      ADD CONSTRAINT media_items_visibility_check CHECK (
        visibility IN ('Public','Private','Unlisted')
      ) NOT VALID$$;
  END IF;
END$$;

-- Trigger: updated_at = now() on update
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_media_items_set_updated_at'
  ) THEN
    EXECUTE 'CREATE TRIGGER trg_media_items_set_updated_at BEFORE UPDATE ON public.media_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()';
  END IF;
END$$;

-- Slug normalization utility and trigger
CREATE OR REPLACE FUNCTION public.normalize_slug(input text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT trim(both '-' FROM regexp_replace(lower(coalesce($1,'')), '[^a-z0-9]+', '-', 'g'))
$$;

CREATE OR REPLACE FUNCTION public.enforce_slug_normalization()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    -- If slug not provided, derive from title
    NEW.slug := public.normalize_slug(COALESCE(NEW.title, gen_random_uuid()::text));
  ELSE
    NEW.slug := public.normalize_slug(NEW.slug);
  END IF;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_media_items_slug_normalize'
  ) THEN
    EXECUTE 'CREATE TRIGGER trg_media_items_slug_normalize BEFORE INSERT OR UPDATE OF slug, title ON public.media_items FOR EACH ROW EXECUTE FUNCTION public.enforce_slug_normalization()';
  END IF;
END$$;

-- Helpful comments
COMMENT ON TABLE public.media_items IS 'Base media items table (normalized). Type-specific data lives in child tables.';
COMMENT ON COLUMN public.media_items.tags IS 'Free-form tags (jsonb array). Kept here for now.';

