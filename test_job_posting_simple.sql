-- Simple Test Job Posting Script
-- This creates test jobs that work with any table structure

-- First, let's check what columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'job_postings'
ORDER BY ordinal_position;

-- Now insert test jobs with minimal required fields
-- Adjust the INSERT based on your actual column types

-- Test Job 1: Senior Full Stack Developer (OPEN)
INSERT INTO job_postings (
  title,
  department,
  location,
  type,
  level,
  description,
  requirements,
  responsibilities,
  status,
  slug
) VALUES (
  'Senior Full Stack Developer',
  'Engineering',
  'Remote (US)',
  'Full-Time',
  'Senior',
  'We are seeking an experienced Full Stack Developer to join our growing engineering team. You will work on cutting-edge digital transformation projects, building scalable web applications using modern technologies.',
  '["Bachelor''s degree in Computer Science", "5+ years of experience", "Strong proficiency in React and TypeScript", "Experience with cloud platforms", "Excellent communication skills"]'::jsonb,
  '["Design and develop scalable web applications", "Collaborate with cross-functional teams", "Write clean, maintainable code", "Participate in code reviews", "Mentor junior developers"]'::jsonb,
  'open',
  'senior-full-stack-developer-' || FLOOR(EXTRACT(EPOCH FROM NOW()))::text
);

-- Test Job 2: Digital Transformation Consultant (OPEN)
INSERT INTO job_postings (
  title,
  department,
  location,
  type,
  level,
  description,
  requirements,
  responsibilities,
  status,
  slug
) VALUES (
  'Digital Transformation Consultant',
  'Consulting',
  'New York, NY',
  'Full-Time',
  'Mid-Level',
  'Join our consulting team to help organizations navigate their digital transformation journey. Work directly with C-level executives to develop strategic digital initiatives.',
  '["Bachelor''s degree in Business or Technology", "3+ years of consulting experience", "Strong understanding of digital technologies", "Excellent presentation skills", "Willingness to travel"]'::jsonb,
  '["Lead digital transformation engagements", "Conduct assessments and develop roadmaps", "Design digital strategies", "Facilitate client workshops", "Manage project deliverables"]'::jsonb,
  'open',
  'digital-transformation-consultant-' || FLOOR(EXTRACT(EPOCH FROM NOW()))::text
);

-- Test Job 3: Data Scientist (CLOSED - should NOT appear on public page)
INSERT INTO job_postings (
  title,
  department,
  location,
  type,
  level,
  description,
  requirements,
  responsibilities,
  status,
  slug
) VALUES (
  'Data Scientist',
  'Data & Analytics',
  'San Francisco, CA',
  'Full-Time',
  'Senior',
  'This position has been filled. Looking for a Data Scientist to join our analytics team.',
  '["PhD or Master''s degree", "4+ years of data science experience", "Strong Python and R skills", "Experience with ML frameworks"]'::jsonb,
  '["Develop machine learning models", "Analyze large datasets", "Collaborate with engineering teams"]'::jsonb,
  'closed',
  'data-scientist-' || FLOOR(EXTRACT(EPOCH FROM NOW()))::text
);

-- Verify the insertions
SELECT 
  id,
  title,
  department,
  location,
  status,
  posted_date,
  created_at
FROM job_postings
ORDER BY created_at DESC
LIMIT 10;

-- Show count by status
SELECT 
  status,
  COUNT(*) as count
FROM job_postings
GROUP BY status
ORDER BY status;
