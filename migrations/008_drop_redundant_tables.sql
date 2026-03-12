-- Cleanup migration: Drop redundant tables after successful data migration
-- WARNING: This removes the old admin_users, authors, and user_roles tables
-- ONLY run after verifying that all data has been successfully migrated to the users table

-- Step 1: Drop foreign key constraints that reference old tables
ALTER TABLE activity_logs
  DROP CONSTRAINT IF EXISTS activity_logs_user_id_fkey CASCADE;

-- (Other constraints already dropped in migration 004)

-- Step 2: Drop old tables

-- Drop admin_users table
DROP TABLE IF EXISTS admin_users CASCADE;

-- Drop authors table
DROP TABLE IF EXISTS authors CASCADE;

-- Drop user_roles table
DROP TABLE IF EXISTS user_roles CASCADE;

-- Step 3: Verify that all tables still work correctly
SELECT
  t.tablename,
  COUNT(*) as row_count
FROM pg_tables t
  LEFT JOIN information_schema.tables i ON t.tablename = i.table_name
WHERE t.schemaname = 'public'
GROUP BY t.tablename
ORDER BY t.tablename;

COMMENT ON MIGRATION 008 IS 'Drop redundant admin_users, authors, and user_roles tables after successful migration';
