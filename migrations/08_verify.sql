-- 08_verify.sql
-- Purpose: Quick verification checks to validate migration results
-- Safe to re-run.
-- Rollback notes: None (read-only)

DO $$
DECLARE
  total bigint;
  a_cnt bigint; v_cnt bigint; p_cnt bigint; r_cnt bigint; t_cnt bigint; e_cnt bigint;
  dup_slugs bigint;
BEGIN
  SELECT count(*) INTO total FROM public.media_items;
  SELECT count(*) INTO a_cnt FROM public.articles;
  SELECT count(*) INTO v_cnt FROM public.videos;
  SELECT count(*) INTO p_cnt FROM public.podcasts;
  SELECT count(*) INTO r_cnt FROM public.reports;
  SELECT count(*) INTO t_cnt FROM public.tools;
  SELECT count(*) INTO e_cnt FROM public.events;

  RAISE NOTICE 'media_items total=%', total;
  RAISE NOTICE 'articles=% videos=% podcasts=% reports=% tools=% events=%', a_cnt, v_cnt, p_cnt, r_cnt, t_cnt, e_cnt;

  SELECT count(*) INTO dup_slugs
  FROM (
    SELECT slug FROM public.media_items WHERE slug IS NOT NULL GROUP BY slug HAVING count(*) > 1
  ) d;
  RAISE NOTICE 'duplicate slugs=% (should be 0)', dup_slugs;
END$$;

-- Sample rows from views (limit to avoid spam)
-- SELECT * FROM public.v_media_all LIMIT 5;
-- SELECT * FROM public.v_media_public LIMIT 5;

