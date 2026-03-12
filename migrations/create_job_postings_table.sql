-- Create job_postings table for managing open positions
CREATE TABLE IF NOT EXISTS job_postings (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL, -- Full-time, Part-time, Contract
  level TEXT NOT NULL, -- Entry-Level, Mid-Level, Senior-Level
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL, -- Array of requirements
  responsibilities TEXT[] NOT NULL, -- Array of responsibilities
  
  -- Status and metadata
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'filled', 'draft')),
  posted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closing_date TIMESTAMP WITH TIME ZONE,
  filled_date TIMESTAMP WITH TIME ZONE,
  
  -- SEO and display
  slug TEXT UNIQUE,
  featured BOOLEAN DEFAULT false,
  
  -- Tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON job_postings(status);
CREATE INDEX IF NOT EXISTS idx_job_postings_department ON job_postings(department);
CREATE INDEX IF NOT EXISTS idx_job_postings_posted_date ON job_postings(posted_date DESC);
CREATE INDEX IF NOT EXISTS idx_job_postings_slug ON job_postings(slug);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_job_postings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_job_postings_updated_at
  BEFORE UPDATE ON job_postings
  FOR EACH ROW
  EXECUTE FUNCTION update_job_postings_updated_at();

-- Enable Row Level Security
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view open positions
CREATE POLICY "Anyone can view open job postings"
  ON job_postings
  FOR SELECT
  USING (status = 'open');

-- Policy: Authenticated users can view all positions
CREATE POLICY "Admins can view all job postings"
  ON job_postings
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can create positions
CREATE POLICY "Admins can create job postings"
  ON job_postings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update positions
CREATE POLICY "Admins can update job postings"
  ON job_postings
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Authenticated users can delete positions
CREATE POLICY "Admins can delete job postings"
  ON job_postings
  FOR DELETE
  TO authenticated
  USING (true);

-- Create view for public job listings
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
  posted_date,
  closing_date,
  slug,
  featured
FROM job_postings
WHERE status = 'open'
  AND (closing_date IS NULL OR closing_date > NOW())
ORDER BY featured DESC, posted_date DESC;

-- Add foreign key to job_applications
ALTER TABLE job_applications
ADD COLUMN IF NOT EXISTS job_posting_id INTEGER REFERENCES job_postings(id);

-- Create index on the foreign key
CREATE INDEX IF NOT EXISTS idx_job_applications_posting_id ON job_applications(job_posting_id);

COMMENT ON TABLE job_postings IS 'Stores job postings/open positions managed by HR admins';
COMMENT ON VIEW v_public_job_postings IS 'Public view of open job positions for the careers page';
