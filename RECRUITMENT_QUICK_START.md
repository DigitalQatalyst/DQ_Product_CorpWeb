# Recruitment System - Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Choose Your Migration (1 minute)

**If you have EXISTING recruitment tables with data:**
- Use `migrations/recruitment_system_update_existing.sql` ✅ SAFE
- This preserves all your existing data
- Only adds new features and fixes RLS

**If you're starting FRESH or want to rebuild:**
- Use `migrations/recruitment_system_complete.sql`
- This creates everything from scratch
- Use rollback script first if you have old tables

### Step 2: Run the Migration (2 minutes)

1. Open Supabase SQL Editor
2. Copy and paste your chosen migration file
3. Click Run
4. Wait for "Success" message

### Step 2: Verify Setup (1 minute)

1. In Supabase SQL Editor, run `migrations/recruitment_system_verify.sql`
2. Check that all items show ✓ status
3. If any show ✗, review the error and re-run the main migration

### Step 3: Restart Dev Server (1 minute)

```bash
# Windows
restart-dev-server.bat

# Or manually:
# Stop server (Ctrl+C)
rmdir /s /q node_modules\.vite
npm run dev
```

### Step 4: Test the System (1 minute)

1. Open http://localhost:3000/jobs
2. You should see the jobs page (may be empty if no jobs yet)
3. Open browser console (F12) - should see logs like:
   ```
   [JobPostingService] Fetching public job postings...
   [JobPostingService] Successfully fetched jobs: { count: X }
   ```

### Step 5: Add Test Job (Optional)

Run this in Supabase SQL Editor:

```sql
INSERT INTO job_postings (
  title, department, location, type, level, description,
  requirements, responsibilities, status, slug
) VALUES (
  'Test Position',
  'Engineering',
  'Remote',
  'Full-time',
  'Mid-Level',
  'This is a test job posting to verify the system works.',
  '["Requirement 1", "Requirement 2", "Requirement 3"]'::jsonb,
  '["Responsibility 1", "Responsibility 2"]'::jsonb,
  'open',
  'test-position-' || extract(epoch from now())::bigint
);
```

Refresh http://localhost:3000/jobs - you should see the test job!

## ✅ Success Checklist

- [ ] Migration ran without errors
- [ ] Verification script shows all ✓
- [ ] Dev server restarted successfully
- [ ] Jobs page loads without errors
- [ ] Console shows successful fetch logs
- [ ] Test job appears on jobs page (if added)

## 🔧 If Something Goes Wrong

### Jobs Not Appearing?

1. Check browser console for errors
2. Run `fix_job_postings_rls.sql` in Supabase
3. Restart dev server
4. Hard refresh browser (Ctrl+Shift+R)

### Migration Errors?

1. Check if tables already exist
2. If needed, run `migrations/recruitment_system_rollback.sql` first
3. Then run the main migration again

### Still Having Issues?

See `RECRUITMENT_SYSTEM_MIGRATION_GUIDE.md` for detailed troubleshooting.

## 📚 What You Just Set Up

- ✅ Job postings table (for careers marketplace)
- ✅ Job applications table (with 10-stage workflow)
- ✅ CV screening table (for AI-powered screening)
- ✅ Storage bucket (for resumes and documents)
- ✅ RLS policies (public can view open jobs, submit applications)
- ✅ Views and analytics (recruitment funnel, screening stats)
- ✅ Automatic status tracking (history of all changes)

## 🎯 Next Steps

1. **Add Real Jobs** - Use the admin dashboard to create job postings
2. **Test Applications** - Submit a test application from the public page
3. **Configure CV Screening** - Set up Azure OpenAI credentials in .env.local
4. **Customize Workflow** - Adjust status values if needed
5. **Review Analytics** - Check recruitment funnel and screening stats

## 📖 Documentation

- `RECRUITMENT_SYSTEM_MIGRATION_GUIDE.md` - Complete guide
- `JOBS_ISSUE_RESOLUTION.md` - Troubleshooting disappearing jobs
- `CV_SCREENING_SYSTEM.md` - AI screening setup
- `JOB_APPLICATION_STATUS_WORKFLOW.md` - Status workflow details

## 🎉 You're Done!

Your recruitment system is now fully configured and ready to use!
