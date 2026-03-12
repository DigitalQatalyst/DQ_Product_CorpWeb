-- Check the exact format of requirements and responsibilities
SELECT 
  id,
  title,
  jsonb_typeof(requirements) as req_type,
  jsonb_typeof(responsibilities) as resp_type,
  requirements,
  responsibilities
FROM job_postings
WHERE id IN (8, 9)
LIMIT 2;

-- Also check if there are any NULL values
SELECT 
  id,
  title,
  requirements IS NULL as req_null,
  responsibilities IS NULL as resp_null,
  description IS NULL as desc_null
FROM job_postings
WHERE status = 'open';
