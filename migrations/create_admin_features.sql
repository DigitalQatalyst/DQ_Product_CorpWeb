-- =====================================================
-- EXECUTIVE ADMIN DASHBOARD - HIGH PRIORITY FEATURES
-- =====================================================

-- 1. USER MANAGEMENT & ROLES
-- =====================================================

-- Create roles enum
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'hr_manager', 'content_editor', 'content_creator', 'viewer');

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'viewer',
  department TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id)
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
  id SERIAL PRIMARY KEY,
  role user_role NOT NULL,
  resource TEXT NOT NULL, -- e.g., 'blog', 'job_posting', 'application', 'user'
  action TEXT NOT NULL, -- e.g., 'create', 'read', 'update', 'delete', 'publish'
  can_perform BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. FORM & LEAD MANAGEMENT
-- =====================================================

-- Create form_submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type TEXT NOT NULL, -- 'consultation', 'demo_request', 'service_request', 'tour_request', etc.
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed', 'spam')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Contact Information
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  job_title TEXT,
  
  -- Form Data
  form_data JSONB NOT NULL,
  
  -- Lead Scoring
  lead_score INTEGER DEFAULT 0,
  lead_source TEXT,
  
  -- Assignment & Follow-up
  assigned_to UUID REFERENCES admin_users(id),
  assigned_at TIMESTAMP WITH TIME ZONE,
  followed_up_at TIMESTAMP WITH TIME ZONE,
  next_follow_up TIMESTAMP WITH TIME ZONE,
  
  -- Notes
  notes TEXT,
  
  -- Metadata
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create form_submission_notes table
CREATE TABLE IF NOT EXISTS form_submission_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES form_submissions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. COMMUNICATION & NOTIFICATIONS
-- =====================================================

-- Create email_templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'recruitment', 'marketing', 'system', 'notification'
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  variables JSONB, -- Available template variables
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'application', 'submission', 'content', 'system'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES email_templates(id),
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. INTERVIEW SCHEDULING
-- =====================================================

-- Create interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
  job_posting_id INTEGER REFERENCES job_postings(id),
  
  -- Interview Details
  interview_type TEXT NOT NULL CHECK (interview_type IN ('phone_screen', 'video', 'onsite', 'technical', 'final')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled', 'no_show')),
  
  -- Scheduling
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT, -- Physical location or video link
  meeting_link TEXT,
  
  -- Participants
  interviewer_ids UUID[], -- Array of admin_user ids
  candidate_email TEXT NOT NULL,
  candidate_name TEXT NOT NULL,
  
  -- Notes & Feedback
  preparation_notes TEXT,
  interview_notes TEXT,
  feedback JSONB,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  recommendation TEXT CHECK (recommendation IN ('strong_yes', 'yes', 'maybe', 'no', 'strong_no')),
  
  -- Reminders
  reminder_sent BOOLEAN DEFAULT false,
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interview_feedback table (for multiple interviewers)
CREATE TABLE IF NOT EXISTS interview_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE,
  interviewer_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  recommendation TEXT CHECK (recommendation IN ('strong_yes', 'yes', 'maybe', 'no', 'strong_no')),
  strengths TEXT,
  weaknesses TEXT,
  notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ANALYTICS TRACKING
-- =====================================================

-- Create content_analytics table
CREATE TABLE IF NOT EXISTS content_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id INTEGER, -- References media_items
  content_type TEXT NOT NULL, -- 'blog', 'article', 'whitepaper', etc.
  
  -- Metrics
  views INTEGER DEFAULT 0,
  unique_views INTEGER DEFAULT 0,
  time_on_page INTEGER, -- seconds
  bounce_rate DECIMAL(5,2),
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  
  -- Engagement
  scroll_depth INTEGER, -- percentage
  cta_clicks INTEGER DEFAULT 0,
  
  -- Date tracking
  date DATE NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(content_id, content_type, date)
);

-- Create recruitment_analytics table
CREATE TABLE IF NOT EXISTS recruitment_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_posting_id INTEGER REFERENCES job_postings(id),
  
  -- Metrics
  views INTEGER DEFAULT 0,
  unique_views INTEGER DEFAULT 0,
  applications_started INTEGER DEFAULT 0,
  applications_completed INTEGER DEFAULT 0,
  applications_qualified INTEGER DEFAULT 0,
  
  -- Conversion rates (calculated)
  view_to_apply_rate DECIMAL(5,2),
  completion_rate DECIMAL(5,2),
  
  -- Sources
  source TEXT, -- 'direct', 'linkedin', 'indeed', 'referral', etc.
  
  -- Date tracking
  date DATE NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(job_posting_id, source, date)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Admin Users
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);

-- Activity Logs
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_resource ON activity_logs(resource_type, resource_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);

-- Form Submissions
CREATE INDEX idx_form_submissions_type ON form_submissions(form_type);
CREATE INDEX idx_form_submissions_status ON form_submissions(status);
CREATE INDEX idx_form_submissions_assigned ON form_submissions(assigned_to);
CREATE INDEX idx_form_submissions_created ON form_submissions(created_at DESC);
CREATE INDEX idx_form_submissions_email ON form_submissions(email);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- Interviews
CREATE INDEX idx_interviews_application ON interviews(application_id);
CREATE INDEX idx_interviews_job_posting ON interviews(job_posting_id);
CREATE INDEX idx_interviews_status ON interviews(status);
CREATE INDEX idx_interviews_date ON interviews(scheduled_date);

-- Analytics
CREATE INDEX idx_content_analytics_content ON content_analytics(content_id, content_type);
CREATE INDEX idx_content_analytics_date ON content_analytics(date DESC);
CREATE INDEX idx_recruitment_analytics_job ON recruitment_analytics(job_posting_id);
CREATE INDEX idx_recruitment_analytics_date ON recruitment_analytics(date DESC);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_form_submissions_updated_at BEFORE UPDATE ON form_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- Policies (authenticated users can access)
CREATE POLICY "Authenticated users can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage users"
  ON admin_users FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view form submissions"
  ON form_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage form submissions"
  ON form_submissions FOR ALL
  TO authenticated
  USING (true);

-- =====================================================
-- SEED DEFAULT PERMISSIONS
-- =====================================================

INSERT INTO role_permissions (role, resource, action, can_perform) VALUES
-- Super Admin (can do everything)
('super_admin', 'all', 'all', true),

-- Admin
('admin', 'blog', 'create', true),
('admin', 'blog', 'read', true),
('admin', 'blog', 'update', true),
('admin', 'blog', 'delete', true),
('admin', 'blog', 'publish', true),
('admin', 'job_posting', 'create', true),
('admin', 'job_posting', 'read', true),
('admin', 'job_posting', 'update', true),
('admin', 'job_posting', 'delete', true),
('admin', 'application', 'read', true),
('admin', 'application', 'update', true),
('admin', 'user', 'read', true),

-- HR Manager
('hr_manager', 'job_posting', 'create', true),
('hr_manager', 'job_posting', 'read', true),
('hr_manager', 'job_posting', 'update', true),
('hr_manager', 'application', 'read', true),
('hr_manager', 'application', 'update', true),
('hr_manager', 'interview', 'create', true),
('hr_manager', 'interview', 'read', true),
('hr_manager', 'interview', 'update', true),

-- Content Editor
('content_editor', 'blog', 'create', true),
('content_editor', 'blog', 'read', true),
('content_editor', 'blog', 'update', true),
('content_editor', 'blog', 'publish', true),
('content_editor', 'author', 'create', true),
('content_editor', 'author', 'read', true),
('content_editor', 'author', 'update', true),

-- Content Creator
('content_creator', 'blog', 'create', true),
('content_creator', 'blog', 'read', true),
('content_creator', 'blog', 'update', true),

-- Viewer
('viewer', 'blog', 'read', true),
('viewer', 'job_posting', 'read', true),
('viewer', 'application', 'read', true);

-- =====================================================
-- SEED DEFAULT EMAIL TEMPLATES
-- =====================================================

INSERT INTO email_templates (name, slug, category, subject, body_html, variables) VALUES
('Application Received', 'application-received', 'recruitment', 
 'Application Received - {{job_title}}',
 '<p>Dear {{candidate_name}},</p><p>Thank you for applying for the {{job_title}} position at DigitalQatalyst. We have received your application and our team will review it shortly.</p><p>Best regards,<br>DigitalQatalyst Recruitment Team</p>',
 '{"candidate_name": "string", "job_title": "string"}'::jsonb),

('Interview Invitation', 'interview-invitation', 'recruitment',
 'Interview Invitation - {{job_title}}',
 '<p>Dear {{candidate_name}},</p><p>We are pleased to invite you for an interview for the {{job_title}} position.</p><p><strong>Date:</strong> {{interview_date}}<br><strong>Time:</strong> {{interview_time}}<br><strong>Location:</strong> {{location}}</p><p>Please confirm your availability.</p><p>Best regards,<br>DigitalQatalyst Recruitment Team</p>',
 '{"candidate_name": "string", "job_title": "string", "interview_date": "string", "interview_time": "string", "location": "string"}'::jsonb),

('Application Rejected', 'application-rejected', 'recruitment',
 'Application Status - {{job_title}}',
 '<p>Dear {{candidate_name}},</p><p>Thank you for your interest in the {{job_title}} position at DigitalQatalyst. After careful consideration, we have decided to move forward with other candidates.</p><p>We appreciate the time you invested in the application process and wish you the best in your job search.</p><p>Best regards,<br>DigitalQatalyst Recruitment Team</p>',
 '{"candidate_name": "string", "job_title": "string"}'::jsonb),

('Consultation Request Received', 'consultation-received', 'marketing',
 'Consultation Request Received',
 '<p>Dear {{name}},</p><p>Thank you for your interest in DigitalQatalyst. We have received your consultation request and a member of our team will contact you within 24-48 hours.</p><p>Best regards,<br>DigitalQatalyst Team</p>',
 '{"name": "string"}'::jsonb);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE admin_users IS 'Admin users with role-based access control';
COMMENT ON TABLE role_permissions IS 'Permissions matrix for different user roles';
COMMENT ON TABLE activity_logs IS 'Audit trail of all admin actions';
COMMENT ON TABLE form_submissions IS 'All form submissions from the website';
COMMENT ON TABLE email_templates IS 'Reusable email templates with variables';
COMMENT ON TABLE notifications IS 'In-app notifications for admin users';
COMMENT ON TABLE interviews IS 'Interview scheduling and management';
COMMENT ON TABLE content_analytics IS 'Content performance metrics';
COMMENT ON TABLE recruitment_analytics IS 'Recruitment funnel metrics';
