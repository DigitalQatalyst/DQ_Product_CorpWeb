-- Add slug column to job_postings table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'job_postings' AND column_name = 'slug'
  ) THEN
    ALTER TABLE job_postings ADD COLUMN slug TEXT UNIQUE;
    CREATE INDEX IF NOT EXISTS idx_job_postings_slug ON job_postings(slug);
  END IF;
END $$;

-- Generate slugs for existing records that don't have one
UPDATE job_postings
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g')) || '-' || id
WHERE slug IS NULL;

COMMENT ON COLUMN job_postings.slug IS 'URL-friendly slug for the job posting';
