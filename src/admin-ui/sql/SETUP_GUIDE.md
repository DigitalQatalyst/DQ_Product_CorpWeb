# Author System Setup Guide

This guide helps you set up the author system and resolve common RLS (Row Level Security) issues.

## Quick Setup

### 1. Run the Database Setup Scripts

Execute these SQL scripts in your Supabase SQL editor in order:

```sql
-- 1. First, run the authors schema
-- Copy and paste the contents of: src/admin-ui/sql/authors_schema.sql

-- 2. Then, fix RLS policies
-- Copy and paste the contents of: src/admin-ui/sql/fix_authors_rls.sql

-- 3. Finally, set up storage
-- Copy and paste the contents of: src/admin-ui/sql/setup_author_storage.sql
```

### 2. Verify Setup

1. Go to `/admin-ui/authors/new` in your application
2. Check the Debug Panel at the top of the page
3. All items should show green checkmarks

## Common Issues and Solutions

### Issue 1: "new row violates row-level security policy"

**Cause**: RLS policies are too restrictive or authentication is not working properly.

**Solutions**:
1. **Check Authentication**: Make sure you're logged in to the application
2. **Run RLS Fix Script**: Execute `src/admin-ui/sql/fix_authors_rls.sql`
3. **Temporary Bypass**: For development, you can temporarily disable RLS:
   ```sql
   ALTER TABLE authors DISABLE ROW LEVEL SECURITY;
   ```
   **⚠️ Warning**: Re-enable RLS before production!

### Issue 2: "Could not find the table 'public.authors'"

**Cause**: The authors table doesn't exist.

**Solution**: Run the authors schema script:
```sql
-- Copy and paste contents of: src/admin-ui/sql/authors_schema.sql
```

### Issue 3: "Bucket not found" (for avatar uploads)

**Cause**: Storage bucket doesn't exist.

**Solution**: Run the storage setup script:
```sql
-- Copy and paste contents of: src/admin-ui/sql/setup_author_storage.sql
```

### Issue 4: Authentication Problems

**Symptoms**: Debug panel shows "Not Authenticated"

**Solutions**:
1. Make sure you're logged in to the application
2. Check your Supabase environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Verify your Supabase project is active

## Development Mode

For development, you can use more permissive RLS policies:

```sql
-- Temporarily allow all operations (DEVELOPMENT ONLY)
DROP POLICY IF EXISTS "Allow all operations for development" ON authors;
CREATE POLICY "Allow all operations for development" ON authors
    FOR ALL USING (true) WITH CHECK (true);
```

**⚠️ Important**: Remove this policy before going to production!

## Production Setup

For production, use these secure RLS policies:

```sql
-- Secure policies for production
CREATE POLICY "Authors are viewable by authenticated users" ON authors
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authors can be created by authenticated users" ON authors
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authors can be updated by authenticated users" ON authors
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authors can be deleted by authenticated users" ON authors
    FOR DELETE USING (auth.role() = 'authenticated');
```

## Troubleshooting

### Debug Information

The AuthorDebugPanel component shows:
- Authentication status
- Database connection
- Storage access
- Authors fetch test

### Console Logs

Check browser console for detailed error messages when creating authors.

### Database Queries

You can test database access directly in Supabase:

```sql
-- Test if you can read authors
SELECT * FROM authors LIMIT 5;

-- Test if you can insert (replace with real data)
INSERT INTO authors (name, title, bio) 
VALUES ('Test Author', 'Test Title', 'Test Bio');

-- Check current user and role
SELECT 
    current_user,
    current_setting('role') as current_role,
    auth.role() as auth_role,
    auth.uid() as auth_uid;
```

## Need Help?

If you're still having issues:

1. Check the Debug Panel in the author creation page
2. Look at browser console logs
3. Verify all SQL scripts have been run
4. Make sure you're authenticated in the application
5. Check Supabase project settings and RLS policies

## Files Reference

- `src/admin-ui/sql/authors_schema.sql` - Creates authors table and basic RLS
- `src/admin-ui/sql/fix_authors_rls.sql` - Fixes RLS policy issues
- `src/admin-ui/sql/setup_author_storage.sql` - Sets up avatar storage
- `src/admin-ui/components/AuthorDebugPanel.tsx` - Debug component
- `src/admin-ui/services/authorService.ts` - Author service with fallback methods