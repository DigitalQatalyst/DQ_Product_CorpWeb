# MSAL Authentication Setup Guide

## Current Configuration

Your application is already configured with Azure AD B2C (CIAM) authentication. The default configuration is:

- **Client ID**: `f996140d-d79b-419d-a64c-f211d23a38ad`
- **Tenant**: `dqproj.onmicrosoft.com`
- **Login Host**: `dqproj.ciamlogin.com`
- **Policy**: `F1_CustomerSUSILocal_KF`
- **Redirect URI**: `http://localhost:3000` (automatically set to current origin)

## How to Test Login

1. **Start the dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Navigate to the My DQ page**:
   - Click "My DQ" in the header, or
   - Go directly to: http://localhost:3000/my-dq

3. **Click any sign-in button**:
   - "Sign In"
   - "Create Account"
   - "Continue with Google"
   - "Continue with LinkedIn"
   
   All buttons currently trigger the same MSAL login flow.

4. **You'll be redirected to the Microsoft login page** where you can:
   - Sign in with an existing account
   - Create a new account (if the policy allows)

5. **After successful login**:
   - You'll be redirected back to the app
   - The header will show your profile avatar instead of "My DQ"
   - You'll have access to the ProfileDropdown menu

## What Happens After Login

Once authenticated:
- ✅ User profile is stored in local storage
- ✅ Profile avatar appears in the header
- ✅ Access to protected routes (dashboard, etc.)
- ✅ User information available via `useAuth()` hook

## Troubleshooting

### Login redirect not working?
- Check that the redirect URI in Azure AD matches your local URL
- Default is set to `window.location.origin` (should work automatically)

### Getting authentication errors?
- Verify the Client ID is correct in Azure AD
- Check that the tenant name and policy are correct
- Ensure the policy allows sign-up if you're creating a new account

### Want to customize the configuration?
Edit the `.env` file and set these variables:
```env
VITE_AZURE_CLIENT_ID=your-client-id
VITE_B2C_TENANT_NAME=your-tenant-name
VITE_AZURE_SUBDOMAIN=your-subdomain
VITE_B2C_POLICY_SIGNUP_SIGNIN=your-policy-name
```

## Development Tips

### Skip Authentication for Development
If you want to bypass authentication temporarily:
1. The app uses MSAL which stores tokens in localStorage
2. Once you log in once, you'll stay logged in until you clear localStorage or logout
3. To logout: Click your profile avatar → Logout

### Testing Different Users
- Use different browser profiles or incognito mode
- Or logout and login with different credentials

## Next Steps

After testing the login flow, we can:
1. Customize the post-login experience
2. Add role-based access control
3. Implement Google and LinkedIn OAuth
4. Create a proper sign-up flow with onboarding
5. Add user profile management

## Files Involved

- **MSAL Config**: `src/services/auth/msal.ts`
- **Auth Context**: `src/components/Header/context/AuthContext.tsx`
- **My DQ Page**: `src/pages/MyDQPage.tsx`
- **Header**: `src/components/Header/Header.tsx`
- **Environment**: `.env`
