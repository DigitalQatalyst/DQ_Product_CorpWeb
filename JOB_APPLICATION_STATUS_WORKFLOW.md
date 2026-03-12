# Job Application Status Workflow Enhancement

## Overview
This document describes the enhanced job application status workflow implementation that provides comprehensive tracking of candidates through the entire recruitment lifecycle.

**Branch:** feature/exe-admin  
**Date:** February 19, 2026  
**Status:** ✅ IMPLEMENTED (Pending Review)

---

## Enhanced Status Workflow

### Status Stages

The new workflow includes 10 distinct statuses that cover the complete recruitment lifecycle:

| Status | Description | Next Steps | Color |
|--------|-------------|------------|-------|
| **Pending** | New application, no action taken | Screened, Rejected | Gray |
| **Screened** | Initial review completed | Qualified, Rejected | Blue |
| **Qualified** | Meets must-haves, moving forward | Interview Scheduled, Rejected | Purple |
| **Interview Scheduled** | Interview arranged | Interviewed, Withdrawn, Rejected | Indigo |
| **Interviewed** | Interview completed, awaiting decision | Shortlisted, Rejected | Cyan |
| **Shortlisted** | Top candidate for final consideration | Offered, Rejected | Amber |
| **Offered** | Job offer extended | Hired, Rejected, Withdrawn | Emerald |
| **Hired** | Offer accepted, candidate hired | (Terminal state) | Green |
| **Rejected** | Application not moving forward | (Terminal state) | Red |
| **Withdrawn** | Candidate withdrew from process | (Terminal state) | Slate |

### Status Flow Diagram

```
┌─────────┐
│ Pending │
└────┬────┘
     │
     ├──────────────┐
     │              │
     ▼              ▼
┌──────────┐   ┌──────────┐
│ Screened │   │ Rejected │
└────┬─────┘   └──────────┘
     │
     ├──────────────┐
     │              │
     ▼              ▼
┌───────────┐  ┌──────────┐
│ Qualified │  │ Rejected │
└─────┬─────┘  └──────────┘
      │
      ├──────────────┐
      │              │
      ▼              ▼
┌────────────────────┐  ┌──────────┐
│ Interview Scheduled│  │ Rejected │
└─────────┬──────────┘  └──────────┘
          │
          ├──────────────┬──────────────┐
          │              │              │
          ▼              ▼              ▼
    ┌─────────────┐ ┌──────────┐ ┌───────────┐
    │ Interviewed │ │ Rejected │ │ Withdrawn │
    └──────┬──────┘ └──────────┘ └───────────┘
           │
           ├──────────────┐
           │              │
           ▼              ▼
    ┌──────────────┐ ┌──────────┐
    │ Shortlisted  │ │ Rejected │
    └──────┬───────┘ └──────────┘
           │
           ├──────────────┐
           │              │
           ▼              ▼
    ┌──────────┐    ┌──────────┐
    │ Offered  │    │ Rejected │
    └────┬─────┘    └──────────┘
         │
         ├──────────────┬──────────────┐
         │              │              │
         ▼              ▼              ▼
    ┌────────┐    ┌──────────┐  ┌───────────┐
    │ Hired  │    │ Rejected │  │ Withdrawn │
    └────────┘    └──────────┘  └───────────┘
```

---

## Implementation Details

### 1. Database Schema Changes

**File:** `migrations/update_job_application_status_workflow.sql`

#### New Columns Added:
- `status_history` (JSONB) - Tracks all status changes with timestamps
- `rejection_reason` (TEXT) - Reason for rejection
- `internal_notes` (TEXT) - Internal HR team notes
- `status_changed_at` (TIMESTAMP) - Last status change timestamp
- `status_changed_by` (UUID) - Admin user who changed status

#### New Database Objects:
- **Function:** `track_application_status_change()` - Automatically logs status changes
- **Trigger:** `trigger_track_application_status_change` - Fires on status updates
- **View:** `v_recruitment_funnel` - Analytics view for funnel visualization
- **Updated View:** `v_job_applications_summary` - Includes new fields

#### Status Constraint:
```sql
CHECK (application_status IN (
  'pending', 'screened', 'qualified', 'interview_scheduled',
  'interviewed', 'shortlisted', 'offered', 'hired',
  'rejected', 'withdrawn'
))
```

#### Migration of Existing Data:
- `reviewing` → `screened`
- `accepted` → `hired`

---

### 2. TypeScript Type Definitions

**File:** `src/types/admin.ts`

#### New Types:
```typescript
export type ApplicationStatus = 
  | 'pending' | 'screened' | 'qualified' 
  | 'interview_scheduled' | 'interviewed' | 'shortlisted'
  | 'offered' | 'hired' | 'rejected' | 'withdrawn';

export interface StatusHistoryEntry {
  from_status: ApplicationStatus;
  to_status: ApplicationStatus;
  changed_at: string;
  changed_by?: string;
}

export interface JobApplication {
  // ... existing fields ...
  application_status: ApplicationStatus;
  status_history?: StatusHistoryEntry[];
  rejection_reason?: string;
  internal_notes?: string;
  status_changed_at?: string;
  status_changed_by?: string;
}

export interface ApplicationStatusUpdate {
  status: ApplicationStatus;
  rejection_reason?: string;
  internal_notes?: string;
  changed_by?: string;
}
```

#### Status Metadata:
```typescript
export const APPLICATION_STATUS_METADATA: Record<ApplicationStatus, StatusMetadata>
```

Provides UI rendering information:
- Label (display name)
- Colors (text, background, border)
- Description
- Next possible steps

---

### 3. Service Layer Updates

**File:** `src/services/jobApplicationService.ts`

#### Updated Functions:

**`getJobApplications()`**
- Now accepts `ApplicationStatus` type for filtering
- Returns properly typed `JobApplication[]`

**`updateApplicationStatus()`**
- Now accepts `ApplicationStatusUpdate` object
- Supports rejection reason and internal notes
- Tracks who made the change

**New Functions:**

**`getApplicationById()`**
```typescript
getApplicationById(applicationId: string): Promise<{ 
  data: JobApplication | null; 
  error?: string 
}>
```

**`getRecruitmentFunnel()`**
```typescript
getRecruitmentFunnel(): Promise<{
  data: Array<{ 
    application_status: ApplicationStatus; 
    count: number; 
    percentage: number 
  }>;
  error?: string;
}>
```

---

### 4. UI Component Updates

**File:** `src/admin-ui/pages/JobApplications.tsx`

#### New Features:

**Enhanced Stats Cards:**
- Total Applications
- Active Pipeline (excludes rejected, withdrawn, hired)
- Shortlisted Count
- Hired Count

**Comprehensive Filter Bar:**
- All statuses with counts
- Visual indication of selected filter
- Real-time count updates

**Status Dropdown:**
- All 10 statuses available
- Triggers rejection modal when selecting "Rejected"

**Rejection Reason Modal:**
- Appears when marking application as rejected
- Optional rejection reason field
- Optional internal notes field
- Prevents accidental rejections

**Enhanced Application Detail Modal:**
- Shows current status with badge
- Displays rejection reason (if applicable)
- Shows internal notes (if applicable)
- Status change timestamp

#### New State Management:
```typescript
const [showStatusModal, setShowStatusModal] = useState(false);
const [statusUpdateApp, setStatusUpdateApp] = useState<JobApplication | null>(null);
const [rejectionReason, setRejectionReason] = useState("");
const [internalNotes, setInternalNotes] = useState("");
```

#### New Helper Functions:
- `getStatusIcon()` - Returns appropriate icon for each status
- `getStatusBadge()` - Renders styled status badge
- `getStatusCounts()` - Calculates counts for all statuses
- `handleStatusModalSubmit()` - Handles rejection with reason

---

## Usage Guide

### For HR Managers

#### Reviewing New Applications:
1. New applications appear with "Pending" status
2. Click status dropdown to change to "Screened" after initial review
3. Move to "Qualified" if candidate meets requirements
4. Select "Rejected" if not suitable (modal will prompt for reason)

#### Scheduling Interviews:
1. Change status to "Interview Scheduled" when interview is arranged
2. After interview, update to "Interviewed"
3. Add internal notes about interview performance

#### Making Hiring Decisions:
1. Move top candidates to "Shortlisted"
2. Change to "Offered" when extending job offer
3. Update to "Hired" when offer is accepted
4. Use "Withdrawn" if candidate drops out

#### Tracking Rejections:
1. Select "Rejected" from status dropdown
2. Modal appears requesting rejection reason
3. Optionally add internal notes
4. Rejection is logged with timestamp and reason

### For Administrators

#### Viewing Analytics:
- Use filter bar to see distribution across statuses
- Monitor "Active Pipeline" count for workload
- Track conversion rates from qualified to hired

#### Auditing Status Changes:
- View `status_history` in database for complete audit trail
- Check `status_changed_by` to see who made changes
- Review `status_changed_at` for timing analysis

---

## Database Migration Instructions

### Prerequisites:
- Supabase CLI installed
- Access to production database
- Backup of current data

### Migration Steps:

1. **Backup Current Data:**
```sql
-- Create backup table
CREATE TABLE job_applications_backup AS 
SELECT * FROM job_applications;
```

2. **Run Migration:**
```bash
# Apply migration file
psql -h [host] -U [user] -d [database] -f migrations/update_job_application_status_workflow.sql
```

3. **Verify Migration:**
```sql
-- Check constraint
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'job_applications'::regclass 
AND conname = 'job_applications_application_status_check';

-- Check new columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'job_applications' 
AND column_name IN ('status_history', 'rejection_reason', 'internal_notes', 'status_changed_at', 'status_changed_by');

-- Check data migration
SELECT application_status, COUNT(*) 
FROM job_applications 
GROUP BY application_status;
```

4. **Test Status Changes:**
```sql
-- Test status update
UPDATE job_applications 
SET application_status = 'screened' 
WHERE id = '[test-id]';

-- Verify status_history was updated
SELECT status_history 
FROM job_applications 
WHERE id = '[test-id]';
```

---

## Testing Checklist

### Unit Tests:
- [ ] Service layer functions return correct types
- [ ] Status validation works correctly
- [ ] Rejection reason is saved properly
- [ ] Internal notes are saved properly
- [ ] Status history is tracked correctly

### Integration Tests:
- [ ] Status changes trigger database updates
- [ ] Rejection modal appears when selecting "Rejected"
- [ ] Filter bar updates counts correctly
- [ ] Stats cards show accurate numbers
- [ ] Application detail modal displays new fields

### UI Tests:
- [ ] All status badges render with correct colors
- [ ] Status dropdown shows all 10 options
- [ ] Rejection modal can be cancelled
- [ ] Rejection modal validates required fields
- [ ] Status icons display correctly

### Edge Cases:
- [ ] Changing from "Hired" to other statuses
- [ ] Multiple rapid status changes
- [ ] Status changes by different admin users
- [ ] Applications with no status history
- [ ] Very long rejection reasons

---

## Performance Considerations

### Database Indexes:
- ✅ Index on `application_status` for filtering
- ✅ Index on `status_changed_at` for sorting
- ✅ Index on `applied_at` for chronological queries

### Query Optimization:
- Status counts calculated in single query
- Recruitment funnel uses materialized view
- Status history stored as JSONB for efficient querying

### Frontend Optimization:
- Status metadata cached in constants
- Filter counts calculated once per load
- Modal state managed efficiently

---

## Future Enhancements

### Phase 2 (Recommended):
1. **Email Notifications:**
   - Notify candidates on status changes
   - Send rejection emails with reason
   - Interview confirmation emails

2. **Status Change Permissions:**
   - Role-based status change restrictions
   - Approval workflow for offers
   - Audit log for sensitive changes

3. **Analytics Dashboard:**
   - Conversion rate by status
   - Average time in each stage
   - Bottleneck identification
   - Source effectiveness tracking

4. **Bulk Operations:**
   - Bulk status updates
   - Bulk rejection with template reasons
   - Export filtered applications

5. **Interview Integration:**
   - Link interviews to applications
   - Auto-update status after interview
   - Interview feedback integration

### Phase 3 (Advanced):
1. **AI-Powered Features:**
   - Auto-screening based on criteria
   - Rejection reason suggestions
   - Candidate ranking

2. **Candidate Portal:**
   - Status tracking for candidates
   - Document upload
   - Interview scheduling

3. **Advanced Reporting:**
   - Custom report builder
   - Scheduled reports
   - Export to Excel/PDF

---

## Rollback Plan

### If Issues Arise:

1. **Restore Previous Status Values:**
```sql
-- Revert to old statuses
UPDATE job_applications 
SET application_status = 'reviewing' 
WHERE application_status = 'screened';

UPDATE job_applications 
SET application_status = 'accepted' 
WHERE application_status = 'hired';
```

2. **Restore Old Constraint:**
```sql
ALTER TABLE job_applications 
DROP CONSTRAINT job_applications_application_status_check;

ALTER TABLE job_applications
ADD CONSTRAINT job_applications_application_status_check 
CHECK (application_status IN ('pending', 'reviewing', 'shortlisted', 'interviewed', 'rejected', 'accepted'));
```

3. **Remove New Columns (if needed):**
```sql
ALTER TABLE job_applications 
DROP COLUMN IF EXISTS status_history,
DROP COLUMN IF EXISTS rejection_reason,
DROP COLUMN IF EXISTS internal_notes,
DROP COLUMN IF EXISTS status_changed_at,
DROP COLUMN IF EXISTS status_changed_by;
```

4. **Revert Code Changes:**
```bash
git checkout HEAD~1 src/types/admin.ts
git checkout HEAD~1 src/services/jobApplicationService.ts
git checkout HEAD~1 src/admin-ui/pages/JobApplications.tsx
```

---

## Files Modified

### New Files:
- `migrations/update_job_application_status_workflow.sql` - Database migration
- `JOB_APPLICATION_STATUS_WORKFLOW.md` - This documentation

### Modified Files:
- `src/types/admin.ts` - Added job application types and status metadata
- `src/services/jobApplicationService.ts` - Updated service functions
- `src/admin-ui/pages/JobApplications.tsx` - Enhanced UI component

### Lines Changed:
- **admin.ts:** +150 lines (new types and metadata)
- **jobApplicationService.ts:** +80 lines (enhanced functions)
- **JobApplications.tsx:** +200 lines (UI enhancements)
- **Migration SQL:** +200 lines (schema changes)

---

## Security Considerations

### Data Privacy:
- Rejection reasons are internal only (not visible to candidates)
- Internal notes are restricted to HR team
- Status history includes admin user tracking

### Access Control:
- Only authenticated admins can view applications
- Only authenticated admins can change statuses
- RLS policies enforce data access restrictions

### Audit Trail:
- All status changes logged with timestamp
- Admin user ID tracked for accountability
- Complete history preserved in JSONB field

---

## Support & Troubleshooting

### Common Issues:

**Issue:** Status dropdown not showing new options
- **Solution:** Clear browser cache and reload

**Issue:** Rejection modal not appearing
- **Solution:** Check browser console for errors, verify state management

**Issue:** Status counts incorrect
- **Solution:** Refresh page, check filter selection

**Issue:** Migration fails on existing data
- **Solution:** Check for invalid status values, run data cleanup first

### Debug Queries:

```sql
-- Check status distribution
SELECT application_status, COUNT(*) 
FROM job_applications 
GROUP BY application_status 
ORDER BY COUNT(*) DESC;

-- View status history for application
SELECT id, first_name, last_name, status_history 
FROM job_applications 
WHERE id = '[application-id]';

-- Find applications with invalid statuses
SELECT id, application_status 
FROM job_applications 
WHERE application_status NOT IN (
  'pending', 'screened', 'qualified', 'interview_scheduled',
  'interviewed', 'shortlisted', 'offered', 'hired',
  'rejected', 'withdrawn'
);
```

---

## Conclusion

The enhanced job application status workflow provides comprehensive tracking of candidates through the entire recruitment lifecycle. The implementation includes:

✅ 10 distinct status stages covering complete hiring process  
✅ Automatic status change tracking with audit trail  
✅ Rejection reason and internal notes support  
✅ Enhanced UI with visual status indicators  
✅ Analytics-ready data structure  
✅ Backward-compatible migration  

The system is ready for review and testing before deployment to production.

---

**Document Version:** 1.0  
**Last Updated:** February 19, 2026  
**Author:** Kiro AI Assistant  
**Status:** Pending Review
