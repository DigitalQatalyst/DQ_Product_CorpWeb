-- 04_rls_policies.sql
-- Purpose: Enable RLS and add policies
-- Idempotent and safe to re-run.
-- Rollback notes:
--   - ALTER TABLE ... DISABLE ROW LEVEL SECURITY; DROP POLICY ... ON ...;

-- Enable RLS on all relevant tables
ALTER TABLE IF EXISTS public.media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.taxonomies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.media_taxonomies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Utility predicates
CREATE OR REPLACE FUNCTION public._is_authenticated()
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT coalesce(auth.role(), '') IN ('authenticated','service_role')
$$;

CREATE OR REPLACE FUNCTION public._is_public_published(_id uuid)
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.media_items mi
    WHERE mi.id = _id
      AND mi.status = 'Published'
      AND mi.visibility = 'Public'
      AND (mi.published_at IS NULL OR mi.published_at <= now())
  )
$$;

-- Policies: media_items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename='media_items' AND policyname='public_read_published_public'
  ) THEN
    EXECUTE $$CREATE POLICY public_read_published_public ON public.media_items
      FOR SELECT
      USING (
        status = 'Published' AND visibility = 'Public' AND (published_at IS NULL OR published_at <= now())
      )$$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename='media_items' AND policyname='authenticated_read_all'
  ) THEN
    EXECUTE $$CREATE POLICY authenticated_read_all ON public.media_items
      FOR SELECT
      USING (public._is_authenticated())$$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename='media_items' AND policyname='authenticated_write_all'
  ) THEN
    EXECUTE $$CREATE POLICY authenticated_write_all ON public.media_items
      FOR ALL
      USING (public._is_authenticated()) WITH CHECK (public._is_authenticated())$$;
  END IF;
END$$;

-- Policies: type tables (articles, videos, podcasts, reports, tools, events)
DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY['articles','videos','podcasts','reports','tools','events']) LOOP
    -- public can select if parent is published & public
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename=t AND policyname='public_read_join_parent'
    ) THEN
      EXECUTE format('CREATE POLICY public_read_join_parent ON public.%I FOR SELECT USING (public._is_public_published(id))', t);
    END IF;
    -- authenticated can select all
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename=t AND policyname='authenticated_read_all'
    ) THEN
      EXECUTE format('CREATE POLICY authenticated_read_all ON public.%I FOR SELECT USING (public._is_authenticated())', t);
    END IF;
    -- authenticated write
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename=t AND policyname='authenticated_write_all'
    ) THEN
      EXECUTE format('CREATE POLICY authenticated_write_all ON public.%I FOR ALL USING (public._is_authenticated()) WITH CHECK (public._is_authenticated())', t);
    END IF;
  END LOOP;
END$$;

-- Policies: media_assets
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='media_assets' AND policyname='public_read_assets_if_parent_public'
  ) THEN
    EXECUTE $$CREATE POLICY public_read_assets_if_parent_public ON public.media_assets
      FOR SELECT
      USING (
        public_url IS NOT NULL AND public._is_public_published(media_id)
      )$$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='media_assets' AND policyname='authenticated_read_all'
  ) THEN
    EXECUTE $$CREATE POLICY authenticated_read_all ON public.media_assets FOR SELECT USING (public._is_authenticated())$$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='media_assets' AND policyname='authenticated_write_all'
  ) THEN
    EXECUTE $$CREATE POLICY authenticated_write_all ON public.media_assets FOR ALL USING (public._is_authenticated()) WITH CHECK (public._is_authenticated())$$;
  END IF;
END$$;

-- Policies: taxonomies (master list readable by public)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='taxonomies' AND policyname='public_read_all'
  ) THEN
    EXECUTE $$CREATE POLICY public_read_all ON public.taxonomies FOR SELECT USING (TRUE)$$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='taxonomies' AND policyname='authenticated_write_all'
  ) THEN
    EXECUTE $$CREATE POLICY authenticated_write_all ON public.taxonomies FOR ALL USING (public._is_authenticated()) WITH CHECK (public._is_authenticated())$$;
  END IF;
END$$;

-- Policies: media_taxonomies (public read only when parent is public & published)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='media_taxonomies' AND policyname='public_read_join_parent'
  ) THEN
    EXECUTE $$CREATE POLICY public_read_join_parent ON public.media_taxonomies FOR SELECT USING (public._is_public_published(media_id))$$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='media_taxonomies' AND policyname='authenticated_read_all'
  ) THEN
    EXECUTE $$CREATE POLICY authenticated_read_all ON public.media_taxonomies FOR SELECT USING (public._is_authenticated())$$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='media_taxonomies' AND policyname='authenticated_write_all'
  ) THEN
    EXECUTE $$CREATE POLICY authenticated_write_all ON public.media_taxonomies FOR ALL USING (public._is_authenticated()) WITH CHECK (public._is_authenticated())$$;
  END IF;
END$$;

-- Policies: audit_logs (no public read)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='audit_logs' AND policyname='authenticated_read_all'
  ) THEN
    EXECUTE $$CREATE POLICY authenticated_read_all ON public.audit_logs FOR SELECT USING (public._is_authenticated())$$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='audit_logs' AND policyname='authenticated_write_all'
  ) THEN
    EXECUTE $$CREATE POLICY authenticated_write_all ON public.audit_logs FOR ALL USING (public._is_authenticated()) WITH CHECK (public._is_authenticated())$$;
  END IF;
END$$;

-- Optional helper functions for publish/unpublish
CREATE OR REPLACE FUNCTION public.publish_media(_id uuid)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.media_items
    SET status='Published', published_at = COALESCE(published_at, now())
    WHERE id = _id;
END;$$;

CREATE OR REPLACE FUNCTION public.unpublish_media(_id uuid)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.media_items
    SET status='Draft'
    WHERE id = _id;
END;$$;

