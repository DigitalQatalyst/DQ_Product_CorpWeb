import { supabase } from '../lib/supabase';

export interface Department {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// Test function to check if table exists and is accessible
export const testDepartmentsTable = async () => {
  try {
    console.log('🧪 Testing departments table access...');
    
    // Test 1: Check if table exists
    const { data: tableInfo, error: tableError } = await supabase
      .from('departments')
      .select('count', { count: 'exact', head: true });
    
    console.log('📊 Table test result:', { tableInfo, tableError });
    
    if (tableError) {
      console.error('❌ Table access error:', tableError);
      return { success: false, error: tableError };
    }
    
    // Test 2: Try to fetch actual data
    const { data, error } = await supabase
      .from('departments')
      .select('id, name')
      .limit(1);
    
    console.log('📋 Data test result:', { data, error });
    
    if (error) {
      console.error('❌ Data fetch error:', error);
      return { success: false, error };
    }
    
    console.log('✅ Departments table is accessible');
    return { success: true, count: data?.length || 0 };
    
  } catch (err) {
    console.error('💥 Test function error:', err);
    return { success: false, error: err };
  }
};

// Get all departments
export const getDepartments = async (): Promise<Department[]> => {
  try {
    
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name', { ascending: true });

    console.log('📊 Supabase response:', { data, error });

    if (error) {
      console.error('❌ Error fetching departments:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    console.log('✅ Successfully fetched departments:', data?.length || 0, 'items');
    console.log('📋 Departments data:', data);
    return data || [];
  } catch (err) {
    console.error('💥 Unexpected error in getDepartments:', err);
    console.error('Error type:', typeof err);
    console.error('Error stack:', err instanceof Error ? err.stack : 'No stack available');
    
    // Return empty array to prevent app from breaking
    return [];
  }
};

// Get department by ID
export const getDepartmentById = async (id: string): Promise<Department | null> => {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching department:', error);
    throw error;
  }

  return data;
};

// Create new department (admin only)
export const createDepartment = async (department: Omit<Department, 'id' | 'created_at' | 'updated_at'>): Promise<Department> => {
  const { data, error } = await supabase
    .from('departments')
    .insert(department)
    .select()
    .single();

  if (error) {
    console.error('Error creating department:', error);
    throw error;
  }

  return data;
};

// Update department (admin only)
export const updateDepartment = async (id: string, updates: Partial<Department>): Promise<Department> => {
  const { data, error } = await supabase
    .from('departments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating department:', error);
    throw error;
  }

  return data;
};

// Delete department (admin only)
export const deleteDepartment = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('departments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
};
