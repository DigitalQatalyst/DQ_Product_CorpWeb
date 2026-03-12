# HR Admin CMS Setup Guide

Complete guide for setting up the HR Admin CMS to manage job postings and applications.

## Features

### 1. **Manage Job Applications** ✅ (Already Built)
- View all applications
- Filter by status
- Update application status
- Download resumes
- View cover letters
- Contact candidates

### 2. **Manage Job Postings** 🆕 (New)
- Create new job postings
- Edit existing postings
- Delete postings
- Mark positions as filled
- View application count per posting
- Feature important positions

### 3. **Job Posting Lifecycle**
- **Draft** → Create and preview before publishing
- **Open** → Live on careers page, accepting applications
- **Filled** → Position filled, no longer accepting applications
- **Closed** → Manually closed, archived

## Database Setup

### Step 1: Run Migration

In your **job applications Supabase project**, run:

```bash
migrations/create_job_postings_table.sql
```

This creates:
- `job_postings` table
- `v_public_job_postings` view (for public careers page)
- RLS policies
- Indexes

### Step 2: Verify Tables

Check that these tables exist:
- ✅ `job_postings`
- ✅ `job_applications`
- ✅ `v_public_job_postings` (view)

## Admin Routes

Add these routes to `AppRouter.tsx`:

```typescript
// Job Postings Management
<Route
  path="/admin-ui/job-postings"
  element={
    <ProtectedRoute>
      <JobPostingsManagement />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin-ui/job-postings/new"
  element={
    <ProtectedRoute>
      <JobPostingForm />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin-ui/job-postings/:id/edit"
  element={
    <ProtectedRoute>
      <JobPostingForm />
    </ProtectedRoute>
  }
/>
```

## HR Admin Workflow

### Creating a New Position

1. **Navigate to**: `/admin-ui/job-postings`
2. **Click**: "Create New Position"
3. **Fill in**:
   - Job Title
   - Department
   - Location
   - Employment Type (Full-time, Part-time, Contract)
   - Level (Entry, Mid, Senior)
   - Description
   - Requirements (list)
   - Responsibilities (list)
   - Closing Date (optional)
   - Featured (checkbox)
4. **Save as**:
   - **Draft** → Preview before publishing
   - **Open** → Publish immediately
5. **Position appears** on careers page at `/jobs`

### Managing Applications

1. **Navigate to**: `/admin-ui/job-applications`
2. **Filter by**:
   - Status (pending, reviewing, shortlisted, etc.)
   - Job ID
3. **Actions**:
   - Update status
   - Download resume
   - View cover letter
   - Contact candidate

### Marking Position as Filled

1. **Navigate to**: `/admin-ui/job-postings`
2. **Find the position**
3. **Click**: "Mark as Filled"
4. **Position**:
   - Status changes to "Filled"
   - Removed from public careers page
   - Applications still accessible
   - Filled date recorded

### Editing a Position

1. **Navigate to**: `/admin-ui/job-postings`
2. **Click**: "Edit" on any posting
3. **Update** any fields
4. **Save** changes
5. **Changes reflect** immediately on careers page

### Deleting a Position

1. **Navigate to**: `/admin-ui/job-postings`
2. **Click**: "Delete"
3. **Confirm** deletion
4. **Note**: Applications are preserved (consider archiving instead)

## Public Careers Page Integration

### Current Setup (Static Data)
- Jobs are hardcoded in `JobListingsPage.tsx` and `JobDetailPage.tsx`

### New Setup (Dynamic from Database)

Update `JobListingsPage.tsx` to fetch from database:

```typescript
import { useEffect, useState } from 'react';
import { getPublicJobPostings } from '../services/jobPostingService';

const [jobs, setJobs] = useState([]);

useEffect(() => {
  loadJobs();
}, []);

const loadJobs = async () => {
  const { data } = await getPublicJobPostings();
  setJobs(data);
};
```

## Access Control

### Who Can Access?

**HR Admins** (authenticated users) can:
- ✅ View all job postings
- ✅ Create new postings
- ✅ Edit postings
- ✅ Delete postings
- ✅ Mark as filled
- ✅ View all applications
- ✅ Update application status

**Public Users** can:
- ✅ View open positions
- ✅ Submit applications
- ❌ Cannot view other applications
- ❌ Cannot manage postings

## Features Summary

| Feature | Status | Location |
|---------|--------|----------|
| View Applications | ✅ Built | `/admin-ui/job-applications` |
| Manage Postings | ✅ Built | `/admin-ui/job-postings` |
| Create Posting | 🔨 Need Form | `/admin-ui/job-postings/new` |
| Edit Posting | 🔨 Need Form | `/admin-ui/job-postings/:id/edit` |
| Mark as Filled | ✅ Built | Button in list |
| Delete Posting | ✅ Built | Button in list |
| View App Count | ✅ Built | Shows in list |
| Dynamic Careers Page | 🔨 Need Update | `/jobs` |

## Next Steps

1. ✅ Run database migration
2. ✅ Add routes to AppRouter
3. 🔨 Create JobPostingForm component (for create/edit)
4. 🔨 Update JobListingsPage to use database
5. 🔨 Update JobDetailPage to use database
6. 🔨 Add navigation links in admin sidebar

## API Endpoints (via Supabase)

All operations use Supabase client:

- `getAllJobPostings()` - Get all postings (admin)
- `getPublicJobPostings()` - Get open postings (public)
- `getJobPostingById(id)` - Get single posting
- `createJobPosting(data)` - Create new posting
- `updateJobPosting(id, data)` - Update posting
- `markPositionAsFilled(id)` - Mark as filled
- `deleteJobPosting(id)` - Delete posting
- `getApplicationCount(id)` - Get application count

## Security

- RLS policies ensure only authenticated users can manage postings
- Public users can only view open positions
- File uploads (resumes) are private by default
- Application data is protected

## Testing

1. **Create a test position**:
   - Go to `/admin-ui/job-postings`
   - Click "Create New Position"
   - Fill in test data
   - Save as "Open"

2. **Verify on careers page**:
   - Go to `/jobs`
   - Should see the new position

3. **Submit test application**:
   - Click on the position
   - Click "Apply Now"
   - Fill in test data
   - Submit

4. **View in admin**:
   - Go to `/admin-ui/job-applications`
   - Should see the test application

5. **Mark as filled**:
   - Go to `/admin-ui/job-postings`
   - Click "Mark as Filled"
   - Verify it's removed from `/jobs`

## Troubleshooting

### Postings not showing on careers page
- Check RLS policies are set correctly
- Verify status is "open"
- Check closing_date hasn't passed

### Can't create postings
- Verify user is authenticated
- Check RLS policies allow INSERT for authenticated users
- Check all required fields are filled

### Applications not linking to postings
- Ensure `job_posting_id` is set when submitting
- Update JobApplicationForm to include posting ID

## Future Enhancements

- [ ] Email notifications when new applications arrive
- [ ] Bulk actions (close multiple positions)
- [ ] Application scoring/rating system
- [ ] Interview scheduling
- [ ] Candidate pipeline view
- [ ] Analytics dashboard (applications per posting, time to fill, etc.)
- [ ] Export applications to CSV
- [ ] Integration with ATS systems
