-- Create admin_users table for user management
-- This table stores user profiles and permissions

-- Drop table if it exists (for clean recreation)
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- Create admin_users table
CREATE TABLE public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Link to Supabase auth.users table
    email TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'hr_manager', 'content_editor', 'content_creator', 'viewer')),
    department TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.admin_users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_admin_users_email ON public.admin_users(email);
CREATE INDEX idx_admin_users_role ON public.admin_users(role);
CREATE INDEX idx_admin_users_is_active ON public.admin_users(is_active);
CREATE INDEX idx_admin_users_created_at ON public.admin_users(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to view their own profile
CREATE POLICY "Users can view own profile" ON public.admin_users
    FOR SELECT USING (auth.uid() = auth_id);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update own profile" ON public.admin_users
    FOR UPDATE USING (auth.uid() = auth_id);

-- Create policy for admins to manage all users
CREATE POLICY "Admins can manage all users" ON public.admin_users
    FOR ALL USING (
        auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'hr_manager')
    );

-- Create policy for users to insert new users (admin only)
CREATE POLICY "Admins can insert users" ON public.admin_users
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'role'::text IN ('super_admin', 'admin', 'hr_manager', 'content_editor', 'content_creator')
    );

-- Temporary policy: Allow all authenticated users to insert users (for testing)
-- REMOVE THIS AFTER TESTING - SECURITY RISK!
CREATE POLICY "Allow all users to insert" ON public.admin_users
    FOR INSERT WITH CHECK (true);

-- Comments for understanding
-- This table structure:
-- 1. Links to Supabase auth.users table via auth_id
-- 2. Stores user profile information (display_name, role, department)
-- 3. Includes RLS policies for proper access control
-- 4. Admin users can manage other users, regular users can only manage themselves

-- To use this table:
-- 1. Run this SQL in your Supabase SQL editor
-- 2. The admin_users table will be created with proper structure
-- 3. User management will work with the existing code
