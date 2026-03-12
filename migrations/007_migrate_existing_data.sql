-- Migration script to move data from admin_users and authors to new unified users table
-- Run this after creating the new users table and before dropping old tables
-- This is a data migration script - handle with care!

-- Step 1: Migrate admin_users to users table
-- Mapping admin_users to users with role preserved (defaulting unmapped to 'admin')
INSERT INTO users (
  id,
  auth_user_id,
  email,
  name,
  title,
  bio,
  avatar_url,
  role,
  is_active,
  department,
  created_at,
  updated_at,
  last_login_at
)
SELECT
  COALESCE(au.id, gen_random_uuid()),
  au.auth_user_id,
  au.email,
  COALESCE(au.first_name || ' ' || au.last_name, au.email),
  au.title,
  au.bio,
  au.avatar_url,
  CASE
    WHEN au.role = 'super_admin' THEN 'admin'::user_role
    WHEN au.role = 'admin' THEN 'admin'::user_role
    WHEN au.role = 'hr_manager' THEN 'creator'::user_role
    WHEN au.role = 'content_editor' THEN 'creator'::user_role
    WHEN au.role = 'content_creator' THEN 'creator'::user_role
    WHEN au.role = 'viewer' THEN 'viewer'::user_role
    ELSE 'admin'::user_role
  END,
  COALESCE(au.is_active, true),
  au.department,
  COALESCE(au.created_at, NOW()),
  COALESCE(au.updated_at, NOW()),
  au.last_login_at
FROM admin_users au
LEFT JOIN users u ON u.auth_user_id = au.auth_user_id
WHERE u.id IS NULL  -- Only insert if not already exists
ON CONFLICT (auth_user_id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  bio = EXCLUDED.bio,
  avatar_url = EXCLUDED.avatar_url,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  department = EXCLUDED.department,
  updated_at = NOW();

-- Step 2: Migrate authors to users table (for content creators without admin accounts)
-- Only migrate authors that don't already have a corresponding user
INSERT INTO users (
  id,
  email,
  name,
  title,
  bio,
  avatar_url,
  linkedin_url,
  twitter_url,
  website_url,
  role,
  is_active,
  created_at,
  updated_at
)
SELECT
  a.id,
  a.email,
  a.name,
  a.title,
  a.bio,
  a.avatar_url,
  a.linkedin_url,
  a.twitter_url,
  a.website_url,
  'creator'::user_role,  -- Authors become creators
  COALESCE(a.is_active, true),
  COALESCE(a.created_at, NOW()),
  COALESCE(a.updated_at, NOW())
FROM authors a
LEFT JOIN users u ON u.id = a.id OR u.email = a.email
WHERE u.id IS NULL  -- Only insert if not already exists
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  bio = EXCLUDED.bio,
  avatar_url = EXCLUDED.avatar_url,
  linkedin_url = EXCLUDED.linkedin_url,
  twitter_url = EXCLUDED.twitter_url,
  website_url = EXCLUDED.website_url,
  role = 'creator'::user_role,
  updated_at = NOW();

-- Step 3: Update user_id references in blogs (update author_id references)
-- This is already handled by the foreign key update, but verify here
-- Update any blogs that still have old author_id references to the new users table
UPDATE blogs
SET author_id = (
  SELECT u.id FROM users u
  WHERE u.id = blogs.author_id AND u.role IN ('admin'::user_role, 'creator'::user_role)
)
WHERE author_id IS NOT NULL;

-- Step 4: Verify data integrity
-- Count total users by role
SELECT
  'Total Users' as metric,
  COUNT(*) as count
FROM users
UNION ALL
SELECT
  'Admin Users',
  COUNT(*)
FROM users WHERE role = 'admin'::user_role
UNION ALL
SELECT
  'Creator Users',
  COUNT(*)
FROM users WHERE role = 'creator'::user_role
UNION ALL
SELECT
  'Viewer Users',
  COUNT(*)
FROM users WHERE role = 'viewer'::user_role
UNION ALL
SELECT
  'Active Users',
  COUNT(*)
FROM users WHERE is_active = true;

-- Step 5: Show sample of migrated data
SELECT id, email, name, role, is_active, created_at
FROM users
ORDER BY created_at DESC
LIMIT 10;

COMMENT ON MIGRATION 007 IS 'Migrate data from admin_users and authors to unified users table';
