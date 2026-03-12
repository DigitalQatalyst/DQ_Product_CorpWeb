# Microsoft Teams Integration for Interview Scheduling

## Overview

The recruitment module now includes seamless Microsoft Teams integration, allowing HR teams to create Teams meetings directly from the interview scheduler without leaving the platform.

## Features

### ✨ What's New

1. **One-Click Teams Meeting Creation**
   - Create Teams meetings automatically when scheduling interviews
   - Meeting link is generated and added to the interview
   - Calendar invite sent to candidate automatically

2. **No Context Switching**
   - Stay in the recruitment dashboard
   - No need to open Teams or Outlook separately
   - Meeting details sync automatically

3. **Automatic Calendar Integration**
   - Meeting added to your Outlook calendar
   - Candidate receives calendar invite via email
   - Includes Teams join link and dial-in numbers

4. **Smart Integration**
   - Only shows for video and technical interviews
   - Optional - you can still add manual links
   - Graceful fallback if Teams creation fails

## How to Use

### Step 1: Grant Teams Permissions (One-Time Setup)

1. Navigate to **Recruitment → Interviews**
2. Click **"Schedule Interview"**
3. Select **"Video Interview"** or **"Technical Interview"**
4. You'll see the Teams Integration section
5. Click **"Grant Permissions"** button
6. Sign in with your Microsoft account (if prompted)
7. Accept the requested permissions:
   - `Calendars.ReadWrite` - Create calendar events
   - `OnlineMeetings.ReadWrite` - Create Teams meetings
   - `User.Read` - Read your profile

### Step 2: Schedule Interview with Teams Meeting

1. Fill in interview details:
   - Candidate name and email
   - Interview type (select Video or Technical)
   - Date, time, and duration

2. In the **Teams Integration** section:
   - Check ✓ **"Automatically create Teams meeting and add link"**
   - The meeting link field will be disabled (auto-generated)

3. Click **"Schedule Interview"**
   - System creates Teams meeting
   - Adds meeting link to interview
   - Sends calendar invite to candidate
   - Shows success message

4. Done! The interview now has:
   - Teams meeting link
   - Calendar event in your Outlook
   - Invite sent to candidate

### Step 3: Join the Meeting

When it's time for the interview:
1. Go to **Recruitment → Interviews**
2. Find the interview in the list
3. Click the 🎥 video icon
4. Teams meeting opens in new tab

## Benefits

### For HR Team

- ⏱️ **Save Time** - No switching between apps
- 🎯 **Stay Focused** - Everything in one place
- ✅ **Reduce Errors** - Automatic link generation
- 📧 **Auto-Invites** - Candidates get calendar invites
- 📊 **Better Tracking** - All meetings in one system

### For Candidates

- 📧 **Professional Invites** - Outlook calendar invite
- 🔗 **Easy Access** - One-click join link
- 📞 **Dial-In Options** - Phone numbers included
- ⏰ **Calendar Reminders** - Automatic reminders

## Technical Details

### Required Permissions

The integration requires these Microsoft Graph API permissions:

| Permission | Purpose | Type |
|------------|---------|------|
| `Calendars.ReadWrite` | Create calendar events | Delegated |
| `OnlineMeetings.ReadWrite` | Create Teams meetings | Delegated |
| `User.Read` | Read user profile | Delegated |

### What Gets Created

When you create a Teams meeting, the system:

1. **Creates Online Meeting**
   - Generates unique Teams meeting link
   - Sets up audio conferencing
   - Configures meeting settings

2. **Creates Calendar Event**
   - Adds to your Outlook calendar
   - Includes meeting details
   - Adds candidate as attendee
   - Sets meeting as "Teams Meeting"

3. **Sends Invitations**
   - Candidate receives email invite
   - Includes .ics calendar file
   - Contains Teams join link
   - Shows dial-in numbers

### Meeting Details Included

Each Teams meeting includes:

- **Join URL** - Web link to join meeting
- **Conference ID** - For dial-in access
- **Toll Number** - Phone number (if available)
- **Toll-Free Number** - Free phone number (if available)
- **Meeting Subject** - "Interview with [Candidate Name]"
- **Duration** - As specified in interview
- **Attendees** - Candidate email

## Troubleshooting

### Issue: "Grant Permissions" Button Not Working

**Solution:**
1. Ensure you're signed in with Microsoft account
2. Check popup blockers aren't blocking the auth window
3. Try using a different browser
4. Clear browser cache and try again

### Issue: Teams Meeting Creation Fails

**Possible Causes:**
- Insufficient permissions
- Network connectivity issues
- Microsoft Graph API temporarily unavailable

**Solution:**
1. System will ask if you want to continue without Teams meeting
2. You can manually add a meeting link instead
3. Or try again later

### Issue: Candidate Didn't Receive Calendar Invite

**Check:**
1. Verify candidate email is correct
2. Check their spam/junk folder
3. Ensure they can receive external calendar invites
4. Resend the meeting link manually if needed

### Issue: Meeting Link Not Working

**Solution:**
1. Verify the link was copied correctly
2. Check if meeting was cancelled
3. Create a new Teams meeting
4. Update the interview with new link

## Configuration

### Environment Variables

Ensure these are set in your `.env.local`:

```env
# Microsoft Authentication
VITE_MSAL_CLIENT_ID=your-client-id
VITE_MSAL_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
VITE_MSAL_REDIRECT_URI=http://localhost:3000

# Azure Scopes (include Teams scopes)
VITE_AZURE_SCOPES=openid profile email offline_access Calendars.ReadWrite OnlineMeetings.ReadWrite User.Read
```

### Azure AD App Registration

Your Azure AD app must have:

1. **API Permissions:**
   - Microsoft Graph → Calendars.ReadWrite (Delegated)
   - Microsoft Graph → OnlineMeetings.ReadWrite (Delegated)
   - Microsoft Graph → User.Read (Delegated)

2. **Authentication:**
   - Platform: Single-page application (SPA)
   - Redirect URI: Your app URL
   - Implicit grant: ID tokens

3. **Admin Consent:**
   - May require admin consent for organization
   - Contact IT admin if needed

## Best Practices

### 1. Always Test First

- Create a test interview with your own email
- Verify you receive the calendar invite
- Test joining the meeting
- Check all details are correct

### 2. Inform Candidates

- Send a follow-up email with meeting details
- Include backup dial-in numbers
- Provide technical support contact
- Send reminder 24 hours before

### 3. Have a Backup Plan

- Keep Zoom/Google Meet as backup
- Have phone numbers ready
- Test meeting 15 minutes early
- Have candidate's phone number

### 4. Use Consistent Naming

- Use clear meeting subjects
- Include candidate name
- Mention position/role
- Add interview round (e.g., "Technical Round")

## Limitations

### Current Limitations

1. **Single Organizer** - Meeting created under your account only
2. **No Co-Hosts** - Can't add multiple interviewers automatically
3. **No Recording Settings** - Must enable recording manually in Teams
4. **No Waiting Room** - Default Teams settings apply
5. **No Custom Backgrounds** - Set in Teams app separately

### Future Enhancements

Planned features:
- Add multiple interviewers
- Configure meeting settings (recording, waiting room)
- View calendar availability
- Reschedule meetings
- Cancel meetings from dashboard
- Meeting analytics and attendance tracking

## Security & Privacy

### Data Handling

- Meeting links stored in database
- No recording of meeting content
- Candidate email used only for invites
- Complies with Microsoft's privacy policies

### Access Control

- Only authenticated HR users can create meetings
- Meetings created under your Microsoft account
- Candidate can only join, not manage meeting
- Meeting links are unique and secure

## Support

### Getting Help

If you encounter issues:

1. **Check Browser Console**
   - Open DevTools (F12)
   - Look for error messages
   - Share with IT support

2. **Verify Permissions**
   - Go to https://myapps.microsoft.com
   - Check app permissions
   - Revoke and re-grant if needed

3. **Test Authentication**
   - Sign out and sign in again
   - Clear browser cache
   - Try incognito mode

4. **Contact Support**
   - Provide error message
   - Share screenshot
   - Mention browser and OS

## FAQ

### Q: Can I use this with personal Microsoft accounts?

A: Yes, but organizational accounts (work/school) are recommended for better integration.

### Q: Does this work with Zoom or Google Meet?

A: No, this integration is specifically for Microsoft Teams. You can still manually add Zoom/Meet links.

### Q: Can candidates join without Teams app?

A: Yes, they can join via web browser. Teams app is optional.

### Q: Are meetings recorded automatically?

A: No, you must start recording manually during the meeting.

### Q: Can I schedule recurring interviews?

A: Not yet. Each interview must be scheduled separately.

### Q: What happens if I delete the interview?

A: The Teams meeting remains in your calendar. You should cancel it separately in Teams/Outlook.

### Q: Can I edit the meeting after creation?

A: Not from the dashboard yet. Edit in Teams/Outlook calendar.

### Q: Is there a limit on meeting duration?

A: Teams meetings can last up to 24 hours. Set appropriate duration when scheduling.

## Changelog

### Version 1.0.0 (Current)

- ✅ One-click Teams meeting creation
- ✅ Automatic calendar invite sending
- ✅ Permission management
- ✅ Graceful error handling
- ✅ Meeting link auto-population

### Upcoming Features

- 🔄 Meeting rescheduling
- 🔄 Meeting cancellation
- 🔄 Multiple interviewer support
- 🔄 Calendar availability checking
- 🔄 Meeting settings configuration

---

**Last Updated:** 2026-02-20  
**Status:** ✅ Production Ready  
**Integration:** Microsoft Teams via Graph API
