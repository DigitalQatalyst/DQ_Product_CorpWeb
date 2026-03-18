# Supabase Authentication Setup Guide

## Overview
This guide explains the simple Supabase authentication implementation for accessing admin-ui pages.

## What Was Changed

### 1. Removed MSAL/Azure B2C Authentication
- Removed `MsalProvider` from `AppRouter.tsx`
- Removed MSAL initialization code
- Replaced with Supabase `AuthProvider` from `./contexts/AuthContext`

### 2. Added Authentication Routes
The following routes are now available:
- `/login` - Login page (uses Supabase email/password authentication)
- `/signup` - Signup page (creates new Supabase users)
- `/forgot-password` - Password reset page
- `/unauthorized` - Access denied page

### 3. Updated Route Guards
- **ProtectedRoute**: Now uses Supabase `isAuthenticated` state
  - Redirects unauthenticated users to `/login?redirect=<original-page>`
  - Shows loading spinner while checking auth state
  
- **AuthorizedRoute**: Now uses Supabase role checks
  - Checks roles: `admin`, `creator`, `viewer`, `HR-Admin`, `HR-viewer`
  - Role hierarchy: admin > creator > viewer
  - Fine-grained permissions temporarily disabled (can be added later)

### 4. Updated Components to Use Supabase Auth
All components now import from `../../contexts/AuthContext` instead of the old MSAL context:
- `src/components/Header/Header.tsx`
- `src/components/Header/ProfileDropdown.tsx`
- `src/components/Header/components/MobileDrawer.tsx`
- `src/admin-ui/components/AppLayout.tsx`
- `src/admin-ui/pages/Dashboard.tsx`
- `src/admin-ui/pages/Analytics.tsx`

### 5. Auth Context API
The Supabase AuthContext provides:

**State:**
- `user` - Current user object (null if not authenticated)
- `session` - Supabase session (null if not authenticated)
- `isLoading` - Loading state during auth check
- `isAuthenticated` - Computed boolean (has user && session)

**Actions:**
- `signIn(credentials)` - Sign in with email/password
- `signUp(credentials)` - Create new account
- `signOut()` - Log out
- `updateProfile(updates)` - Update user metadata
- `refreshSession()` - Refresh the auth session

**Role Checks:**
- `isAdmin()` - Check if user has admin role
- `isCreator()` - Check if user has creator role
- `isViewer()` - Check if user has viewer role
- `isHRAdmin()` - Check if user has HR admin role
- `isHRViewer()` - Check if user has HR viewer role
- `hasRole(role)` - Check specific role

## How to Test

### Prerequisites
1. Ensure `.env` file exists with valid Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Make sure your Supabase project has:
   - Auth enabled (email/password provider)
   - Email confirmation disabled (for testing) OR access to test emails
   - Users table with RLS policies (if using profiles)

### Testing Steps

#### 1. Start the Development Server
```bash
npm run dev
```

#### 2. Test Signup Flow
1. Navigate to `/signup`
2. Fill in the form:
   - First name
   - Last name
   - Email
   - Password (min 6 characters)
   - Confirm password
3. Submit the form
4. Check your email for verification link (if enabled)
5. Click the verification link

#### 3. Test Login Flow
1. Navigate to `/login`
2. Enter your email and password
3. Click "Sign in"
4. You should be redirected to `/admin-ui/dashboard`

#### 4. Test Protected Routes
1. Try accessing `/admin-ui/dashboard` without logging in
2. You should be redirected to `/login?redirect=/admin-ui/dashboard`
3. After login, you should return to the dashboard

#### 5. Test Role-Based Access
1. Login as a user with admin role
2. Try accessing admin-only pages like `/admin-ui/settings`
3. Logout and login as a non-admin user
4. Try accessing the same page - should see access denied message

#### 6. Test Logout
1. Click on your profile icon in the header
2. Click "Sign Out"
3. You should be logged out and redirected

## Admin UI Pages Protection

All admin-ui pages are now protected:

| Route | Required Roles | Description |
|-------|---------------|-------------|
| `/admin-ui/dashboard` | admin, creator, HR-Admin, HR-viewer | Main dashboard |
| `/admin-ui/media` | admin, creator | Media management |
| `/admin-ui/media/new` | admin, creator + blogs:create | Create blog |
| `/admin-ui/media/:id` | admin, creator | View/edit blog |
| `/admin-ui/settings` | admin | Admin settings |
| `/admin-ui/analytics` | admin, creator, HR-Admin, HR-viewer | Analytics |
| `/admin-ui/authors` | admin, creator | Author management |
| `/admin-ui/categories` | admin, creator | Category management |
| `/admin-ui/jobs` | admin, creator, HR-Admin, HR-viewer | Job postings |
| `/admin-ui/applications` | admin, creator, HR-Admin, HR-viewer | Job applications |
| `/admin-ui/users` | admin | User management |

## Creating Admin Users

To create users with specific roles, you have two options:

### Option 1: Via Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to Authentication → Users
3. Create a new user or select existing
4. Add custom claims in the `user_metadata`:
   ```json
   {
     "role": "admin",
     "is_admin": true
   }
   ```

### Option 2: Via SQL (Recommended for initial setup)
Run this SQL in your Supabase SQL editor:

```sql
-- Update existing user to admin
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin", "is_admin": true}'::jsonb
WHERE email = 'your-email@example.com';

-- Or create a function to set user role
CREATE OR REPLACE FUNCTION set_user_role(user_email TEXT, role TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', role, 'is_admin', role = 'admin')
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Usage:
SELECT set_user_role('your-email@example.com', 'admin');
```

## Troubleshooting

### Issue: Can't login after signup
**Solution:** Check if email confirmation is required. If so, check your email for the verification link.

### Issue: Getting "Access Denied" on admin pages
**Solution:** Ensure your user has the correct role in Supabase user_metadata.

### Issue: Auth state not updating
**Solution:** Clear browser cache and localStorage, then try again.

### Issue: Redirect loop
**Solution:** Check that the `redirect` parameter matches between ProtectedRoute and LoginPage.

## Next Steps

### Recommended Enhancements
1. **Email Verification**: Enable email confirmation in Supabase
2. **Password Reset**: Implement forgot password flow using Supabase functions
3. **Fine-grained Permissions**: Re-enable permission checks in AuthorizedRoute
4. **User Profiles**: Add profile creation on signup
5. **SSO**: Add social auth providers (Google, Microsoft, etc.)

### Security Considerations
1. Enable RLS (Row Level Security) on all tables
2. Set up proper database policies for each role
3. Use service role key only in backend functions
4. Regularly rotate API keys

## Support

For issues or questions:
1. Check Supabase dashboard logs
2. Review browser console for errors
3. Verify environment variables are set correctly
4. Check Supabase auth settings
