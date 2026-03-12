-- =====================================================
-- CONSOLIDATED JOBS MIGRATION FOR PRIMARY SUPABASE
-- =====================================================
-- This migration creates all job-related tables and policies
-- Run this in your PRIMARY Supabase instance SQL Editor
-- =====================================================

-- =====================================================
-- 1. CREATE JOB POSTINGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.job_postings (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    level TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
    responsibilities JSONB NOT NULL DEFAULT '[]'::jsonb,
    skills JSONB DEFAULT NULL,
    open_positions INTEGER DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    posted_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for job_postings
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON public.job_postings(status);
CREATE INDEX IF NOT EXISTS idx_job_postings_posted_date ON public.job_postings(posted_date DESC);

-- Add comment
COMMENT ON TABLE public.job_postings IS 'Stores job postings that appear on the public careers page';

-- =====================================================
-- 2. CREATE JOB APPLICATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id INTEGER NOT NULL,
  job_title TEXT NOT NULL,
  
  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  linkedin_url TEXT,
  portfolio_url TEXT,
  
  -- Professional Information
  current_location TEXT NOT NULL,
  years_of_experience TEXT NOT NULL,
  current_company TEXT,
  current_job_role TEXT,
  notice_period TEXT NOT NULL,
  expected_salary TEXT,
  
  -- Application Content
  cover_letter TEXT NOT NULL,
  
  -- Document URLs (stored in Supabase Storage)
  resume_url TEXT NOT NULL,
  resume_filename TEXT NOT NULL,
  additional_documents_url TEXT,
  additional_documents_filename TEXT,
  
  -- Metadata
  application_status TEXT DEFAULT 'pending' CHECK (application_status IN ('pending', 'reviewing', 'shortlisted', 'interviewed', 'rejected', 'accepted')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for job_applications
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_email ON public.job_applications(email);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_job_applications_applied_at ON public.job_applications(applied_at DESC);

-- Add comment
COMMENT ON TABLE public.job_applications IS 'Stores job application submissions from the careers portal';

-- =====================================================
-- 3. CREATE UPDATED_AT TRIGGER FOR JOB APPLICATIONS
-- =====================================================

CREATE OR REPLACE FUNCTION update_job_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_job_applications_updated_at();

-- =====================================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on job_applications
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Disable RLS on job_postings (public read access)
ALTER TABLE public.job_postings DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. CREATE RLS POLICIES FOR JOB APPLICATIONS
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can submit job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON public.job_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.job_applications;

-- Policy: Allow anyone to insert (submit application)
CREATE POLICY "Anyone can submit job applications"
  ON public.job_applications
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Only authenticated admins can view applications
CREATE POLICY "Admins can view all applications"
  ON public.job_applications
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only authenticated admins can update applications
CREATE POLICY "Admins can update applications"
  ON public.job_applications
  FOR UPDATE
  TO authenticated
  USING (true);

-- =====================================================
-- 6. CREATE STORAGE BUCKET FOR JOB APPLICATIONS
-- =====================================================

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('job-applications', 'job-applications', false)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 7. CREATE STORAGE POLICIES
-- =====================================================

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Anyone can upload job application documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view job application documents" ON storage.objects;

-- Policy: Anyone can upload job application documents
CREATE POLICY "Anyone can upload job application documents"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'job-applications');

-- Policy: Admins can view job application documents
CREATE POLICY "Admins can view job application documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'job-applications');

-- =====================================================
-- 8. CREATE VIEWS FOR EASIER QUERYING
-- =====================================================

-- Drop existing view if it exists
DROP VIEW IF EXISTS public.v_job_applications_summary;

-- Create summary view
CREATE OR REPLACE VIEW public.v_job_applications_summary AS
SELECT 
  id,
  job_id,
  job_title,
  first_name || ' ' || last_name AS full_name,
  email,
  phone,
  current_location,
  years_of_experience,
  application_status,
  applied_at,
  updated_at
FROM public.job_applications
ORDER BY applied_at DESC;

COMMENT ON VIEW public.v_job_applications_summary IS 'Summary view of job applications for admin dashboard';

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Next steps:
-- 1. If you have existing data in secondary Supabase, export and import it
-- 2. Update your .env.local to remove secondary Supabase variables
-- 3. Test the application to ensure everything works
-- =====================================================
