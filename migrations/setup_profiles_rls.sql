-- =====================================================
-- PROFILES TABLE RLS POLICIES
-- =====================================================
-- This script sets up proper RLS policies for the profiles table

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- Create RLS policies
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
        WHERE id = auth.uid()::text 
        AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
        WHERE id = auth.uid()::text 
        AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
        WHERE id = auth.uid()::text 
        AND role = 'admin'
    )
  );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION user_has_role(user_id UUID, required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id 
    AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM public.profiles 
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test the setup
SELECT 'Testing profiles table setup...' as status;

-- Try to insert a test profile
INSERT INTO public.profiles (id, role)
VALUES (
  '00000000-0000-0000-0000-000000000001'::UUID,
  'user'
) ON CONFLICT (id) DO NOTHING;

-- Check if test worked
SELECT 
  COUNT(*) as test_profile_count
FROM public.profiles 
WHERE id = '00000000-0000-0000-0000-000000000001';

-- Clean up test
DELETE FROM public.profiles 
WHERE id = '00000000-0000-0000-0000-000000000001';

SELECT 'Profiles table setup complete!' as result;
