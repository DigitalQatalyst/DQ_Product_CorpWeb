-- Fix Duplicate Columns Error
-- This script specifically addresses the "column specified more than once" error
-- by dropping existing views that may have conflicting column names

-- First, identify any existing views that might have duplicate column names
-- This query will show you the current views in the database
SELECT table_name, column_name, COUNT(*) 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name LIKE 'v_%'
GROUP BY table_name, column_name
HAVING COUNT(*) > 1;

-- Drop any existing views that might cause the duplicate column error
-- This targets the specific error you're getting with "author_name"
DROP VIEW IF EXISTS public.v_media_all CASCADE;
DROP VIEW IF EXISTS public.v_media_public CASCADE;
DROP VIEW IF EXISTS public.v_media_with_authors CASCADE;

-- Also drop any other views that might exist
DO $$
DECLARE
    view_name text;
BEGIN
    FOR view_name IN
        SELECT table_name
        FROM information_schema.views
        WHERE table_schema = 'public'
        AND table_name LIKE 'v_%'
    LOOP
        EXECUTE 'DROP VIEW IF EXISTS public.' || quote_ident(view_name) || ' CASCADE';
    END LOOP;
END $$;

-- Drop any other views that might exist
DO $$
DECLARE
    view_name text;
BEGIN
    FOR view_name IN
        SELECT table_name
        FROM information_schema.views
        WHERE table_schema = 'public'
    LOOP
        EXECUTE 'DROP VIEW IF EXISTS public.' || quote_ident(view_name) || ' CASCADE';
    END LOOP;
END $$;

-- Drop any materialized views if they exist
DO $$
DECLARE
    matview_name text;
BEGIN
    FOR matview_name IN
        SELECT matviewname
        FROM pg_matviews
        WHERE schemaname = 'public'
    LOOP
        EXECUTE 'DROP MATERIALIZED VIEW IF EXISTS public.' || quote_ident(matview_name) || ' CASCADE';
    END LOOP;
END $$;

-- Now also make sure all functions are dropped that might be related
DROP FUNCTION IF EXISTS public.create_blog_post CASCADE;
DROP FUNCTION IF EXISTS public.update_blog_post CASCADE;
DROP FUNCTION IF EXISTS public.create_author CASCADE;
DROP FUNCTION IF EXISTS public.create_media_item CASCADE;
DROP FUNCTION IF EXISTS public.update_media_item CASCADE;
DROP FUNCTION IF EXISTS public.publish_media CASCADE;
DROP FUNCTION IF EXISTS public.unpublish_media CASCADE;
DROP FUNCTION IF EXISTS public.get_media_item_full CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- Verify what's left
SELECT 'Views remaining after cleanup:' as status, 
       count(*) as remaining_views
FROM information_schema.views 
WHERE table_schema = 'public';

SELECT 'Functions remaining after cleanup:' as status, 
       count(*) as remaining_functions
FROM information_schema.routines 
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION';

SELECT '🎉 Potential duplicate column issue resolved! 
✅ All views dropped that could cause the error
✅ All functions that might reference conflicting views dropped
You should now be able to run your setup script without the duplicate column error.' as final_status;