# Jobs Disappearing After Refresh - Troubleshooting Guide

## Problem
Jobs appear once but disappear after refreshing the browser at http://localhost:3000/jobs

## Most Likely Cause: Row Level Security (RLS)

Based on the symptoms (jobs appear once then disappear), this is almost certainly an RLS issue. The first load might be using cached data or a different authentication state, but subsequent loads are being blocked by RLS policies.

## RECOMMENDED FIX (Do This First)

### Step 1: Run the RLS Fix Script
Run `fix_job_postings_rls.sql` in your Supabase SQL Editor. This will:
- Enable RLS on the job_postings table
- Create a policy allowing anonymous users to view open jobs
- Verify the policy was created

### Step 2: Clear Cache and Restart
Run the batch file to clear Vite cache and restart:
```bash
restart-dev-server.bat
```

Or manually:
```bash
# Stop dev server (Ctrl+C)
rmdir /s /q node_modules\.vite
npm run dev
```

### Step 3: Hard Refresh Browser
- Open http://localhost:3000/jobs
- Press Ctrl+Shift+R (hard refresh)
- Check browser console for log messages

## Other Possible Causes

### 1. Vite Dev Server Caching
The Vite dev server may be caching API responses or module imports.

**Solution:**
```bash
# Stop the dev server (Ctrl+C)
# Clear Vite cache and restart
rmdir /s /q node_modules\.vite
npm run dev
```

### 2. Row Level Security (RLS) Policies
RLS policies on the `job_postings` table may be blocking anonymous access.

**Check RLS Status:**
Run `verify_jobs_simple.sql` in Supabase SQL Editor to check if RLS is enabled.

**Temporary Fix (Testing Only):**
Run `temp_disable_rls.sql` in Supabase SQL Editor:
```sql
ALTER TABLE job_postings DISABLE ROW LEVEL SECURITY;
```

**Permanent Fix:**
Create a policy that allows public read access to open jobs:
```sql
-- Enable RLS
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to open jobs
CREATE POLICY "Allow public read access to open jobs"
ON job_postings
FOR SELECT
TO anon
USING (status = 'open');
```

### 3. Data Format Issues
The `requirements` and `responsibilities` columns may have inconsistent data formats (object vs array).

**Fix Data Format:**
Run `diagnose_and_fix_jobs.sql` in Supabase SQL Editor to:
- Check current data format
- Convert objects to arrays
- Verify the fix

### 4. Browser Cache
Browser may be caching the empty response.

**Solution:**
- Open browser DevTools (F12)
- Go to Network tab
- Check "Disable cache"
- Hard refresh (Ctrl+Shift+R)

## Debugging Steps

### Step 1: Check Browser Console
1. Open http://localhost:3000/jobs
2. Open DevTools (F12) → Console tab
3. Look for these log messages:
   - `[JobListingsPage] Starting to fetch jobs...`
   - `[JobPostingService] Fetching public job postings...`
   - `[JobPostingService] Successfully fetched jobs:`
   - `[JobListingsPage] Transformed jobs:`

### Step 2: Check Network Tab
1. Open DevTools (F12) → Network tab
2. Refresh the page
3. Look for Supabase API calls
4. Check the response data

### Step 3: Verify Database
Run these queries in Supabase SQL Editor:

```sql
-- Check if jobs exist
SELECT COUNT(*) FROM job_postings WHERE status = 'open';

-- Check RLS status
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'job_postings';

-- Check data format
SELECT 
  id, 
  title, 
  jsonb_typeof(requirements) as req_type,
  jsonb_typeof(responsibilities) as resp_type
FROM job_postings 
WHERE status = 'open';
```

## Quick Fix Checklist

- [ ] Stop dev server and clear Vite cache
- [ ] Run `verify_jobs_simple.sql` to check RLS and data
- [ ] Run `diagnose_and_fix_jobs.sql` to fix data format
- [ ] If needed, run `temp_disable_rls.sql` (testing only)
- [ ] Clear browser cache and hard refresh
- [ ] Check browser console for errors
- [ ] Restart dev server with `npm run dev`

## Expected Console Output

When working correctly, you should see:
```
[JobPostingService] Fetching public job postings...
[JobPostingService] Successfully fetched jobs: { count: 6, jobs: [...] }
[JobListingsPage] Starting to fetch jobs...
[JobListingsPage] Fetch result: { hasError: false, dataCount: 6 }
[JobListingsPage] Transformed jobs: { count: 6, jobs: [...] }
```

## Files Modified
- `src/services/jobPostingService.ts` - Added detailed logging
- `src/pages/JobListingsPage.tsx` - Enhanced error handling and logging
- `verify_jobs_simple.sql` - Simple diagnostic script
- `diagnose_and_fix_jobs.sql` - Data format fix script
- `temp_disable_rls.sql` - Temporary RLS disable (testing only)
