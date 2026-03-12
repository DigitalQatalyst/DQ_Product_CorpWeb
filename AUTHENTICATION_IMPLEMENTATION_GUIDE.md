# Azure B2C + Supabase Authentication Implementation Guide

## Overview

This guide describes the complete implementation of unified user authentication and authorization using Azure B2C for authentication and Supabase for user data storage.

**Key Changes:**

- Consolidated `auth.users` → `admin_users` → `authors` into a single `users` table
- Added 3-tier role system: `admin`, `creator`, `viewer`
- Implemented automatic user provisioning on first Azure B2C login
- Added Row-Level Security (RLS) policies for data protection
- Created unified user management service

---

## Architecture

```
Azure B2C (Authentication)
    ↓
MSAL (Frontend Login)
    ↓
AuthContext (Stores user credentials)
    ↓
/api/auth/sync-profile (Backend)
    ↓
Edge Function: sync-user-from-b2c
    ↓
Supabase RPC: sync_user_from_b2c()
    ↓
Users Table (Supabase Database)
    ↓
RLS Policies enforce role-based access
```

---

## Implementation Steps

### Phase 1: Database Migration (Supabase)

Execute these migrations in order against your Supabase database:

1. **001_create_user_role_enum.sql**
   - Creates the `user_role` enum type with values: `admin`, `creator`, `viewer`

2. **002_create_unified_users_table.sql**
   - Creates the new unified `users` table
   - Enables RLS on the table
   - Creates indexes for performance

3. **003_setup_role_permissions.sql**
   - Creates/updates `role_permissions` table
   - Seeds default permissions for each role

4. **004_migrate_foreign_keys.sql**
   - Updates all foreign key constraints to reference new `users` table
   - Affected tables:
     - `blogs.author_id` → `users.id`
     - `email_templates.created_by` → `users.id`
     - `interviews.created_by` → `users.id`
     - `interview_feedback.interviewer_id` → `users.id`
     - `notifications.user_id` → `users.id`
     - `activity_logs.user_id` → `users.id`
     - `form_submissions.user_id` → `users.id` (new column)

5. **005_create_rls_policies.sql**
   - Creates comprehensive RLS policies for:
     - `users` table (own profile, admins all access)
     - `blogs` table (creators edit own, admins edit all, viewers read-only)
     - `form_submissions` (admins read all, creators read own)
     - `notifications` (users see own, admins manage)
     - Other tables with appropriate access controls

6. **006_create_sync_functions.sql**
   - `sync_user_from_b2c()` - Auto-provision users on first login
   - `get_user_by_auth_id()` - Fetch user by Azure B2C ID
   - `check_user_permission()` - Check single permission
   - `get_user_permissions()` - Fetch all user permissions

7. **007_migrate_existing_data.sql**
   - Migrates data from `admin_users` to new `users` table
   - Migrates data from `authors` to new `users` table as creators
   - Maps old roles to new 3-tier roles:
     - `super_admin`, `admin` → `admin`
     - `hr_manager`, `content_editor`, `content_creator` → `creator`
     - `viewer` → `viewer`

8. **008_drop_redundant_tables.sql** ⚠️ **LAST - After verification**
   - Drops old tables: `admin_users`, `authors`, `user_roles`
   - Only run after verifying data migration successful

**How to apply migrations:**

Option A: Via Supabase Dashboard

- Go to SQL Editor
- Run each migration file in order
- Verify successful completion before moving to next

Option B: Via Supabase CLI

```bash
supabase db push
```

---

### Phase 2: Deploy Supabase Edge Function

Deploy the `sync-user-from-b2c` edge function:

**Location:** `supabase/functions/sync-user-from-b2c/index.ts`

Steps:

1. Ensure Supabase CLI is installed: `npm install -g supabase`
2. Authenticate: `supabase login`
3. Link to project: `supabase link --project-ref swwghoukwlnocpfkuluv`
4. Deploy function:
   ```bash
   supabase functions deploy sync-user-from-b2c
   ```
5. Verify deployment:
   ```bash
   supabase functions list
   ```

---

### Phase 3: Backend API Endpoint

The API endpoint is already created at: `src/pages/api/auth/sync-profile.ts`

**What it does:**

- Receives POST request after MSAL login
- Extracts user info from Azure B2C token
- Calls Supabase edge function to sync user
- Returns user profile with role and permissions

**Access it from frontend:**

```typescript
const response = await fetch("/api/auth/sync-profile", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${idToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: user.email,
    name: user.name,
    given_name: user.givenName,
    family_name: user.familyName,
    avatar_url: user.picture,
  }),
});
```

---

### Phase 4: Frontend Integration

The AuthContext has been updated to automatically sync users. No changes needed if using the new `useAuth()` hook.

**New AuthContext Features:**

```typescript
const {
  user, // User profile with role
  isLoading, // Auth loading state
  isSyncing, // Supabase sync in progress
  syncError, // Any sync errors
  hasPermission, // (resource, action) => boolean
  isAdmin, // () => boolean
  isCreator, // () => boolean
  login,
  logout,
} = useAuth();
```

**Usage Examples:**

```typescript
// Check if user is admin
if (auth.isAdmin()) {
  // Show admin panel
}

// Check specific permission
if (auth.hasPermission('blogs', 'delete')) {
  // Show delete button
}

// Show sync loading state
if (auth.isSyncing) {
  return <Spinner />;
}

// Display user role
if (auth.user) {
  console.log(`User role: ${auth.user.role}`);
}
```

---

### Phase 5: Update Components Using Users

Replace usage of old services with new `userService`:

**Old:** `adminUserService.ts`
**New:** `userService.ts`

**Example migration:**

```typescript
// Old
import { getAdminUsers } from "@/services/adminUserService";
const admins = await getAdminUsers();

// New
import { getUsersByRole } from "@/services/userService";
const admins = await getUsersByRole("admin");
```

**Available functions in userService:**

- `getAllUsers(limit?, offset?)` - Get all users with pagination
- `getUserById(userId)` - Get single user
- `getUserByEmail(email)` - Get user by email
- `getUserByAuthId(authUserId)` - Get user by Azure B2C ID
- `createUser(input)` - Create new user (admin only)
- `updateUser(userId, input)` - Update user profile
- `updateUserRole(userId, role)` - Change user role
- `deactivateUser(userId)` - Soft delete
- `activateUser(userId)` - Reactivate user
- `deleteUser(userId)` - Hard delete
- `getUsersByRole(role)` - Get all users with specific role
- `searchUsers(query, limit)` - Search users by name/email
- `getUserStatistics()` - Get user count by role
- `bulkUpdateUserRoles(userIds, role)` - Bulk role change
- `hasUserPermission(userId, resource, action)` - Check permission
- `getUserPermissions(userId)` - Get all user permissions

---

## Role Definitions

### Admin

- **Permissions**: Full platform access
- **Capabilities**:
  - Create, read, update, delete all content
  - Manage all users and assign roles
  - Access audit logs and analytics
  - Configure system settings
  - View all form submissions
  - Manage interviews and recruitment

### Creator

- **Permissions**: Content creation and own resource management
- **Capabilities**:
  - Create and publish blogs/content
  - Edit/delete own content
  - View own form submissions
  - Schedule and participate in interviews
  - Update own profile and avatar
  - Cannot access admin panel or user management

### Viewer

- **Permissions**: Read-only access
- **Capabilities**:
  - View published content and blogs
  - Submit forms
  - View job postings
  - Cannot create or edit any content
  - View own profile (read-only)

---

## RLS Policy Overview

### Users Table

| Role    | SELECT | INSERT | UPDATE                | DELETE |
| ------- | ------ | ------ | --------------------- | ------ |
| Admin   | ✅ All | ✅ Yes | ✅ All                | ✅ Yes |
| Creator | ✅ Own | ❌ No  | ✅ Own                | ❌ No  |
| Viewer  | ✅ Own | ❌ No  | ✅ Own (profile only) | ❌ No  |

### Blogs Table

| Role    | SELECT | INSERT | UPDATE | DELETE |
| ------- | ------ | ------ | ------ | ------ |
| Admin   | ✅ All | ✅ Yes | ✅ All | ✅ Yes |
| Creator | ✅ All | ✅ Yes | ✅ Own | ✅ Own |
| Viewer  | ✅ All | ❌ No  | ❌ No  | ❌ No  |

### Form Submissions

| Role    | SELECT | INSERT | UPDATE | DELETE |
| ------- | ------ | ------ | ------ | ------ |
| Admin   | ✅ All | ✅ Yes | ✅ Yes | ✅ Yes |
| Creator | ✅ Own | ✅ Yes | ❌ No  | ❌ No  |
| Viewer  | ❌ No  | ✅ Yes | ❌ No  | ❌ No  |

---

## Testing the Implementation

### 1. Test Azure B2C Login

```
1. Navigate to login page
2. Click "Sign In"
3. Authenticate with Azure B2C
4. You should be redirected to dashboard
5. Check browser console for success message
```

### 2. Test User Sync

```
1. After login, monitor network tab
2. Look for POST /api/auth/sync-profile
3. Check response contains: user_id, role, permissions
4. Check useAuth() hook returns synced data
```

### 3. Test Role-Based Access

```
1. Login as admin - should see all content
2. Login as creator - should only see own content
3. Login as viewer - should see read-only views
```

### 4. Test Permissions

```typescript
const { hasPermission, isAdmin } = useAuth();

// Test admin check
if (isAdmin()) {
  console.log("Admin access granted");
}

// Test specific permission
if (hasPermission("blogs", "delete")) {
  console.log("Can delete blogs");
}
```

### 5. Test RLS Policies

```sql
-- Disable RLS temporarily (for testing only)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Re-enable after testing
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

---

## Troubleshooting

### Issue: User not syncing after login

**Causes:**

- Edge function not deployed
- API endpoint not responding
- JWT token validation failing
- Database connection issue

**Solutions:**

1. Check Supabase functions list: `supabase functions list`
2. Check API endpoint logs: `curl -X GET http://localhost:3000/api/health`
3. Verify Supabase connection string in `.env`
4. Check browser console for errors

### Issue: "Permission denied" on database queries

**Causes:**

- RLS policies too restrictive
- User role not set correctly
- JWT claims not matching auth_user_id

**Solutions:**

1. Verify user has correct role: `SELECT * FROM users WHERE auth_user_id = 'xxx'`
2. Check RLS policies are enabled: `ALTER TABLE users ENABLE ROW LEVEL SECURITY`
3. Test by disabling RLS temporarily (dev only)

### Issue: Old tables still referenced in code

**Causes:**

- Code not updated to use new `users` table
- Queries still referencing `admin_users` or `authors`

**Solutions:**

1. Search codebase: `grep -r "admin_users\|authors" src/`
2. Replace with `users` and update query logic
3. Use new `userService` functions

---

## Cleanup Checklist

- [ ] All migrations applied successfully
- [ ] Data migrated from old tables to `users`
- [ ] Edge function deployed and tested
- [ ] AuthContext updated and syncing users
- [ ] userService integrated into codebase
- [ ] All old table references removed from code
- [ ] Old migrations/SQL files moved to archive
- [ ] End-to-end testing complete
- [ ] Role-based access verified
- [ ] RLS policies tested
- [ ] Documentation updated
- [ ] Deployment to staging environment
- [ ] UAT testing by stakeholders
- [ ] Production deployment

---

## Next Steps

1. **Apply database migrations** in sequence
2. **Deploy edge function** via Supabase CLI
3. **Test locally** with Azure B2C sandbox account
4. **Update any remaining references** to old tables
5. **Deploy to staging** for UAT
6. **Run end-to-end tests** with real B2C users
7. **Deploy to production** with monitoring

---

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Supabase logs: `supabase functions logs sync-user-from-b2c`
3. Check Azure B2C app registration config
4. Verify environment variables are set correctly
5. Contact Supabase support if database issues persist

---

**Created:** February 19, 2026
**Version:** 1.0 - Initial Implementation
