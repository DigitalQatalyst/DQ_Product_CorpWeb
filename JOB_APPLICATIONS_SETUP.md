# Job Applications Database Setup

This guide explains how to set up database storage for job applications.

## Overview

Job applications are stored in Supabase with the following features:
- Application data stored in `job_applications` table
- Resume and documents stored in Supabase Storage
- Row Level Security (RLS) policies for data protection
- Admin dashboard to review and manage applications

## Database Setup

### 1. Run the Migration

Execute the SQL migration file to create the necessary tables and policies:

```bash
# Connect to your Supabase project and run:
psql -h your-supabase-host -U postgres -d postgres -f migrations/create_job_applications_table.sql
```

Or use the Supabase Dashboard:
1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy and paste the contents of `migrations/create_job_applications_table.sql`
4. Click "Run"

### 2. Verify Setup

Check that the following were created:
- ✅ Table: `job_applications`
- ✅ View: `v_job_applications_summary`
- ✅ Storage Bucket: `job-applications`
- ✅ RLS Policies enabled
- ✅ Indexes created

## Features

### Application Submission
- **Public Access**: Anyone can submit job applications (no authentication required)
- **File Upload**: Resumes and additional documents are uploaded to Supabase Storage
- **Validation**: Email format validation and required field checks
- **Status Tracking**: Applications start with "pending" status

### Admin Management
- **Protected Access**: Only authenticated users can view applications
- **Status Management**: Update application status (pending, reviewing, shortlisted, interviewed, accepted, rejected)
- **Document Access**: Download resumes and additional documents
- **Filtering**: Filter applications by status or job ID
- **Search**: View applications by candidate name, email, or job title

## Database Schema

### job_applications Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| job_id | INTEGER | Reference to job posting |
| job_title | TEXT | Job title |
| first_name | TEXT | Candidate first name |
| last_name | TEXT | Candidate last name |
| email | TEXT | Candidate email (validated) |
| phone | TEXT | Candidate phone |
| linkedin_url | TEXT | LinkedIn profile URL (optional) |
| portfolio_url | TEXT | Portfolio URL (optional) |
| current_location | TEXT | Current location |
| years_of_experience | TEXT | Years of experience |
| current_company | TEXT | Current company (optional) |
| current_role | TEXT | Current role (optional) |
| notice_period | TEXT | Notice period |
| expected_salary | TEXT | Expected salary (optional) |
| cover_letter | TEXT | Cover letter content |
| resume_url | TEXT | Resume file URL in storage |
| resume_filename | TEXT | Original resume filename |
| additional_documents_url | TEXT | Additional docs URL (optional) |
| additional_documents_filename | TEXT | Additional docs filename (optional) |
| application_status | TEXT | Status (pending, reviewing, shortlisted, interviewed, rejected, accepted) |
| applied_at | TIMESTAMP | Application submission time |
| updated_at | TIMESTAMP | Last update time |

## Usage

### Frontend - Submit Application

```typescript
import { submitJobApplication } from './services/jobApplicationService';

const result = await submitJobApplication({
  jobId: 1,
  jobTitle: "Software Engineer",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+1234567890",
  currentLocation: "Nairobi, KE",
  yearsOfExperience: "3-5",
  noticePeriod: "1-month",
  coverLetter: "I am interested...",
  resume: resumeFile, // File object
  // ... other fields
});

if (result.success) {
  console.log("Application submitted:", result.applicationId);
}
```

### Admin - View Applications

Navigate to: `/admin-ui/job-applications`

Features:
- Filter by status
- Update application status
- Download resumes and documents
- View cover letters
- Contact candidates directly

### Admin - Query Applications

```typescript
import { getJobApplications } from './services/jobApplicationService';

// Get all applications
const { data, count } = await getJobApplications();

// Filter by job ID
const { data } = await getJobApplications({ jobId: 1 });

// Filter by status
const { data } = await getJobApplications({ status: 'shortlisted' });

// Pagination
const { data } = await getJobApplications({ 
  limit: 10, 
  offset: 0 
});
```

## Security

### Row Level Security (RLS)

1. **Public Insert**: Anyone can submit applications
2. **Authenticated Read**: Only authenticated users can view applications
3. **Authenticated Update**: Only authenticated users can update application status

### Storage Security

1. **Public Upload**: Anyone can upload to job-applications bucket (for application submission)
2. **Authenticated Read**: Only authenticated users can download documents

## API Endpoints

The application uses Supabase client-side SDK. No custom API endpoints required.

## Testing

1. **Submit Test Application**:
   - Navigate to `/jobs/1/apply`
   - Fill out the form
   - Upload a test resume
   - Submit

2. **View in Admin**:
   - Login as admin
   - Navigate to `/admin-ui/job-applications`
   - Verify application appears
   - Test status updates

3. **Verify Storage**:
   - Check Supabase Storage dashboard
   - Verify files in `job-applications` bucket
   - Test file downloads

## Troubleshooting

### Applications not saving
- Check Supabase connection in `.env.local`
- Verify RLS policies are enabled
- Check browser console for errors

### File upload fails
- Verify storage bucket exists: `job-applications`
- Check storage policies
- Verify file size limits (default 5MB)

### Admin can't view applications
- Ensure user is authenticated
- Check RLS policies for SELECT permission
- Verify user role/permissions

## Future Enhancements

- [ ] Email notifications to HR team on new applications
- [ ] Candidate portal to track application status
- [ ] Interview scheduling integration
- [ ] Application scoring/rating system
- [ ] Bulk actions (accept/reject multiple)
- [ ] Export applications to CSV
- [ ] Integration with ATS (Applicant Tracking System)
