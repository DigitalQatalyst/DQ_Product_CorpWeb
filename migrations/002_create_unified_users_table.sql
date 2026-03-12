-- Create unified users table
-- This table consolidates auth.users, admin_users, authors, and user_roles
-- into a single source of truth for all application users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Authentication reference
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic user info
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,

  -- Author/Creator profile info
  title TEXT,
  bio TEXT,
  avatar_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,

  -- Role and status
  role user_role NOT NULL DEFAULT 'viewer',
  is_active BOOLEAN DEFAULT true,

  -- Department (for HR/Admin tracking)
  department TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,

  -- Constraints
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create index for faster lookups by auth_user_id
CREATE INDEX idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Enable Row-Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Add comment
COMMENT ON TABLE users IS 'Unified user table consolidating auth, authors, admins, and roles';
COMMENT ON COLUMN users.auth_user_id IS 'Reference to Supabase auth.users - the source of truth for Azure B2C authenticated users';
COMMENT ON COLUMN users.role IS 'User role: admin (full access), creator (can write content), viewer (read-only)';
