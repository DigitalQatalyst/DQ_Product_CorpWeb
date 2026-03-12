import { getPrimarySupabase } from '../lib/supabaseClients';
import type { AdminUser, UserRole, ActivityLog } from '../types/admin';

const supabase = getPrimarySupabase();

// Get all admin users
export const getAdminUsers = async (filters?: {
  role?: UserRole;
  isActive?: boolean;
  department?: string;
}) => {
  try {
    let query = supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.role) {
      query = query.eq('role', filters.role);
    }
    if (filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }
    if (filters?.department) {
      query = query.eq('department', filters.department);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data: data as AdminUser[], error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

// Get single admin user
export const getAdminUser = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data: data as AdminUser, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Get admin user by email
export const getAdminUserByEmail = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return { data: data as AdminUser, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Create admin user
export const createAdminUser = async (user: Partial<AdminUser>) => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .insert([user])
      .select()
      .single();

    if (error) throw error;
    return { data: data as AdminUser, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Update admin user
export const updateAdminUser = async (id: string, updates: Partial<AdminUser>) => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as AdminUser, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Update user role
export const updateUserRole = async (id: string, role: UserRole) => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as AdminUser, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Deactivate user
export const deactivateUser = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as AdminUser, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Activate user
export const activateUser = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as AdminUser, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Update last login
export const updateLastLogin = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as AdminUser, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Delete admin user
export const deleteAdminUser = async (id: string) => {
  try {
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Activity Logs
export const logActivity = async (activity: {
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert([activity])
      .select()
      .single();

    if (error) throw error;
    return { data: data as ActivityLog, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Get activity logs
export const getActivityLogs = async (filters?: {
  userId?: string;
  resourceType?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}) => {
  try {
    let query = supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }
    if (filters?.resourceType) {
      query = query.eq('resource_type', filters.resourceType);
    }
    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data: data as ActivityLog[], error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

// Get user activity summary
export const getUserActivitySummary = async (userId: string, days: number = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('activity_logs')
      .select('action, resource_type')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    // Count by action
    const actionCounts = data?.reduce((acc: Record<string, number>, item) => {
      acc[item.action] = (acc[item.action] || 0) + 1;
      return acc;
    }, {});

    return { data: actionCounts, error: null };
  } catch (error: any) {
    return { data: {}, error: error.message };
  }
};

// Check user permission
export const checkPermission = async (role: UserRole, resource: string, action: string) => {
  try {
    const { data, error } = await supabase
      .from('role_permissions')
      .select('can_perform')
      .eq('role', role)
      .or(`resource.eq.${resource},resource.eq.all`)
      .or(`action.eq.${action},action.eq.all`)
      .single();

    if (error) throw error;
    return { allowed: data?.can_perform || false, error: null };
  } catch (error: any) {
    return { allowed: false, error: error.message };
  }
};
