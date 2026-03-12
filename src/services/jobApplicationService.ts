import { getJobsSupabase } from '../lib/supabaseClients';
import type { JobApplication, ApplicationStatus, ApplicationStatusUpdate } from '../types/admin';

export interface JobApplicationData {
  jobId: number;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedIn?: string;
  portfolio?: string;
  currentLocation: string;
  yearsOfExperience: string;
  currentCompany?: string;
  currentRole?: string;
  noticePeriod: string;
  expectedSalary?: string;
  coverLetter: string;
  resume: File;
  additionalDocuments?: File | null;
}

/**
 * Upload a file to Supabase Storage
 */
async function uploadFile(file: File, folder: string): Promise<{ url: string; filename: string }> {
  const supabase = getJobsSupabase();
  const timestamp = Date.now();
  const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filename = `${folder}/${timestamp}_${sanitizedFilename}`;

  const { data, error } = await supabase.storage
    .from('job-applications')
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('File upload error:', error);
    throw new Error(`Failed to upload ${file.name}: ${error.message}`);
  }

  // Get public URL (even though bucket is private, we store the path)
  const { data: urlData } = supabase.storage
    .from('job-applications')
    .getPublicUrl(data.path);

  return {
    url: urlData.publicUrl,
    filename: file.name,
  };
}

/**
 * Submit a job application
 */
export async function submitJobApplication(
  applicationData: JobApplicationData
): Promise<{ success: boolean; applicationId?: string; error?: string }> {
  try {
    const supabase = getJobsSupabase();

    // Upload resume
    const resumeUpload = await uploadFile(
      applicationData.resume,
      `resumes/${applicationData.email}`
    );

    // Upload additional documents if provided
    let additionalDocsUpload: { url: string; filename: string } | null = null;
    if (applicationData.additionalDocuments) {
      additionalDocsUpload = await uploadFile(
        applicationData.additionalDocuments,
        `additional/${applicationData.email}`
      );
    }

    // Insert application into database
    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        job_id: applicationData.jobId,
        job_title: applicationData.jobTitle,
        first_name: applicationData.firstName,
        last_name: applicationData.lastName,
        email: applicationData.email,
        phone: applicationData.phone,
        linkedin_url: applicationData.linkedIn || null,
        portfolio_url: applicationData.portfolio || null,
        current_location: applicationData.currentLocation,
        years_of_experience: applicationData.yearsOfExperience,
        current_company: applicationData.currentCompany || null,
        current_job_role: applicationData.currentRole || null,
        notice_period: applicationData.noticePeriod,
        expected_salary: applicationData.expectedSalary || null,
        cover_letter: applicationData.coverLetter,
        resume_url: resumeUpload.url,
        resume_filename: resumeUpload.filename,
        additional_documents_url: additionalDocsUpload?.url || null,
        additional_documents_filename: additionalDocsUpload?.filename || null,
        application_status: 'pending',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Database insert error:', error);
      throw new Error(`Failed to submit application: ${error.message}`);
    }

    return {
      success: true,
      applicationId: data.id,
    };
  } catch (error) {
    console.error('Job application submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get all job applications (admin only)
 */
export async function getJobApplications(
  filters?: {
    jobId?: number;
    status?: ApplicationStatus;
    limit?: number;
    offset?: number;
  }
): Promise<{ data: JobApplication[]; count: number; error?: string }> {
  try {
    const supabase = getJobsSupabase();
    let query = supabase
      .from('job_applications')
      .select('*', { count: 'exact' })
      .order('applied_at', { ascending: false });

    if (filters?.jobId) {
      query = query.eq('job_id', filters.jobId);
    }

    if (filters?.status) {
      query = query.eq('application_status', filters.status);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return {
      data: (data || []) as JobApplication[],
      count: count || 0,
    };
  } catch (error) {
    console.error('Error fetching job applications:', error);
    return {
      data: [],
      count: 0,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Update application status (admin only)
 */
export async function updateApplicationStatus(
  applicationId: string,
  statusUpdate: ApplicationStatusUpdate
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getJobsSupabase();
    
    // Build update data object with only the status (required field)
    const updateData: any = {
      application_status: statusUpdate.status,
    };

    // Add optional fields only if they exist in the database schema
    // These fields will be added after running the migration
    if (statusUpdate.rejection_reason !== undefined) {
      updateData.rejection_reason = statusUpdate.rejection_reason;
    }
    
    if (statusUpdate.internal_notes !== undefined) {
      updateData.internal_notes = statusUpdate.internal_notes;
    }

    if (statusUpdate.changed_by !== undefined) {
      updateData.status_changed_by = statusUpdate.changed_by;
    }

    const { error } = await supabase
      .from('job_applications')
      .update(updateData)
      .eq('id', applicationId);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating application status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get application by ID (admin only)
 */
export async function getApplicationById(
  applicationId: string
): Promise<{ data: JobApplication | null; error?: string }> {
  try {
    const supabase = getJobsSupabase();
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { data: data as JobApplication };
  } catch (error) {
    console.error('Error fetching application:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get recruitment funnel analytics
 */
export async function getRecruitmentFunnel(): Promise<{
  data: Array<{ application_status: ApplicationStatus; count: number; percentage: number }>;
  error?: string;
}> {
  try {
    const supabase = getJobsSupabase();
    const { data, error } = await supabase
      .from('v_recruitment_funnel')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return { data: data || [] };
  } catch (error) {
    console.error('Error fetching recruitment funnel:', error);
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
