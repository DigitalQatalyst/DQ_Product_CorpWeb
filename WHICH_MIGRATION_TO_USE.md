# Which Migration Should I Use?

## Quick Decision Tree

```
Do you have existing recruitment tables in Supabase?
│
├─ YES → Do you have important data in them?
│   │
│   ├─ YES → Use: recruitment_system_update_existing.sql ✅
│   │         (Keeps all your data, adds new features)
│   │
│   └─ NO → Use: recruitment_system_rollback.sql first
│             Then: recruitment_system_complete.sql
│             (Clean slate)
│
└─ NO → Use: recruitment_system_complete.sql ✅
          (Fresh installation)
```

## Migration Files Explained

### 1. `recruitment_system_update_existing.sql` ✅ SAFEST

**Use this if:**
- ✅ You have existing job_postings table
- ✅ You have existing job_applications table
- ✅ You have data you want to keep
- ✅ You just want to add new features

**What it does:**
- Adds missing columns (status_history, rejection_reason, etc.)
- Updates RLS policies to fix the "disappearing jobs" issue
- Creates cv_screening_results table if it doesn't exist
- Converts TEXT[] to JSONB if needed
- Migrates old status values to new ones
- **Preserves ALL existing data** ✅

**Safe to run multiple times:** Yes

### 2. `recruitment_system_complete.sql`

**Use this if:**
- ✅ You're starting fresh (no existing tables)
- ✅ You want to rebuild everything from scratch
- ✅ You've already backed up and deleted old tables

**What it does:**
- Creates all tables from scratch
- Sets up all RLS policies
- Creates all views and triggers
- Sets up storage bucket

**Safe to run multiple times:** Yes (uses IF NOT EXISTS)

### 3. `recruitment_system_rollback.sql` ⚠️ DESTRUCTIVE

**Use this if:**
- ⚠️ You want to completely remove the recruitment system
- ⚠️ You're okay with losing ALL recruitment data
- ⚠️ You want to start completely fresh

**What it does:**
- Drops all recruitment tables
- Drops all views
- Drops all triggers
- **DELETES ALL DATA** ⚠️

**Safe to run multiple times:** Yes, but unnecessary

## Recommended Approach

### Scenario 1: You Have Existing Data (MOST COMMON)

```sql
-- Step 1: Run the update migration
\i migrations/recruitment_system_update_existing.sql

-- Step 2: Verify everything works
\i migrations/recruitment_system_verify.sql

-- Step 3: Done! Your data is preserved and enhanced
```

### Scenario 2: Fresh Start (No Existing Tables)

```sql
-- Step 1: Run the complete migration
\i migrations/recruitment_system_complete.sql

-- Step 2: Verify everything works
\i migrations/recruitment_system_verify.sql

-- Step 3: Done! Everything is set up
```

### Scenario 3: Rebuild Everything (Have Data But Want Fresh Start)

```sql
-- Step 1: Backup your data first!
COPY (SELECT * FROM job_postings) TO '/tmp/job_postings_backup.csv' CSV HEADER;
COPY (SELECT * FROM job_applications) TO '/tmp/job_applications_backup.csv' CSV HEADER;

-- Step 2: Remove old tables
\i migrations/recruitment_system_rollback.sql

-- Step 3: Create fresh tables
\i migrations/recruitment_system_complete.sql

-- Step 4: Restore data if needed (manual import)

-- Step 5: Verify
\i migrations/recruitment_system_verify.sql
```

## How to Check What You Have

Run this in Supabase SQL Editor:

```sql
-- Check if tables exist
SELECT 
  tablename,
  CASE 
    WHEN tablename IN ('job_postings', 'job_applications', 'cv_screening_results') 
    THEN '✓ EXISTS'
    ELSE '✗ NOT FOUND'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('job_postings', 'job_applications', 'cv_screening_results');

-- Check if you have data
SELECT 
  'job_postings' as table_name,
  COUNT(*) as record_count
FROM job_postings
UNION ALL
SELECT 
  'job_applications',
  COUNT(*)
FROM job_applications;
```

**If you see:**
- Tables exist + record_count > 0 → Use `recruitment_system_update_existing.sql`
- Tables exist + record_count = 0 → Use either (update is safer)
- Tables don't exist → Use `recruitment_system_complete.sql`

## What If I'm Not Sure?

**Use `recruitment_system_update_existing.sql`** - It's the safest option!

- ✅ Won't delete anything
- ✅ Won't break anything
- ✅ Adds new features
- ✅ Fixes RLS issues
- ✅ Safe to run even if tables don't exist (will create them)

## Common Questions

### Q: Will the update migration work if I don't have any tables yet?

**A:** Yes! It uses `CREATE TABLE IF NOT EXISTS`, so it will create tables if they don't exist.

### Q: Can I run the update migration multiple times?

**A:** Yes! It's idempotent - safe to run multiple times without causing issues.

### Q: What if I already ran the old migrations?

**A:** Run `recruitment_system_update_existing.sql` - it will add the missing features to your existing tables.

### Q: Will this fix the "disappearing jobs" issue?

**A:** Yes! Both migrations include the proper RLS policies that allow public access to open jobs.

### Q: Do I need to update my code after running the migration?

**A:** No! The migrations are designed to be backward compatible with your existing code.

## Summary

| Situation | Migration to Use | Risk Level |
|-----------|-----------------|------------|
| Have data, want to keep it | `recruitment_system_update_existing.sql` | ✅ Safe |
| No tables yet | `recruitment_system_complete.sql` | ✅ Safe |
| Want fresh start, no data | `recruitment_system_complete.sql` | ✅ Safe |
| Want fresh start, have data | Backup → Rollback → Complete | ⚠️ Medium |
| Not sure | `recruitment_system_update_existing.sql` | ✅ Safest |

## Still Confused?

**Just use `recruitment_system_update_existing.sql`** - it's the safest choice and works in all scenarios!
