-- Fix RLS policies to allow trigger updates
-- This fixes "Database error updating user" issue

-- Drop existing policies that conflict with trigger
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation via trigger" ON public.profiles;

-- Recreate policies with proper trigger support

-- 1. Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- 2. Users can update their own profile (with trigger exception)
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (
    auth.uid() = id OR
    -- Allow updates when in trigger context
    pg_trigger_depth() > 0
  );

-- 3. Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    ) OR
    -- Allow service role
    current_setting('request.jwt.claims', true)::jsonb->>'role' = 'service_role'
  );

-- 4. Admins can update all profiles (with trigger exception)
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    ) OR
    -- Allow service role
    current_setting('request.jwt.claims', true)::jsonb->>'role' = 'service_role' OR
    -- Allow trigger context
    pg_trigger_depth() > 0
  );

-- 5. Admins can insert new profiles (with trigger exception)
CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    ) OR
    -- Allow service role
    current_setting('request.jwt.claims', true)::jsonb->>'role' = 'service_role' OR
    -- Allow trigger context
    pg_trigger_depth() > 0
  );

-- Update trigger function to be more robust
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert new profile with default values
  INSERT INTO public.profiles (id, email, first_name, last_name, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'first_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    COALESCE(
      new.raw_user_meta_data->>'first_name', 
      split_part(new.email, '@', 1), 
      ''
    ) || ' ' || COALESCE(new.raw_user_meta_data->>'last_name', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    full_name = EXCLUDED.full_name,
    updated_at = NOW();
  
  -- Update email verification status if email is already confirmed
  IF new.email_confirmed_at IS NOT NULL THEN
    UPDATE public.profiles 
    SET email_verified = true, 
        email_verified_at = new.email_confirmed_at
    WHERE id = new.id;
  END IF;
  
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error for debugging but don't fail user creation
    RAISE WARNING 'Error in handle_new_user trigger: %, SQLSTATE: %', SQLERRM, SQLSTATE;
    RETURN new;
END;
$$;

-- Recreate trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT ALL ON public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

-- Add comments
COMMENT ON POLICY "Users can update own profile" ON public.profiles IS 
  'Allows users to update their own profile, with trigger exception';

COMMENT ON POLICY "Admins can update all profiles" ON public.profiles IS 
  'Allows admins to update any profile, with trigger and service role exceptions';

COMMENT ON POLICY "Admins can insert profiles" ON public.profiles IS 
  'Allows admins to insert profiles, with trigger and service role exceptions';
