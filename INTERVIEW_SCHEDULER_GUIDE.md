# Interview Scheduler - User Guide

## Overview

The Interview Scheduler feature allows HR managers and admins to schedule, track, and manage candidate interviews throughout the recruitment process.

## Accessing the Feature

**Navigation:** Recruitment → Interviews  
**Route:** `/admin-ui/interviews`  
**Icon:** Calendar icon

---

## How to Schedule an Interview

### Step 1: Click "Schedule Interview" Button

Located in the top-right corner of the Interview Scheduler page.

### Step 2: Fill in Interview Details

**Required Information:**
- **Candidate Name** - Full name of the candidate
- **Candidate Email** - Email address for sending interview invitations
- **Interview Type** - Select from:
  - 📞 Phone Screen - Initial screening call
  - 🎥 Video - Remote video interview
  - 📍 Onsite - In-person interview at office
  - 💻 Technical - Technical assessment/coding interview
  - ✅ Final - Final round interview

- **Date & Time** - When the interview will take place
- **Duration** - Length of interview in minutes (default: 60)
- **Status** - Initial status (usually "Scheduled")

**Optional Information:**
- **Meeting Link** - Video conference URL (Zoom, Teams, Google Meet)
- **Location** - Physical address for onsite interviews
- **Interviewer** - Name of person conducting the interview
- **Notes** - Additional details or instructions

### Step 3: Save Interview

Click "Schedule Interview" button to create the interview record.

---

## Interview Workflow

### Interview Statuses

1. **Scheduled** 🔵 - Interview has been scheduled
2. **Confirmed** 🟢 - Candidate confirmed attendance
3. **Completed** ⚪ - Interview finished
4. **Cancelled** 🔴 - Interview was cancelled
5. **Rescheduled** 🟡 - Interview moved to different time
6. **No Show** 🟠 - Candidate didn't attend

### Typical Flow

```
Scheduled → Confirmed → Completed
     ↓
  Cancelled / Rescheduled / No Show
```

---

## Managing Interviews

### View All Interviews

The main table shows:
- Candidate name and email
- Interview type with icon
- Date, time, and duration
- Current status
- Action buttons

### Filter Interviews

Use the filter buttons to view:
- **ALL** - Show all interviews
- **SCHEDULED** - Upcoming interviews
- **CONFIRMED** - Confirmed interviews
- **COMPLETED** - Past interviews
- **CANCELLED** - Cancelled interviews

### Update Interview Status

Click the status dropdown for any interview to change its status inline.

### Join Video Interviews

If a meeting link is provided, click the 🎥 video icon to join the meeting.

---

## Dashboard Stats

The Interview Scheduler displays 4 key metrics:

1. **Total Interviews** - All scheduled interviews
2. **Upcoming** - Future scheduled/confirmed interviews
3. **Completed** - Successfully completed interviews
4. **Cancelled** - Cancelled interviews

---

## Integration with Job Applications

### Linking to Applications

Interviews can be linked to specific job applications:

```typescript
{
  application_id: "uuid-of-application",
  job_posting_id: 123,
  candidate_name: "John Doe",
  candidate_email: "john@example.com",
  // ... other fields
}
```

### Viewing from Applications Page

From the Job Applications page, you can:
1. Select a candidate
2. Click "Schedule Interview"
3. Interview is automatically linked to that application

---

## Best Practices

### 1. **Set Clear Interview Types**
- Use Phone Screen for initial contact
- Progress to Video or Onsite for deeper evaluation
- Use Technical for skills assessment
- Final round for decision-making

### 2. **Always Include Meeting Links**
- For video interviews, add Zoom/Teams/Meet link
- Test the link before sending to candidate
- Include backup phone number

### 3. **Update Status Promptly**
- Mark as "Confirmed" when candidate responds
- Update to "Completed" immediately after interview
- Record "No Show" if candidate doesn't attend

### 4. **Use Duration Wisely**
- Phone Screen: 15-30 minutes
- Video Interview: 45-60 minutes
- Technical: 60-90 minutes
- Final Round: 30-45 minutes

### 5. **Add Detailed Notes**
- Include interview agenda
- List topics to cover
- Note any special requirements

---

## Interview Feedback (Coming Soon)

After completing an interview, you'll be able to:
- Rate the candidate (1-5 stars)
- Add detailed feedback
- Make hiring recommendations
- Share notes with team

---

## Email Notifications (Future Feature)

Planned features:
- Automatic email invitations to candidates
- Calendar invites (.ics files)
- Reminder emails 24 hours before
- Follow-up emails after interview

---

## Calendar Integration (Future Feature)

Planned integrations:
- Google Calendar sync
- Microsoft Outlook sync
- Export to .ics format
- View in calendar view

---

## Current Limitations

1. **No Modal Implementation Yet** - The "Schedule Interview" button exists but the modal form needs to be implemented
2. **Manual Email Sending** - You need to manually email candidates with interview details
3. **No Calendar Sync** - Interviews don't sync with external calendars yet
4. **No Feedback Form** - Interview feedback feature is planned but not implemented

---

## Database Schema

Interviews are stored in the `interviews` table with:

```sql
CREATE TABLE interviews (
  id UUID PRIMARY KEY,
  application_id UUID REFERENCES job_applications(id),
  job_posting_id INTEGER,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT NOT NULL,
  interview_type interview_type NOT NULL,
  scheduled_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status interview_status DEFAULT 'scheduled',
  location TEXT,
  meeting_link TEXT,
  interviewer_name TEXT,
  interviewer_email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## API Functions Available

From `interviewService.ts`:

- `getInterviews(filters?)` - Get all interviews with optional filters
- `getInterview(id)` - Get single interview by ID
- `createInterview(interview)` - Create new interview
- `updateInterview(id, updates)` - Update interview details
- `updateInterviewStatus(id, status)` - Change interview status
- `deleteInterview(id)` - Delete interview
- `getInterviewsByApplication(applicationId)` - Get interviews for specific application

---

## Next Steps to Complete Feature

To make the Interview Scheduler fully functional:

1. **Implement Schedule Modal** - Add form to create new interviews
2. **Add Edit Functionality** - Allow editing interview details
3. **Implement Feedback Form** - Add post-interview feedback
4. **Email Integration** - Auto-send interview invitations
5. **Calendar View** - Add calendar visualization
6. **Bulk Actions** - Schedule multiple interviews at once

---

## Support

For issues or questions:
- Check browser console for errors
- Verify `interviews` table exists in Supabase
- Ensure RLS policies allow insert/update operations
- Check that user has appropriate role (HR Manager, Admin, Super Admin)

---

**Status:** ✅ Partially Implemented  
**Route:** `/admin-ui/interviews`  
**Last Updated:** 2026-02-10
