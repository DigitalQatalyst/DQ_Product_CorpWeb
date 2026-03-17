-- =====================================================
-- TEST USER REGISTRATION
-- =====================================================
-- This script tests the user registration process
-- to identify any database issues

-- 1. Check if users table exists
SELECT 'Checking if users table exists...' as status;

SELECT 
    table_name,
    table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'users';

-- 2. Check table structure if it exists
SELECT 'Checking users table structure...' as status;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 3. Check RLS status
SELECT 'Checking RLS status...' as status;

SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'users';

-- 4. Check existing policies
SELECT 'Checking RLS policies...' as status;

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'users';

-- 5. Test inserting a simple user record
SELECT 'Testing user insertion...' as status;

-- Try to insert a test user
INSERT INTO users (
    id,
    email, 
    name,
    role,
    email_verified,
    is_active,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'test@example.com',
    'Test User',
    'user',
    false,
    true,
    NOW(),
    NOW()
);

-- Check if insert worked
SELECT 'Checking if test user was created...' as status;

SELECT 
    id,
    email,
    name,
    role,
    created_at
FROM users 
WHERE email = 'test@example.com';

-- 6. Clean up test user
SELECT 'Cleaning up test user...' as status;

DELETE FROM users 
WHERE email = 'test@example.com';

-- 7. Check auth.users table structure
SELECT 'Checking auth.users table structure...' as status;

SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'auth' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 8. Check if trigger exists
SELECT 'Checking user registration trigger...' as status;

SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing,
    action_condition,
    action_orientation,
    action_reference_old_table,
    action_reference_new_table
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- =====================================================
-- TEST COMPLETE
-- =====================================================
