-- Quick Departments Fix
-- Run this in your Supabase SQL Editor

-- Step 1: Drop and recreate table (if needed)
DROP TABLE IF EXISTS departments CASCADE;

-- Step 2: Create simple table without RLS first
CREATE TABLE departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Insert departments
INSERT INTO departments (name, description) VALUES
('Engineering', 'Software engineering, hardware engineering, and technical roles'),
('Product', 'Product management, product design, and product strategy'),
('Design', 'UI/UX design, graphic design, and creative roles'),
('Marketing', 'Digital marketing, content marketing, and brand management'),
('Sales', 'Sales development, account management, and business development'),
('HR', 'Human resources, recruitment, and people operations'),
('Finance', 'Financial planning, accounting, and financial analysis'),
('Operations', 'Operations management, logistics, and process optimization'),
('Legal', 'Legal counsel, compliance, and regulatory affairs'),
('Executive', 'C-level roles, leadership, and strategic management'),
('Other', 'Roles that don''t fit into other categories');

-- Step 4: Test query (should return 11 rows)
SELECT COUNT(*) as department_count FROM departments;

-- Step 5: Enable RLS (optional - remove if causing issues)
-- ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Step 6: Simple public read policy (if RLS enabled)
-- CREATE POLICY "Public read access" ON departments FOR SELECT USING (true);

-- Verify the data
SELECT * FROM departments ORDER BY name;
