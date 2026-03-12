-- Create Row-Level Security (RLS) policies for users table and related tables
-- This ensures users can only access data appropriate to their role

-- ===== USERS TABLE POLICIES =====
-- Users can view their own profile
CREATE POLICY users_own_read ON users
  FOR SELECT
  USING (auth.uid() = auth_user_id);

-- Admins can view all users
CREATE POLICY users_admin_read ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_user_id = auth.uid() AND u.role = 'admin'
    )
  );

-- Users can update their own profile (but not role)
CREATE POLICY users_own_update ON users
  FOR UPDATE
  USING (auth.uid() = auth_user_id)
  WITH CHECK (
    auth.uid() = auth_user_id AND
    role = (SELECT role FROM users WHERE auth_user_id = auth.uid()) -- Prevent role change
  );

-- Admins can update any user (including role)
CREATE POLICY users_admin_update ON users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_user_id = auth.uid() AND u.role = 'admin'
    )
  );

-- Admins can delete users
CREATE POLICY users_admin_delete ON users
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_user_id = auth.uid() AND u.role = 'admin'
    )
  );

-- Admins can insert users (for manual creation)
CREATE POLICY users_admin_insert ON users
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_user_id = auth.uid() AND u.role = 'admin'
    )
  );

-- ===== BLOGS TABLE POLICIES =====
-- All logged-in users can read published blogs
CREATE POLICY blogs_read_all ON blogs
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Creators can create blogs
CREATE POLICY blogs_creator_insert ON blogs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_user_id = auth.uid() AND u.role IN ('admin', 'creator')
    )
  );

-- Creators can update their own blogs; admins can update all
CREATE POLICY blogs_creator_update ON blogs
  FOR UPDATE
  USING (
    author_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_user_id = auth.uid() AND u.role = 'admin'
    )
  );

-- Creators can delete their own blogs; admins can delete all
CREATE POLICY blogs_creator_delete ON blogs
  FOR DELETE
  USING (
    author_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_user_id = auth.uid() AND u.role = 'admin'
    )
  );

-- ===== FORM_SUBMISSIONS TABLE POLICIES =====
-- Admins can read all form submissions
CREATE POLICY form_submissions_admin_read ON form_submissions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_user_id = auth.uid() AND u.role = 'admin'
    )
  );

-- Creators can read their own form submissions
CREATE POLICY form_submissions_creator_read ON form_submissions
  FOR SELECT
  USING (
    user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_user_id = auth.uid() AND u.role = 'admin'
    )
  );

-- Anyone can create form submissions (guest submissions allowed for contact forms)
CREATE POLICY form_submissions_insert ON form_submissions
  FOR INSERT
  WITH CHECK (true);

-- ===== EMAIL_TEMPLATES TABLE POLICIES =====
-- Admins can read and manage templates
CREATE POLICY email_templates_admin_read ON email_templates
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_user_id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY email_templates_admin_write ON email_templates
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_user_id = auth.uid() AND u.role = 'admin'
    )
  );

-- ===== NOTIFICATIONS TABLE POLICIES =====
-- Users can read their own notifications
CREATE POLICY notifications_own_read ON notifications
  FOR SELECT
  USING (
    user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()) OR
    user_id IS NULL -- System notifications
  );

-- System/admins can create notifications
CREATE POLICY notifications_admin_insert ON notifications
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_user_id = auth.uid() AND u.role = 'admin'
    ) OR
    auth.uid() IS NULL -- Allow service role
  );

-- ===== INTERVIEWS TABLE POLICIES =====
-- Admins and creators can read interviews
CREATE POLICY interviews_read ON interviews
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_user_id = auth.uid() AND u.role IN ('admin', 'creator')
    )
  );

-- Admins and creators can create interviews
CREATE POLICY interviews_insert ON interviews
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_user_id = auth.uid() AND u.role IN ('admin', 'creator')
    )
  );

-- ===== ROLE_PERMISSIONS TABLE POLICIES =====
-- Only admins can read and manage role permissions
CREATE POLICY role_permissions_admin ON role_permissions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_user_id = auth.uid() AND u.role = 'admin'
    )
  );

-- Enable RLS on all relevant tables if not already enabled
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

COMMENT ON MIGRATION 005 IS 'Create Row-Level Security policies for all tables based on user roles';
