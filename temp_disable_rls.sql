-- Temporarily disable RLS for testing (DO NOT use in production)
ALTER TABLE job_postings DISABLE ROW LEVEL SECURITY;

-- Check if jobs are now visible
SELECT COUNT(*) as total_jobs FROM job_postings WHERE status = 'open';

-- To re-enable later:
-- ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
