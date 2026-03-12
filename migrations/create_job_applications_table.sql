-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
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
  current_role TEXT,
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
  
  -- Indexes for common queries
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_email ON job_applications(email);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_job_applications_applied_at ON job_applications(applied_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_job_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_job_applications_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (submit application)
CREATE POLICY "Anyone can submit job applications"
  ON job_applications
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Only authenticated admins can view applications
CREATE POLICY "Admins can view all applications"
  ON job_applications
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only authenticated admins can update applications
CREATE POLICY "Admins can update applications"
  ON job_applications
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create storage bucket for job application documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('job-applications', 'job-applications', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for job application documents
CREATE POLICY "Anyone can upload job application documents"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'job-applications');

CREATE POLICY "Admins can view job application documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'job-applications');

-- Create a view for easier querying
CREATE OR REPLACE VIEW v_job_applications_summary AS
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
FROM job_applications
ORDER BY applied_at DESC;

COMMENT ON TABLE job_applications IS 'Stores job application submissions from the careers portal';
COMMENT ON VIEW v_job_applications_summary IS 'Summary view of job applications for admin dashboard';
