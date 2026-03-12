import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Primary Supabase (existing - for media, blogs, etc.)
const PRIMARY_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://swwghoukwlnocpfkuluv.supabase.co';
const PRIMARY_SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Secondary Supabase (for job applications)
const SECONDARY_SUPABASE_URL = import.meta.env.VITE_SUPABASE_JOBS_URL || '';
const SECONDARY_SUPABASE_KEY = import.meta.env.VITE_SUPABASE_JOBS_ANON_KEY || '';

let primaryClient: SupabaseClient | null = null;
let secondaryClient: SupabaseClient | null = null;

/**
 * Get primary Supabase client (for media, blogs, etc.)
 */
export function getPrimarySupabase(): SupabaseClient {
  if (!primaryClient) {
    primaryClient = createClient(PRIMARY_SUPABASE_URL, PRIMARY_SUPABASE_KEY);
  }
  return primaryClient;
}

/**
 * Get secondary Supabase client (for job applications)
 */
export function getJobsSupabase(): SupabaseClient {
  // If no secondary configured, use primary
  if (!SECONDARY_SUPABASE_URL || !SECONDARY_SUPABASE_KEY) {
    console.log('No secondary Supabase configured, using primary');
    return getPrimarySupabase();
  }
  
  if (!secondaryClient) {
    secondaryClient = createClient(SECONDARY_SUPABASE_URL, SECONDARY_SUPABASE_KEY);
  }
  return secondaryClient;
}

/**
 * Check if secondary Supabase is configured
 */
export function hasSecondarySupabase(): boolean {
  return Boolean(SECONDARY_SUPABASE_URL && SECONDARY_SUPABASE_KEY);
}
