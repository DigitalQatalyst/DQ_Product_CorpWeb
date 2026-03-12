-- Fix RLS policies for authors table
-- This script addresses common RLS issues that prevent author creation

-- First, let's check if the table exists and has RLS enabled
-- DROP existing policies to recreate them properly
DROP POLICY IF EXISTS "Authors are viewable by authenticated users" ON authors;
DROP POLICY IF EXISTS "Authors can be created by authenticated users" ON authors;
DROP POLICY IF EXISTS "Authors can be updated by authenticated users" ON authors;
DROP POLICY IF EXISTS "Authors can be deleted by authenticated users" ON authors;

-- Temporarily disable RLS to test if that's the issue
-- ALTER TABLE authors DISABLE ROW LEVEL SECURITY;

-- Create more permissive policies for testing
-- Policy for reading authors (allow all authenticated users)
CREATE POLICY "Authors are viewable by authenticated users" ON authors
    FOR SELECT USING (
        auth.role() = 'authenticated' OR 
        auth.role() = 'anon'
    );

-- Policy for creating authors (allow authenticated users)
CREATE POLICY "Authors can be created by authenticated users" ON authors
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' OR
        auth.role() = 'service_role'
    );

-- Policy for updating authors (allow authenticated users)
CREATE POLICY "Authors can be updated by authenticated users" ON authors
    FOR UPDATE USING (
        auth.role() = 'authenticated' OR
        auth.role() = 'service_role'
    );

-- Policy for deleting authors (allow authenticated users)
CREATE POLICY "Authors can be deleted by authenticated users" ON authors
    FOR DELETE USING (
        auth.role() = 'authenticated' OR
        auth.role() = 'service_role'
    );

-- Alternative: Create a more permissive policy for development
-- Uncomment these if the above doesn't work:

-- CREATE POLICY "Allow all operations for development" ON authors
--     FOR ALL USING (true) WITH CHECK (true);

-- Check current user and role for debugging
SELECT 
    current_user,
    current_setting('role') as current_role,
    auth.role() as auth_role,
    auth.uid() as auth_uid;

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'authors';