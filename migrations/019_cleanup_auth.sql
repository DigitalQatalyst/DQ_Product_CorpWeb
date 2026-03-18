-- Clean up all complex auth objects and keep it simple
-- Run this to remove profiles table and related triggers

-- Drop all triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_email_verified ON auth.users;
DROP TRIGGER IF EXISTS on_user_sign_in ON auth.users;
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;

-- Drop all functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_email_verification();
DROP FUNCTION IF EXISTS public.update_last_login();
DROP FUNCTION IF EXISTS public.handle_updated_at();
DROP FUNCTION IF EXISTS public.is_admin(user_id UUID);
DROP FUNCTION IF EXISTS public.update_user_metadata(user_id UUID, metadata JSONB);

-- Drop views
DROP VIEW IF EXISTS admin_users_view;

-- Drop tables
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop all policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation via trigger" ON public.profiles;

-- Clean up any remaining objects
DROP FUNCTION IF EXISTS public.sync_user_from_b2c(
  authUserId TEXT,
  email TEXT,
  name TEXT,
  givenName TEXT,
  familyName TEXT,
  avatarUrl TEXT
);

DROP FUNCTION IF EXISTS public.get_user_permissions(authUserId TEXT);
DROP FUNCTION IF EXISTS public.check_user_permission(
  authUserId TEXT,
  resource TEXT,
  action TEXT
);

-- Simple authentication is now ready
-- Users can sign up, sign in, and manage their own metadata
-- No complex profiles table or triggers needed
