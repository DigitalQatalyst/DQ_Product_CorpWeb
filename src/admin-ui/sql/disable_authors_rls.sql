-- Disable Row Level Security for authors table
-- This allows all operations on the authors table without authentication checks
-- ⚠️ WARNING: This is for development only. Re-enable RLS for production!

-- Disable RLS on authors table
ALTER TABLE authors DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'authors';

-- The rowsecurity column should show 'f' (false) after running this script

-- Optional: If you want to re-enable RLS later, use:
-- ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

-- Success message
SELECT 'RLS disabled for authors table. Author creation should now work.' as status;