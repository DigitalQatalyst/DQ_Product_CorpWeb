-- Enhanced Job Application Status Workflow Migration
-- This migration updates the application_status field to support a comprehensive recruitment lifecycle

-- Step 1: Drop existing constraint
ALTER TABLE job_applications 
DROP CONSTRAINT IF EXISTS job_applications_application_status_check;

-- Step 2: Add new constraint with enhanced status values
ALTER TABLE job_applications
ADD CONSTRAINT job_applications_application_status_check 
CHECK (application_status IN (
  'pending',              -- New application, no action taken
  'screened',             -- Initial review completed
  'qualified',            -- Meets must-haves, moving forward
  'interview_scheduled',  -- Interview arranged
  'interviewed',          -- Interview completed, awaiting decision
  'shortlisted',          -- Top candidate for final consideration
  'offered',              -- Job offer extended
  'hired',                -- Offer accepted
  'rejected',             -- Not moving forward
  'withdrawn'             -- Candidate withdrew
));

-- Step 3: Update existing records to map old statuses to new ones
-- Old 'reviewing' -> New 'screened'
UPDATE job_applications 
SET application_status = 'screened' 
WHERE application_status = 'reviewing';

-- Old 'accepted' -> New 'hired'
UPDATE job_applications 
SET application_status = 'hired' 
WHERE application_status = 'accepted';

-- Step 4: Add status_history column to track status changes
ALTER TABLE job_applications
ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]'::jsonb;

-- Step 5: Add rejection_reason column for better tracking
ALTER TABLE job_applications
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Step 6: Add notes column for internal comments
ALTER TABLE job_applications
ADD COLUMN IF NOT EXISTS internal_notes TEXT;

-- Step 7: Add status_changed_at column
ALTER TABLE job_applications
ADD COLUMN IF NOT EXISTS status_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 8: Add status_changed_by column (references admin user)
ALTER TABLE job_applications
ADD COLUMN IF NOT EXISTS status_changed_by UUID;

-- Step 9: Create function to track status changes
CREATE OR REPLACE FUNCTION track_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only track if status actually changed
  IF OLD.application_status IS DISTINCT FROM NEW.application_status THEN
    -- Update status_changed_at
    NEW.status_changed_at = NOW();
    
    -- Append to status_history
    NEW.status_history = COALESCE(NEW.status_history, '[]'::jsonb) || 
      jsonb_build_object(
        'from_status', OLD.application_status,
        'to_status', NEW.application_status,
        'changed_at', NOW(),
        'changed_by', NEW.status_changed_by
      );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 10: Create trigger for status change tracking
DROP TRIGGER IF EXISTS trigger_track_application_status_change ON job_applications;
CREATE TRIGGER trigger_track_application_status_change
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION track_application_status_change();

-- Step 11: Create index on new status values
DROP INDEX IF EXISTS idx_job_applications_status;
CREATE INDEX idx_job_applications_status ON job_applications(application_status);
CREATE INDEX idx_job_applications_status_changed_at ON job_applications(status_changed_at DESC);

-- Step 12: Update the summary view
DROP VIEW IF EXISTS v_job_applications_summary;
CREATE OR REPLACE VIEW v_job_applications_summary AS
SELECT 
  id,
  job_id,
  job_title,
  first_name || ' ' || last_name AS full_name,
  email,
  phone,
  current_location,
  years_of_experience,
  application_status,
  rejection_reason,
  applied_at,
  status_changed_at,
  updated_at
FROM job_applications
ORDER BY applied_at DESC;

-- Step 13: Create analytics view for recruitment funnel
CREATE OR REPLACE VIEW v_recruitment_funnel AS
SELECT 
  application_status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM job_applications
GROUP BY application_status
ORDER BY 
  CASE application_status
    WHEN 'pending' THEN 1
    WHEN 'screened' THEN 2
    WHEN 'qualified' THEN 3
    WHEN 'interview_scheduled' THEN 4
    WHEN 'interviewed' THEN 5
    WHEN 'shortlisted' THEN 6
    WHEN 'offered' THEN 7
    WHEN 'hired' THEN 8
    WHEN 'rejected' THEN 9
    WHEN 'withdrawn' THEN 10
  END;

-- Step 14: Add comments for documentation
COMMENT ON COLUMN job_applications.application_status IS 'Current status in recruitment lifecycle: pending, screened, qualified, interview_scheduled, interviewed, shortlisted, offered, hired, rejected, withdrawn';
COMMENT ON COLUMN job_applications.status_history IS 'JSON array tracking all status changes with timestamps and user IDs';
COMMENT ON COLUMN job_applications.rejection_reason IS 'Reason for rejection if application_status is rejected';
COMMENT ON COLUMN job_applications.internal_notes IS 'Internal notes for HR team (not visible to candidate)';
COMMENT ON COLUMN job_applications.status_changed_at IS 'Timestamp of last status change';
COMMENT ON COLUMN job_applications.status_changed_by IS 'Admin user ID who changed the status';
COMMENT ON VIEW v_recruitment_funnel IS 'Analytics view showing distribution of applications across status stages';

-- Step 15: Grant necessary permissions
GRANT SELECT ON v_recruitment_funnel TO authenticated;

