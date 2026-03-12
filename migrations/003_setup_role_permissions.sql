-- Update role_permissions table to reference new users table
-- This table defines what actions each role can perform on resources
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role user_role NOT NULL,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  can_perform BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_permission UNIQUE(role, resource, action)
);

-- Create indexes
CREATE INDEX idx_role_permissions_role ON role_permissions(role);
CREATE INDEX idx_role_permissions_resource ON role_permissions(resource);

-- Add comment
COMMENT ON TABLE role_permissions IS 'Defines permissions for each role on various resources';

-- Drop the old role_permissions table constraints if it exists
-- This will be handled in the migration script

-- Insert default permissions for the 3 roles
-- Admin: full access to everything
INSERT INTO role_permissions (role, resource, action, can_perform) VALUES
  -- Admin permissions (all access)
  ('admin', 'users', 'read', true),
  ('admin', 'users', 'create', true),
  ('admin', 'users', 'update', true),
  ('admin', 'users', 'delete', true),
  ('admin', 'blogs', 'read', true),
  ('admin', 'blogs', 'create', true),
  ('admin', 'blogs', 'update', true),
  ('admin', 'blogs', 'delete', true),
  ('admin', 'interviews', 'read', true),
  ('admin', 'interviews', 'create', true),
  ('admin', 'interviews', 'update', true),
  ('admin', 'interviews', 'delete', true),
  ('admin', 'job_postings', 'read', true),
  ('admin', 'job_postings', 'create', true),
  ('admin', 'job_postings', 'update', true),
  ('admin', 'job_postings', 'delete', true),
  ('admin', 'form_submissions', 'read', true),
  ('admin', 'form_submissions', 'create', true),
  ('admin', 'form_submissions', 'update', true),
  ('admin', 'form_submissions', 'delete', true),
  ('admin', 'email_templates', 'read', true),
  ('admin', 'email_templates', 'create', true),
  ('admin', 'email_templates', 'update', true),
  ('admin', 'email_templates', 'delete', true),
  ('admin', 'notifications', 'read', true),
  ('admin', 'notifications', 'create', true),
  ('admin', 'notifications', 'update', true),
  ('admin', 'notifications', 'delete', true),

  -- Creator permissions
  ('creator', 'users', 'read', true),
  ('creator', 'users', 'update', true), -- Can only update own profile (RLS enforces this)
  ('creator', 'blogs', 'read', true),
  ('creator', 'blogs', 'create', true),
  ('creator', 'blogs', 'update', true), -- Can only update own blogs (RLS enforces this)
  ('creator', 'interviews', 'read', true),
  ('creator', 'interviews', 'create', true),
  ('creator', 'interviews', 'update', true), -- Can only update own interviews
  ('creator', 'form_submissions', 'read', true),

  -- Viewer permissions (read-only)
  ('viewer', 'users', 'read', true), -- Can view own profile
  ('viewer', 'blogs', 'read', true),
  ('viewer', 'interviews', 'read', true),
  ('viewer', 'job_postings', 'read', true),
  ('viewer', 'form_submissions', 'create', true) -- Can submit forms
ON CONFLICT (role, resource, action) DO NOTHING;
