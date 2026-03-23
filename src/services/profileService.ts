import { supabase } from '../lib/supabase';
import { getSupabaseAdmin } from '../admin-ui/utils/supabaseClient';
import type { Profile } from '../contexts/AuthContext';

// Get all profiles (for user management)
export const getAllProfiles = async (filters?: {
  role?: string;
  isActive?: boolean;
}) => {
  try {
    // Try using RPC to get profiles with emails
    // const { data, error } = await supabase.rpc('get_profiles_with_emails');
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        console.log("all profiles table",data)
    
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

// Delete profile (use with caution) - deletes from both profiles and auth.users
export const deleteProfile = async (id: string) => {
  try {
    console.log('[ProfileService] Starting complete user deletion for ID:', id);
    
    // First, try to delete the user from auth.users table using admin client
    let authDeletionSuccess = false;
    let authDeletionError = null;
    
    try {
      let adminSupabase = getSupabaseAdmin();
      
      if (!adminSupabase) {
        console.warn('[ProfileService] Admin client not available, falling back to manual auth deletion');
        
        // Fallback: Try to use regular client with manual auth deletion
        // This is a workaround when service role key is not configured
        try {
          // Get current user to verify admin status
          const { data: { user } } = await supabase.auth.getUser();
          const currentUserProfile = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user?.id || '')
            .single();

          const isAdmin = currentUserProfile?.data?.role === 'admin';
          
          if (!isAdmin) {
            throw new Error('Admin privileges required to delete users. Current user role: ' + (currentUserProfile?.data?.role || 'unknown'));
          }

          console.log('[ProfileService] Admin user confirmed, attempting manual auth deletion...');
          
          // Manual auth deletion using service_role (bypasses RLS)
          const { error: manualDeleteError } = await supabase.rpc('admin_delete_user', { user_id: id });
          
          if (manualDeleteError) {
            console.error('[ProfileService] Manual auth deletion failed:', manualDeleteError);
            authDeletionError = `Manual auth deletion failed: ${manualDeleteError.message}`;
          } else {
            authDeletionSuccess = true;
            console.log('[ProfileService] Manual auth deletion successful');
          }
          
        } catch (manualError: any) {
          console.error('[ProfileService] Manual auth deletion error:', manualError);
          authDeletionError = `Manual auth deletion error: ${manualError.message || manualError}`;
        }
      } else {
        console.log('[ProfileService] Using admin client for auth deletion...');
        
        // Delete from auth.users using admin functions
        const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(id);
        
        if (deleteError) {
          console.error('[ProfileService] Auth user deletion failed:', deleteError);
          authDeletionError = `Failed to delete auth user: ${deleteError.message}`;
        } else {
          authDeletionSuccess = true;
          console.log('[ProfileService] Auth user deleted successfully');
        }
      }
      
    } catch (authError: any) {
      console.error('[ProfileService] Auth deletion error:', authError);
      authDeletionError = `Auth deletion error: ${authError.message || authError}`;
      // Continue with profile deletion even if auth deletion fails
      // This ensures at least the profile is removed
    }
    
    // Always delete from profiles table
    let profileDeletionSuccess = false;
    let profileDeletionError = null;
    
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (profileError) {
        console.error('[ProfileService] Profile deletion failed:', profileError);
        profileDeletionError = `Failed to delete profile: ${profileError.message}`;
      } else {
        profileDeletionSuccess = true;
        console.log('[ProfileService] Profile deleted successfully');
      }
    } catch (profileErr: any) {
      console.error('[ProfileService] Profile deletion error:', profileErr);
      profileDeletionError = `Profile deletion error: ${profileErr.message || profileErr}`;
    }
    
    // Determine overall success
    const overallSuccess = authDeletionSuccess && profileDeletionSuccess;
    const overallError = authDeletionError || profileDeletionError;
    
    console.log('[ProfileService] Deletion summary:', {
      authDeletionSuccess,
      profileDeletionSuccess,
      overallSuccess,
      authError: authDeletionError,
      profileError: profileDeletionError
    });

    return { 
      success: overallSuccess, 
      error: overallError,
      authDeletionSuccess,
      profileDeletionSuccess
    };
  } catch (error: any) {
    console.error('[ProfileService] Complete user deletion failed:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown error occurred',
      authDeletionSuccess: false,
      profileDeletionSuccess: false
    };
  }
};
