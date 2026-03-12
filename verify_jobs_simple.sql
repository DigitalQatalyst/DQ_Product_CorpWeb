-- Simple verification script to check job data

-- 1. Count total jobs
SELECT COUNT(*) as total_jobs FROM job_postings;

-- 2. Count open jobs
SELECT COUNT(*) as open_jobs FROM job_postings WHERE status = 'open';

-- 3. Show all open jobs with their data types
SELECT 
  id,
  title,
  status,
  jsonb_typeof(requirements) as req_type,
  jsonb_typeof(responsibilities) as resp_type
FROM job_postings
WHERE status = 'open'
ORDER BY id;

-- 4. Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'job_postings';

-- 5. Show RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'job_postings';
