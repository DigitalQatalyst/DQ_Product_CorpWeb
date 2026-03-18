# Supabase Authentication - Quick Reference

## ✅ What's Been Done

### 1. Removed MSAL/Azure B2C Blocking
- ❌ Removed `MsalProvider` from AppRouter
- ❌ Removed MSAL initialization
- ✅ Added Supabase `AuthProvider` 

### 2. New Auth Routes
```
/login              → Login page (Supabase auth)
/signup             → Signup page  
/forgot-password    → Password reset
/unauthorized       → Access denied
```

### 3. Updated Route Guards
**ProtectedRoute** (`src/components/ProtectedRoute.tsx`)
- Uses `isAuthenticated` from Supabase AuthContext
- Redirects to `/login?redirect=<page>` if not authenticated
- Shows loading spinner during auth check

**AuthorizedRoute** (`src/components/AuthorizedRoute.tsx`)
- Uses Supabase role checks: `isAdmin()`, `isCreator()`, etc.
- Role hierarchy: admin > creator > viewer > HR roles
- Fine-grained permissions temporarily disabled

### 4. Components Updated to Supabase Auth
All now import from `../../contexts/AuthContext`:

**Header Components:**
- `src/components/Header/Header.tsx`
- `src/components/Header/ProfileDropdown.tsx` 
- `src/components/Header/components/MobileDrawer.tsx`

**Admin UI:**
- `src/admin-ui/components/AppLayout.tsx`
- `src/admin-ui/pages/Dashboard.tsx`
- `src/admin-ui/pages/Analytics.tsx`

**Dashboard Pages:**
- `src/pages/dashboard/DashboardRouter.tsx`
- `src/pages/dashboard/DashboardContent.tsx`
- `src/pages/dashboard/DashboardOverview.tsx`
- `src/pages/dashboard/ProfilePage.tsx`
- `src/pages/MyDQPage.tsx`

**Other:**
- `src/components/UserProfile/UserProfileForm.tsx`
- `src/hooks/useOnboardingFormRHF.ts`

## 🔐 Auth Context API

### State
```typescript
user: SimpleUser | null           // Current user
session: Session | null            // Supabase session
isLoading: boolean                 // Loading state
isAuthenticated: boolean          // Computed: has user && session
```

### Actions
```typescript
signIn(credentials)         // Login with email/password
signUp(credentials)         // Create account
signOut()                   // Logout
updateProfile(updates)      // Update user metadata
refreshSession()            // Refresh session
```

### Role Checks
```typescript
isAdmin()        // Check admin role
isCreator()      // Check creator role  
isViewer()       // Check viewer role
isHRAdmin()      // Check HR admin role
isHRViewer()     // Check HR viewer role
hasRole(role)    // Check specific role
```

## 🧪 Testing Instructions

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Test Signup
1. Go to `/signup`
2. Fill form (name, email, password)
3. Submit
4. Check email for verification (if enabled)

### 3. Test Login
1. Go to `/login`
2. Enter credentials
3. Click "Sign in"
4. Redirects to `/admin-ui/dashboard`

### 4. Test Protected Routes
1. Try accessing `/admin-ui/dashboard` while logged out
2. Should redirect to `/login?redirect=/admin-ui/dashboard`
3. Login → redirects back to dashboard

### 5. Test Role-Based Access
```
/admin-ui/settings     → admin only
/admin-ui/media        → admin, creator
/admin-ui/jobs         → admin, creator, HR roles
```

## 👤 Creating Admin Users

### Via Supabase Dashboard
1. Go to Authentication → Users
2. Select user
3. Add to `user_metadata`:
```json
{
  "role": "admin",
  "is_admin": true
}
```

### Via SQL
```sql
-- Set user as admin
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || 
    '{"role": "admin", "is_admin": true}'::jsonb
WHERE email = 'your-email@example.com';

-- Or use function
CREATE OR REPLACE FUNCTION set_user_role(
  user_email TEXT, 
  role TEXT
) RETURNS VOID AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || 
      jsonb_build_object('role', role, 'is_admin', role = 'admin')
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Usage
SELECT set_user_role('your-email@example.com', 'admin');
```

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't login after signup | Check email verification requirement |
| Access Denied on admin pages | Verify user has correct role in metadata |
| Auth state not updating | Clear cache & localStorage |
| Redirect loop | Check `redirect` param matches in routes |

## 📝 Protected Admin Routes

| Route | Required Roles |
|-------|---------------|
| `/admin-ui/dashboard` | admin, creator, HR-Admin, HR-viewer |
| `/admin-ui/settings` | admin |
| `/admin-ui/media` | admin, creator |
| `/admin-ui/media/new` | admin, creator + blogs:create |
| `/admin-ui/analytics` | admin, creator, HR-Admin, HR-viewer |
| `/admin-ui/authors` | admin, creator |
| `/admin-ui/jobs` | admin, creator, HR-Admin, HR-viewer |
| `/admin-ui/users` | admin |

## ⚙️ Environment Variables

Required in `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 📚 Additional Documentation
- Full setup guide: `SUPABASE_AUTH_SETUP.md`
- Auth context: `src/contexts/AuthContext.tsx`
- Supabase client: `src/lib/supabase.ts`
