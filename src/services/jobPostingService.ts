import { getJobsSupabase } from '../lib/supabaseClients';

export interface JobPosting {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  description: string;
  requirements: any; // Support both string[] and jsonb from database
  responsibilities: any; // Support both string[] and jsonb from database
  skills?: {
    core?: string[];
    behavioral?: string[];
  };
  open_positions?: number;
  posted_date: string;
  closing_date?: string;
  filled_date?: string;
  slug?: string;
  featured?: boolean;
  status: 'open' | 'closed' | 'filled' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface JobPostingInput {
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills?: {
    core?: string[];
    behavioral?: string[];
  };
  openPositions?: number;
  postedDate?: string;
  status?: 'open' | 'closed' | 'filled' | 'draft';
}

/**
 * Get all job postings (admin view)
 */
export async function getAllJobPostings(filters?: {
  status?: string;
  department?: string;
}): Promise<{ data: JobPosting[]; error?: string }> {
  try {
    const supabase = getJobsSupabase();
    let query = supabase
      .from('job_postings')
      .select('*')
      .order('posted_date', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.department) {
      query = query.eq('department', filters.department);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return { data: data || [] };
  } catch (error) {
    console.error('Error fetching job postings:', error);
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get public job postings (for careers page)
 */
export async function getPublicJobPostings(): Promise<{ data: JobPosting[]; error?: string }> {
  try {
    const supabase = getJobsSupabase();
    
    console.log('[JobPostingService] Fetching public job postings...');
    
    // Query directly from job_postings table for open positions
    // Temporarily remove status filter to debug
    const { data, error } = await supabase
      .from('job_postings')
      .select('*')
      // .eq('status', 'open')  // Temporarily commented out for debugging
      .order('posted_date', { ascending: false });

    if (error) {
      console.error('[JobPostingService] Supabase query error:', error);
      throw new Error(error.message);
    }

    console.log('[JobPostingService] Successfully fetched jobs:', {
      count: data?.length || 0,
      jobs: data?.map(j => ({ id: j.id, title: j.title, status: j.status }))
    });

    return { data: data || [] };
  } catch (error) {
    console.error('[JobPostingService] Error fetching public job postings:', error);
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get single job posting by ID
 */
export async function getJobPostingById(id: number): Promise<{ data: JobPosting | null; error?: string }> {
  try {
    const supabase = getJobsSupabase();
    const { data, error } = await supabase
      .from('job_postings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { data };
  } catch (error) {
    console.error('Error fetching job posting:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Create new job posting
 */
export async function createJobPosting(
  posting: JobPostingInput
): Promise<{ success: boolean; data?: JobPosting; error?: string }> {
  try {
    const supabase = getJobsSupabase();
    
    // Generate unique slug from title with timestamp
    const baseSlug = posting.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Add timestamp to ensure uniqueness
    const timestamp = Date.now();
    const slug = `${baseSlug}-${timestamp}`;

    const { data, error } = await supabase
      .from('job_postings')
      .insert({
        title: posting.title,
        department: posting.department,
        location: posting.location,
        type: posting.type,
        level: posting.level,
        description: posting.description,
        requirements: posting.requirements,
        responsibilities: posting.responsibilities,
        skills: posting.skills,
        open_positions: posting.openPositions || 1,
        posted_date: posting.postedDate,
        status: posting.status || 'draft',
        slug,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      // Provide specific guidance for common errors
      if (error.message.toLowerCase().includes('column') && error.message.toLowerCase().includes('not found')) {
        throw new Error(`${error.message}\n\nThis error typically occurs when job_postings table or its columns don't exist in the database.\nPlease run the migration script: migrations/update_job_postings_table.sql in your Supabase SQL editor.`);
      }
      
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error creating job posting:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Update job posting
 */
export async function updateJobPosting(
  id: number,
  updates: Partial<JobPostingInput>
): Promise<{ success: boolean; data?: JobPosting; error?: string }> {
  try {
    const supabase = getJobsSupabase();
    
    // Create updates object with slug if title changed
    const updatesWithSlug: Partial<JobPostingInput> & { slug?: string } = { ...updates };
    if (updates.title) {
      const baseSlug = updates.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Add timestamp to ensure uniqueness
      const timestamp = Date.now();
      updatesWithSlug.slug = `${baseSlug}-${timestamp}`;
    }
    
    // Map field names to match database column names
    const dbUpdates: any = { ...updatesWithSlug };
    if (dbUpdates.openPositions !== undefined) {
      dbUpdates.open_positions = dbUpdates.openPositions;
      delete dbUpdates.openPositions;
    }
    if (dbUpdates.postedDate !== undefined) {
      dbUpdates.posted_date = dbUpdates.postedDate;
      delete dbUpdates.postedDate;
    }
    if (dbUpdates.featured !== undefined) {
      delete dbUpdates.featured;
    }

    const { data, error } = await supabase
      .from('job_postings')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error updating job posting:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Mark position as filled
 */
export async function markPositionAsFilled(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getJobsSupabase();
    const { error } = await supabase
      .from('job_postings')
      .update({
        status: 'filled',
        filled_date: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Error marking position as filled:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Delete job posting
 */
export async function deleteJobPosting(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getJobsSupabase();
    const { error } = await supabase
      .from('job_postings')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting job posting:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get application count for a job posting
 */
export async function getApplicationCount(
  jobPostingId: number
): Promise<{ count: number; error?: string }> {
  try {
    const supabase = getJobsSupabase();
    const { count, error } = await supabase
      .from('job_applications')
      .select('*', { count: 'exact', head: true })
      .eq('job_posting_id', jobPostingId);

    if (error) {
      throw new Error(error.message);
    }

    return { count: count || 0 };
  } catch (error) {
    console.error('Error getting application count:', error);
    return {
      count: 0,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
