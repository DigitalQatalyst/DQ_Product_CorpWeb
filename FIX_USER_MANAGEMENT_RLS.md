# Fix User Management RLS Issue

## Problem
Error: "new row violates row-level security policy for table 'admin_users'"

This happens because Row Level Security (RLS) policies are blocking INSERT operations on the `admin_users` table.

## Solution Options

### Option 1: Fix RLS Policies (Recommended)

Run this SQL in your Supabase SQL Editor:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can manage users" ON admin_users;

-- Create separate policies for each operation
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
```

### Option 2: Temporarily Disable RLS (Quick Fix - Not Recommended for Production)

```sql
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
```

**Warning:** This removes all security restrictions. Only use for testing!

### Option 3: Use Service Role Key

Update your code to use the service role key for admin operations:

1. In Supabase Dashboard, go to Settings > API
2. Copy the `service_role` key (not the `anon` key)
3. Add to `.env.local`:
   ```
   VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

4. Update `src/lib/supabaseClients.ts` to add a service client:
   ```typescript
   export const getServiceSupabase = () => {
     return createClient(
       import.meta.env.VITE_SUPABASE_URL,
       import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
     );
   };
   ```

5. Update `src/services/adminUserService.ts` to use service client for admin operations.

### Option 4: Add Proper Role-Based Policies (Most Secure)

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can manage users" ON admin_users;

-- View policy - all authenticated users can view
CREATE POLICY "Authenticated users can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

-- Insert policy - only admins and super_admins can create users
CREATE POLICY "Admins can insert users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

-- Update policy - only admins and super_admins can update users
CREATE POLICY "Admins can update users"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

-- Delete policy - only super_admins can delete users
CREATE POLICY "Super admins can delete users"
  ON admin_users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );
```

## Recommended Steps

1. **For Development/Testing:** Use Option 1 (simple policies that allow all authenticated users)
2. **For Production:** Use Option 4 (role-based policies) after you have at least one admin user created

## Verify the Fix

After running the SQL, try adding a user again. If it still fails:

1. Check browser console for detailed error
2. Verify you're authenticated in Supabase
3. Check Supabase logs in Dashboard > Logs
4. Ensure the `admin_users` table exists and has the correct schema

## Create Your First Admin User Manually

If you need to bootstrap the system, create your first admin user directly in Supabase:

```sql
INSERT INTO admin_users (
  email,
  first_name,
  last_name,
  role,
  is_active
) VALUES (
  'your-email@example.com',
  'Your',
  'Name',
  'super_admin',
  true
);
```

Then use the User Management UI to add more users.
