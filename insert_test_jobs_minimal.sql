-- Minimal test job insertions
-- Run this if you're having issues with the other scripts

-- Job 1: OPEN (will appear on public page)
INSERT INTO job_postings (
  title,
  department,
  location,
  type,
  level,
  description,
  requirements,
  responsibilities,
  status
) VALUES (
  'Senior Full Stack Developer',
  'Engineering', 
  'Remote (US)',
  'Full-Time',
  'Senior',
  'Experienced developer needed for digital transformation projects.',
  '{"items": ["5+ years experience", "React/TypeScript skills", "Cloud platform knowledge"]}'::jsonb,
  '{"items": ["Build web applications", "Code reviews", "Mentor team"]}'::jsonb,
  'open'
);

-- Job 2: OPEN (will appear on public page)  
INSERT INTO job_postings (
  title,
  department,
  location,
  type,
  level,
  description,
  requirements,
  responsibilities,
  status
) VALUES (
  'Digital Transformation Consultant',
  'Consulting',
  'New York, NY', 
  'Full-Time',
  'Mid-Level',
  'Help clients with digital transformation initiatives.',
  '{"items": ["3+ years consulting", "Digital strategy knowledge", "Client management"]}'::jsonb,
  '{"items": ["Lead engagements", "Develop roadmaps", "Facilitate workshops"]}'::jsonb,
  'open'
);

-- Job 3: CLOSED (will NOT appear on public page)
INSERT INTO job_postings (
  title,
  department,
  location,
  type,
  level,
  description,
  requirements,
  responsibilities,
  status
) VALUES (
  'Data Scientist',
  'Data & Analytics',
  'San Francisco, CA',
  'Full-Time', 
  'Senior',
  'Position filled.',
  '{"items": ["PhD preferred", "ML experience", "Python/R"]}'::jsonb,
  '{"items": ["Build ML models", "Analyze data", "Collaborate"]}'::jsonb,
  'closed'
);

-- Show results
SELECT id, title, status, department FROM job_postings ORDER BY id DESC LIMIT 5;
