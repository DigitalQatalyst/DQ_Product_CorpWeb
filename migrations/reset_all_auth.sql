-- =====================================================
-- COMPLETE AUTHENTICATION RESET
-- =====================================================
-- This script resets ALL authentication changes to start fresh
-- WARNING: This will delete all user data and auth setup

-- 1. Drop all custom tables
SELECT 'Dropping custom tables...' as status;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;

-- 2. Drop all custom functions
SELECT 'Dropping custom functions...' as status;

DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_users_updated_at() CASCADE;
DROP FUNCTION IF EXISTS user_has_role(UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS get_user_role(UUID) CASCADE;

-- 3. Drop all triggers
SELECT 'Dropping custom triggers...' as status;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trigger_update_users_updated_at ON users;

-- 4. Drop all views
SELECT 'Dropping custom views...' as status;

DROP VIEW IF EXISTS v_public_user_profiles CASCADE;

-- 5. Drop all policies
SELECT 'Dropping custom policies...' as status;

DROP POLICY IF EXISTS "Public can view users" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

-- 6. Clean up auth.users triggers (if any)
SELECT 'Cleaning auth.users triggers...' as status;

-- Remove any existing triggers on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 7. Reset auth.users table to original state
SELECT 'Resetting auth.users table...' as status;

-- Remove any custom columns that might have been added
ALTER TABLE auth.users DROP COLUMN IF EXISTS name;
ALTER TABLE auth.users DROP COLUMN IF EXISTS role;
ALTER TABLE auth.users DROP COLUMN IF EXISTS avatar_url;
ALTER TABLE auth.users DROP COLUMN IF EXISTS bio;
ALTER TABLE auth.users DROP COLUMN IF EXISTS phone;
ALTER TABLE auth.users DROP COLUMN IF EXISTS location;

-- 8. Clean up any remaining RLS on public tables
SELECT 'Disabling RLS on all public tables...' as status;

-- Disable RLS on all public tables
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- 9. Reset auth schema
SELECT 'Resetting auth schema...' as status;

-- Ensure auth schema is clean
DO $$
DECLARE
    table_rec RECORD;
BEGIN
    FOR table_rec IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'auth' 
        AND table_name NOT IN ('users', 'sessions', 'refresh_tokens', 'migrations')
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS auth.' || quote_ident(table_rec.table_name) || ' CASCADE';
    END LOOP;
END $$;

-- 10. Check final state
SELECT 'Checking final database state...' as status;

-- Show what's left in public schema
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Show what's left in auth schema
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'auth' 
ORDER BY table_name;

-- Show remaining functions
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
ORDER BY routine_name;

-- Show remaining triggers
SELECT 
    trigger_name,
    event_object_table
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
ORDER BY trigger_name;

-- =====================================================
-- RESET COMPLETE - Database is now clean
-- =====================================================
-- Now you can run the original create_users_with_roles.sql
-- to set up authentication properly
