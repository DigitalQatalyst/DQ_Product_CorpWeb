-- Create permissive RLS policies for authors table
-- This allows all operations while keeping RLS enabled
-- Better for development than completely disabling RLS

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authors are viewable by authenticated users" ON authors;
DROP POLICY IF EXISTS "Authors can be created by authenticated users" ON authors;
DROP POLICY IF EXISTS "Authors can be updated by authenticated users" ON authors;
DROP POLICY IF EXISTS "Authors can be deleted by authenticated users" ON authors;
DROP POLICY IF EXISTS "Allow all operations for development" ON authors;

-- Create a single permissive policy that allows all operations
CREATE POLICY "Allow all operations for development" ON authors
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- Verify the policy was created
SELECT schemaname, tablename, policyname, permissive, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'authors';

-- Success message
SELECT 'Permissive RLS policy created for authors table. All operations should now work.' as status;