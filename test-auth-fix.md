# Authentication Fix Testing Guide

## Problem: "Database error saving new user" during signup

## Root Cause
The profile creation trigger was failing due to Row Level Security (RLS) policies preventing the trigger from inserting into the profiles table.

## Solution Applied

### 1. Fixed Database Trigger (Migration 016)
- Created `migrations/016_fix_profile_trigger_secure.sql`
- Updated the trigger function to handle errors gracefully
- Added proper RLS bypass for trigger operations
- Added exception handling to prevent signup failures

### 2. Updated Supabase Client
- Added `lock: undefined` to prevent Navigator LockManager timeouts
- Enabled session persistence and auto-refresh
- Proper auth configuration for production use

## Steps to Fix

### 1. Run the Migration
Execute this SQL in your Supabase SQL Editor:

```sql
-- Copy contents of: migrations/016_fix_profile_trigger_secure.sql
```

### 2. Test the Signup

#### Method 1: Browser Testing
1. Go to `/signup` in your application
2. Fill out the signup form:
   - First Name: Test
   - Last Name: User  
   - Email: test@example.com
   - Password: password123
3. Submit the form
4. Check if you get the success message

#### Method 2: Database Verification
After running the migration, check if the trigger works:

```sql
-- Check if the trigger function exists and is properly configured
SELECT proname, prosrc FROM pg_proc WHERE proname = 'handle_new_user';

-- Check if profiles table exists
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'profiles' ORDER BY ordinal_position;

-- Check RLS policies
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies WHERE tablename = 'profiles';
```

### 3. Verify Fix

#### Check Browser Console
- Open browser dev tools
- Look for any error messages during signup
- Should see "Check your email" success message

#### Check Supabase Dashboard
1. Go to Authentication > Users
2. Look for the test user you created
3. Check if they have a profile in the profiles table

#### Check Database Directly
```sql
-- Check if user was created in auth.users
SELECT id, email, created_at FROM auth.users WHERE email = 'test@example.com';

-- Check if profile was created by trigger
SELECT id, first_name, last_name, email, role FROM profiles 
WHERE email = 'test@example.com';
```

## Expected Results

### ✅ Success Indicators
- Signup completes without "Database error saving new user"
- User sees "Check your email" message
- User appears in auth.users table
- Profile appears in profiles table (created by trigger)
- No console errors during signup

### ❌ Failure Indicators
- Still getting "Database error saving new user"
- No user in auth.users table
- No profile in profiles table
- Console shows database errors

## Troubleshooting

### If Still Getting Errors

1. **Check Migration Status**
   ```sql
   -- Verify the trigger was recreated
   SELECT tgname, tgrelid::regclass, tgfoid::regproc 
   FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```

2. **Check RLS Policies**
   ```sql
   -- Verify the new policy exists
   SELECT policyname FROM pg_policies 
   WHERE tablename = 'profiles' AND policyname = 'Allow profile creation via trigger';
   ```

3. **Check Function Permissions**
   ```sql
   -- Check if function has SECURITY DEFINER
   SELECT proname, prosecdef FROM pg_proc 
   WHERE proname = 'handle_new_user';
   ```

4. **Manual Test**
   ```sql
   -- Test the trigger manually
   DO $$
   DECLARE
     test_id UUID := gen_random_uuid();
   BEGIN
     INSERT INTO auth.users (id, email, raw_user_meta_data)
     VALUES (test_id, 'manual-test@example.com', '{"first_name": "Manual", "last_name": "Test"}');
     
     -- Check if profile was created
     IF EXISTS (SELECT 1 FROM profiles WHERE id = test_id) THEN
       RAISE NOTICE '✅ Trigger working: Profile created';
       DELETE FROM profiles WHERE id = test_id;
     ELSE
       RAISE NOTICE '❌ Trigger failed: No profile created';
     END IF;
     
     DELETE FROM auth.users WHERE id = test_id;
   END $$;
   ```

### Common Issues

1. **Migration Not Applied**
   - Run the migration SQL manually in Supabase SQL Editor
   - Check for any SQL syntax errors

2. **RLS Still Blocking**
   - Verify the new policy was created
   - Check if the function has SECURITY DEFINER

3. **Permission Issues**
   - Ensure service_role has proper permissions
   - Check if authenticated role can access profiles table

## Next Steps After Fix

1. **Test Full Flow**
   - Signup → Email verification → Login
   - Try accessing admin pages
   - Test role-based access

2. **Clean Up Test Data**
   ```sql
   -- Remove test users
   DELETE FROM profiles WHERE email LIKE '%test%';
   DELETE FROM auth.users WHERE email LIKE '%test%';
   ```

3. **Monitor Production**
   - Watch for signup errors
   - Check trigger performance
   - Monitor profile creation success rate

---

**If you still have issues after applying this fix, please:**
1. Run the migration SQL manually
2. Test with the manual trigger test
3. Check browser console for specific error messages
4. Verify Supabase project settings
