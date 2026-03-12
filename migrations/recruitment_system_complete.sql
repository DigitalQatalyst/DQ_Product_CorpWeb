-- =====================================================
-- COMPLETE RECRUITMENT SYSTEM MIGRATION
-- =====================================================
-- This is a comprehensive migration for the entire recruitment module
-- including job postings, applications, CV screening, and interview scheduling
-- 
-- Run this in your Supabase SQL Editor
-- =====================================================

-- =====================================================
-- PART 1: JOB POSTINGS TABLE
-- =====================================================

-- Drop existing table if you want a clean start (CAUTION: This deletes data!)
-- DROP TABLE IF EXISTS job_postings CASCADE;

CREATE TABLE IF NOT EXISTS job_postings (
  id SERIAL PRIMARY KEY,
  
  -- Basic Information
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL, -- Full-time, Part-time, Contract, Remote
  level TEXT NOT NULL, -- Entry-Level, Mid-Level, Senior, Executive
  description TEXT NOT NULL,
  
  -- Job Details (stored as JSONB for flexibility)
  requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
  responsibilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT NULL, -- { core: [], behavioral: [] }
  
  -- Position Details
  open_positions INTEGER DEFAULT 1,
  salary_range TEXT,
  
  -- Status and Dates
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed', 'filled')),
  posted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closing_date TIMESTAMP WITH TIME ZONE,
  filled_date TIMESTAMP WITH TIME ZONE,
  
  -- SEO and Display
  slug TEXT UNIQUE,
  featured BOOLEAN DEFAULT false,
  
  -- Tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Indexes for job_postings
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON job_postings(status);
CREATE INDEX IF NOT EXISTS idx_job_postings_department ON job_postings(department);
CREATE INDEX IF NOT EXISTS idx_job_postings_posted_date ON job_postings(posted_date DESC);
CREATE INDEX IF NOT EXISTS idx_job_postings_slug ON job_postings(slug);
CREATE INDEX IF NOT EXISTS idx_job_postings_featured ON job_postings(featured) WHERE featured = true;

-- Updated_at trigger for job_postings
CREATE OR REPLACE FUNCTION update_job_postings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_job_postings_updated_at ON job_postings;
CREATE TRIGGER trigger_update_job_postings_updated_at
  BEFORE UPDATE ON job_postings
  FOR EACH ROW
  EXECUTE FUNCTION update_job_postings_updated_at();

-- RLS for job_postings
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access to open jobs" ON job_postings;
DROP POLICY IF EXISTS "Anyone can view open job postings" ON job_postings;
DROP POLICY IF EXISTS "Public can view open jobs" ON job_postings;
DROP POLICY IF EXISTS "Admins can view all job postings" ON job_postings;
DROP POLICY IF EXISTS "Admins can create job postings" ON job_postings;
DROP POLICY IF EXISTS "Admins can update job postings" ON job_postings;
DROP POLICY IF EXISTS "Admins can delete job postings" ON job_postings;

-- Create new policies
CREATE POLICY "Public can view open job postings"
  ON job_postings
  FOR SELECT
  TO anon, authenticated
  USING (status = 'open');

CREATE POLICY "Authenticated users can view all job postings"
  ON job_postings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create job postings"
  ON job_postings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update job postings"
  ON job_postings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete job postings"
  ON job_postings
  FOR DELETE
  TO authenticated
  USING (true);

-- View for public job listings
CREATE OR REPLACE VIEW v_public_job_postings AS
SELECT 
  id,
  title,
  department,
  location,
  type,
  level,
  description,
  requirements,
  responsibilities,
  skills,
  open_positions,
  salary_range,
  posted_date,
  closing_date,
  slug,
  featured
FROM job_postings
WHERE status = 'open'
  AND (closing_date IS NULL OR closing_date > NOW())
ORDER BY featured DESC, posted_date DESC;

COMMENT ON TABLE job_postings IS 'Stores job postings/open positions for the careers marketplace';
COMMENT ON VIEW v_public_job_postings IS 'Public view of open job positions';

-- =====================================================
-- PART 2: JOB APPLICATIONS TABLE
-- =====================================================

-- Drop existing table if you want a clean start (CAUTION: This deletes data!)
-- DROP TABLE IF EXISTS job_applications CASCADE;

CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Job Reference
  job_posting_id INTEGER REFERENCES job_postings(id) ON DELETE SET NULL,
  job_id INTEGER NOT NULL, -- Legacy field, kept for compatibility
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
  
  -- Enhanced Status Workflow
  application_status TEXT DEFAULT 'pending' CHECK (application_status IN (
    'pending',              -- New application, no action taken
    'screened',             -- Initial review completed
    'qualified',            -- Meets must-haves, moving forward
    'interview_scheduled',  -- Interview arranged
    'interviewed',          -- Interview completed, awaiting decision
    'shortlisted',          -- Top candidate for final consideration
    'offered',              -- Job offer extended
    'hired',                -- Offer accepted
    'rejected',             -- Not moving forward
    'withdrawn'             -- Candidate withdrew
  )),
  
  -- Status Tracking
  status_history JSONB DEFAULT '[]'::jsonb,
  status_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status_changed_by UUID,
  rejection_reason TEXT,
  internal_notes TEXT,
  
  -- Timestamps
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes for job_applications
CREATE INDEX IF NOT EXISTS idx_job_applications_job_posting_id ON job_applications(job_posting_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_email ON job_applications(email);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_job_applications_applied_at ON job_applications(applied_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_applications_status_changed_at ON job_applications(status_changed_at DESC);

-- Updated_at trigger for job_applications
CREATE OR REPLACE FUNCTION update_job_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_job_applications_updated_at ON job_applications;
CREATE TRIGGER trigger_update_job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_job_applications_updated_at();

-- Status change tracking trigger
CREATE OR REPLACE FUNCTION track_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only track if status actually changed
  IF OLD.application_status IS DISTINCT FROM NEW.application_status THEN
    -- Update status_changed_at
    NEW.status_changed_at = NOW();
    
    -- Append to status_history
    NEW.status_history = COALESCE(NEW.status_history, '[]'::jsonb) || 
      jsonb_build_object(
        'from_status', OLD.application_status,
        'to_status', NEW.application_status,
        'changed_at', NOW(),
        'changed_by', NEW.status_changed_by,
        'rejection_reason', NEW.rejection_reason
      );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_track_application_status_change ON job_applications;
CREATE TRIGGER trigger_track_application_status_change
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION track_application_status_change();

-- RLS for job_applications
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can submit job applications" ON job_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON job_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON job_applications;
DROP POLICY IF EXISTS "Admins can delete applications" ON job_applications;

-- Create new policies
CREATE POLICY "Anyone can submit job applications"
  ON job_applications
  FOR INSERT
  TO anon, public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all applications"
  ON job_applications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update applications"
  ON job_applications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete applications"
  ON job_applications
  FOR DELETE
  TO authenticated
  USING (true);

-- Views for job_applications
CREATE OR REPLACE VIEW v_job_applications_summary AS
SELECT 
  id,
  job_posting_id,
  job_id,
  job_title,
  first_name || ' ' || last_name AS full_name,
  email,
  phone,
  current_location,
  years_of_experience,
  application_status,
  rejection_reason,
  applied_at,
  status_changed_at,
  updated_at
FROM job_applications
ORDER BY applied_at DESC;

CREATE OR REPLACE VIEW v_recruitment_funnel AS
SELECT 
  application_status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / NULLIF(SUM(COUNT(*)) OVER (), 0), 2) as percentage
FROM job_applications
GROUP BY application_status
ORDER BY 
  CASE application_status
    WHEN 'pending' THEN 1
    WHEN 'screened' THEN 2
    WHEN 'qualified' THEN 3
    WHEN 'interview_scheduled' THEN 4
    WHEN 'interviewed' THEN 5
    WHEN 'shortlisted' THEN 6
    WHEN 'offered' THEN 7
    WHEN 'hired' THEN 8
    WHEN 'rejected' THEN 9
    WHEN 'withdrawn' THEN 10
  END;

COMMENT ON TABLE job_applications IS 'Stores job application submissions from the careers portal';
COMMENT ON VIEW v_job_applications_summary IS 'Summary view of job applications for admin dashboard';
COMMENT ON VIEW v_recruitment_funnel IS 'Analytics view showing distribution of applications across status stages';

-- =====================================================
-- PART 3: CV SCREENING RESULTS TABLE
-- =====================================================

-- Drop existing table if you want a clean start (CAUTION: This deletes data!)
-- DROP TABLE IF EXISTS cv_screening_results CASCADE;

CREATE TABLE IF NOT EXISTS cv_screening_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL UNIQUE REFERENCES job_applications(id) ON DELETE CASCADE,
  
  -- Scoring (0-100 scale)
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  skills_match_score INTEGER NOT NULL CHECK (skills_match_score >= 0 AND skills_match_score <= 100),
  experience_match_score INTEGER NOT NULL CHECK (experience_match_score >= 0 AND experience_match_score <= 100),
  education_match_score INTEGER NOT NULL CHECK (education_match_score >= 0 AND education_match_score <= 100),
  
  -- Extracted Information
  extracted_skills TEXT[] DEFAULT '{}',
  extracted_experience TEXT[] DEFAULT '{}',
  extracted_education TEXT[] DEFAULT '{}',
  
  -- Assessment
  key_highlights TEXT[] DEFAULT '{}',
  red_flags TEXT[] DEFAULT '{}',
  recommendation TEXT NOT NULL CHECK (recommendation IN ('strong_match', 'good_match', 'potential_match', 'weak_match', 'no_match')),
  screening_summary TEXT NOT NULL,
  
  -- Metadata
  screened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  screened_by UUID,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for cv_screening_results
CREATE INDEX IF NOT EXISTS idx_cv_screening_application_id ON cv_screening_results(application_id);
CREATE INDEX IF NOT EXISTS idx_cv_screening_overall_score ON cv_screening_results(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_cv_screening_recommendation ON cv_screening_results(recommendation);
CREATE INDEX IF NOT EXISTS idx_cv_screening_screened_at ON cv_screening_results(screened_at DESC);

-- Updated_at trigger for cv_screening_results
CREATE OR REPLACE FUNCTION update_cv_screening_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_cv_screening_updated_at ON cv_screening_results;
CREATE TRIGGER trigger_update_cv_screening_updated_at
  BEFORE UPDATE ON cv_screening_results
  FOR EACH ROW
  EXECUTE FUNCTION update_cv_screening_updated_at();

-- RLS for cv_screening_results
ALTER TABLE cv_screening_results ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all screening results" ON cv_screening_results;
DROP POLICY IF EXISTS "Admins can insert screening results" ON cv_screening_results;
DROP POLICY IF EXISTS "Admins can update screening results" ON cv_screening_results;

-- Create new policies
CREATE POLICY "Authenticated users can view screening results"
  ON cv_screening_results
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert screening results"
  ON cv_screening_results
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update screening results"
  ON cv_screening_results
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Views for cv_screening_results
CREATE OR REPLACE VIEW v_screening_analytics AS
SELECT 
  recommendation,
  COUNT(*) as count,
  ROUND(AVG(overall_score), 2) as avg_overall_score,
  ROUND(AVG(skills_match_score), 2) as avg_skills_score,
  ROUND(AVG(experience_match_score), 2) as avg_experience_score,
  ROUND(AVG(education_match_score), 2) as avg_education_score
FROM cv_screening_results
GROUP BY recommendation
ORDER BY 
  CASE recommendation
    WHEN 'strong_match' THEN 1
    WHEN 'good_match' THEN 2
    WHEN 'potential_match' THEN 3
    WHEN 'weak_match' THEN 4
    WHEN 'no_match' THEN 5
  END;

CREATE OR REPLACE VIEW v_applications_with_screening AS
SELECT 
  ja.*,
  csr.overall_score,
  csr.skills_match_score,
  csr.experience_match_score,
  csr.education_match_score,
  csr.recommendation,
  csr.screening_summary,
  csr.key_highlights,
  csr.red_flags,
  csr.screened_at
FROM job_applications ja
LEFT JOIN cv_screening_results csr ON ja.id = csr.application_id
ORDER BY csr.overall_score DESC NULLS LAST, ja.applied_at DESC;

COMMENT ON TABLE cv_screening_results IS 'Stores AI-powered CV screening results for job applications';
COMMENT ON VIEW v_screening_analytics IS 'Analytics view showing screening results distribution and average scores';
COMMENT ON VIEW v_applications_with_screening IS 'Combined view of applications with their screening results';

-- =====================================================
-- PART 4: STORAGE BUCKET FOR JOB APPLICATIONS
-- =====================================================

-- Create storage bucket for job application documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('job-applications', 'job-applications', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Anyone can upload job application documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view job application documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view job application documents" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload to job-applications" ON storage.objects;

-- Create new storage policies
CREATE POLICY "Public can upload job application documents"
  ON storage.objects
  FOR INSERT
  TO anon, public
  WITH CHECK (bucket_id = 'job-applications');

CREATE POLICY "Authenticated users can view job application documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'job-applications');

CREATE POLICY "Authenticated users can delete job application documents"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'job-applications');

-- =====================================================
-- PART 5: GRANT PERMISSIONS
-- =====================================================

GRANT SELECT ON v_public_job_postings TO anon, authenticated;
GRANT SELECT ON v_job_applications_summary TO authenticated;
GRANT SELECT ON v_recruitment_funnel TO authenticated;
GRANT SELECT ON v_screening_analytics TO authenticated;
GRANT SELECT ON v_applications_with_screening TO authenticated;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- 
-- Summary of what was created:
-- 1. job_postings table with RLS policies
-- 2. job_applications table with enhanced status workflow
-- 3. cv_screening_results table for AI screening
-- 4. Storage bucket and policies for document uploads
-- 5. Multiple views for analytics and reporting
-- 6. Triggers for automatic timestamp updates
-- 7. Status change tracking for applications
--
-- Next steps:
-- 1. Verify all tables were created: SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE '%job%';
-- 2. Test public access to open jobs
-- 3. Test application submission
-- 4. Configure Azure OpenAI for CV screening
-- =====================================================
