-- =====================================================
-- CREATE USERS TABLE WITH ROLE SYSTEM
-- =====================================================
-- This migration creates the users table with role-based access control
-- for the new authentication system

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Information
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'hr', 'editor')),
  
  -- Profile
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  location TEXT,
  
  -- Verification Status
  email_verified BOOLEAN DEFAULT false,
  verification_token TEXT,
  verification_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_users_updated_at ON users;
CREATE TRIGGER trigger_update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_users_updated_at();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view users" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

-- Create RLS policies
CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can view all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text 
      AND role = 'admin'
      AND is_active = true
    )
  );

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Admins can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text 
      AND role = 'admin'
      AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text 
      AND role = 'admin'
      AND is_active = true
    )
  );

-- Create function to handle user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- This trigger will be called when a new user signs up through Supabase Auth
  -- It will create a corresponding record in the users table
  
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    'user'  -- Default role
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create view for public user profiles (for team pages, etc.)
CREATE OR REPLACE VIEW v_public_user_profiles AS
SELECT 
  id,
  name,
  avatar_url,
  bio,
  location,
  created_at
FROM users
WHERE is_active = true
  AND email_verified = true;

-- Grant permissions
GRANT SELECT ON v_public_user_profiles TO anon, authenticated;

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION user_has_role(user_id UUID, required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = user_id 
    AND role = required_role 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM users 
    WHERE id = user_id 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON TABLE users IS 'User profiles with role-based access control';
COMMENT ON COLUMN users.role IS 'User role: user, admin, hr, editor';
COMMENT ON COLUMN users.email_verified IS 'Whether the user has verified their email address';
COMMENT ON VIEW v_public_user_profiles IS 'Public view of verified user profiles';
COMMENT ON FUNCTION user_has_role IS 'Check if a user has a specific role';
COMMENT ON FUNCTION get_user_role IS 'Get the role of a user';

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Create an admin user (you'll need to set this up properly with actual auth)
-- INSERT INTO users (id, email, name, role, email_verified)
-- VALUES ('00000000-0000-0000-0000-000000000001', 'admin@example.com', 'Admin User', 'admin', true)
-- ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
