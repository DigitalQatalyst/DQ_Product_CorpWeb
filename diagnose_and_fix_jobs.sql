-- Diagnostic and Fix Script for Job Postings

-- Step 1: Check if jobs exist
SELECT 
  id,
  title,
  status,
  requirements,
  responsibilities,
  pg_typeof(requirements) as req_type,
  pg_typeof(responsibilities) as resp_type
FROM job_postings
LIMIT 5;

-- Step 2: Check the data format
SELECT 
  id,
  title,
  jsonb_typeof(requirements) as req_json_type,
  jsonb_typeof(responsibilities) as resp_json_type,
  requirements,
  responsibilities
FROM job_postings
WHERE status = 'open'
LIMIT 3;

-- Step 3: Fix the data format if needed
-- The frontend expects requirements and responsibilities to be arrays, not objects

-- Update all jobs to have array format
UPDATE job_postings
SET 
  requirements = CASE 
    WHEN jsonb_typeof(requirements) = 'object' AND requirements ? 'items' THEN 
      requirements->'items'
    WHEN jsonb_typeof(requirements) = 'array' THEN 
      requirements
    ELSE 
      '[]'::jsonb
  END,
  responsibilities = CASE 
    WHEN jsonb_typeof(responsibilities) = 'object' AND responsibilities ? 'items' THEN 
      responsibilities->'items'
    WHEN jsonb_typeof(responsibilities) = 'array' THEN 
      responsibilities
    ELSE 
      '[]'::jsonb
  END
WHERE jsonb_typeof(requirements) != 'array' OR jsonb_typeof(responsibilities) != 'array';

-- Step 4: Verify the fix
SELECT 
  id,
  title,
  status,
  jsonb_typeof(requirements) as req_type,
  jsonb_typeof(responsibilities) as resp_type,
  jsonb_array_length(requirements) as req_count,
  jsonb_array_length(responsibilities) as resp_count
FROM job_postings
WHERE status = 'open';

-- Step 5: Show the final data
SELECT 
  id,
  title,
  department,
  location,
  type,
  level,
  status,
  requirements,
  responsibilities
FROM job_postings
WHERE status = 'open'
ORDER BY id DESC;
