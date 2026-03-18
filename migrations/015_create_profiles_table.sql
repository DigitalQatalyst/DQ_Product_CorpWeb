-- Create profiles table for Supabase auth users
-- This table will be automatically populated via triggers when new users sign up

-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  
  -- Basic profile information
  first_name TEXT,
  last_name TEXT,
  full_name TEXT GENERATED ALWAYS AS (
    COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')
  ) STORED,
  
  -- Contact information
  email TEXT,
  phone TEXT,
  
  -- Profile details
  avatar_url TEXT,
  bio TEXT,
  
  -- Role and permissions
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'creator', 'viewer', 'hr_admin', 'hr_viewer')),
  
  -- Professional information
  title TEXT,
  company TEXT,
  department TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  
  -- Status and timestamps
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  
  -- Email verification
  email_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' OR email IS NULL)
);

-- Create indexes for performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_is_active ON profiles(is_active);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- 1. Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- 2. Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 3. Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 4. Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 5. Admins can insert new profiles
CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to handle new user signup
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
  );
  
  -- Update email verification status
  IF new.email_confirmed_at IS NOT NULL THEN
    UPDATE public.profiles 
    SET email_verified = true, 
        email_verified_at = new.email_confirmed_at
    WHERE id = new.id;
  END IF;
  
  RETURN new;
END;
$$;

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Create function to handle user email verification
CREATE OR REPLACE FUNCTION public.handle_email_verification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update email verification status in profiles
  UPDATE public.profiles 
  SET email_verified = true, 
      email_verified_at = new.email_confirmed_at
  WHERE id = new.id;
  
  RETURN new;
END;
$$;

-- Create trigger to handle email verification updates
CREATE OR REPLACE TRIGGER on_auth_user_email_verified
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (old.email_confirmed_at IS NULL AND new.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.handle_email_verification();

-- Create function to update last_login_at
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles 
  SET last_login_at = NOW()
  WHERE id = new.id;
  RETURN new;
END;
$$;

-- Create trigger to update last login on sign in
CREATE OR REPLACE TRIGGER on_user_sign_in
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (old.last_sign_in_at IS NULL OR new.last_sign_in_at > old.last_sign_in_at)
EXECUTE FUNCTION public.update_last_login();

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.profiles IS 'User profiles linked to Supabase auth.users table';
COMMENT ON COLUMN public.profiles.id IS 'Reference to auth.users.id - primary key';
COMMENT ON COLUMN public.profiles.role IS 'User role: admin (full access), creator (can write content), viewer (read-only), hr_admin, hr_viewer';
COMMENT ON COLUMN public.profiles.email IS 'User email (copied from auth.users for convenience)';
COMMENT ON COLUMN public.profiles.first_name IS 'User first name (from signup metadata)';
COMMENT ON COLUMN public.profiles.last_name IS 'User last name (from signup metadata)';
COMMENT ON COLUMN public.profiles.full_name IS 'Generated full name from first and last name';
COMMENT ON COLUMN public.profiles.avatar_url IS 'Profile picture URL';
COMMENT ON COLUMN public.profiles.bio IS 'User biography/description';
COMMENT ON COLUMN public.profiles.is_active IS 'Whether the user account is active';
COMMENT ON COLUMN public.profiles.email_verified IS 'Whether the user email has been verified';
COMMENT ON COLUMN public.profiles.last_login_at IS 'Last time the user signed in';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
