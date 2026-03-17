-- =====================================================
-- RESET AUTH.USERS TO DEFAULT STATE
-- =====================================================
-- This script resets auth.users table to Supabase defaults

-- 1. First, let's see what columns currently exist in auth.users
SELECT 'Current auth.users columns:' as status;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'auth' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 2. Drop any custom columns that were added
SELECT 'Dropping custom columns from auth.users...' as status;

-- Remove custom columns if they exist
ALTER TABLE auth.users DROP COLUMN IF EXISTS name;
ALTER TABLE auth.users DROP COLUMN IF EXISTS role;
ALTER TABLE auth.users DROP COLUMN IF EXISTS avatar_url;
ALTER TABLE auth.users DROP COLUMN IF EXISTS bio;
ALTER TABLE auth.users DROP COLUMN IF EXISTS phone;
ALTER TABLE auth.users DROP COLUMN IF EXISTS location;
ALTER TABLE auth.users DROP COLUMN IF EXISTS email_verified;
ALTER TABLE auth.users DROP COLUMN IF EXISTS is_active;
ALTER TABLE auth.users DROP COLUMN IF EXISTS last_login_at;
ALTER TABLE auth.users DROP COLUMN IF EXISTS verification_token;
ALTER TABLE auth.users DROP COLUMN IF EXISTS verification_expires_at;

-- 3. Check if there are any remaining non-standard columns
SELECT 'Checking for remaining custom columns...' as status;

SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_schema = 'auth' 
AND table_name = 'users'
AND column_name NOT IN (
    'id', 'instance_id', 'aud', 'role', 'email', 'encrypted_password', 
    'email_confirmed_at', 'invited_at', 'confirmation_token', 
    'recovery_token', 'email_change_token_new', 'email_change', 
    'created_at', 'updated_at', 'last_sign_in_at', 'phone', 
    'phone_confirmed_at', 'phone_change', 'phone_change_token', 
    'email_change_token_current', 'banned_until', 'recovery_sent_at'
);

-- 4. Drop all custom triggers on auth.users
SELECT 'Dropping custom triggers from auth.users...' as status;

-- Drop any custom triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;
DROP TRIGGER IF EXISTS auth_user_created_trigger ON auth.users;

-- 5. Drop custom functions that might exist
SELECT 'Dropping custom functions...' as status;

DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS auth.handle_new_user() CASCADE;

-- 6. Reset auth.users to original structure
SELECT 'Resetting auth.users to default structure...' as status;

-- Ensure auth.users has only default columns
-- The default Supabase auth.users columns are:
-- id, instance_id, aud, role, email, encrypted_password, 
-- email_confirmed_at, invited_at, confirmation_token, 
-- recovery_token, email_change_token_new, email_change, 
-- created_at, updated_at, last_sign_in_at, phone, 
-- phone_confirmed_at, phone_change, phone_change_token, 
-- email_change_token_current, banned_until, recovery_sent_at

-- 7. Check final state
SELECT 'Final auth.users structure:' as status;

SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'auth' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 8. Check for any remaining custom triggers
SELECT 'Checking for remaining triggers:' as status;

SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing
FROM information_schema.triggers 
WHERE trigger_schema = 'auth' 
AND trigger_name NOT IN (
    -- Default Supabase triggers (if any)
    'auth.users_email_confirmed_at_trigger',
    'auth.users_last_sign_in_at_trigger'
);

-- 9. Show what's left in public schema
SELECT 'Public schema tables after reset:' as status;

SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- =====================================================
-- RESET COMPLETE
-- =====================================================
-- auth.users is now back to default Supabase state
-- You can now run clean_auth_setup.sql to set up users table properly
