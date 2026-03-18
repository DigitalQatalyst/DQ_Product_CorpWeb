-- ============================================
-- Supabase Auth Setup - Admin User Creation
-- ============================================
-- Run this in your Supabase SQL Editor to set up admin users
-- ============================================

-- Function to set user role
CREATE OR REPLACE FUNCTION set_user_role(
  user_email TEXT, 
  role TEXT DEFAULT 'admin'
) RETURNS VOID AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || 
      jsonb_build_object(
        'role', role, 
        'is_admin', role = 'admin',
        'is_creator', role IN ('admin', 'creator'),
        'is_viewer', role IN ('admin', 'creator', 'viewer')
      )
  WHERE email = user_email;
  
  RAISE NOTICE 'User % set to role: %', user_email, role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create admin user directly
CREATE OR REPLACE FUNCTION create_admin_user(
  user_email TEXT,
  user_password TEXT DEFAULT NULL,
  first_name TEXT DEFAULT NULL,
  last_name TEXT DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
  new_user auth.users%ROWTYPE;
BEGIN
  -- If password provided, create new user via Supabase Auth API
  IF user_password IS NOT NULL THEN
    -- This requires calling Supabase signup API from client
    -- This function just sets up the role after creation
    RAISE INFO 'To create a new user, use the signup page or Supabase dashboard';
    RETURN jsonb_build_object('error', 'Use signup API or dashboard for new users');
  END IF;
  
  -- Set existing user as admin
  PERFORM set_user_role(user_email, 'admin');
  
  RETURN jsonb_build_object('success', true, 'email', user_email);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to list all users with their roles
CREATE OR REPLACE FUNCTION list_users_with_roles()
RETURNS TABLE (
  id UUID,
  email TEXT,
  role TEXT,
  is_admin BOOLEAN,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    (au.raw_app_meta_data->>'role')::TEXT as role,
    (au.raw_app_meta_data->>'is_admin')::BOOLEAN as is_admin,
    au.created_at,
    au.last_sign_in_at
  FROM auth.users au
  ORDER BY au.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to remove admin role
CREATE OR REPLACE FUNCTION remove_user_role(
  user_email TEXT
) RETURNS VOID AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data - 'role' - 'is_admin' - 'is_creator' - 'is_viewer'
  WHERE email = user_email;
  
  RAISE NOTICE 'Removed roles from user: %', user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- USAGE EXAMPLES
-- ============================================

-- Example 1: Set existing user as admin
-- SELECT set_user_role('your-email@example.com', 'admin');

-- Example 2: Set user as creator
-- SELECT set_user_role('creator-email@example.com', 'creator');

-- Example 3: Set user as viewer
-- SELECT set_user_role('viewer-email@example.com', 'viewer');

-- Example 4: Set user as HR Admin
-- SELECT set_user_role('hr-admin@example.com', 'HR-Admin');

-- Example 5: Set user as HR Viewer
-- SELECT set_user_role('hr-viewer@example.com', 'HR-viewer');

-- Example 6: List all users with roles
-- SELECT * FROM list_users_with_roles();

-- Example 7: Remove roles from user
-- SELECT remove_user_role('user-email@example.com');

-- ============================================
-- QUICK SETUP FOR FIRST ADMIN USER
-- ============================================
-- After signing up your first user via /signup, run:
-- SELECT set_user_role('YOUR_EMAIL@example.com', 'admin');

-- ============================================
-- VIEW CURRENT USER ROLES
-- ============================================
-- Quick query to see all users and their metadata
SELECT 
  email,
  raw_app_meta_data->>'role' as role,
  raw_app_meta_data->>'is_admin' as is_admin,
  created_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;
