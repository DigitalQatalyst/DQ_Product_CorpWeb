# Authentication Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │   React Application (Vite)                              │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │   AuthContext (useAuth hook)                             │  │
│  │   ├─ user.email, user.name                              │  │
│  │   ├─ user.role (admin/creator/viewer)                   │  │
│  │   ├─ user.permissions (resource/action pairs)           │  │
│  │   ├─ hasPermission(), isAdmin(), isCreator()            │  │
│  │   └─ isSyncing, syncError states                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           │ (1) User clicks Login               │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │   MSAL (Azure B2C)                                       │  │
│  │   ├─ Login popup shows                                   │  │
│  │   ├─ User authenticates                                  │  │
│  │   └─ Returns JWT ID token + access token                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           │ (2) User authenticated              │
│                           │     ID token captured               │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │   AuthContext.useEffect()                                │  │
│  │   ├─ Detects isAuthenticated = true                      │  │
│  │   ├─ Calls /api/auth/sync-profile with ID token          │  │
│  │   └─ Sets isSyncing = true                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           │ (3) POST /api/auth/sync-profile     │
│                           │     Headers: Authorization: Bearer  │
│                           │     Body: { email, name, avatar }   │
│                           ▼                                      │
└─────────────────────────────────────────────────────────────────┘
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVER SIDE (Next.js)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  /api/auth/sync-profile.ts                                     │
│  ├─ Receives POST with ID token + user info                   │
│  ├─ Verifies JWT token                                         │
│  ├─ Calls Supabase Edge Function                               │
│  └─ Returns: { user_id, role, permissions, profile }           │
│                           │                                      │
│                           │ (4) Call Edge Function              │
│                           │     supabase.functions.invoke()     │
│                           ▼                                      │
└─────────────────────────────────────────────────────────────────┘
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                  SUPABASE EDGE FUNCTIONS (Deno)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  sync-user-from-b2c/index.ts                                   │
│  ├─ Verify JWT with Supabase                                   │
│  ├─ Extract: auth_user_id, email, name, avatar               │
│  ├─ Call RPC: sync_user_from_b2c()                            │
│  └─ Fetch RPC: get_user_permissions()                         │
│                           │                                      │
│                           │ (5) Call RPC Functions              │
│                           │     supabase.rpc()                  │
│                           ▼                                      │
└─────────────────────────────────────────────────────────────────┘
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE DATABASE (PostgreSQL)               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  RPC Function: sync_user_from_b2c()                      │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Check if user exists in users table                     │  │
│  │  ├─ EXISTS: Update last_login_at                         │  │
│  │  └─ NOT EXISTS: Create new user with role='viewer'      │  │
│  │  Return: { user_id, email, role, is_active, created }   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Users Table (RLS Enabled)                               │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  id (UUID, PK)                                           │  │
│  │  auth_user_id (FK to auth.users, unique)                │  │
│  │  email, name, title, bio, avatar_url                     │  │
│  │  linkedin_url, twitter_url, website_url                  │  │
│  │  role (enum: admin/creator/viewer)  ◄────┐              │  │
│  │  is_active, department, created_at                       │  │
│  │  updated_at, last_login_at                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│               ┌───────────┴───────────┐                          │
│               ▼                       ▼                          │
│  ┌──────────────────────────┐  ┌──────────────────┐            │
│  │  Role Permissions Table  │  │  Auth.users Table│            │
│  ├──────────────────────────┤  ├──────────────────┤            │
│  │  id, role                │  │  id (PK)         │            │
│  │  resource, action        │  │  Azure B2C ID    │            │
│  │  can_perform             │  │  email           │            │
│  │                          │  │  ...             │            │
│  │  Admin: full access      │  │                  │            │
│  │  Creator: own content    │  │ (Managed by      │            │
│  │  Viewer: read-only       │  │  Azure B2C)      │            │
│  └──────────────────────────┘  └──────────────────┘            │
│                           │                                      │
│                           │ (6) Update users table               │
│                           │     Join role_permissions           │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  RPC Function: get_user_permissions()                    │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  SELECT from role_permissions WHERE                      │  │
│  │    role = user.role AND can_perform = true               │  │
│  │  Return: [{ resource, action, can_perform }, ...]        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           │ (7) Get permissions                  │
│                           ▼                                      │
└─────────────────────────────────────────────────────────────────┘
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVER RESPONSE (Next.js)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Response payload:                                             │
│  {                                                             │
│    "user_id": "uuid-abc-123",                                 │
│    "email": "user@example.com",                               │
│    "role": "creator",         ◄── Role from users table       │
│    "is_active": true,                                         │
│    "created": true,  # First-time user                        │
│    "profile": {                                               │
│      "name": "John Doe",                                      │
│      "title": "Content Creator",                              │
│      "bio": "...",                                            │
│      "avatar_url": "https://..."                              │
│    },                                                         │
│    "permissions": [                                            │
│      { "resource": "blogs", "action": "create", "can_perform": true },      │
│      { "resource": "blogs", "action": "update", "can_perform": true },      │
│      { "resource": "blogs", "action": "delete", "can_perform": true },      │
│      { "resource": "users", "action": "read", "can_perform": true },        │
│      ...                                                      │
│    ]                                                          │
│  }                                                            │
│                           │                                      │
│                           │ (8) Return response                 │
│                           ▼                                      │
└─────────────────────────────────────────────────────────────────┘
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE (Updated)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AuthContext.state updated:                                    │
│  ├─ user.supabaseUserId = "uuid-abc-123"                      │
│  ├─ user.role = "creator"                                     │
│  ├─ user.permissions = [...]                                  │
│  ├─ user.isNewUser = true                                     │
│  ├─ isSyncing = false                                         │
│  └─ syncError = null                                           │
│                           │                                      │
│                           │ (9) Component re-renders             │
│                           │     with user data                   │
│                           ▼                                      │
│  Components can now:                                           │
│  ├─ Show: "Welcome, John Doe!"                               │
│  ├─ Check: auth.isCreator() ✅ true                           │
│  ├─ Verify: auth.hasPermission('blogs', 'create') ✅ true    │
│  └─ Apply: RLS policies on Supabase queries                   │
│                                                                 │
│  User is fully authenticated & authorized! 🎉                |
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Summary

| Step | Component     | Action                                         |
| ---- | ------------- | ---------------------------------------------- |
| 1    | Browser       | User clicks "Sign In"                          |
| 2    | MSAL          | Shows Azure B2C login popup                    |
| 3    | Azure B2C     | User authenticates, returns JWT                |
| 4    | AuthContext   | Detects login, calls sync endpoint             |
| 5    | Next.js API   | Validates JWT, calls Edge Function             |
| 6    | Edge Function | Calls RPC to sync user                         |
| 7    | PostgreSQL    | Creates/updates user in users table            |
| 8    | PostgreSQL    | Fetches user permissions from role_permissions |
| 9    | Edge Function | Returns user profile + permissions             |
| 10   | API Route     | Returns response to frontend                   |
| 11   | AuthContext   | Updates state with user data                   |
| 12   | React         | Components re-render with user context         |

---

## Permission Cascade

```
User logs in with Azure B2C
    ↓
User auto-created in users table
    ↓
User assigned role (admin/creator/viewer)
    ↓
On request to access resource:
    ├─ Check RLS policy (who can SELECT/UPDATE/DELETE)
    ├─ Check role_permissions table (what can user do)
    └─ Allow or deny based on both

Example:
  Creator wants to DELETE a blog
    ├─ Check RLS: DELETE allowed if author_id = current_user_id ✓
    ├─ Check role_permissions: creator.blogs.delete = true ✓
    └─ Operation allowed! ✓

  Viewer wants to DELETE a blog
    ├─ Check RLS: DELETE denied (not author) ✗
    ├─ Check role_permissions: viewer.blogs.delete = false ✗
    └─ Operation blocked! ✗
```

---

## Table Relationships

```
┌────────────────┐
│  auth.users    │  (Managed by Azure B2C)
│   (Supabase)   │
├────────────────┤
│  id (PK)       │  Azure B2C Object ID
│  email         │
│  ...           │
└────────────────┘
        ▲
        │ 1:1
        │
┌────────────────────────────────────────┐
│  users                                 │  (Managed by app)
│                                        │
├────────────────────────────────────────┤
│  id (PK)                               │
│  auth_user_id (FK) ──────────────────► │ ─→ auth.users.id
│  email                                 │
│  name, title, bio, avatar_url          │
│  linkedin_url, twitter_url, ...        │
│  role ─────────────────────────◐       │
│  is_active, department                 │
│  created_at, updated_at, last_login_at │
└────────────────────────────────────────┘
        ▲
        │
      1:* (multiple users can have same role)
        │
┌────────────────────────────────────────┐
│  role_permissions                      │
│                                        │
├────────────────────────────────────────┤
│  role (FK) ◄──────────────────────────┘
│  resource (text)                       │
│  action (text)                         │
│  can_perform (boolean)                 │
└────────────────────────────────────────┘

User → Blogs (via author_id)
User → Form Submissions (via user_id)
User → Interviews (via created_by)
User → Notifications (via user_id)
User → Activity Logs (via user_id)
```

---

## Role Hierarchy

```
                    ┌─────────────────┐
                    │     VIEWER      │
                    │   (Read-only)   │
                    └─────────────────┘
                           ▲
                           │ Can be promoted to
                           │
                    ┌─────────────────┐
                    │    CREATOR      │
                    │ (Content author)│
                    └─────────────────┘
                           ▲
                           │ Can be promoted to
                           │
                    ┌─────────────────┐
                    │     ADMIN       │
                    │  (Full access)  │
                    └─────────────────┘

Default role for new users: VIEWER
Admin can assign/change roles
Viewer cannot change own role
```

---

## Security Layers

```
┌──────────────────────────────────────────────┐
│ Layer 1: Azure B2C Authentication            │
│ ├─ User must authenticate with credentials  │
│ ├─ JWT token signed and verified            │
│ └─ Token sent with every request             │
└──────────────────────────────────────────────┘
              ▼
┌──────────────────────────────────────────────┐
│ Layer 2: Supabase RLS (Row-Level Security)  │
│ ├─ Database-level access control             │
│ ├─ Users can only see/modify authorized     │
│ │  data (roles enforced)                     │
│ └─ Prevents direct DB access bypassing app   │
└──────────────────────────────────────────────┘
              ▼
┌──────────────────────────────────────────────┐
│ Layer 3: Application-Level Permissions      │
│ ├─ role_permissions table defines actions   │
│ ├─ API endpoints check permissions           │
│ └─ UI hides buttons for non-allowed actions  │
└──────────────────────────────────────────────┘
              ▼
┌──────────────────────────────────────────────┐
│ Layer 4: Frontend Route Guards               │
│ ├─ Private routes require auth               │
│ ├─ Admin routes check role                   │
│ └─ Redirects to login if unauthorized        │
└──────────────────────────────────────────────┘
```

---

## Component Usage Examples

### Check Role in Component

```typescript
import { useAuth } from '@/components/Header/context/AuthContext';

export function AdminPanel() {
  const { user, isAdmin } = useAuth();

  if (!isAdmin()) {
    return <div>Access Denied</div>;
  }

  return <div>Admin Content - {user?.role}</div>;
}
```

### Check Permission

```typescript
import { useAuth } from '@/components/Header/context/AuthContext';

export function BlogActions() {
  const { hasPermission, user } = useAuth();

  return (
    <div>
      {hasPermission('blogs', 'create') && (
        <button>Create Blog</button>
      )}
      {hasPermission('blogs', 'delete') && (
        <button>Delete Blog</button>
      )}
    </div>
  );
}
```

### Show Sync Status

```typescript
export function AuthStatus() {
  const { user, isSyncing, syncError } = useAuth();

  if (isSyncing) return <div>Syncing profile...</div>;
  if (syncError) return <div>Sync failed: {syncError}</div>;
  if (user) return <div>Welcome {user.name}!</div>;
  return <div>Sign in to continue</div>;
}
```

---

**Created:** February 19, 2026
**For:** Azure B2C + Supabase Authentication System
