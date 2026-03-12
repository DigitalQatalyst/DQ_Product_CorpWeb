-- Migrate foreign key references from old tables to new users table
-- This migration updates references from admin_users, authors, and user_roles to the new unified users table

-- Step 1: Add new foreign key columns to existing tables (if not already present)
-- blogs table: update author_id reference
ALTER TABLE blogs
  DROP CONSTRAINT IF EXISTS blogs_author_id_fkey CASCADE;

ALTER TABLE blogs
  ADD CONSTRAINT blogs_author_id_fkey
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL;

-- Step 2: Update other tables that reference admin_users
-- email_templates table
ALTER TABLE email_templates
  DROP CONSTRAINT IF EXISTS email_templates_created_by_fkey CASCADE;

ALTER TABLE email_templates
  ADD CONSTRAINT email_templates_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

-- interviews table
ALTER TABLE interviews
  DROP CONSTRAINT IF EXISTS interviews_created_by_fkey CASCADE;

ALTER TABLE interviews
  ADD CONSTRAINT interviews_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

-- interview_feedback table
ALTER TABLE interview_feedback
  DROP CONSTRAINT IF EXISTS interview_feedback_interviewer_id_fkey CASCADE;

ALTER TABLE interview_feedback
  ADD CONSTRAINT interview_feedback_interviewer_id_fkey
  FOREIGN KEY (interviewer_id) REFERENCES users(id) ON DELETE SET NULL;

-- notifications table
ALTER TABLE notifications
  DROP CONSTRAINT IF EXISTS notifications_user_id_fkey CASCADE;

ALTER TABLE notifications
  ADD CONSTRAINT notifications_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Step 3: Add optional user_id column to form_submissions if not present
ALTER TABLE form_submissions
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_form_submissions_user_id ON form_submissions(user_id);

-- Step 4: Add optional user_id column to activity_logs if not present
-- Or migrate activity_logs to reference users instead of admin_users
ALTER TABLE activity_logs
  DROP CONSTRAINT IF EXISTS activity_logs_user_id_fkey CASCADE;

ALTER TABLE activity_logs
  ADD CONSTRAINT activity_logs_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

COMMENT ON MIGRATION 004 IS 'Migrate all foreign key references to new unified users table';
