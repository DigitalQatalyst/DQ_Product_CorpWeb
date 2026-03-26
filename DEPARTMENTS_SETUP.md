# Departments Setup Guide

## Quick Setup (Recommended)

### Option 1: Manual SQL (Easiest)
1. Copy contents of `supabase/migrations/departments_simple.sql`
2. Go to your Supabase project → SQL Editor
3. Paste and run the SQL
4. Done! The table will be created with default departments

### Option 2: Setup Script
Run the setup script (fixes applied):
```bash
./setup_departments.sh
```

## Troubleshooting

### If departments keep loading:
1. Check browser console for errors
2. Verify Supabase connection in AuthContext
3. Check if departments table exists in Supabase dashboard

### If SQL errors occur:
1. Check Supabase logs in dashboard
2. Verify RLS policies are enabled
3. Ensure user has admin role for write operations

### Current Issues Fixed:
✅ SQL syntax errors in migration
✅ Infinite loop in JobPostingCreate useEffect  
✅ JavaScript errors in setup script
✅ Added error handling to department service

## Files Created:
- `supabase/migrations/001_create_departments.sql` (complete with RLS)
- `supabase/migrations/departments_simple.sql` (simpler version)
- `setup_departments.sh` (automated setup)
- `src/services/departmentService.ts` (CRUD operations)
- `src/admin-ui/pages/DepartmentsManagement.tsx` (management UI)

## Next Steps:
1. Run the setup (manual or script)
2. Test departments management at `/admin-ui/departments`
3. Create job posting to test department dropdown
