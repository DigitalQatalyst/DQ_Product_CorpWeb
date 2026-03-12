/**
 * Debug script to check environment variables
 */

export function debugEnvironmentVariables() {
  console.log('🔍 Environment Variables Debug:');
  console.log('');
  
  // Check import.meta.env
  console.log('import.meta.env:', import.meta.env);
  console.log('');
  
  // Check specific Supabase variables
  const supabaseUrl = (import.meta as any)?.env?.VITE_SUPABASE_URL;
  const anonKey = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY;
  const serviceKey = (import.meta as any)?.env?.VITE_SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('VITE_SUPABASE_URL:', supabaseUrl);
  console.log('VITE_SUPABASE_ANON_KEY:', anonKey ? `${anonKey.substring(0, 20)}...` : 'undefined');
  console.log('VITE_SUPABASE_SERVICE_ROLE_KEY:', serviceKey ? `${serviceKey.substring(0, 20)}...` : 'undefined');
  console.log('');
  
  // Check types
  console.log('Types:');
  console.log('  VITE_SUPABASE_URL type:', typeof supabaseUrl);
  console.log('  VITE_SUPABASE_ANON_KEY type:', typeof anonKey);
  console.log('  VITE_SUPABASE_SERVICE_ROLE_KEY type:', typeof serviceKey);
  console.log('');
  
  // Check if they're strings and not empty
  console.log('Validation:');
  console.log('  URL valid:', Boolean(supabaseUrl && typeof supabaseUrl === 'string' && supabaseUrl.trim()));
  console.log('  Anon key valid:', Boolean(anonKey && typeof anonKey === 'string' && anonKey.trim()));
  console.log('  Service key valid:', Boolean(serviceKey && typeof serviceKey === 'string' && serviceKey.trim()));
}