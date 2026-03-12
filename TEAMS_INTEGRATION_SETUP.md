# Teams Integration - Quick Setup Checklist

## ✅ Setup Checklist

### 1. Azure AD Configuration

- [ ] Azure AD app is registered
- [ ] API permissions added:
  - [ ] `Calendars.ReadWrite` (Delegated)
  - [ ] `OnlineMeetings.ReadWrite` (Delegated)
  - [ ] `User.Read` (Delegated)
- [ ] Admin consent granted (if required)
- [ ] Redirect URI configured for SPA
- [ ] Client ID copied

### 2. Environment Variables

Add to `.env.local`:

```env
VITE_MSAL_CLIENT_ID=your-azure-ad-client-id
VITE_MSAL_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
VITE_MSAL_REDIRECT_URI=http://localhost:3000
VITE_AZURE_SCOPES=openid profile email offline_access Calendars.ReadWrite OnlineMeetings.ReadWrite User.Read
```

- [ ] `VITE_MSAL_CLIENT_ID` set
- [ ] `VITE_MSAL_AUTHORITY` set
- [ ] `VITE_MSAL_REDIRECT_URI` set
- [ ] `VITE_AZURE_SCOPES` includes Teams scopes

### 3. Code Integration

- [ ] `teamsIntegrationService.ts` created
- [ ] `InterviewScheduler.tsx` updated
- [ ] Teams integration UI added
- [ ] Permission checking implemented
- [ ] Error handling added

### 4. Testing

- [ ] Sign in with Microsoft account works
- [ ] Permission grant flow works
- [ ] Teams meeting creation works
- [ ] Calendar invite received
- [ ] Meeting link added to interview
- [ ] Join meeting link works

### 5. User Training

- [ ] HR team informed about new feature
- [ ] Permission grant process explained
- [ ] Demo/training session conducted
- [ ] Documentation shared

## 🚀 Quick Start

### For Developers

1. **Install dependencies** (already done if using existing project)
   ```bash
   npm install @azure/msal-browser
   ```

2. **Configure Azure AD**
   - Go to Azure Portal → Azure Active Directory → App registrations
   - Create new registration or use existing
   - Add API permissions
   - Configure authentication

3. **Update environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in Azure AD details

4. **Test locally**
   ```bash
   npm run dev
   ```

5. **Grant permissions**
   - Navigate to Interviews page
   - Click "Schedule Interview"
   - Select "Video Interview"
   - Click "Grant Permissions"

### For HR Users

1. **First Time Setup**
   - Go to Recruitment → Interviews
   - Click "Schedule Interview"
   - Select "Video Interview" or "Technical Interview"
   - Click "Grant Permissions" in the Teams section
   - Sign in with your Microsoft account
   - Accept the permissions

2. **Schedule Interview with Teams**
   - Fill in candidate details
   - Select interview type (Video or Technical)
   - Check ✓ "Automatically create Teams meeting"
   - Click "Schedule Interview"
   - Done! Meeting link is added automatically

## 📋 Verification Steps

### Test 1: Permission Grant

```
1. Open Interview Scheduler
2. Click "Schedule Interview"
3. Select "Video Interview"
4. Verify "Grant Permissions" button appears
5. Click button
6. Sign in with Microsoft
7. Accept permissions
8. Verify button changes to show permissions granted
```

**Expected Result:** ✅ Permissions granted successfully

### Test 2: Create Teams Meeting

```
1. Fill in interview form:
   - Candidate Name: Test User
   - Candidate Email: your-email@example.com
   - Type: Video Interview
   - Date: Tomorrow
   - Time: 10:00 AM
   - Duration: 60 minutes
2. Check "Automatically create Teams meeting"
3. Click "Schedule Interview"
4. Wait for creation (shows loading spinner)
5. Verify success message
```

**Expected Result:** ✅ Interview created with Teams link

### Test 3: Verify Calendar Invite

```
1. Check your email inbox
2. Look for calendar invite
3. Verify it contains:
   - Meeting subject
   - Date and time
   - Teams join link
   - Dial-in numbers
4. Accept the invite
5. Verify it appears in Outlook calendar
```

**Expected Result:** ✅ Calendar invite received and accepted

### Test 4: Join Meeting

```
1. Go to Interviews list
2. Find the test interview
3. Click the 🎥 video icon
4. Verify Teams meeting opens
5. Join the meeting
6. Verify audio/video works
```

**Expected Result:** ✅ Successfully joined Teams meeting

## 🐛 Common Issues & Fixes

### Issue: "Grant Permissions" button doesn't work

**Fix:**
```
1. Check browser console for errors
2. Verify MSAL configuration in .env.local
3. Check popup blockers
4. Try different browser
```

### Issue: Teams meeting creation fails

**Fix:**
```
1. Verify API permissions in Azure AD
2. Check if admin consent is required
3. Verify scopes in .env.local
4. Check network connectivity
5. Try signing out and back in
```

### Issue: Calendar invite not received

**Fix:**
```
1. Check spam/junk folder
2. Verify candidate email is correct
3. Check if external invites are allowed
4. Manually forward the meeting link
```

### Issue: Meeting link doesn't work

**Fix:**
```
1. Verify link was copied correctly
2. Check if meeting was cancelled
3. Try opening in different browser
4. Create new meeting if needed
```

## 📞 Support Contacts

- **Technical Issues:** IT Support
- **Azure AD Issues:** Azure Administrator
- **Feature Requests:** Product Team
- **User Training:** HR Manager

## 📚 Additional Resources

- [Microsoft Graph API Documentation](https://docs.microsoft.com/en-us/graph/)
- [Teams Meeting API Reference](https://docs.microsoft.com/en-us/graph/api/resources/onlinemeeting)
- [MSAL.js Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Azure AD App Registration Guide](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)

## 🎯 Success Criteria

The integration is successful when:

- ✅ HR can grant permissions without IT help
- ✅ Teams meetings are created in under 5 seconds
- ✅ Calendar invites are received by candidates
- ✅ Meeting links work reliably
- ✅ No manual copying/pasting of links needed
- ✅ HR team adoption rate > 80%

## 📊 Metrics to Track

- Number of Teams meetings created
- Success rate of meeting creation
- Time saved per interview scheduling
- User satisfaction score
- Support tickets related to Teams integration

---

**Setup Time:** ~15 minutes  
**Difficulty:** Easy  
**Prerequisites:** Azure AD account, Admin access (for permissions)
