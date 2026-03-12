import { getPrimarySupabase } from '../lib/supabaseClients';
import type { Interview, InterviewFeedback, InterviewType, InterviewStatus, Recommendation } from '../types/admin';

const supabase = getPrimarySupabase();

// Get all interviews
export const getInterviews = async (filters?: {
  applicationId?: string;
  jobPostingId?: number;
  status?: InterviewStatus;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    let query = supabase
      .from('interviews')
      .select('*')
      .order('scheduled_date', { ascending: true });

    if (filters?.applicationId) {
      query = query.eq('application_id', filters.applicationId);
    }
    if (filters?.jobPostingId) {
      query = query.eq('job_posting_id', filters.jobPostingId);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.startDate) {
      query = query.gte('scheduled_date', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('scheduled_date', filters.endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data: data as Interview[], error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

// Get single interview
export const getInterview = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data: data as Interview, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Create interview
export const createInterview = async (interview: Partial<Interview>) => {
  try {
    const { data, error } = await supabase
      .from('interviews')
      .insert([interview])
      .select()
      .single();

    if (error) throw error;
    return { data: data as Interview, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Update interview
export const updateInterview = async (id: string, updates: Partial<Interview>) => {
  try {
    const { data, error } = await supabase
      .from('interviews')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as Interview, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Update interview status
export const updateInterviewStatus = async (id: string, status: InterviewStatus) => {
  try {
    const { data, error} = await supabase
      .from('interviews')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as Interview, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Cancel interview
export const cancelInterview = async (id: string) => {
  return updateInterviewStatus(id, 'cancelled');
};

// Reschedule interview
export const rescheduleInterview = async (id: string, newDate: string) => {
  try {
    const { data, error } = await supabase
      .from('interviews')
      .update({ 
        scheduled_date: newDate,
        status: 'rescheduled',
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as Interview, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Mark interview as completed
export const completeInterview = async (id: string, notes?: string) => {
  try {
    const { data, error } = await supabase
      .from('interviews')
      .update({ 
        status: 'completed',
        interview_notes: notes,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as Interview, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Get interview feedback
export const getInterviewFeedback = async (interviewId: string) => {
  try {
    const { data, error } = await supabase
      .from('interview_feedback')
      .select(`
        *,
        interviewer:admin_users(id, first_name, last_name, avatar_url)
      `)
      .eq('interview_id', interviewId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return { data: data as InterviewFeedback[], error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

// Submit interview feedback
export const submitInterviewFeedback = async (feedback: {
  interview_id: string;
  interviewer_id: string;
  rating?: number;
  recommendation?: Recommendation;
  strengths?: string;
  weaknesses?: string;
  notes?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('interview_feedback')
      .insert([feedback])
      .select()
      .single();

    if (error) throw error;
    return { data: data as InterviewFeedback, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Update interview feedback
export const updateInterviewFeedback = async (id: string, updates: Partial<InterviewFeedback>) => {
  try {
    const { data, error } = await supabase
      .from('interview_feedback')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as InterviewFeedback, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Send interview reminder
export const sendInterviewReminder = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('interviews')
      .update({ 
        reminder_sent: true,
        reminder_sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as Interview, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Get upcoming interviews
export const getUpcomingInterviews = async (days: number = 7) => {
  try {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .gte('scheduled_date', today.toISOString())
      .lte('scheduled_date', futureDate.toISOString())
      .in('status', ['scheduled', 'confirmed'])
      .order('scheduled_date', { ascending: true });

    if (error) throw error;
    return { data: data as Interview[], error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

// Get interviews by interviewer
export const getInterviewsByInterviewer = async (interviewerId: string) => {
  try {
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .contains('interviewer_ids', [interviewerId])
      .order('scheduled_date', { ascending: true });

    if (error) throw error;
    return { data: data as Interview[], error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

// Delete interview
export const deleteInterview = async (id: string) => {
  try {
    const { error } = await supabase
      .from('interviews')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
