-- Fix the profile creation trigger to work with RLS
-- This fixes the "Database error saving new user" issue during signup

-- First, drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a new trigger function that properly handles RLS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert new profile with default values, bypassing RLS
  -- Use INSERT ... ON CONFLICT to handle any existing profiles
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
END;
$$;

-- Recreate the trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Add a bypass policy for the trigger function
-- This allows the trigger to insert profiles regardless of RLS
CREATE POLICY "Enable insert for authenticated users with bypass" ON profiles
  FOR INSERT WITH CHECK (true);

-- Grant necessary permissions to the service role
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.profiles TO authenticated;

-- Add comment explaining the fix
COMMENT ON POLICY "Enable insert for authenticated users with bypass" ON profiles IS 
  'Allows profile creation via trigger, bypassing RLS for new user signup';

-- Test the trigger function (optional - can be removed in production)
-- This creates a test user to verify the trigger works
-- Note: Remove this block in production
/*
DO $$
DECLARE
  test_user_id UUID := gen_random_uuid();
BEGIN
  -- Simulate auth.users insert
  INSERT INTO auth.users (id, email, raw_user_meta_data, email_confirmed_at)
  VALUES (
    test_user_id,
    'test@example.com',
    '{"first_name": "Test", "last_name": "User"}',
    NOW()
  );
  
  -- Check if profile was created
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = test_user_id) THEN
    RAISE NOTICE 'Trigger test: Profile created successfully';
  ELSE
    RAISE NOTICE 'Trigger test: Profile creation failed';
  END IF;
  
  -- Clean up test data
  DELETE FROM public.profiles WHERE id = test_user_id;
  DELETE FROM auth.users WHERE id = test_user_id;
END $$;
*/
