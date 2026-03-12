# Authentication System Configuration Guide

## Overview

The DQ Prod CorpWeb application uses Azure B2C for authentication with Supabase for user profile storage and role-based access control (RBAC). This is a **React + Supabase** frontend-only authentication system with no backend required.

## Architecture

```
Azure B2C Login
    ↓
MSAL (Microsoft Authentication Library)
    ↓
AuthContext (React)
    ↓
Supabase Client
    ↓
sync_user_from_b2c() RPC Function
    ↓
Users Table + Role Permissions
    ↓
RLS Policies Enforce Access Control
```

## Environment Configuration

### Required Environment Variables

```env
# Azure B2C & MSAL
VITE_AZURE_CLIENT_ID=<your-azure-b2c-client-id>
VITE_AZURE_TENANT_ID=<your-azure-b2c-tenant-id>
VITE_AZURE_REDIRECT_URI=http://localhost:3000

# Supabase
VITE_SUPABASE_URL=https://swwghoukwlnocpfkuluv.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>

# Optional: For improved email resolution
VITE_MSAL_ENABLE_GRAPH_FALLBACK=true
```

## Supabase Database Structure

### Tables

| Table              | RLS | Purpose                                      |
| ------------------ | --- | -------------------------------------------- |
| `users`            | ✓   | Unified user profiles with roles             |
| `role_permissions` | ✓   | Permission matrix (role × resource × action) |
| `blogs`            | ✓   | Blog posts with author tracking              |
| `form_submissions` | ✓   | User-submitted forms                         |
| `email_templates`  | ✓   | Email templates for notifications            |
| `notifications`    | ✓   | User notifications                           |
| `interviews`       | ✓   | Interview scheduling                         |

### Users Table Schema

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  auth_user_id UUID UNIQUE,           -- Azure B2C OID
  email TEXT UNIQUE,
  name TEXT,
  title TEXT,
  bio TEXT,
  avatar_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  role user_role DEFAULT 'viewer',   -- admin | creator | viewer
  is_active BOOLEAN DEFAULT true,
  department TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  last_login_at TIMESTAMP
);
```

### Role System

| Role        | Max Permissions | Typical Use                           |
| ----------- | --------------- | ------------------------------------- |
| **admin**   | 8               | Full platform access, user management |
| **creator** | 5               | Content creation rights               |
| **viewer**  | 3               | Read-only access + form submissions   |

## Authentication Flow

### 1. User Login (Browser)

```
User clicks "Login"
  → MSAL popup/redirect to Azure B2C
  → User authenticates
  → MSAL stores tokens in localStorage
  → App detects authentication
```

### 2. User Profile Sync (Automatic)

```
AuthContext detects isAuthenticated = true
  → Extracts JWT claims (oid, email, name)
  → Calls syncUserFromB2C(authUserId, email, name)
  → Supabase RPC creates/updates user record
  → Assigns default role = 'viewer'
  → Fetches user permissions
  → Stores in React context
```

### 3. Component Access Control

```
Component checks useAuth().isAdmin()
  → Returns true if user role = 'admin'
  → Renders protected content or shows redirect
```

## React Integration

### 1. AuthContext Setup

```tsx
import { AuthProvider, useAuth } from "@/components/Header/context/AuthContext";

<AuthProvider>
  <App />
</AuthProvider>;
```

### 2. Using Authentication

```tsx
function MyComponent() {
  const { user, isAdmin, isCreator, hasPermission } = useAuth();

  if (!user) return <div>Please login</div>;

  return (
    <>
      <h1>Welcome, {user.name}</h1>
      <p>Role: {user.role}</p>

      {isAdmin() && <AdminPanel />}

      {hasPermission("blogs", "create") && <CreateBlogButton />}
    </>
  );
}
```

### 3. Helper Functions

```typescript
const auth = useAuth();

// Check role
auth.isAdmin(); // Returns boolean
auth.isCreator(); // Returns boolean
auth.isViewer(); // Returns boolean

// Check permissions
auth.hasPermission("blogs", "create"); // Returns boolean
auth.hasPermission("users", "update"); // Returns boolean

// User info
auth.user.email; // User email
auth.user.role; // Current role
auth.user.permissions; // Array of permission objects

// Auth actions
auth.login(); // Trigger Azure B2C login
auth.logout(); // Logout and clear data

// Sync status
auth.isSyncing; // Boolean: currently syncing
auth.syncError; // Error message if sync failed
```

## Supabase RPC Functions

### sync_user_from_b2c()

Auto-provisions or updates user on login:

- Creates new user with default 'viewer' role if not exists
- Updates last_login_at and avatar_url if already exists
- Returns: `{ user_id, email, role, is_active, created }`

### get_user_permissions()

Fetches all permissions for a user:

- Returns array of: `{ resource, action, can_perform }`
- Example resources: blogs, users, form_submissions
- Example actions: create, read, update, delete

### check_user_permission()

Checks single permission:

- Parameters: auth_user_id, resource, action
- Returns: boolean

## Row-Level Security (RLS) Policies

All tables enforce RLS at the database level:

### Users Table

- Users see their own profile (self-read)
- Admins see all users
- Users can update own profile (not role)
- Admins can update any profile including roles

### Blogs Table

- All authenticated users can read published blogs
- Creators can create/update/delete own blogs
- Admins can manage all blogs

### Form Submissions Table

- Anyone can submit forms (guest access)
- Users see own submissions
- Admins see all submissions

## Troubleshooting

### Issue: User not syncing

**Solution**: Check browser console for [Auth] prefix logs. Verify:

- VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set
- User is authenticated (check MSAL logs)
- Supabase RLS policies allow service role

### Issue: Permission check always returns false

**Solution**:

- Verify role_permissions table has entries
- Check user role is one of: admin, creator, viewer
- Verify resource/action names match exactly

### Issue: RLS blocks legitimate queries

**Solution**:

- Ensure auth.uid() is set (Supabase session)
- Check if using correct Supabase client (getPrimarySupabase)
- RLS policies assume authenticated user context

### Issue: Logout doesn't clear data

**Solution**:

- Check browser localStorage is cleared
- Verify MSAL config includes post-logout redirect

## Testing

### Manual Testing Checklist

1. **Login Flow**
   - [ ] Click login → redirects to Azure B2C
   - [ ] Enter credentials → redirects back
   - [ ] Console shows [Auth] sync logs
   - [ ] User appears in Supabase users table

2. **Role-Based Access**
   - [ ] Admin sees admin panel
   - [ ] Creator can create blogs
   - [ ] Viewer sees read-only content
   - [ ] Permissions enforced at component level

3. **Logout Flow**
   - [ ] Click logout → clears auth state
   - [ ] Redirects to login page
   - [ ] localStorage cleared
   - [ ] Cannot access protected routes

4. **Permission System**
   - [ ] hasPermission() returns correct results
   - [ ] RLS policies block unauthorized DB access
   - [ ] Admins can promote/demote user roles
   - [ ] Role changes take effect immediately

## Deployment Checklist

- [ ] Environment variables configured in hosting platform
- [ ] Supabase project URL correct
- [ ] VITE_SUPABASE_ANON_KEY set (not SERVICE_ROLE_KEY)
- [ ] Azure B2C redirect URI updated for production domain
- [ ] RLS policies reviewed and enabled
- [ ] Database backups created
- [ ] Error monitoring configured (Sentry, etc.)

## Performance Considerations

- **First Load**: ~2-3 seconds (MSAL + Supabase sync)
- **Cached Logins**: <1 second (localStorage)
- **Permission Checks**: <100ms (in-memory array)
- **DB Queries**: Optimized with indexes and RLS

## Security Best Practices

1. ✓ Never expose SERVICE_ROLE_KEY in frontend
2. ✓ Use ANON_KEY with RLS policies for auth enforcement
3. ✓ Email verified through Azure B2C
4. ✓ Role changes immediate via in-memory updates
5. ✓ Last_login tracked for security audits
6. ✓ RLS prevents cross-user data access

## Support & Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Azure B2C Documentation](https://docs.microsoft.com/en-us/azure/active-directory-b2c/)
- [MSAL React](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- Supabase Dashboard: https://app.supabase.com
