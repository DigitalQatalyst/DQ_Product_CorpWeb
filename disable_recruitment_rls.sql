-- =====================================================
-- DISABLE RLS FOR RECRUITMENT TABLES
-- =====================================================
-- This script disables Row Level Security for all recruitment tables
-- to allow operations without authentication requirements
-- 
-- Run this in your Supabase SQL Editor after the main migration
-- =====================================================

-- Disable RLS for job_postings table
ALTER TABLE job_postings DISABLE ROW LEVEL SECURITY;

-- Disable RLS for job_applications table  
ALTER TABLE job_applications DISABLE ROW LEVEL SECURITY;

-- Disable RLS for cv_screening_results table
ALTER TABLE cv_screening_results DISABLE ROW LEVEL SECURITY;

-- Disable RLS for interviews table (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'interviews' AND table_schema = 'public') THEN
        ALTER TABLE interviews DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Disable RLS for interview_feedback table (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'interview_feedback' AND table_schema = 'public') THEN
        ALTER TABLE interview_feedback DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- =====================================================
-- ALTERNATIVE: Keep RLS but allow public access
-- =====================================================
-- If you prefer to keep RLS enabled but allow public access,
-- uncomment and run these policies instead:

/*
-- Drop existing policies and create permissive ones
DROP POLICY IF EXISTS "Public can view open job postings" ON job_postings;
DROP POLICY IF EXISTS "Authenticated users can view all job postings" ON job_postings;
DROP POLICY IF EXISTS "Authenticated users can create job postings" ON job_postings;
DROP POLICY IF EXISTS "Authenticated users can update job postings" ON job_postings;
DROP POLICY IF EXISTS "Authenticated users can delete job postings" ON job_postings;

-- Create permissive policies for all users
CREATE POLICY "Allow all operations on job_postings"
  ON job_postings
  FOR ALL
  TO public, authenticated, anon
  USING (true)
  WITH CHECK (true);

-- Similar policies for other tables
DROP POLICY IF EXISTS "Anyone can submit job applications" ON job_applications;
DROP POLICY IF EXISTS "Authenticated users can view all applications" ON job_applications;
DROP POLICY IF EXISTS "Authenticated users can update applications" ON job_applications;
DROP POLICY IF EXISTS "Authenticated users can delete applications" ON job_applications;

CREATE POLICY "Allow all operations on job_applications"
  ON job_applications
  FOR ALL
  TO public, authenticated, anon
  USING (true)
  WITH CHECK (true);
*/

-- =====================================================
-- VERIFICATION
-- =====================================================
-- You can verify RLS is disabled with:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE '%job%' OR tablename LIKE '%interview%';

-- =====================================================
-- COMPLETION
-- =====================================================
-- After running this, you should be able to:
-- 1. Create job postings without authentication
-- 2. Submit job applications without authentication  
-- 3. Perform all recruitment operations without RLS restrictions
-- =====================================================
