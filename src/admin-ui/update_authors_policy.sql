-- Update RLS policies for authors table to allow service role operations

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations for service role on authors" ON public.authors;
DROP POLICY IF EXISTS "Enable read access for all users on authors" ON public.authors;
DROP POLICY IF EXISTS "Enable insert for authenticated users on authors" ON public.authors;
DROP POLICY IF EXISTS "Enable update for authenticated users on authors" ON public.authors;
DROP POLICY IF EXISTS "Enable delete for authenticated users on authors" ON public.authors;

-- Recreate policies for authors table with proper permissions
CREATE POLICY "Allow all operations for service role on authors" ON public.authors
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable read access for all users on authors" ON public.authors
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users on authors" ON public.authors
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users on authors" ON public.authors
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users on authors" ON public.authors
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Ensure service_role has all privileges on the authors table
GRANT ALL PRIVILEGES ON TABLE public.authors TO service_role;

-- Also make sure the service_role has USAGE privilege on the schema
GRANT USAGE ON SCHEMA public TO service_role;

-- Make sure the service_role has INSERT, SELECT, UPDATE, DELETE privileges specifically
GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE public.authors TO service_role;

-- If the table has a sequence for auto-incrementing primary key, grant usage on it too
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name='authors' AND column_name='id' 
             AND column_default LIKE 'nextval%') THEN
    GRANT USAGE ON SEQUENCE authors_id_seq TO service_role;
  END IF;
END $$;

-- Verify the policies are in place
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'authors';

-- Also check grants on the table
SELECT grantee, privilege_type 
FROM information_schema.table_privileges 
WHERE table_name = 'authors';
