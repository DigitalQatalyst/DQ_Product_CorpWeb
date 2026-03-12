-- Add HR-viewer and HR-Admin roles to user_role enum
-- This migration extends the existing enum with two new HR-specific roles

-- Add HR-Admin role
ALTER TYPE user_role ADD VALUE 'HR-Admin';

-- Add HR-viewer role
ALTER TYPE user_role ADD VALUE 'HR-viewer';

-- ===== ADD RLS POLICIES FOR NEW HR ROLES =====

-- HR-Admin can read all HR-related data (jobs, applications, etc.)
CREATE POLICY job_postings_hr_admin_read ON job_postings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_user_id = auth.uid() AND u.role IN ('admin', 'HR-Admin')
    )
  );

-- HR-Admin can insert job postings
CREATE POLICY job_postings_hr_admin_insert ON job_postings
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_user_id = auth.uid() AND u.role IN ('admin', 'HR-Admin')
    )
  );

-- HR-Admin can update job postings
CREATE POLICY job_postings_hr_admin_update ON job_postings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_user_id = auth.uid() AND u.role IN ('admin', 'HR-Admin')
    )
  );

-- HR-Admin can delete job postings
CREATE POLICY job_postings_hr_admin_delete ON job_postings
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_user_id = auth.uid() AND u.role IN ('admin', 'HR-Admin')
    )
  );

-- HR-Viewer can only read job postings (read-only access)
CREATE POLICY job_postings_hr_viewer_read ON job_postings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_user_id = auth.uid() AND u.role IN ('HR-viewer', 'admin', 'HR-Admin')
    )
  );

-- HR-Admin can manage job applications
CREATE POLICY job_applications_hr_admin_read ON job_applications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_user_id = auth.uid() AND u.role IN ('admin', 'HR-Admin')
    )
  );

CREATE POLICY job_applications_hr_admin_update ON job_applications
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_user_id = auth.uid() AND u.role IN ('admin', 'HR-Admin')
    )
  );

-- HR-Viewer can read job applications (read-only)
CREATE POLICY job_applications_hr_viewer_read ON job_applications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_user_id = auth.uid() AND u.role IN ('HR-viewer', 'admin', 'HR-Admin')
    )
  );
