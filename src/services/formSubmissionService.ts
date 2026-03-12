import { getPrimarySupabase } from '../lib/supabaseClients';
import type { FormSubmission, FormSubmissionNote, FormType, FormStatus, Priority } from '../types/admin';

const supabase = getPrimarySupabase();

// Get all form submissions
export const getFormSubmissions = async (filters?: {
  formType?: FormType;
  status?: FormStatus;
  assignedTo?: string;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    let query = supabase
      .from('form_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.formType) {
      query = query.eq('form_type', filters.formType);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.assignedTo) {
      query = query.eq('assigned_to', filters.assignedTo);
    }
    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data: data as FormSubmission[], error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

// Get single submission
export const getFormSubmission = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data: data as FormSubmission, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Create form submission
export const createFormSubmission = async (submission: Partial<FormSubmission>) => {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .insert([submission])
      .select()
      .single();

    if (error) throw error;
    return { data: data as FormSubmission, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Update submission status
export const updateSubmissionStatus = async (id: string, status: FormStatus) => {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as FormSubmission, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Update submission priority
export const updateSubmissionPriority = async (id: string, priority: Priority) => {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .update({ priority, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as FormSubmission, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Assign submission to user
export const assignSubmission = async (id: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .update({ 
        assigned_to: userId, 
        assigned_at: new Date().toISOString(),
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as FormSubmission, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Update follow-up date
export const updateFollowUpDate = async (id: string, nextFollowUp: string) => {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .update({ 
        next_follow_up: nextFollowUp,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as FormSubmission, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Mark as followed up
export const markAsFollowedUp = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .update({ 
        followed_up_at: new Date().toISOString(),
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as FormSubmission, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Get submission notes
export const getSubmissionNotes = async (submissionId: string) => {
  try {
    const { data, error } = await supabase
      .from('form_submission_notes')
      .select(`
        *,
        user:admin_users(id, first_name, last_name, avatar_url)
      `)
      .eq('submission_id', submissionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data as FormSubmissionNote[], error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

// Add submission note
export const addSubmissionNote = async (submissionId: string, userId: string, note: string) => {
  try {
    const { data, error } = await supabase
      .from('form_submission_notes')
      .insert([{
        submission_id: submissionId,
        user_id: userId,
        note,
      }])
      .select()
      .single();

    if (error) throw error;
    return { data: data as FormSubmissionNote, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Update lead score
export const updateLeadScore = async (id: string, score: number) => {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .update({ 
        lead_score: score,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as FormSubmission, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Get submissions by status count
export const getSubmissionsByStatus = async () => {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .select('status');

    if (error) throw error;

    const statusCounts = data?.reduce((acc: Record<string, number>, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});

    return { data: statusCounts, error: null };
  } catch (error: any) {
    return { data: {}, error: error.message };
  }
};

// Get submissions by form type count
export const getSubmissionsByFormType = async () => {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .select('form_type');

    if (error) throw error;

    const typeCounts = data?.reduce((acc: Record<string, number>, item) => {
      acc[item.form_type] = (acc[item.form_type] || 0) + 1;
      return acc;
    }, {});

    return { data: typeCounts, error: null };
  } catch (error: any) {
    return { data: {}, error: error.message };
  }
};

// Delete submission
export const deleteSubmission = async (id: string) => {
  try {
    const { error } = await supabase
      .from('form_submissions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Helper function to create form submission handler
export const createFormSubmissionHandler = (formType: FormType) => {
  return async (formData: any, metadata?: { submittedBy?: string }) => {
    try {
      // Extract common fields
      const submission: Partial<FormSubmission> = {
        form_type: formType,
        email: formData.email || formData.contactEmail || '',
        first_name: formData.firstName || formData.first_name || '',
        last_name: formData.lastName || formData.last_name || '',
        phone: formData.phone || formData.phoneNumber || '',
        company: formData.company || formData.companyName || '',
        job_title: formData.jobTitle || formData.position || '',
        form_data: formData,
        status: 'new',
        priority: 'medium',
        lead_score: 0,
      };

      const result = await createFormSubmission(submission);
      
      if (result.error) {
        throw new Error(result.error);
      }

      return { success: true, data: result.data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };
};

/**
 * Submit a general contact form
 */
export const submitContactForm = async (formData: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  form_type: string;
}): Promise<any> => {
  const enhancedPayload = {
    serviceName: "Contact",
    formName: "General Contact Form",
    formId: "general-contact",
    category: "contact",
    submittedAt: new Date().toISOString(),
    status: "submitted",
    formData: formData,
    userAgent: navigator.userAgent
  };

  console.log('📤 Submitting Contact Form:', enhancedPayload);

  try {
    const response = await fetch('/api/forms/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enhancedPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${errorText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('❌ Contact form submission error:', error.message);
    throw new Error('Failed to submit contact form. Please try again.');
  }
};
