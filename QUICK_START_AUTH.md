# Quick Start: Apply Authentication Implementation

**Time to Complete:** ~20-30 minutes
**Difficulty:** Intermediate

---

## Quick Summary

You now have a complete authentication system ready to deploy. This guide walks through applying it step by step.

**What's being implemented:**

- Azure B2C login with Supabase user sync
- 3 roles: admin (full access) / creator (content) / viewer (read-only)
- Automatic user provisioning on first login
- Role-based access control via RLS policies

---

## Step 1: Build Supabase Schema (10 min)

### Via Supabase Dashboard

1. Go to **SQL Editor** in your Supabase project
2. Copy & paste each migration file in order:
   - `migrations/001_create_user_role_enum.sql`
   - `migrations/002_create_unified_users_table.sql`
   - `migrations/003_setup_role_permissions.sql`
   - `migrations/004_migrate_foreign_keys.sql`
   - `migrations/005_create_rls_policies.sql`
   - `migrations/006_create_sync_functions.sql`
3. Run each one **in order** (wait for completion)
4. ✅ Verify no errors

### Or Via Supabase CLI

```bash
# Navigate to project
cd c:\Users\vitalis\Desktop\DQ\DQ_Prod_CorpWeb

# Link to Supabase (if not already linked)
supabase link --project-ref swwghoukwlnocpfkuluv

# Push migrations
supabase db push
```

---

## Step 2: Deploy Edge Function (5 min)

### Prerequisites

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase
```

### Deploy

```bash
# From project root
supabase functions deploy sync-user-from-b2c

# Verify deployment
supabase functions list
```

**Expected output:**

```
✓ sync-user-from-b2c (Deno) 201 Created
```

---

## Step 3: Test Database & Function (5 min)

### 1. Check Users Table Created

In Supabase Dashboard → Table Editor:

- ✅ Confirm `users` table exists
- ✅ View columns (id, auth_user_id, email, role, etc)
- ✅ RLS is enabled

### 2. Check Role Permissions

Run in SQL Editor:

```sql
SELECT role, resource, action, can_perform
FROM role_permissions
LIMIT 10;
```

**Should show permissions for admin, creator, viewer roles**

### 3. Check Functions Created

Run in SQL Editor:

```sql
\df sync_user_from_b2c
\df get_user_by_auth_id
\df check_user_permission
\df get_user_permissions
```

**Should list all 4 functions**

---

## Step 4: Local Testing (5 min)

### 1. Update Environment

Ensure `.env.local` has:

```bash
VITE_SUPABASE_URL=https://swwghoukwlnocpfkuluv.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_MSAL_CLIENT_ID=your_b2c_client_id
# ... other B2C vars
```

### 2. Start Dev Server

```bash
npm run dev
# or
yarn dev
```

### 3. Test Login Flow

```
1. Navigate to http://localhost:5173 (or 3000)
2. Click "Sign In"
3. Authenticate with Azure B2C test account
4. Open browser console
5. Look for messages:
   - "User profile synced successfully"
   - or "User sync failed" + error details
```

### 4. Check Sync Response

In browser DevTools → Network:

- Find `POST /api/auth/sync-profile`
- Check Response tab
- Should see:
  ```json
  {
    "user_id": "uuid",
    "email": "test@example.com",
    "role": "viewer",
    "created": true,
    "permissions": [...]
  }
  ```

---

## Step 5: Data Migration (Optional - Only if migrating old users)

⚠️ **Only run if you have existing admin_users or authors data**

### 1. Check Current Data

In SQL Editor:

```sql
SELECT COUNT(*) as admin_count FROM admin_users;
SELECT COUNT(*) as authors_count FROM authors;
```

### 2. Run Migration

Run this in SQL Editor:

```sql
-- Copy contents of migrations/007_migrate_existing_data.sql
-- and paste into SQL Editor, then run
```

### 3. Verify Migration

```sql
SELECT
  'Total Users' as metric,
  COUNT(*) as count
FROM users;

SELECT role, COUNT(*) FROM users GROUP BY role;
```

---

## Step 6: Verification Checklist

- [ ] All migrations applied without errors
- [ ] Edge function deployed successfully
- [ ] `users` table exists with correct columns
- [ ] RLS policies are enabled
- [ ] `role_permissions` has data
- [ ] Functions are created
- [ ] Local login works
- [ ] User synced to database
- [ ] AuthContext shows user.role
- [ ] No console errors

---

## Common Issues & Quick Fixes

### Issue: "Function does not exist" on login

**Solution:**

1. Run migration 006 again: `migrations/006_create_sync_functions.sql`
2. Verify functions: `\df sync_user_from_b2c`
3. Restart dev server

### Issue: "403 Forbidden" on RLS

**Solution:**

1. Verify user has auth_user_id set
2. Check RLS policy: `SELECT * FROM pg_policies WHERE tablename = 'users';`
3. Temporarily disable RLS for testing: `ALTER TABLE users DISABLE ROW LEVEL SECURITY;`

### Issue: Login redirects but doesn't sync

**Solution:**

1. Check env vars are correct
2. Check browser console for errors
3. Check if `/api/auth/sync-profile` endpoint exists
4. Look at Supabase function logs: `supabase functions logs sync-user-from-b2c`

### Issue: Old admin_users table still referenced

**Solution:**

1. Search code: `grep -r "admin_users" src/`
2. Replace with `users`
3. Update queries to use new `userService`

---

## Next: Advanced Setup

Once verified, you can:

1. **Migrate existing data** (Step 5 if you have old data)
2. **Drop old tables** - Run migration 008 (after backups!)
3. **Update codebase** - Search & replace old admin service
4. **Deploy to staging** - Test with real B2C users
5. **Production deployment** - With monitoring & rollback plan

---

## Files Reference

| Step | Files                                                                                 |
| ---- | ------------------------------------------------------------------------------------- |
| 1    | `migrations/001-006.sql`                                                              |
| 2    | `supabase/functions/sync-user-from-b2c/index.ts`                                      |
| 3    | Supabase Dashboard SQL Editor                                                         |
| 4    | `src/pages/api/auth/sync-profile.ts`, `src/components/Header/context/AuthContext.tsx` |
| 5    | `migrations/007_migrate_existing_data.sql`                                            |

---

## Support

For detailed help:

- See `AUTHENTICATION_IMPLEMENTATION_GUIDE.md` (comprehensive guide)
- See `AUTH_IMPLEMENTATION_SUMMARY.md` (detailed summary)
- Check Supabase logs: `supabase functions logs sync-user-from-b2c`
- Check browser console for client-side errors

---

**Ready?** Start with Step 1 and work through in order. Should take ~30 min total.

Once complete, your system will have:
✅ Azure B2C authentication
✅ Automatic user provisioning
✅ 3-tier role system
✅ Row-level security
✅ Unified user management

Good luck! 🚀
