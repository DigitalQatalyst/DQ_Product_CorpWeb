-- =====================================================
-- UPDATE JOB POSTINGS TABLE TO SUPPORT ALL FORM FIELDS
-- =====================================================
-- Run this in your Supabase SQL Editor to add missing columns
-- =====================================================

-- First, let's check what columns currently exist
-- (This is a comment, run the query below to see actual columns)

-- Add missing columns to existing job_postings table
ALTER TABLE job_postings 
ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS open_positions INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS closing_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS filled_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add unique constraint for slug if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'job_postings_slug_key') THEN
        ALTER TABLE job_postings ADD CONSTRAINT job_postings_slug_key UNIQUE (slug);
    END IF;
END
$$;

-- Add comment to new columns
COMMENT ON COLUMN job_postings.skills IS 'Skills and competencies for the job position (core and behavioral)';
COMMENT ON COLUMN job_postings.open_positions IS 'Number of open positions for this job';
COMMENT ON COLUMN job_postings.closing_date IS 'Application closing date for the position';
COMMENT ON COLUMN job_postings.filled_date IS 'Date when the position was filled';
COMMENT ON COLUMN job_postings.slug IS 'SEO-friendly URL slug for the job posting';
COMMENT ON COLUMN job_postings.featured IS 'Whether this job posting is featured on the careers page';

-- Update existing records to have default values if NULL
UPDATE job_postings 
SET open_positions = 1 
WHERE open_positions IS NULL;

UPDATE job_postings 
SET featured = false 
WHERE featured IS NULL;

-- Create index on skills for better performance (optional)
CREATE INDEX IF NOT EXISTS idx_job_postings_skills ON job_postings USING GIN (skills) WHERE skills IS NOT NULL;

-- Create index on slug for better performance
CREATE INDEX IF NOT EXISTS idx_job_postings_slug ON job_postings(slug) WHERE slug IS NOT NULL;

-- Update the public view to include available fields (skip non-existent columns)
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
  slug,
  featured,
  open_positions,
  skills
FROM job_postings
WHERE status = 'open'
ORDER BY featured DESC, posted_date DESC;

-- Update comment on view
COMMENT ON VIEW v_public_job_postings IS 'Public view of open job positions for careers page - includes skills and open positions';

-- Verify the changes - show current table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'job_postings' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
