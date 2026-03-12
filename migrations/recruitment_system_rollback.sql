-- =====================================================
-- RECRUITMENT SYSTEM ROLLBACK SCRIPT
-- =====================================================
-- Use this script to remove all recruitment-related tables
-- WARNING: This will delete ALL recruitment data!
-- Only use this if you need to start fresh
-- =====================================================

-- Drop views first (they depend on tables)
DROP VIEW IF EXISTS v_applications_with_screening CASCADE;
DROP VIEW IF EXISTS v_screening_analytics CASCADE;
DROP VIEW IF EXISTS v_recruitment_funnel CASCADE;
DROP VIEW IF EXISTS v_job_applications_summary CASCADE;
DROP VIEW IF EXISTS v_public_job_postings CASCADE;

-- Drop storage policies
DROP POLICY IF EXISTS "Public can upload job application documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view job application documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete job application documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload job application documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view job application documents" ON storage.objects;

-- Delete storage bucket (this will fail if there are files in it)
-- DELETE FROM storage.buckets WHERE id = 'job-applications';

-- Drop tables (CASCADE will drop dependent objects)
DROP TABLE IF EXISTS cv_screening_results CASCADE;
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS job_postings CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_cv_screening_updated_at() CASCADE;
DROP FUNCTION IF EXISTS track_application_status_change() CASCADE;
DROP FUNCTION IF EXISTS update_job_applications_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_job_postings_updated_at() CASCADE;

-- Verify cleanup
SELECT 
  'Tables remaining:' as check_type,
  tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename LIKE '%job%'
UNION ALL
SELECT 
  'Views remaining:' as check_type,
  viewname 
FROM pg_views 
WHERE schemaname = 'public' 
  AND viewname LIKE '%job%'
UNION ALL
SELECT 
  'Functions remaining:' as check_type,
  routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name LIKE '%job%';

-- =====================================================
-- ROLLBACK COMPLETE
-- =====================================================
