// Admin User Management Types
export type UserRole = 'super_admin' | 'admin' | 'hr_manager' | 'content_editor' | 'content_creator' | 'viewer';

export interface AdminUser {
  id: string;
  auth_user_id?: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  department?: string;
  avatar_url?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface RolePermission {
  id: number;
  role: UserRole;
  resource: string;
  action: string;
  can_perform: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Form & Lead Management Types
export type FormType = 'consultation' | 'demo_request' | 'service_request' | 'tour_request' | 'contact' | 'other';
export type FormStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'closed' | 'spam';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface FormSubmission {
  id: string;
  form_type: FormType;
  status: FormStatus;
  priority: Priority;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  company?: string;
  job_title?: string;
  form_data: Record<string, any>;
  lead_score: number;
  lead_source?: string;
  assigned_to?: string;
  assigned_at?: string;
  followed_up_at?: string;
  next_follow_up?: string;
  notes?: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  created_at: string;
  updated_at: string;
}

export interface FormSubmissionNote {
  id: string;
  submission_id: string;
  user_id?: string;
  note: string;
  created_at: string;
  user?: AdminUser;
}

// Communication & Notifications Types
export type EmailCategory = 'recruitment' | 'marketing' | 'system' | 'notification';
export type NotificationType = 'application' | 'submission' | 'content' | 'system';
export type EmailStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';

export interface EmailTemplate {
  id: string;
  name: string;
  slug: string;
  category: EmailCategory;
  subject: string;
  body_html: string;
  body_text?: string;
  variables?: Record<string, string>;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  read_at?: string;
  priority: Priority;
  created_at: string;
}

export interface EmailLog {
  id: string;
  template_id?: string;
  recipient_email: string;
  subject: string;
  status: EmailStatus;
  error_message?: string;
  sent_at?: string;
  delivered_at?: string;
  opened_at?: string;
  clicked_at?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

// Interview Scheduling Types
export type InterviewType = 'phone_screen' | 'video' | 'onsite' | 'technical' | 'final';
export type InterviewStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show';
export type Recommendation = 'strong_yes' | 'yes' | 'maybe' | 'no' | 'strong_no';

export interface Interview {
  id: string;
  application_id: string;
  job_posting_id?: number;
  interview_type: InterviewType;
  status: InterviewStatus;
  scheduled_date: string;
  duration_minutes: number;
  location?: string;
  meeting_link?: string;
  interviewer_ids?: string[];
  candidate_email: string;
  candidate_name: string;
  preparation_notes?: string;
  interview_notes?: string;
  feedback?: Record<string, any>;
  rating?: number;
  recommendation?: Recommendation;
  reminder_sent: boolean;
  reminder_sent_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface InterviewFeedback {
  id: string;
  interview_id: string;
  interviewer_id?: string;
  rating?: number;
  recommendation?: Recommendation;
  strengths?: string;
  weaknesses?: string;
  notes?: string;
  submitted_at: string;
  interviewer?: AdminUser;
}

// Analytics Types
export interface ContentAnalytics {
  id: string;
  content_id: number;
  content_type: string;
  views: number;
  unique_views: number;
  time_on_page?: number;
  bounce_rate?: number;
  shares: number;
  comments: number;
  downloads: number;
  scroll_depth?: number;
  cta_clicks: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface RecruitmentAnalytics {
  id: string;
  job_posting_id?: number;
  views: number;
  unique_views: number;
  applications_started: number;
  applications_completed: number;
  applications_qualified: number;
  view_to_apply_rate?: number;
  completion_rate?: number;
  source?: string;
  date: string;
  created_at: string;
  updated_at: string;
}

// Dashboard Analytics Summary
export interface AnalyticsSummary {
  content: {
    total_views: number;
    total_posts: number;
    avg_time_on_page: number;
    top_performing: Array<{
      id: number;
      title: string;
      views: number;
      engagement_rate: number;
    }>;
  };
  recruitment: {
    total_applications: number;
    total_positions: number;
    avg_time_to_hire: number;
    conversion_rate: number;
    top_sources: Array<{
      source: string;
      applications: number;
      conversion_rate: number;
    }>;
  };
  leads: {
    total_submissions: number;
    qualified_leads: number;
    conversion_rate: number;
    by_form_type: Record<FormType, number>;
  };
}

// Job Application Types
export type ApplicationStatus = 
  | 'pending'              // New application, no action taken
  | 'screened'             // Initial review completed
  | 'qualified'            // Meets must-haves, moving forward
  | 'interview_scheduled'  // Interview arranged
  | 'interviewed'          // Interview completed, awaiting decision
  | 'shortlisted'          // Top candidate for final consideration
  | 'offered'              // Job offer extended
  | 'hired'                // Offer accepted
  | 'rejected'             // Not moving forward
  | 'withdrawn';           // Candidate withdrew

export interface StatusHistoryEntry {
  from_status: ApplicationStatus;
  to_status: ApplicationStatus;
  changed_at: string;
  changed_by?: string;
}

export interface JobApplication {
  id: string;
  job_id: number;
  job_title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  linkedin_url?: string;
  portfolio_url?: string;
  current_location: string;
  years_of_experience: string;
  current_company?: string;
  current_role?: string;
  notice_period: string;
  expected_salary?: string;
  cover_letter: string;
  resume_url: string;
  resume_filename: string;
  additional_documents_url?: string;
  additional_documents_filename?: string;
  application_status: ApplicationStatus;
  status_history?: StatusHistoryEntry[];
  rejection_reason?: string;
  internal_notes?: string;
  status_changed_at?: string;
  status_changed_by?: string;
  applied_at: string;
  updated_at: string;
}

export interface ApplicationStatusUpdate {
  status: ApplicationStatus;
  rejection_reason?: string;
  internal_notes?: string;
  changed_by?: string;
}

// Status metadata for UI rendering
export interface StatusMetadata {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  nextSteps?: ApplicationStatus[];
}

export const APPLICATION_STATUS_METADATA: Record<ApplicationStatus, StatusMetadata> = {
  pending: {
    label: 'Pending',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    description: 'New application, awaiting initial review',
    nextSteps: ['screened', 'rejected'],
  },
  screened: {
    label: 'Screened',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Initial review completed',
    nextSteps: ['qualified', 'rejected'],
  },
  qualified: {
    label: 'Qualified',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'Meets requirements, ready for interview',
    nextSteps: ['interview_scheduled', 'rejected'],
  },
  interview_scheduled: {
    label: 'Interview Scheduled',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    description: 'Interview arranged with candidate',
    nextSteps: ['interviewed', 'withdrawn', 'rejected'],
  },
  interviewed: {
    label: 'Interviewed',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    description: 'Interview completed, awaiting decision',
    nextSteps: ['shortlisted', 'rejected'],
  },
  shortlisted: {
    label: 'Shortlisted',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description: 'Top candidate for final consideration',
    nextSteps: ['offered', 'rejected'],
  },
  offered: {
    label: 'Offered',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    description: 'Job offer extended to candidate',
    nextSteps: ['hired', 'rejected', 'withdrawn'],
  },
  hired: {
    label: 'Hired',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    description: 'Offer accepted, candidate hired',
    nextSteps: [],
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    description: 'Application not moving forward',
    nextSteps: [],
  },
  withdrawn: {
    label: 'Withdrawn',
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    description: 'Candidate withdrew from process',
    nextSteps: [],
  },
};
