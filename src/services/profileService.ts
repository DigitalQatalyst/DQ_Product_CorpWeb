import { supabase } from '../lib/supabase';
import type { Profile } from '../contexts/AuthContext';

// Get all profiles (for user management)
export const getAllProfiles = async (filters?: {
  role?: string;
  isActive?: boolean;
}) => {
  try {
    // Try using RPC to get profiles with emails
    const { data, error } = await supabase.rpc('get_profiles_with_emails');
    
    if (error) {
      console.error('RPC error:', error);
      // Fallback to basic profiles query
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      console.log('Raw profiles data (fallback):', profiles);

      // Return profiles without emails for now
      let filteredData = profiles || [];
      if (filters?.role) {
        filteredData = filteredData.filter(user => user.role === filters.role);
      }

      return { data: filteredData as Profile[], error: null };
    }

    console.log('RPC data:', data);

    // Apply filters
    let filteredData = data || [];
    if (filters?.role) {
      filteredData = filteredData.filter(user => user.role === filters.role);
    }

    return { data: filteredData as (Profile & { email: string })[], error: null };
  } catch (error: any) {
    console.error('Error in getAllProfiles:', error);
    return { data: [], error: error.message };
  }
};

// Get single profile
export const getProfile = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data: data as Profile, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Update profile
export const updateProfile = async (id: string, updates: Partial<Profile>) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        ...updates, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as Profile, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Update user role
export const updateUserRole = async (id: string, role: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        role, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as Profile, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Deactivate user (set role to 'inactive' or similar)
export const deactivateUser = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        role: 'inactive',
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as Profile, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Activate user (set role back to 'viewer' or default)
export const activateUser = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        role: 'viewer',
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as Profile, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Delete profile (use with caution)
export const deleteProfile = async (id: string) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
