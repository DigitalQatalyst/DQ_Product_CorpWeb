import { getPrimarySupabase } from '../lib/supabaseClients';
import type { ContentAnalytics, RecruitmentAnalytics, AnalyticsSummary } from '../types/admin';

const supabase = getPrimarySupabase();

// Content Analytics
export const getContentAnalytics = async (filters?: {
  startDate?: string;
  endDate?: string;
  contentType?: string;
}) => {
  try {
    let query = supabase
      .from('content_analytics')
      .select('*')
      .order('date', { ascending: false });

    if (filters?.startDate) {
      query = query.gte('date', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('date', filters.endDate);
    }
    if (filters?.contentType) {
      query = query.eq('content_type', filters.contentType);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data: data as ContentAnalytics[], error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

export const getTopPerformingContent = async (limit: number = 10) => {
  try {
    const { data, error } = await supabase
      .from('content_analytics')
      .select('content_id, content_type, views, unique_views, shares, cta_clicks')
      .order('views', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

// Recruitment Analytics
export const getRecruitmentAnalytics = async (filters?: {
  startDate?: string;
  endDate?: string;
  jobPostingId?: number;
}) => {
  try {
    let query = supabase
      .from('recruitment_analytics')
      .select('*')
      .order('date', { ascending: false });

    if (filters?.startDate) {
      query = query.gte('date', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('date', filters.endDate);
    }
    if (filters?.jobPostingId) {
      query = query.eq('job_posting_id', filters.jobPostingId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data: data as RecruitmentAnalytics[], error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

export const getRecruitmentBySource = async () => {
  try {
    const { data, error } = await supabase
      .from('recruitment_analytics')
      .select('source, applications_completed')
      .not('source', 'is', null);

    if (error) throw error;

    // Aggregate by source
    const sourceMap = new Map<string, number>();
    data?.forEach((item: any) => {
      const current = sourceMap.get(item.source) || 0;
      sourceMap.set(item.source, current + item.applications_completed);
    });

    const result = Array.from(sourceMap.entries()).map(([source, count]) => ({
      source,
      applications: count,
    }));

    return { data: result, error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

// Dashboard Summary
export const getAnalyticsSummary = async (): Promise<{ data: AnalyticsSummary | null; error: string | null }> => {
  try {
    // Get content stats
    const { data: contentData } = await supabase
      .from('content_analytics')
      .select('views, time_on_page');

    const totalViews = contentData?.reduce((sum, item) => sum + item.views, 0) || 0;
    const avgTimeOnPage = contentData?.length 
      ? contentData.reduce((sum, item) => sum + (item.time_on_page || 0), 0) / contentData.length 
      : 0;

    // Get recruitment stats
    const { data: recruitmentData } = await supabase
      .from('recruitment_analytics')
      .select('applications_completed, view_to_apply_rate');

    const totalApplications = recruitmentData?.reduce((sum, item) => sum + item.applications_completed, 0) || 0;
    const avgConversionRate = recruitmentData?.length
      ? recruitmentData.reduce((sum, item) => sum + (item.view_to_apply_rate || 0), 0) / recruitmentData.length
      : 0;

    // Get form submissions stats
    const { data: submissionsData } = await supabase
      .from('form_submissions')
      .select('form_type, status');

    const totalSubmissions = submissionsData?.length || 0;
    const qualifiedLeads = submissionsData?.filter(s => s.status === 'qualified').length || 0;

    const summary: AnalyticsSummary = {
      content: {
        total_views: totalViews,
        total_posts: contentData?.length || 0,
        avg_time_on_page: Math.round(avgTimeOnPage),
        top_performing: [],
      },
      recruitment: {
        total_applications: totalApplications,
        total_positions: 0,
        avg_time_to_hire: 0,
        conversion_rate: avgConversionRate,
        top_sources: [],
      },
      leads: {
        total_submissions: totalSubmissions,
        qualified_leads: qualifiedLeads,
        conversion_rate: totalSubmissions > 0 ? (qualifiedLeads / totalSubmissions) * 100 : 0,
        by_form_type: {} as any,
      },
    };

    return { data: summary, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Track content view
export const trackContentView = async (contentId: number, contentType: string) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase.rpc('increment_content_view', {
      p_content_id: contentId,
      p_content_type: contentType,
      p_date: today,
    });

    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Track recruitment view
export const trackRecruitmentView = async (jobPostingId: number, source?: string) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase.rpc('increment_recruitment_view', {
      p_job_posting_id: jobPostingId,
      p_source: source || 'direct',
      p_date: today,
    });

    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
