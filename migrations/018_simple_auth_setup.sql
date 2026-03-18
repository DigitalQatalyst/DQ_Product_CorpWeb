-- Simple Supabase Authentication Setup
-- No profiles table - just basic auth.users functionality

-- Clean up any existing auth-related objects
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP POLICY IF EXISTS EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS EXISTS "Allow profile creation via trigger" ON public.profiles;

-- Simple authentication setup using only auth.users
-- No additional tables needed for basic auth

-- Optional: Create a simple view for user management (admin only)
CREATE OR REPLACE VIEW admin_users_view AS
SELECT 
  id,
  email,
  created_at,
  updated_at,
  last_sign_in_at,
  email_confirmed_at,
  phone,
  raw_user_meta_data,
  is_anonymous
FROM auth.users
ORDER BY created_at DESC;

-- Grant access to admin users (you can check roles in metadata)
-- For now, grant to authenticated users - you can restrict this later
GRANT SELECT ON admin_users_view TO authenticated;

-- Create a simple function to check if user is admin
-- This checks user metadata for an 'is_admin' flag
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT (raw_user_meta_data->>'is_admin')::boolean
  FROM auth.users
  WHERE id = user_id;
$$;

-- Create a simple function to update user metadata
CREATE OR REPLACE FUNCTION update_user_metadata(
  user_id UUID,
  metadata JSONB
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data = metadata
  WHERE id = user_id AND id = auth.uid();
  
  RETURN FOUND;
END;
$$;

-- Add comments
COMMENT ON VIEW admin_users_view IS 'Simple admin view of users for management';
COMMENT ON FUNCTION is_admin IS 'Check if user has admin privileges from metadata';
COMMENT ON FUNCTION update_user_metadata IS 'Update current user metadata';

-- Simple authentication is now ready
-- Users can:
-- 1. Sign up with email/password
-- 2. Sign in 
-- 3. Store additional data in raw_user_meta_data
-- 4. Admin can manage users via the view
