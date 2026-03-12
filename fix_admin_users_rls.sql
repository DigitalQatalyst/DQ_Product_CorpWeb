-- Fix RLS policies for admin_users table to allow inserts

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can manage users" ON admin_users;

-- Create new policies that allow all operations for authenticated users
CREATE POLICY "Authenticated users can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert admin users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update admin users"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete admin users"
  ON admin_users FOR DELETE
  TO authenticated
  USING (true);

-- Verify RLS is enabled
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON admin_users TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
