-- ⚠️ WARNING: This will DELETE ALL TABLES in your database
-- ⚠️ Make sure you have a backup before running this!
-- ⚠️ This action is IRREVERSIBLE

-- Drop all views first (they depend on tables)
DROP VIEW IF EXISTS public.v_media_public CASCADE;
DROP VIEW IF EXISTS public.v_media_all CASCADE;
DROP VIEW IF EXISTS public.v_blogs_with_authors CASCADE;

-- Drop all functions with all possible signatures
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all functions in public schema
    FOR r IN 
        SELECT 'DROP FUNCTION IF EXISTS ' || ns.nspname || '.' || proname || '(' || oidvectortypes(proargtypes) || ') CASCADE;' as drop_statement
        FROM pg_proc 
        INNER JOIN pg_namespace ns ON (pg_proc.pronamespace = ns.oid)
        WHERE ns.nspname = 'public'
    LOOP
        EXECUTE r.drop_statement;
    END LOOP;
END $$;

-- Drop all tables (in correct order to handle foreign keys)
DROP TABLE IF EXISTS public.content_submissions CASCADE;
DROP TABLE IF EXISTS public.media_taxonomies CASCADE;
DROP TABLE IF EXISTS public.taxonomies CASCADE;
DROP TABLE IF EXISTS public.media_assets CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.author_profiles CASCADE;

-- Drop type-specific tables
DROP TABLE IF EXISTS public.blogs CASCADE;
DROP TABLE IF EXISTS public.articles CASCADE;
DROP TABLE IF EXISTS public.videos CASCADE;
DROP TABLE IF EXISTS public.podcasts CASCADE;
DROP TABLE IF EXISTS public.reports CASCADE;
DROP TABLE IF EXISTS public.tools CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.news CASCADE;
DROP TABLE IF EXISTS public.guides CASCADE;

-- Drop the main media_items table
DROP TABLE IF EXISTS public.media_items CASCADE;

-- Drop the authors table
DROP TABLE IF EXISTS public.authors CASCADE;

-- Drop storage policies
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'storage'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON storage.' || r.tablename || ' CASCADE';
    END LOOP;
END $$;

-- Drop storage buckets (if you want to clean those too)
-- Uncomment these if you want to delete storage buckets
-- DELETE FROM storage.objects WHERE bucket_id IN ('author-avatars', 'blog-images', 'media-thumbnails');
-- DELETE FROM storage.buckets WHERE id IN ('author-avatars', 'blog-images', 'media-thumbnails');

SELECT 'All tables, views, and functions deleted successfully!' as status;
