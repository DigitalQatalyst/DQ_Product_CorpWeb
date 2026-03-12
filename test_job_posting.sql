-- Test Job Posting Script
-- This script creates sample job postings to verify the connection between admin and public pages

-- First, check if the table exists and what columns it has
DO $$
BEGIN
  -- Check if featured column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'job_postings' AND column_name = 'featured'
  ) THEN
    ALTER TABLE job_postings ADD COLUMN featured BOOLEAN DEFAULT false;
  END IF;
  
  -- Check if skills column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'job_postings' AND column_name = 'skills'
  ) THEN
    ALTER TABLE job_postings ADD COLUMN skills JSONB;
  END IF;
  
  -- Check if open_positions column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'job_postings' AND column_name = 'open_positions'
  ) THEN
    ALTER TABLE job_postings ADD COLUMN open_positions INTEGER DEFAULT 1;
  END IF;
END $$;

-- Insert test job posting 1: Senior Full Stack Developer (OPEN)
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
  slug,
  featured
) VALUES (
  'Senior Full Stack Developer',
  'Engineering',
  'Remote (US)',
  'Full-Time',
  'Senior',
  'We are seeking an experienced Full Stack Developer to join our growing engineering team. You will work on cutting-edge digital transformation projects, building scalable web applications using modern technologies. This role offers the opportunity to work with Fortune 500 clients and make a significant impact on their digital journey.',
  ARRAY[
    'Bachelor''s degree in Computer Science or related field',
    '5+ years of professional software development experience',
    'Strong proficiency in React, TypeScript, and Node.js',
    'Experience with cloud platforms (AWS, Azure, or GCP)',
    'Solid understanding of RESTful APIs and microservices architecture',
    'Experience with SQL and NoSQL databases',
    'Strong problem-solving and analytical skills',
    'Excellent communication and teamwork abilities'
  ],
  ARRAY[
    'Design, develop, and maintain scalable web applications',
    'Collaborate with cross-functional teams to define and implement new features',
    'Write clean, maintainable, and well-documented code',
    'Participate in code reviews and provide constructive feedback',
    'Optimize application performance and ensure high availability',
    'Mentor junior developers and contribute to team knowledge sharing',
    'Stay up-to-date with emerging technologies and industry trends',
    'Participate in agile development processes and sprint planning'
  ],
  'open',
  'senior-full-stack-developer-' || EXTRACT(EPOCH FROM NOW())::bigint,
  true
);

-- Insert test job posting 2: Digital Transformation Consultant (OPEN)
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
  slug,
  featured
) VALUES (
  'Digital Transformation Consultant',
  'Consulting',
  'New York, NY',
  'Full-Time',
  'Mid-Level',
  'Join our consulting team to help organizations navigate their digital transformation journey. You will work directly with C-level executives to develop and implement strategic digital initiatives that drive business value and competitive advantage.',
  ARRAY[
    'Bachelor''s degree in Business, Technology, or related field',
    '3+ years of management consulting or digital transformation experience',
    'Strong understanding of digital technologies and their business applications',
    'Experience with change management and organizational transformation',
    'Excellent presentation and stakeholder management skills',
    'Ability to analyze complex business problems and develop actionable solutions',
    'Strong project management capabilities',
    'Willingness to travel up to 50%'
  ],
  ARRAY[
    'Lead digital transformation engagements for enterprise clients',
    'Conduct current state assessments and develop future state roadmaps',
    'Design and implement digital strategies aligned with business objectives',
    'Facilitate workshops with client stakeholders',
    'Develop business cases and ROI analyses for digital initiatives',
    'Manage project timelines, budgets, and deliverables',
    'Build and maintain strong client relationships',
    'Contribute to thought leadership and business development activities'
  ],
  'open',
  'digital-transformation-consultant-' || EXTRACT(EPOCH FROM NOW())::bigint,
  false
);

-- Insert test job posting 3: Data Scientist (CLOSED - should NOT appear on public page)
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
  slug,
  featured
) VALUES (
  'Data Scientist',
  'Data & Analytics',
  'San Francisco, CA',
  'Full-Time',
  'Senior',
  'This position has been filled. We are looking for a Data Scientist to join our analytics team.',
  ARRAY[
    'PhD or Master''s degree in Computer Science, Statistics, or related field',
    '4+ years of experience in data science or machine learning',
    'Strong programming skills in Python and R',
    'Experience with ML frameworks (TensorFlow, PyTorch, scikit-learn)'
  ],
  ARRAY[
    'Develop and deploy machine learning models',
    'Analyze large datasets to extract insights',
    'Collaborate with engineering teams'
  ],
  'closed',
  'data-scientist-' || EXTRACT(EPOCH FROM NOW())::bigint,
  false
);

-- Verify the insertions
SELECT 
  id,
  title,
  department,
  location,
  status,
  COALESCE(featured, false) as featured,
  posted_date
FROM job_postings
ORDER BY posted_date DESC
LIMIT 10;

-- Show count by status
SELECT 
  status,
  COUNT(*) as count
FROM job_postings
GROUP BY status
ORDER BY status;
