-- Migration to add missing slug column to job_postings table
-- This addresses the error: "Could not find the 'slug' column of 'job_postings' in the schema cache"

-- Add the slug column as TEXT type with UNIQUE constraint
ALTER TABLE job_postings 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create an index on the slug column for better performance
CREATE INDEX IF NOT EXISTS idx_job_postings_slug ON job_postings(slug);

-- Update existing records to have slugs if they don't already have them
-- This generates slugs based on the job title
UPDATE job_postings 
SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

-- Ensure the slug column is NOT NULL after populating existing records
-- (Commented out in case you want to keep it nullable initially)
-- ALTER TABLE job_postings ALTER COLUMN slug SET NOT NULL;

-- Refresh the schema cache by resetting the search_path
-- This helps ensure Supabase recognizes the new column
SET search_path TO public, auth, extensions;