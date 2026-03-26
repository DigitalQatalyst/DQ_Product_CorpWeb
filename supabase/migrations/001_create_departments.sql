-- Create departments table for job postings
-- This table will store all available departments

-- Drop table if it exists (for development)
DROP TABLE IF EXISTS departments CASCADE;

-- Create departments table
CREATE TABLE departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX idx_departments_name ON departments(name);

-- Insert default departments
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

-- Enable Row Level Security (RLS)
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read departments
CREATE POLICY "Departments are viewable by all authenticated users" ON departments
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow only admin users to insert departments
CREATE POLICY "Only admins can insert departments" ON departments
  FOR INSERT WITH CHECK (auth.jwt()->>'role' = 'admin');

-- Create policy to allow only admin users to update departments
CREATE POLICY "Only admins can update departments" ON departments
  FOR UPDATE USING (auth.jwt()->>'role' = 'admin');

-- Create policy to allow only admin users to delete departments
CREATE POLICY "Only admins can delete departments" ON departments
  FOR DELETE USING (auth.jwt()->>'role' = 'admin');
