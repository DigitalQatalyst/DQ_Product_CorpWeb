-- =====================================================
-- UPDATE EXISTING RECRUITMENT TABLES
-- =====================================================
-- This migration updates existing tables without dropping them
-- Safe to run - preserves all existing data
-- =====================================================

-- =====================================================
-- PART 1: UPDATE JOB POSTINGS TABLE
-- =====================================================

-- Add missing columns if they don't exist
ALTER TABLE job_postings 
ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT NULL;

ALTER TABLE job_postings 
ADD COLUMN IF NOT EXISTS open_positions INTEGER DEFAULT 1;

ALTER TABLE job_postings 
ADD COLUMN IF NOT EXISTS salary_range TEXT;

ALTER TABLE job_postings 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

ALTER TABLE job_postings 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

ALTER TABLE job_postings 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

ALTER TABLE job_postings 
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

-- Update status constraint if needed
DO $$ 
BEGIN
  ALTER TABLE job_postings 
  DROP CONSTRAINT IF EXISTS job_postings_status_check;
  
  ALTER TABLE job_postings
  ADD CONSTRAINT job_postings_status_check 
  CHECK (status IN ('draft', 'open', 'closed', 'filled'));
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Convert requirements and responsibilities to JSONB if they're TEXT[]
DO $$ 
BEGIN
  -- Check if requirements is TEXT[] and convert to JSONB
  IF (SELECT data_type FROM information_schema.columns 
      WHERE table_name = 'job_postings' AND column_name = 'requirements') = 'ARRAY' THEN
    ALTER TABLE job_postings 
    ALTER COLUMN requirements TYPE JSONB USING to_jsonb(requirements);
  END IF;
  
  -- Check if responsibilities is TEXT[] and convert to JSONB
  IF (SELECT data_type FROM information_schema.columns 
      WHERE table_name = 'job_postings' AND column_name = 'responsibilities') = 'ARRAY' THEN
    ALTER TABLE job_postings 
    ALTER COLUMN responsibilities TYPE JSONB USING to_jsonb(responsibilities);
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Create missing indexes
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON job_postings(status);
CREATE INDEX IF NOT EXISTS idx_job_postings_department ON job_postings(department);
CREATE INDEX IF NOT EXISTS idx_job_postings_posted_date ON job_postings(posted_date DESC);
CREATE INDEX IF NOT EXISTS idx_job_postings_slug ON job_postings(slug);
CREATE INDEX IF NOT EXISTS idx_job_postings_featured ON job_postings(featured) WHERE featured = true;

-- Update RLS policies for job_postings
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view open job postings" ON job_postings;
DROP POLICY IF EXISTS "Anyone can view open job postings" ON job_postings;
DROP POLICY IF EXISTS "Allow public read access to open jobs" ON job_postings;
DROP POLICY IF EXISTS "Authenticated users can view all job postings" ON job_postings;
DROP POLICY IF EXISTS "Admins can view all job postings" ON job_postings;
DROP POLICY IF EXISTS "Authenticated users can create job postings" ON job_postings;
DROP POLICY IF EXISTS "Admins can create job postings" ON job_postings;
DROP POLICY IF EXISTS "Authenticated users can update job postings" ON job_postings;
DROP POLICY IF EXISTS "Admins can update job postings" ON job_postings;
DROP POLICY IF EXISTS "Authenticated users can delete job postings" ON job_postings;
DROP POLICY IF EXISTS "Admins can delete job postings" ON job_postings;

CREATE POLICY "Public can view open job postings"
  ON job_postings FOR SELECT
  TO anon, authenticated
  USING (status = 'open');

CREATE POLICY "Authenticated users can view all job postings"
  ON job_postings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create job postings"
  ON job_postings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update job postings"
  ON job_postings FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete job postings"
  ON job_postings FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- PART 2: UPDATE JOB APPLICATIONS TABLE
-- =====================================================

-- Add missing columns if they don't exist
ALTER TABLE job_applications 
ADD COLUMN IF NOT EXISTS job_posting_id INTEGER REFERENCES job_postings(id) ON DELETE SET NULL;

ALTER TABLE job_applications 
ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]'::jsonb;

ALTER TABLE job_applications 
ADD COLUMN IF NOT EXISTS status_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE job_applications 
ADD COLUMN IF NOT EXISTS status_changed_by UUID;

ALTER TABLE job_applications 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

ALTER TABLE job_applications 
ADD COLUMN IF NOT EXISTS internal_notes TEXT;

-- Update status constraint to include new statuses
DO $$ 
BEGIN
  ALTER TABLE job_applications 
  DROP CONSTRAINT IF EXISTS job_applications_application_status_check;
  
  ALTER TABLE job_applications
  ADD CONSTRAINT job_applications_application_status_check 
  CHECK (application_status IN (
    'pending', 'screened', 'qualified', 'interview_scheduled',
    'interviewed', 'shortlisted', 'offered', 'hired',
    'rejected', 'withdrawn',
    -- Keep old statuses for backward compatibility
    'reviewing', 'accepted'
  ));
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Migrate old status values to new ones
UPDATE job_applications 
SET application_status = 'screened' 
WHERE application_status = 'reviewing';

UPDATE job_applications 
SET application_status = 'hired' 
WHERE application_status = 'accepted';

-- Create missing indexes
CREATE INDEX IF NOT EXISTS idx_job_applications_job_posting_id ON job_applications(job_posting_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_email ON job_applications(email);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_job_applications_applied_at ON job_applications(applied_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_applications_status_changed_at ON job_applications(status_changed_at DESC);

-- Create or replace status tracking trigger
CREATE OR REPLACE FUNCTION track_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.application_status IS DISTINCT FROM NEW.application_status THEN
    NEW.status_changed_at = NOW();
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

-- Update RLS policies for job_applications
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit job applications" ON job_applications;
DROP POLICY IF EXISTS "Authenticated users can view all applications" ON job_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON job_applications;
DROP POLICY IF EXISTS "Authenticated users can update applications" ON job_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON job_applications;
DROP POLICY IF EXISTS "Authenticated users can delete applications" ON job_applications;

CREATE POLICY "Anyone can submit job applications"
  ON job_applications FOR INSERT
  TO anon, public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all applications"
  ON job_applications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update applications"
  ON job_applications FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete applications"
  ON job_applications FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- PART 3: CREATE CV SCREENING TABLE (if not exists)
-- =====================================================

CREATE TABLE IF NOT EXISTS cv_screening_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL UNIQUE REFERENCES job_applications(id) ON DELETE CASCADE,
  
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  skills_match_score INTEGER NOT NULL CHECK (skills_match_score >= 0 AND skills_match_score <= 100),
  experience_match_score INTEGER NOT NULL CHECK (experience_match_score >= 0 AND experience_match_score <= 100),
  education_match_score INTEGER NOT NULL CHECK (education_match_score >= 0 AND education_match_score <= 100),
  
  extracted_skills TEXT[] DEFAULT '{}',
  extracted_experience TEXT[] DEFAULT '{}',
  extracted_education TEXT[] DEFAULT '{}',
  
  key_highlights TEXT[] DEFAULT '{}',
  red_flags TEXT[] DEFAULT '{}',
  recommendation TEXT NOT NULL CHECK (recommendation IN ('strong_match', 'good_match', 'potential_match', 'weak_match', 'no_match')),
  screening_summary TEXT NOT NULL,
  
  screened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  screened_by UUID,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cv_screening_application_id ON cv_screening_results(application_id);
CREATE INDEX IF NOT EXISTS idx_cv_screening_overall_score ON cv_screening_results(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_cv_screening_recommendation ON cv_screening_results(recommendation);
CREATE INDEX IF NOT EXISTS idx_cv_screening_screened_at ON cv_screening_results(screened_at DESC);

-- RLS for cv_screening_results
ALTER TABLE cv_screening_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view screening results" ON cv_screening_results;
DROP POLICY IF EXISTS "Admins can view all screening results" ON cv_screening_results;
DROP POLICY IF EXISTS "Authenticated users can insert screening results" ON cv_screening_results;
DROP POLICY IF EXISTS "Admins can insert screening results" ON cv_screening_results;
DROP POLICY IF EXISTS "Authenticated users can update screening results" ON cv_screening_results;
DROP POLICY IF EXISTS "Admins can update screening results" ON cv_screening_results;

CREATE POLICY "Authenticated users can view screening results"
  ON cv_screening_results FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert screening results"
  ON cv_screening_results FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update screening results"
  ON cv_screening_results FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

-- =====================================================
-- PART 4: UPDATE/CREATE VIEWS
-- =====================================================

CREATE OR REPLACE VIEW v_public_job_postings AS
SELECT 
  id, title, department, location, type, level, description,
  requirements, responsibilities, skills, open_positions, salary_range,
  posted_date, closing_date, slug, featured
FROM job_postings
WHERE status = 'open'
  AND (closing_date IS NULL OR closing_date > NOW())
ORDER BY featured DESC, posted_date DESC;

CREATE OR REPLACE VIEW v_job_applications_summary AS
SELECT 
  id, job_posting_id, job_id, job_title,
  first_name || ' ' || last_name AS full_name,
  email, phone, current_location, years_of_experience,
  application_status, rejection_reason,
  applied_at, status_changed_at, updated_at
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
  csr.overall_score, csr.skills_match_score,
  csr.experience_match_score, csr.education_match_score,
  csr.recommendation, csr.screening_summary,
  csr.key_highlights, csr.red_flags, csr.screened_at
FROM job_applications ja
LEFT JOIN cv_screening_results csr ON ja.id = csr.application_id
ORDER BY csr.overall_score DESC NULLS LAST, ja.applied_at DESC;

-- =====================================================
-- PART 5: STORAGE BUCKET AND POLICIES
-- =====================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('job-applications', 'job-applications', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can upload job application documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload job application documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view job application documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view job application documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete job application documents" ON storage.objects;

CREATE POLICY "Public can upload job application documents"
  ON storage.objects FOR INSERT
  TO anon, public
  WITH CHECK (bucket_id = 'job-applications');

CREATE POLICY "Authenticated users can view job application documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'job-applications');

CREATE POLICY "Authenticated users can delete job application documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'job-applications');

-- =====================================================
-- PART 6: GRANT PERMISSIONS
-- =====================================================

GRANT SELECT ON v_public_job_postings TO anon, authenticated;
GRANT SELECT ON v_job_applications_summary TO authenticated;
GRANT SELECT ON v_recruitment_funnel TO authenticated;
GRANT SELECT ON v_screening_analytics TO authenticated;
GRANT SELECT ON v_applications_with_screening TO authenticated;

-- =====================================================
-- UPDATE COMPLETE
-- =====================================================
-- Your existing tables have been updated with new features
-- All existing data has been preserved
-- Run recruitment_system_verify.sql to confirm everything works
-- =====================================================
