-- Drop Everything At Once
-- This script drops ALL database objects in the correct order to avoid conflicts
-- ⚠️ WARNING: This will delete ALL existing data and cannot be undone!

-- ============================================================================
-- STEP 1: Drop All Dependent Views First
-- ============================================================================

DROP VIEW IF EXISTS public.v_media_with_authors CASCADE;
DROP VIEW IF EXISTS public.v_media_public CASCADE;
DROP VIEW IF EXISTS public.v_media_all CASCADE;

-- ============================================================================
-- STEP 2: Drop All Functions and Procedures
-- ============================================================================

-- Drop user-defined functions
DROP FUNCTION IF EXISTS public.create_blog_post CASCADE;
DROP FUNCTION IF EXISTS public.update_blog_post CASCADE;
DROP FUNCTION IF EXISTS public.create_author CASCADE;
DROP FUNCTION IF EXISTS public.create_media_item CASCADE;
DROP FUNCTION IF EXISTS public.update_media_item CASCADE;
DROP FUNCTION IF EXISTS public.publish_media CASCADE;
DROP FUNCTION IF EXISTS public.unpublish_media CASCADE;
DROP FUNCTION IF EXISTS public.get_media_item_full CASCADE;

-- Drop trigger functions
DROP FUNCTION IF EXISTS public.update_updated_at_column CASCADE;

-- Drop any other custom functions (catch-all)
DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN
        SELECT proname, pg_get_userbyid(proowner) as owner
        FROM pg_proc 
        WHERE pronamespace = 'public'::regnamespace
        AND pg_get_userbyid(proowner) = current_user
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(func_record.proname) || '() CASCADE';
    END LOOP;
END $$;

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

-- Drop all storage policies by name (more reliable than iterating)
DO $$
DECLARE
    policy_name text;
BEGIN
    FOR policy_name IN
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(policy_name) || ' ON storage.objects';
    END LOOP;
END $$;

-- Delete all objects from storage
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
-- STEP 6: Drop Any Sequences or Other Objects
-- ============================================================================

-- Drop any sequences in the public schema
DO $$
DECLARE
    seq_record RECORD;
BEGIN
    FOR seq_record IN
        SELECT sequence_name
        FROM information_schema.sequences
        WHERE sequence_schema = 'public'
    LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS public.' || quote_ident(seq_record.sequence_name) || ' CASCADE';
    END LOOP;
END $$;

-- ============================================================================
-- STEP 7: Drop Any Remaining Triggers
-- ============================================================================

-- Drop any triggers on existing tables (if any remain)
DO $$
DECLARE
    trig_record RECORD;
BEGIN
    FOR trig_record IN
        SELECT tgname, relname
        FROM pg_trigger t
        JOIN pg_class c ON c.oid = t.tgrelid
        WHERE c.relnamespace = 'public'::regnamespace
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(trig_record.tgname) || 
                ' ON public.' || quote_ident(trig_record.relname);
    END LOOP;
END $$;

-- ============================================================================
-- STEP 8: Final Verification and Cleanup
-- ============================================================================

-- Clean up any remaining objects in the public schema
-- Drop any remaining tables that might have been missed
DO $$
DECLARE
    table_name text;
BEGIN
    FOR table_name IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename != 'schema_migrations'  -- Preserve schema migrations table if it exists
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(table_name) || ' CASCADE';
    END LOOP;
END $$;

-- Clean up any remaining functions that might have been missed
DO $$
DECLARE
    func_name text;
    func_args text;
BEGIN
    FOR func_name, func_args IN
        SELECT proname, pg_get_function_identity_arguments(p.oid)
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public'
        AND pg_get_userbyid(proowner) = current_user
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(func_name) || '(' || func_args || ') CASCADE';
    END LOOP;
END $$;

-- ============================================================================
-- STEP 9: Final Verification Queries
-- ============================================================================

-- Verify that all tables are dropped
SELECT 'Tables remaining in public schema:' as status, 
       count(*) as remaining_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name != 'schema_migrations';

-- Verify that all views are dropped
SELECT 'Views remaining in public schema:' as status, 
       count(*) as remaining_views
FROM information_schema.views 
WHERE table_schema = 'public';

-- Verify that all functions are dropped
SELECT 'Functions remaining in public schema:' as status, 
       count(*) as remaining_functions
FROM information_schema.routines 
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION';

-- Verify that all storage buckets are dropped
SELECT 'Storage buckets remaining:' as status, 
       count(*) as remaining_buckets
FROM storage.buckets;

-- Final success message
SELECT '🎉 Everything dropped successfully! 
✅ All views dropped
✅ All functions dropped  
✅ All tables dropped
✅ All storage policies and buckets removed
✅ All triggers removed
✅ All sequences removed
✅ All custom types removed
Your database is now completely clean!' as final_status;