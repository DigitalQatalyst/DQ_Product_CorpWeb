# Supabase Authentication Implementation

This document outlines the complete Supabase authentication system that replaces the Azure B2C authentication in the DigitalQatalyst application.

## Overview

The new authentication system provides:
- **Production-ready Supabase authentication** with proper session management
- **Automatic profile creation** via database triggers
- **Role-based access control** (Admin, Creator, Viewer, HR-Admin, HR-Viewer)
- **Protected admin routes** with proper authorization
- **Prolonged sessions** with automatic refresh
- **Email verification** for account security

## Architecture

### 1. Database Schema

#### Profiles Table (`public.profiles`)
- Linked to `auth.users` table via foreign key
- Automatically populated on user signup via triggers
- Contains user profile information and role assignments

**Key Fields:**
- `id` - References `auth.users.id`
- `first_name`, `last_name` - User's name
- `email` - User's email (copied from auth.users)
- `role` - User role: admin, creator, viewer, hr_admin, hr_viewer
- `email_verified` - Email verification status
- `last_login_at` - Last login timestamp

#### Database Triggers
1. `on_auth_user_created` - Creates profile when user signs up
2. `on_auth_user_email_verified` - Updates email verification status
3. `on_user_sign_in` - Updates last login timestamp
4. `set_updated_at` - Automatically updates modified timestamp

### 2. Authentication Context

#### AuthContext (`src/contexts/AuthContext.tsx`)
- **Clean, production-ready implementation**
- **Proper session management** with automatic refresh
- **Error handling** with retry logic
- **Role-based access helpers**
- **Profile management** functions

**Key Features:**
- Automatic session persistence
- Profile fetching and caching
- Role-based permission checking
- Comprehensive error handling
- TypeScript type safety

#### AuthGuard Components (`src/components/AuthGuard.tsx`)
- **AuthGuard** - Generic authentication guard
- **AdminGuard** - Admin-only access
- **CreatorGuard** - Creator and above access
- **HRAdminGuard** - HR Admin and above access
- **HRViewerGuard** - HR Viewer and above access

### 3. Authentication Pages

#### Login Page (`src/pages/auth/LoginPage.tsx`)
- Modern, responsive design
- Email/password authentication
- Error handling and loading states
- Redirect after successful login

#### Signup Page (`src/pages/auth/SignupPage.tsx`)
- First name and last name collection
- Email verification flow
- Password confirmation
- Success state with email verification message

#### Unauthorized Page (`src/pages/UnauthorizedPage.tsx`)
- Access denied page for insufficient permissions
- Shows current role and required role
- Navigation options and help resources

## Setup Instructions

### 1. Database Migration

Run the migration file to create the profiles table and triggers:

```sql
-- Run this in Supabase SQL Editor
-- File: migrations/015_create_profiles_table.sql
```

### 2. Environment Variables

Ensure these are set in your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Application Configuration

The application is already configured with:
- AuthProvider wrapping the entire app
- Protected admin routes using AuthGuard components
- Authentication routes (/login, /signup, /unauthorized)

## User Roles and Permissions

### Role Hierarchy (highest to lowest)
1. **Admin** - Full access to everything
2. **Creator** - Can create and manage content
3. **HR-Admin** - HR management access
4. **HR-Viewer** - HR viewing access
5. **Viewer** - Read-only access

### Access Control
- Admin routes are protected with `AdminGuard`
- Each role includes all permissions of lower roles
- Automatic redirection to unauthorized page for insufficient permissions

## Authentication Flow

### 1. User Registration
1. User fills out signup form (first name, last name, email, password)
2. Supabase creates user account
3. Database trigger creates profile automatically
4. Email verification sent to user
5. User must verify email to complete registration

### 2. User Login
1. User enters email and password
2. Supabase authenticates credentials
3. Session established and persisted
4. Profile fetched and cached
5. User redirected to intended destination

### 3. Session Management
- Sessions automatically refresh when needed
- Profile data cached for performance
- Automatic logout on session expiration
- Last login timestamp updated on each sign-in

## Security Features

### 1. Row Level Security (RLS)
- Users can only view/update their own profiles
- Admins can view/update all profiles
- Proper SQL policies in place

### 2. Email Verification
- Required for account activation
- Automatic status updates via triggers
- Verification links sent by Supabase

### 3. Session Security
- Secure session tokens
- Automatic refresh mechanism
- Proper session cleanup on logout

## Testing the Implementation

### 1. Create Test Users
```sql
-- Create admin user
INSERT INTO public.profiles (id, first_name, last_name, email, role)
VALUES (
  'user-uuid-here',
  'Admin',
  'User',
  'admin@example.com',
  'admin'
);

-- Create regular user
INSERT INTO public.profiles (id, first_name, last_name, email, role)
VALUES (
  'user-uuid-here',
  'Regular',
  'User',
  'user@example.com',
  'viewer'
);
```

### 2. Test Authentication Flow
1. Navigate to `/signup`
2. Create a new account
3. Check email for verification link
4. Navigate to `/login`
5. Sign in with new credentials
6. Try accessing admin routes (should redirect to unauthorized)

### 3. Test Role-Based Access
1. Sign in as different user roles
2. Verify access permissions work correctly
3. Test unauthorized page functionality

## Migration from Azure B2C

### What Changed
- **AuthContext** - Completely rewritten for Supabase
- **Authentication pages** - Updated to use new API
- **Route protection** - New AuthGuard system
- **Database schema** - New profiles table with triggers
- **Session management** - Supabase-based instead of MSAL

### What Was Removed
- Azure B2C/MSAL dependencies
- Old AuthContext in `src/components/Header/context/`
- Legacy user management system
- Complex sync logic

### Benefits
- **Simpler architecture** - One authentication system
- **Better performance** - Native database triggers
- **Improved security** - Proper RLS and email verification
- **Easier maintenance** - Clean, documented code
- **Better UX** - Modern auth flows

## Troubleshooting

### Common Issues

1. **"User not found" errors**
   - Check if profile trigger is working
   - Verify database migration was applied

2. **Permission denied errors**
   - Check RLS policies on profiles table
   - Verify user role assignments

3. **Email verification not working**
   - Check Supabase email settings
   - Verify email templates are configured

4. **Session not persisting**
   - Check browser localStorage
   - Verify Supabase project settings

### Debug Tools
- Use browser dev tools to check localStorage
- Check Supabase dashboard for user activity
- Use `window.__authDebug` for debugging (development only)

## Future Enhancements

### Planned Features
1. **Multi-factor authentication**
2. **Social login providers** (Google, GitHub, etc.)
3. **Password reset flow**
4. **User invitation system**
5. **Audit logging**
6. **Session management UI**

### Scalability Considerations
- Database indexes for performance
- Connection pooling for high traffic
- Caching strategies for profile data
- Rate limiting for auth endpoints

## Support

For issues with the authentication system:
1. Check this documentation first
2. Review Supabase auth documentation
3. Check application logs for errors
4. Verify database migration status
5. Test with different user roles

---

**Implementation Status:** ✅ Complete and Tested
**Last Updated:** March 2025
**Version:** 1.0.0
