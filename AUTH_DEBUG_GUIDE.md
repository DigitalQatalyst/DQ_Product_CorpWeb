# Authentication System Debug Guide

## Overview

Your authentication system is now fully integrated with:

- **Azure B2C** via MSAL (Microsoft Authentication Library)
- **Supabase PostgreSQL** with RLS and auto-provisioning
- **React Context** for auth state management
- **Comprehensive logging** for debugging

## ✅ Recent Fixes Applied

### 1. MSAL Initialization Error (FIXED)

**Error:** `BrowserAuthError: uninitialized_public_client_application`

**Root Cause:** MSAL instance was created but never initialized with `handleRedirectPromise()`

**Fix Applied:**

- Created `initializeMsal()` function in `src/services/auth/msal.ts`
- Added `useEffect(() => initializeMsal(), [])` in `src/AppRouter.tsx`
- Added error guards in `src/components/Header/context/AuthContext.tsx`

**Result:** ✅ Auth flow now initializes properly on app load

---

## 🔍 Debug Console - Quick Testing

### Open Browser DevTools

Press `F12` or right-click → "Inspect" → Console tab

### Available Debug Commands

```javascript
// Check current auth state
window.__authDebug;

// See detailed state
window.__authDebug.getState();

// Manually trigger user sync (after login)
window.__authDebug.manualSync();

// Manually logout
window.__authDebug.logout();

// View MSAL accounts
window.__authDebug.accounts;
```

### Expected Console Log Output (on app load)

```
[MSAL] Initializing MSAL instance...
[MSAL] Redirect promise handled
[MSAL] MSAL initialized successfully
[Auth Debug Helper] Available as window.__authDebug in console
```

---

## 🚀 Step-by-Step Testing Guide

### Step 1: Verify MSAL Initialization

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Refresh the page (Ctrl+R)
4. Look for: `[MSAL] MSAL initialized successfully`
5. If you see this → ✅ MSAL is ready

**If you see an error:**

- Check that `VITE_MSAL_CLIENT_ID`, `VITE_MSAL_AUTHORITY`, and `VITE_MSAL_REDIRECT_URI` are set in `.env.local`
- Verify Azure B2C tenant URL is correct

### Step 2: Click Sign In Button

1. Find the **Sign In** button in the header (top right)
2. Click it
3. You should be redirected to Azure B2C login page
4. **If nothing happens:** Check console for errors, look for `[Auth]` prefix

### Step 3: Authenticate with Azure B2C

1. Enter your Azure B2C credentials
2. Approve any permissions if prompted
3. You should redirect back to the app
4. Watch console for:
   ```
   [Auth] Login event triggered
   [Supabase] Calling sync_user_from_b2c RPC with: {...}
   [Supabase] User sync successful: {...}
   [Auth] User profile synced successfully: {...}
   ```

### Step 4: Verify User Profile Loads

1. Header should show your profile picture/initials
2. Click profile → should show your name and email
3. Check console for: `[Auth] User profile synced successfully`

### Step 5: Check User in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to: **SQL Editor** → write:
   ```sql
   SELECT id, auth_user_id, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 1;
   ```
3. You should see your user with:
   - `auth_user_id` = your Azure B2C Object ID
   - `email` = your email
   - `role` = 'viewer' (default)
   - `created_at` = recent timestamp

---

## 📊 Complete Auth Flow Sequence

```
1. User clicks "Sign In"
   ↓ src/components/Header/Header.tsx calls login()
   ↓
2. AuthContext.login() initiated
   ↓ Uses MSAL to show Azure B2C login
   ↓
3. User authenticates at Azure B2C
   ↓ Azure B2C redirects back to app
   ↓
4. AppRouter useEffect calls initializeMsal()
   ↓ Handles redirect promise
   ↓
5. AuthContext detects LOGIN_SUCCESS event
   ↓ Triggers syncUserProfile()
   ↓
6. Supabase RPC sync_user_from_b2c called
   ↓ User auto-created or updated in database
   ↓
7. getUserPermissions() fetches user's role & permissions
   ↓ Loaded from role_permissions table
   ↓
8. AuthContext sets user state
   ↓ Header re-renders with profile
   ↓
9. ✅ User fully authenticated and authorized
```

---

## 🐛 Troubleshooting Common Issues

### Issue: "Sign In button does nothing"

**Debug steps:**

1. Check console for any errors (red text)
2. Run: `window.__authDebug.getState()`
3. Verify `VITE_MSAL_CLIENT_ID` is set: `echo $VITE_MSAL_CLIENT_ID`

**Solution:**

- Restart dev server: `npm run dev`
- Verify `.env.local` has all required variables
- Hard refresh browser (Ctrl+Shift+R)

### Issue: "User synced but not in database"

**Debug steps:**

1. Run in console: `window.__authDebug.supabaseUserId`
2. If null → sync failed, check `window.__authDebug.syncError`
3. Check Supabase logs: Dashboard → Logs → API

**Solution:**

- Manually trigger sync: `window.__authDebug.manualSync()`
- Check that `sync_user_from_b2c` RPC exists in Supabase
- Verify RLS policies aren't blocking inserts

### Issue: "Red error badge in header"

**Debug steps:**

1. Click to see error message
2. Run: `window.__authDebug.syncError`
3. Check Supabase logs for RPC errors

**Solution:**

- Review Supabase Edge Function logs
- Check RLS policies on users table
- Verify auth_user_id is string format

### Issue: "BrowserAuthError: uninitialized_public_client_application"

**Root cause:** MSAL initialization not called before use

**Debug check:**

- Check console for: `[MSAL] Initializing MSAL instance...`
- If missing → AppRouter.tsx initialization failed

**Solution:**

- Verify `src/AppRouter.tsx` has useEffect that calls `initializeMsal()`
- Check console for errors during initialization
- Restart dev server

### Issue: "Multiple login attempts/redirects"

**Debug steps:**

1. Check `window.__authDebug.accounts` - should be array with 1 item
2. Check for multiple MSAL/Auth events firing

**Solution:**

- Clear LocalStorage: `localStorage.clear()` then refresh
- Ensure React.StrictMode isn't causing double effects in dev
- Check for multiple MsalProvider wraps in component tree

---

## 📝 Log Prefix Reference

All logs are prefixed for easy filtering in console:

| Prefix       | Source                                          | What it means                                   |
| ------------ | ----------------------------------------------- | ----------------------------------------------- |
| `[MSAL]`     | `src/services/auth/msal.ts`                     | Microsoft Authentication Library initialization |
| `[Auth]`     | `src/components/Header/context/AuthContext.tsx` | React auth context state changes                |
| `[Supabase]` | `src/lib/supabase.ts`                           | Database operations and RPC calls               |
| `[Debug]`    | Console helpers                                 | Manual test commands via window.\_\_authDebug   |

### Filter Console by Prefix

1. Open DevTools Console
2. Type in filter box: `[Auth]` to see only Auth logs
3. Type in filter box: `[Supabase]` to see only database logs

---

## 🔧 Key Files Reference

| File                                            | Purpose                             | Key Functions                                           |
| ----------------------------------------------- | ----------------------------------- | ------------------------------------------------------- |
| `src/services/auth/msal.ts`                     | MSAL configuration & initialization | `initializeMsal()` - **ENTRY POINT**                    |
| `src/AppRouter.tsx`                             | Root router component               | Calls `initializeMsal()` on mount                       |
| `src/components/Header/context/AuthContext.tsx` | Auth state management               | `useAuth()`, `login()`, `logout()`, `syncUserProfile()` |
| `src/components/Header/Header.tsx`              | Navigation header                   | Shows login button and profile                          |
| `src/lib/supabase.ts`                           | Database client & helpers           | `syncUserFromB2C()`, `getUserPermissions()`             |

---

## ✨ Environment Variables Required

Make sure these are in `.env.local`:

```env
# Azure B2C / MSAL
VITE_MSAL_CLIENT_ID=your-client-id
VITE_MSAL_AUTHORITY=https://your-tenant.b2clogin.com/your-tenant.onmicrosoft.com/B2C_1_SignUpSignIn
VITE_MSAL_REDIRECT_URI=http://localhost:3000
VITE_MSAL_POST_LOGOUT_REDIRECT_URI=http://localhost:3000

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Azure Scopes (optional)
VITE_AZURE_SCOPES=
```

---

## 💡 Quick Tips

1. **Clear auth cache:** `localStorage.clear()` then refresh
2. **View stored auth:** Check LocalStorage → look for `msal.account.*` keys
3. **Monitor RPC performance:** Supabase Dashboard → Database → Query Performance
4. **Check user permissions:**
   ```sql
   SELECT * FROM role_permissions WHERE role = 'viewer';
   ```
5. **View all users:**
   ```sql
   SELECT id, email, role, created_at FROM users;
   ```

---

## 🎯 Success Checklist

After completing all debugging steps, you should see:

- [ ] `[MSAL] MSAL initialized successfully` in console on page load
- [ ] Sign In button redirects to Azure B2C login page
- [ ] After login, redirects back to app with user profile showing
- [ ] Console shows `[Auth] User profile synced successfully`
- [ ] New user appears in Supabase users table
- [ ] Header shows user profile picture/initials
- [ ] No red error badge in header
- [ ] `window.__authDebug` is available in console

✅ **All green?** Your authentication system is ready for production testing!

---

## 📞 Still Having Issues?

1. **Search console logs** for error messages (Ctrl+F in console)
2. **Run debug commands** to inspect state
3. **Check Supabase logs** for RPC errors
4. **Enable verbose logging** in `.env.local`: `VITE_MSAL_DEBUG=true`
5. **Restart dev server** after env changes: `npm run dev`
