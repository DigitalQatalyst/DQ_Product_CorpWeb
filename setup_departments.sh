#!/bin/bash

# Departments Setup Script
# This script will set up the departments table in Supabase

echo "🚀 Setting up departments table in Supabase..."

# Check if supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if user is logged in to Supabase
echo "📋 Checking Supabase authentication..."
if ! supabase status &> /dev/null; then
    echo "❌ You are not logged in to Supabase. Please run:"
    echo "supabase login"
    exit 1
fi

# Get the project URL and anon key
echo "🔗 Getting project info..."
SUPABASE_URL=$(supabase status | grep "API URL:" | cut -d' ' -f2)
SUPABASE_ANON_KEY=$(supabase status | grep "anon key:" | cut -d' ' -f2)

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Could not retrieve Supabase project info. Make sure you're in the correct project directory."
    exit 1
fi

echo "✅ Supabase project found: $SUPABASE_URL"

# Run the SQL migration
echo "🗃️ Creating departments table..."

# Create a temporary SQL file
cat > /tmp/setup_departments.sql << 'EOF'
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
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create policy to allow only admin users to update departments
CREATE POLICY "Only admins can update departments" ON departments
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Create policy to allow only admin users to delete departments
CREATE POLICY "Only admins can delete departments" ON departments
  FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');
EOF

# Get the project reference from supabase config
PROJECT_REF=$(supabase status | grep "Project URL:" | sed 's|.*/\(project[^)]*\).*|\1|' | sed 's/.*ref=\([^)]*\).*/\1/')

# Execute SQL using curl
echo "📊 Executing SQL migration..."
RESPONSE=$(curl -X POST "$SUPABASE_URL/rest/v1/rpc/execute_sql" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d "{\"sql\": \"$(cat /tmp/setup_departments.sql | tr '\n' ' ' | sed 's/"/\\"/g')\", \"project_ref\": \"$PROJECT_REF\"}")

# Check for SQL errors in response
if echo "$RESPONSE" | grep -q "error\|Error\|failed\|syntax"; then
    echo "❌ Migration failed. Response:"
    echo "$RESPONSE" | jq -r '.error // .message // .details // "SQL migration failed"'
    echo ""
    echo "🔧 You may need to run the SQL manually in your Supabase dashboard:"
    echo "https://app.supabase.com/project/_/sql"
    echo ""
    echo "📋 Common issues to check:"
    echo "  - SQL syntax errors"
    echo "  - Missing RLS policies"
    echo "  - Insufficient permissions"
    exit 1
else
    echo "✅ Departments table created successfully!"
    echo ""
    echo "📋 Default departments inserted:"
    echo "  - Engineering"
    echo "  - Product"
    echo "  - Design"
    echo "  - Marketing"
    echo "  - Sales"
    echo "  - HR"
    echo "  - Finance"
    echo "  - Operations"
    echo "  - Legal"
    echo "  - Executive"
    echo "  - Other"
fi

# Clean up
rm -f /tmp/setup_departments.sql

echo ""
echo "🎉 Setup complete! You can now:"
echo "  1. Manage departments via: /admin-ui/departments"
echo "  2. Create job postings with dynamic department selection"
echo ""
echo "💡 The SQL file is also available at: supabase/migrations/001_create_departments.sql"
