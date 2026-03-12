# Job Posting Connection Test Guide

## Overview
This guide will help you verify that the job posting system is correctly connected between the admin panel and the public jobs marketplace.

**Date:** February 19, 2026  
**Status:** Testing Required

---

## Prerequisites

Before testing, ensure:
1. ✅ Database migrations have been run
2. ✅ Supabase connection is configured
3. ✅ Application is running on `http://localhost:3000`
4. ✅ Admin panel is accessible at `http://localhost:3000/admin-ui`

---

## Step 1: Run Database Migration

If you haven't already, run the job postings table migration:

### Option A: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Open the file: `migrations/create_job_postings_table.sql`
4. Copy and paste the entire content
5. Click "Run" to execute

### Option B: Using Supabase CLI
```bash
supabase db push
```

---

## Step 2: Insert Test Data

### Option A: Using SQL Script (Recommended)
1. Go to Supabase SQL Editor
2. Open the file: `test_job_posting.sql`
3. Copy and paste the entire content
4. Click "Run" to execute

This will create:
- ✅ 2 "open" job postings (will appear on public page)
- ✅ 1 "closed" job posting (will NOT appear on public page)

### Option B: Using Admin UI (Manual Test)
1. Navigate to `http://localhost:3000/admin-ui/job-postings`
2. Click "New Position" button
3. Fill in the form with test data:
   - **Title:** Senior Full Stack Developer
   - **Department:** Engineering
   - **Location:** Remote (US)
   - **Type:** Full-Time
   - **Level:** Senior
   - **Description:** [Add description]
   - **Requirements:** [Add at least 3 requirements]
   - **Responsibilities:** [Add at least 3 responsibilities]
   - **Status:** Open
4. Click "Save" or "Publish"

---

## Step 3: Verify in Admin Panel

### Check Job Postings Management Page
1. Navigate to: `http://localhost:3000/admin-ui/job-postings`
2. You should see:
   - ✅ Stats cards showing total positions
   - ✅ List of all job postings (including closed ones)
   - ✅ Filter buttons (All, Open, Closed)
   - ✅ Search functionality

### Expected Results:
- **Total Positions:** 3
- **Open Positions:** 2
- **Closed Positions:** 1

### Test Filters:
- Click "Open" filter → Should show 2 jobs
- Click "Closed" filter → Should show 1 job
- Click "All" filter → Should show 3 jobs

---

## Step 4: Verify on Public Jobs Page

### Check Public Jobs Marketplace
1. Navigate to: `http://localhost:3000/jobs`
2. You should see:
   - ✅ Only "open" job postings (2 jobs)
   - ✅ Job cards with details
   - ✅ Filter sidebar (Department, Location, Type)
   - ✅ Search functionality

### Expected Results:
- **Showing:** 2 of 2 positions
- **Visible Jobs:**
  1. Senior Full Stack Developer
  2. Digital Transformation Consultant
- **NOT Visible:** Data Scientist (closed status)

### Test Features:
1. **Search:** Type "developer" → Should show 1 result
2. **Filter by Department:** Select "Engineering" → Should show 1 result
3. **Filter by Location:** Select "Remote (US)" → Should show 1 result
4. **Click "View Job":** Should navigate to job detail page

---

## Step 5: Test Job Detail Page

### View Individual Job
1. From jobs page, click "View Job" on any posting
2. Should navigate to: `http://localhost:3000/jobs/{id}`
3. You should see:
   - ✅ Full job description
   - ✅ Requirements list
   - ✅ Responsibilities list
   - ✅ Skills (if available)
   - ✅ "Apply Now" button

### Test Application Flow:
1. Click "Apply Now" button
2. Should navigate to application form
3. Form should be pre-filled with job ID and title

---

## Step 6: Test Real-Time Sync

### Verify Admin → Public Connection
1. **In Admin Panel:**
   - Go to `http://localhost:3000/admin-ui/job-postings`
   - Create a new job posting
   - Set status to "Open"
   - Save

2. **In Public Page:**
   - Go to `http://localhost:3000/jobs`
   - Refresh the page
   - ✅ New job should appear immediately

3. **Change Status:**
   - In admin panel, change job status to "Closed"
   - Refresh public jobs page
   - ✅ Job should disappear from public listing

---

## Troubleshooting

### Issue: No jobs appearing on public page

**Possible Causes:**
1. Database table doesn't exist
2. No jobs with "open" status
3. Supabase connection issue
4. RLS policies blocking access

**Solutions:**
```sql
-- Check if table exists
SELECT * FROM job_postings LIMIT 1;

-- Check job statuses
SELECT id, title, status FROM job_postings;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'job_postings';

-- Temporarily disable RLS for testing (NOT for production)
ALTER TABLE job_postings DISABLE ROW LEVEL SECURITY;
```

### Issue: Jobs appear in admin but not public

**Check Status:**
```sql
-- Verify status is 'open'
UPDATE job_postings 
SET status = 'open' 
WHERE id = YOUR_JOB_ID;
```

**Check Service Function:**
- Open browser console (F12)
- Go to Network tab
- Refresh jobs page
- Look for API calls to Supabase
- Check for errors

### Issue: Can't create jobs in admin panel

**Check Console Errors:**
1. Open browser console (F12)
2. Try creating a job
3. Look for error messages
4. Common errors:
   - "Column not found" → Run migration
   - "Permission denied" → Check RLS policies
   - "Network error" → Check Supabase connection

**Verify Environment Variables:**
```bash
# Check .env.local file
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Verification Checklist

### Database Level
- [ ] `job_postings` table exists
- [ ] Test data inserted successfully
- [ ] RLS policies configured correctly
- [ ] Indexes created for performance

### Admin Panel
- [ ] Can view all job postings
- [ ] Can create new job postings
- [ ] Can edit existing job postings
- [ ] Can delete job postings
- [ ] Can filter by status
- [ ] Can search jobs
- [ ] Stats cards show correct counts

### Public Jobs Page
- [ ] Only "open" jobs are visible
- [ ] Job cards display correctly
- [ ] Filters work (Department, Location, Type)
- [ ] Search functionality works
- [ ] Can navigate to job detail page
- [ ] "Apply Now" button works

### Real-Time Sync
- [ ] New jobs appear immediately
- [ ] Status changes reflect immediately
- [ ] Deleted jobs disappear immediately

---

## Test Data Summary

### Job 1: Senior Full Stack Developer
- **Status:** Open ✅
- **Department:** Engineering
- **Location:** Remote (US)
- **Type:** Full-Time
- **Level:** Senior
- **Open Positions:** 2
- **Featured:** Yes
- **Should appear on public page:** YES

### Job 2: Digital Transformation Consultant
- **Status:** Open ✅
- **Department:** Consulting
- **Location:** New York, NY
- **Type:** Full-Time
- **Level:** Mid-Level
- **Open Positions:** 3
- **Featured:** No
- **Should appear on public page:** YES

### Job 3: Data Scientist
- **Status:** Closed ❌
- **Department:** Data & Analytics
- **Location:** San Francisco, CA
- **Type:** Full-Time
- **Level:** Senior
- **Open Positions:** 1
- **Featured:** No
- **Should appear on public page:** NO

---

## Expected Behavior

### Admin Panel (`/admin-ui/job-postings`)
```
Total Positions: 3
Open Positions: 2
Closed Positions: 1

Job List:
1. Senior Full Stack Developer (Open)
2. Digital Transformation Consultant (Open)
3. Data Scientist (Closed)
```

### Public Jobs Page (`/jobs`)
```
Showing 2 of 2 positions

Job Cards:
1. Senior Full Stack Developer
   - Engineering | Remote (US) | Full-Time
   - Senior Level
   - 2 Positions Available
   
2. Digital Transformation Consultant
   - Consulting | New York, NY | Full-Time
   - Mid-Level Level
   - 3 Positions Available
```

---

## Success Criteria

✅ **Test Passed If:**
1. All 3 jobs appear in admin panel
2. Only 2 "open" jobs appear on public page
3. Filters work correctly on both pages
4. Search functionality works
5. Job detail pages load correctly
6. Real-time sync works (create/update/delete)

❌ **Test Failed If:**
- Jobs don't appear on public page
- Closed jobs appear on public page
- Filters don't work
- Can't create new jobs
- Database errors occur

---

## Next Steps After Successful Test

1. **Clean Up Test Data (Optional):**
```sql
-- Delete test jobs
DELETE FROM job_postings 
WHERE title IN (
  'Senior Full Stack Developer',
  'Digital Transformation Consultant',
  'Data Scientist'
);
```

2. **Create Real Job Postings:**
   - Use admin panel to create actual job openings
   - Set appropriate statuses
   - Add detailed descriptions and requirements

3. **Configure SEO:**
   - Add meta descriptions to job postings
   - Optimize job titles for search
   - Add structured data (JSON-LD)

4. **Set Up Analytics:**
   - Track job page views
   - Monitor application conversion rates
   - Analyze popular job categories

---

## Support

### For Database Issues:
- Check Supabase dashboard logs
- Review RLS policies
- Verify table structure

### For Frontend Issues:
- Check browser console for errors
- Review Network tab for API calls
- Verify environment variables

### For Connection Issues:
- Test Supabase connection
- Check API keys
- Verify CORS settings

---

## Conclusion

This test verifies that:
- ✅ Admin can create and manage job postings
- ✅ Public page displays only "open" positions
- ✅ Real-time sync works between admin and public
- ✅ Filters and search work correctly
- ✅ Application flow is functional

**Status:** Ready for production use after successful testing!

---

**Document Version:** 1.0  
**Last Updated:** February 19, 2026  
**Created By:** Kiro AI Assistant
