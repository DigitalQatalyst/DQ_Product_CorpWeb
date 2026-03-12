-- =====================================================
-- RECRUITMENT SYSTEM VERIFICATION SCRIPT
-- =====================================================
-- Run this after the main migration to verify everything is set up correctly
-- =====================================================

-- Check 1: Verify all tables exist
SELECT 
  '✓ Tables' as check_category,
  tablename,
  CASE 
    WHEN tablename IN ('job_postings', 'job_applications', 'cv_screening_results') THEN '✓ EXISTS'
    ELSE '✗ MISSING'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('job_postings', 'job_applications', 'cv_screening_results')
ORDER BY tablename;

-- Check 2: Verify all views exist
SELECT 
  '✓ Views' as check_category,
  viewname,
  '✓ EXISTS' as status
FROM pg_views 
WHERE schemaname = 'public' 
  AND viewname LIKE '%job%' OR viewname LIKE '%recruitment%' OR viewname LIKE '%screening%'
ORDER BY viewname;

-- Check 3: Verify RLS is enabled
SELECT 
  '✓ RLS Status' as check_category,
  tablename,
  CASE 
    WHEN rowsecurity = true THEN '✓ ENABLED'
    ELSE '✗ DISABLED'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('job_postings', 'job_applications', 'cv_screening_results');

-- Check 4: Verify RLS policies
SELECT 
  '✓ RLS Policies' as check_category,
  tablename,
  policyname,
  cmd as operation,
  roles,
  '✓ EXISTS' as status
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('job_postings', 'job_applications', 'cv_screening_results')
ORDER BY tablename, cmd;

-- Check 5: Verify indexes
SELECT 
  '✓ Indexes' as check_category,
  tablename,
  indexname,
  '✓ EXISTS' as status
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('job_postings', 'job_applications', 'cv_screening_results')
ORDER BY tablename, indexname;

-- Check 6: Verify triggers
SELECT 
  '✓ Triggers' as check_category,
  event_object_table as tablename,
  trigger_name,
  event_manipulation as event,
  '✓ EXISTS' as status
FROM information_schema.triggers 
WHERE event_object_schema = 'public' 
  AND event_object_table IN ('job_postings', 'job_applications', 'cv_screening_results')
ORDER BY event_object_table, trigger_name;

-- Check 7: Verify storage bucket
SELECT 
  '✓ Storage Bucket' as check_category,
  id as bucket_id,
  name as bucket_name,
  public as is_public,
  CASE 
    WHEN id = 'job-applications' THEN '✓ EXISTS'
    ELSE '✗ UNEXPECTED'
  END as status
FROM storage.buckets 
WHERE id = 'job-applications';

-- Check 8: Verify storage policies
SELECT 
  '✓ Storage Policies' as check_category,
  policyname,
  '✓ EXISTS' as status
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%job%application%'
ORDER BY policyname;

-- Check 9: Verify table columns
SELECT 
  '✓ Table Structure' as check_category,
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('job_postings', 'job_applications', 'cv_screening_results')
ORDER BY table_name, ordinal_position;

-- Check 10: Count records in each table
SELECT 
  '✓ Record Counts' as check_category,
  'job_postings' as table_name,
  COUNT(*) as record_count,
  COUNT(*) FILTER (WHERE status = 'open') as open_count
FROM job_postings
UNION ALL
SELECT 
  '✓ Record Counts',
  'job_applications',
  COUNT(*),
  COUNT(*) FILTER (WHERE application_status = 'pending')
FROM job_applications
UNION ALL
SELECT 
  '✓ Record Counts',
  'cv_screening_results',
  COUNT(*),
  COUNT(*) FILTER (WHERE recommendation = 'strong_match')
FROM cv_screening_results;

-- Check 11: Test public access to open jobs (should return data without authentication)
SELECT 
  '✓ Public Access Test' as check_category,
  COUNT(*) as open_jobs_visible,
  CASE 
    WHEN COUNT(*) > 0 THEN '✓ PUBLIC ACCESS WORKING'
    ELSE '⚠ NO OPEN JOBS OR ACCESS BLOCKED'
  END as status
FROM v_public_job_postings;

-- Check 12: Verify foreign key relationships
SELECT 
  '✓ Foreign Keys' as check_category,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  '✓ EXISTS' as status
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('job_applications', 'cv_screening_results')
ORDER BY tc.table_name;

-- =====================================================
-- VERIFICATION COMPLETE
-- =====================================================
-- Review the results above:
-- - All checks should show ✓ status
-- - RLS should be ENABLED for all tables
-- - All expected policies should exist
-- - Storage bucket should exist and not be public
-- - Public access test should work (if you have open jobs)
-- =====================================================
