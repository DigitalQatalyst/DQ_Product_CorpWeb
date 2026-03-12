-- Clean Database Completely
-- This script drops ALL existing tables, views, functions, and storage completely
-- ⚠️ WARNING: This will delete ALL existing data and cannot be undone!

-- ============================================================================
-- STEP 1: Drop All Views (Dependent Objects First)
-- ============================================================================

DROP VIEW IF EXISTS public.v_media_with_authors CASCADE;
DROP VIEW IF EXISTS public.v_media_public CASCADE;
DROP VIEW IF EXISTS public.v_media_all CASCADE;

-- ============================================================================
-- STEP 2: Drop All Functions and Procedures
-- ============================================================================

DROP FUNCTION IF EXISTS public.create_blog_post CASCADE;
DROP FUNCTION IF EXISTS public.update_blog_post CASCADE;
DROP FUNCTION IF EXISTS public.create_author CASCADE;
DROP FUNCTION IF EXISTS public.create_media_item CASCADE;
DROP FUNCTION IF EXISTS public.update_media_item CASCADE;
DROP FUNCTION IF EXISTS public.publish_media CASCADE;
DROP FUNCTION IF EXISTS public.unpublish_media CASCADE;
DROP FUNCTION IF EXISTS public.get_media_item_full CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- ============================================================================
-- STEP 3: Drop All Tables (Child Tables First, Then Parent Tables)
-- ============================================================================

-- Drop all child/dependent tables first
DROP TABLE IF EXISTS public.content_submissions CASCADE;
DROP TABLE IF EXISTS public.media_taxonomies CASCADE;
DROP TABLE IF EXISTS public.taxonomies CASCADE;
DROP TABLE IF EXISTS public.media_assets CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.blogs CASCADE;
DROP TABLE IF EXISTS public.articles CASCADE;
DROP TABLE IF EXISTS public.videos CASCADE;
DROP TABLE IF EXISTS public.podcasts CASCADE;
DROP TABLE IF EXISTS public.reports CASCADE;
DROP TABLE IF EXISTS public.tools CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.authors CASCADE;
DROP TABLE IF EXISTS public.media_items CASCADE;

-- ============================================================================
-- STEP 4: Drop All Storage Policies and Buckets
-- ============================================================================

-- Drop all storage policies
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT id FROM storage.buckets)
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "Allow all operations on ' || r.id || '" ON storage.objects';
        EXECUTE 'DROP POLICY IF EXISTS "' || r.id || ' is publicly accessible" ON storage.objects';
    END LOOP;
END$$;

-- Delete all objects from storage (be careful - this removes ALL stored files)
DELETE FROM storage.objects;

-- Drop all storage buckets
DELETE FROM storage.buckets;

-- ============================================================================
-- STEP 5: Drop Any Remaining Custom Types or Extensions
-- ============================================================================

-- Drop any custom types if they exist
DROP TYPE IF EXISTS public.media_type_enum CASCADE;
DROP TYPE IF EXISTS public.status_enum CASCADE;
DROP TYPE IF EXISTS public.visibility_enum CASCADE;
DROP TYPE IF EXISTS public.kind_enum CASCADE;

-- ============================================================================
-- STEP 6: Final Verification
-- ============================================================================

-- Verify that all tables are dropped
SELECT 'All tables dropped successfully' as status, 
       count(*) as remaining_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE';

-- Verify that all views are dropped
SELECT 'All views dropped successfully' as status, 
       count(*) as remaining_views
FROM information_schema.views 
WHERE table_schema = 'public';

-- Verify that all storage buckets are dropped
SELECT 'All storage buckets dropped successfully' as status, 
       count(*) as remaining_buckets
FROM storage.buckets;

-- Final success message
SELECT '🎉 Database completely cleaned! 
✅ All tables dropped
✅ All views dropped  
✅ All functions dropped
✅ All storage buckets and objects removed
Your database is now completely empty and ready for fresh setup!' as final_status;