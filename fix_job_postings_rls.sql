-- Fix RLS policies for job_postings table
-- This allows public (anonymous) users to view open job postings

-- First, enable RLS if not already enabled
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access to open jobs" ON job_postings;
DROP POLICY IF EXISTS "Public can view open jobs" ON job_postings;
DROP POLICY IF EXISTS "Anyone can view open job postings" ON job_postings;

-- Create a policy that allows anonymous users to read open jobs
CREATE POLICY "Allow public read access to open jobs"
ON job_postings
FOR SELECT
TO anon, authenticated
USING (status = 'open');

-- Verify the policy was created
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

-- Test the policy by checking if open jobs are visible
SELECT COUNT(*) as open_jobs_count FROM job_postings WHERE status = 'open';
