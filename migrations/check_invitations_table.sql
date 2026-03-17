-- =====================================================
-- CHECK INVITATIONS TABLE SETUP
-- =====================================================
-- This script checks if the invitations table exists and is properly set up

-- Check if invitations table exists
SELECT 'Checking if invitations table exists...' as status;

SELECT 
    table_name,
    table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'invitations';

-- Check table structure if it exists
SELECT 'Checking invitations table structure...' as status;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'invitations'
ORDER BY ordinal_position;

-- Check RLS status
SELECT 'Checking RLS status...' as status;

SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'invitations';

-- Check existing policies
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
AND tablename = 'invitations';

-- Test inserting a sample invitation
SELECT 'Testing invitation insertion...' as status;

-- Try to insert a test invitation
INSERT INTO invitations (
    email,
    name,
    role,
    token,
    created_by,
    expires_at
) VALUES (
    'test@example.com',
    'Test User',
    'user',
    'test-token-123',
    '00000000-0000-0000-0000-000000000001',
    NOW() + INTERVAL '7 days'
) ON CONFLICT (token) DO NOTHING;

-- Check if insert worked
SELECT 'Checking if test invitation was created...' as status;

SELECT 
    id,
    email,
    name,
    role,
    status,
    created_at
FROM invitations 
WHERE email = 'test@example.com';

-- Clean up test invitation
SELECT 'Cleaning up test invitation...' as status;

DELETE FROM invitations 
WHERE email = 'test@example.com';

-- =====================================================
-- CHECK COMPLETE
-- =====================================================
