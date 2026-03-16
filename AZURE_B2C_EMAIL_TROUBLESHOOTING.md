# Azure B2C Email Claim Configuration - Troubleshooting Guide

## Current Issue

Azure B2C authentication is working, but the **email claim is not being included in the ID token**. This causes the system to fall back to generating emails like `username@b2c-user.local`.

**Evidence:**

- Logs show: `email: "veeh@b2c-user.local"` (generated fallback)
- Token claims are missing the actual email address
- MSAL is correctly requesting `email` scope

---

## Solution: Configure Azure B2C to Return Email Claim

### Step 1: Go to Azure B2C Portal
<!-- test
 -->

1. Open https://portal.azure.com
2. Go to **Azure AD B2C** resource
3. Navigate to: **User Flows** → Select your sign-in policy (e.g., `B2C_1_SignUpSignIn`)

### Step 2: Configure Application Claims

1. In the Sign-up or sign-in policy, go to **Application claims** (or **User attributes**)
2. Add/Enable these claims:
   - ✅ **Email Address** (or `email`)
   - ✅ **Display Name**
   - ✅ **Given Name**
   - ✅ **Surname**

### Step 3: Configure Local Account Sign-in Options

Make sure your policy includes:

- **Email address** as a sign-in option
- **Email address** collected during sign-up
- **Email verification** enabled

### Step 4: Verify Token Enrichment

1. Go to **API connectors** (optional but recommended)
2. Ensure your policy retrieves the user's email from the local directory
3. Check that the email attribute is correctly mapped to the `email` claim in the token

---

## Database Schema Note

The `users` table in Supabase has an email validation constraint:

```sql
CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
```

This means:

- ✅ Real emails like `user@example.com` pass validation
- ❌ Generated fallback emails like `username@b2c-user.local` might fail validation depending on the pattern

---

## Temporary Workaround (Until B2C is Fixed)

If you cannot immediately configure Azure B2C, use the username as the email:

### Option A: Use Username as Email

In Azure B2C, map the `preferred_username` (objectId or email) to be returned in the token claims.

### Option B: Store Both UPN and Email

Update the `users` table to accept UPN (user principal name) as well as email.

---

## Testing After Configuration

1. **Clear browser cache:**

   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```

2. **Sign in again with test user**

3. **Check browser console for logs:**

   ```
   [MSAL Debug] Cached Account Details
   🔐 ID Token Claims: {
     email: "user@example.com",  ← Should now contain real email
     emails: ["user@example.com"],
     ...
   }
   ```

4. **Verify in Supabase:**
   ```sql
   SELECT email, name, role FROM users ORDER BY created_at DESC LIMIT 1;
   ```
   Email should now be: `user@example.com` (not the fallback)

---

## Quick Checklist

- [ ] Azure B2C policy includes **Email Address** as application claim
- [ ] Email address is collected during **sign-up**
- [ ] Email verification is **enabled** in the policy
- [ ] Local account sign-in uses **email** as an option
- [ ] Tested sign-up with new user
- [ ] Verified email appears in token claims in browser console
- [ ] Email syncs correctly to Supabase users table

---

## Reference Documentation

- [Azure B2C: Configure user input collection](https://docs.microsoft.com/en-us/azure/active-directory-b2c/configure-user-input)
- [Azure B2C: Return claims to application](https://docs.microsoft.com/en-us/azure/active-directory-b2c/managed-user-accounts-azure-ad-b2c)
- [MSAL.js: Scopes and permissions](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/scopes.md)

---

## Debug Commands (Browser Console)

```javascript
// See all token claims
window.__authDebug?.getState();

// See accounts in MSAL cache
window.__authDebug?.accounts;

// Check if email is in claims
const state = window.__authDebug?.getState();
console.log("User email:", state?.user?.email);
```
