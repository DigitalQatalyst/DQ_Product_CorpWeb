# Recruitment System Migration Guide

## Overview

This guide covers the complete database setup for the recruitment module, including job postings, applications, CV screening, and all related features.

## Migration Files

### 1. Main Migration (USE THIS ONE)
**File:** `migrations/recruitment_system_complete.sql`

This is the comprehensive migration that sets up everything:
- Job postings table with RLS policies
- Job applications table with enhanced 10-stage status workflow
- CV screening results table for AI-powered screening
- Storage bucket for document uploads
- All necessary views, triggers, and indexes
- Proper RLS policies for public and authenticated access

### 2. Verification Script
**File:** `migrations/recruitment_system_verify.sql`

Run this after the main migration to verify everything is set up correctly. It checks:
- All tables exist
- All views exist
- RLS is enabled
- RLS policies are in place
- Indexes are created
- Triggers are working
- Storage bucket exists
- Foreign keys are set up
- Public access works

### 3. Rollback Script
**File:** `migrations/recruitment_system_rollback.sql`

⚠️ **WARNING:** Only use this if you need to completely remove the recruitment system and start fresh. This will delete ALL recruitment data!

## Installation Steps

### Step 1: Backup Existing Data (If Any)

If you have existing recruitment data, export it first:

```sql
-- Export job postings
COPY (SELECT * FROM job_postings) TO '/tmp/job_postings_backup.csv' CSV HEADER;

-- Export job applications
COPY (SELECT * FROM job_applications) TO '/tmp/job_applications_backup.csv' CSV HEADER;
```

### Step 2: Run the Main Migration

1. Open your Supabase SQL Editor
2. Copy the entire contents of `migrations/recruitment_system_complete.sql`
3. Paste into the SQL Editor
4. Click "Run" or press Ctrl+Enter
5. Wait for completion (should take 5-10 seconds)

### Step 3: Verify the Migration

1. In Supabase SQL Editor, run `migrations/recruitment_system_verify.sql`
2. Review all the checks - they should all show ✓ status
3. Pay special attention to:
   - RLS Status (should be ENABLED)
   - RLS Policies (should have policies for public and authenticated)
   - Public Access Test (should work if you have open jobs)

### Step 4: Test Public Access

Run this query to test if anonymous users can see open jobs:

```sql
-- This should return open jobs without authentication
SELECT * FROM v_public_job_postings;
```

### Step 5: Insert Test Data (Optional)

```sql
-- Insert a test job posting
INSERT INTO job_postings (
  title,
  department,
  location,
  type,
  level,
  description,
  requirements,
  responsibilities,
  status,
  slug
) VALUES (
  'Senior Software Engineer',
  'Engineering',
  'Remote',
  'Full-time',
  'Senior',
  'We are looking for an experienced software engineer to join our team.',
  '["5+ years of experience", "Strong knowledge of TypeScript", "Experience with React"]'::jsonb,
  '["Design and implement features", "Code review", "Mentor junior developers"]'::jsonb,
  'open',
  'senior-software-engineer-' || extract(epoch from now())::bigint
);

-- Verify it appears in public view
SELECT * FROM v_public_job_postings;
```

## What Gets Created

### Tables

1. **job_postings**
   - Stores job listings for the careers marketplace
   - Fields: title, department, location, type, level, description, requirements, responsibilities, status, etc.
   - Status values: draft, open, closed, filled
   - RLS: Public can view open jobs, authenticated users can manage all

2. **job_applications**
   - Stores candidate applications
   - Fields: personal info, professional info, documents, status, history
   - Status workflow: pending → screened → qualified → interview_scheduled → interviewed → shortlisted → offered → hired (+ rejected/withdrawn)
   - RLS: Anyone can submit, authenticated users can view/manage

3. **cv_screening_results**
   - Stores AI screening results
   - Fields: scores (overall, skills, experience, education), recommendations, highlights, red flags
   - Linked to job_applications via application_id
   - RLS: Authenticated users only

### Views

1. **v_public_job_postings** - Public view of open jobs
2. **v_job_applications_summary** - Summary of applications for admin
3. **v_recruitment_funnel** - Analytics showing application distribution
4. **v_screening_analytics** - CV screening statistics
5. **v_applications_with_screening** - Applications with screening results

### Storage

- **job-applications bucket** - Stores resumes and additional documents
- Not public (authenticated access only)
- Policies allow public upload, authenticated view/delete

### Triggers

1. **update_job_postings_updated_at** - Auto-updates updated_at timestamp
2. **update_job_applications_updated_at** - Auto-updates updated_at timestamp
3. **track_application_status_change** - Tracks status changes in history
4. **update_cv_screening_updated_at** - Auto-updates updated_at timestamp

## Key Features

### 1. Enhanced Status Workflow

The application status now supports a complete recruitment lifecycle:

- **pending** - New application, no action taken
- **screened** - Initial review completed
- **qualified** - Meets must-haves, moving forward
- **interview_scheduled** - Interview arranged
- **interviewed** - Interview completed, awaiting decision
- **shortlisted** - Top candidate for final consideration
- **offered** - Job offer extended
- **hired** - Offer accepted
- **rejected** - Not moving forward
- **withdrawn** - Candidate withdrew

### 2. Status History Tracking

Every status change is automatically tracked in the `status_history` JSONB field:

```json
[
  {
    "from_status": "pending",
    "to_status": "screened",
    "changed_at": "2024-01-15T10:30:00Z",
    "changed_by": "user-uuid",
    "rejection_reason": null
  }
]
```

### 3. AI-Powered CV Screening

The system supports AI screening with:
- Multi-dimensional scoring (0-100 scale)
- Extracted skills, experience, education
- Key highlights and red flags
- Recommendations (strong_match, good_match, potential_match, weak_match, no_match)

### 4. Public Access Control

- Anonymous users can view open job postings
- Anonymous users can submit applications
- Authenticated users (admins) can manage everything
- Document uploads are restricted to authenticated users for viewing

## Troubleshooting

### Issue: Jobs not visible on public page

**Solution:**
1. Check if RLS is enabled: Run verification script
2. Check if jobs have status='open'
3. Check if RLS policies exist for public access
4. Try running: `SELECT * FROM v_public_job_postings;`

### Issue: Cannot submit applications

**Solution:**
1. Check storage bucket exists: `SELECT * FROM storage.buckets WHERE id = 'job-applications';`
2. Check storage policies exist
3. Check job_applications RLS policies allow INSERT for anon

### Issue: Admins cannot view applications

**Solution:**
1. Verify user is authenticated
2. Check RLS policies for authenticated users
3. Run: `SELECT * FROM job_applications;` (should work when authenticated)

### Issue: Status changes not tracked

**Solution:**
1. Verify trigger exists: Run verification script
2. Check if `status_changed_by` is being set when updating
3. Manually test: `UPDATE job_applications SET application_status = 'screened' WHERE id = 'some-uuid';`

## Differences from Old Migrations

### What Changed

1. **Consolidated Everything** - All recruitment tables in one migration
2. **Fixed RLS Policies** - Proper public access to open jobs
3. **Enhanced Status Workflow** - 10 stages instead of 6
4. **Status History Tracking** - Automatic tracking of all status changes
5. **Better Indexes** - Optimized for common queries
6. **JSONB for Arrays** - requirements/responsibilities use JSONB instead of TEXT[]
7. **Proper Foreign Keys** - job_applications.job_posting_id references job_postings.id

### What Stayed the Same

1. Table names (job_postings, job_applications, cv_screening_results)
2. Core field names (compatible with existing code)
3. Storage bucket name (job-applications)
4. View names (for backward compatibility)

## Next Steps After Migration

1. ✅ Run verification script
2. ✅ Test public job listings page (http://localhost:3000/jobs)
3. ✅ Test job application submission
4. ✅ Test admin dashboard access
5. ✅ Configure Azure OpenAI for CV screening (if not already done)
6. ✅ Update .env.local with correct Supabase credentials
7. ✅ Clear Vite cache and restart dev server
8. ✅ Test the complete recruitment workflow

## Maintenance

### Adding New Status Values

If you need to add new status values:

```sql
-- 1. Drop the constraint
ALTER TABLE job_applications 
DROP CONSTRAINT job_applications_application_status_check;

-- 2. Add new constraint with additional values
ALTER TABLE job_applications
ADD CONSTRAINT job_applications_application_status_check 
CHECK (application_status IN (
  'pending', 'screened', 'qualified', 'interview_scheduled',
  'interviewed', 'shortlisted', 'offered', 'hired',
  'rejected', 'withdrawn', 'your_new_status'
));
```

### Backing Up Data

```sql
-- Backup all recruitment data
COPY (SELECT * FROM job_postings) TO '/tmp/job_postings.csv' CSV HEADER;
COPY (SELECT * FROM job_applications) TO '/tmp/job_applications.csv' CSV HEADER;
COPY (SELECT * FROM cv_screening_results) TO '/tmp/cv_screening.csv' CSV HEADER;
```

### Monitoring

```sql
-- Check recruitment funnel
SELECT * FROM v_recruitment_funnel;

-- Check screening analytics
SELECT * FROM v_screening_analytics;

-- Check recent applications
SELECT * FROM v_job_applications_summary LIMIT 10;
```

## Support

If you encounter issues:

1. Run the verification script first
2. Check the troubleshooting section
3. Review Supabase logs for errors
4. Check browser console for client-side errors
5. Verify .env.local has correct Supabase credentials

## Files Reference

- `migrations/recruitment_system_complete.sql` - Main migration (RUN THIS)
- `migrations/recruitment_system_verify.sql` - Verification checks
- `migrations/recruitment_system_rollback.sql` - Rollback script (CAUTION)
- `RECRUITMENT_SYSTEM_MIGRATION_GUIDE.md` - This guide
- `fix_job_postings_rls.sql` - Quick RLS fix (if needed)
- `JOBS_ISSUE_RESOLUTION.md` - Troubleshooting for disappearing jobs
