import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const rawUrl = (import.meta as any)?.env?.VITE_SUPABASE_URL
const rawKey = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY
const rawServiceKey = (import.meta as any)?.env?.VITE_SUPABASE_SERVICE_ROLE_KEY
const SUPABASE_URL = typeof rawUrl === 'string' ? rawUrl.trim() : 'https://swwghoukwlnocpfkuluv.supabase.co'
const SUPABASE_ANON_KEY = typeof rawKey === 'string' ? rawKey.trim() : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3d2dob3Vrd2xub2NwZmt1bHV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NDQzODEsImV4cCI6MjA4MTQyMDM4MX0.SwGGjGOTRDD24oQKBbsoq4lydlnbH-ONXXgLHCRKBN8'
const SUPABASE_SERVICE_KEY = typeof rawServiceKey === 'string' ? rawServiceKey.trim() : ''

let _client: SupabaseClient<Database> | null = null
let _adminClient: SupabaseClient<Database> | null = null

export const isSupabaseConfigured = () =>
  Boolean(SUPABASE_URL && /^https?:\/\//i.test(SUPABASE_URL) && SUPABASE_ANON_KEY)

export const isSupabaseAdminConfigured = () =>
  Boolean(SUPABASE_URL && /^https?:\/\//i.test(SUPABASE_URL) && SUPABASE_SERVICE_KEY)

export function getSupabase(): SupabaseClient<Database> {
  if (_client) return _client
  if (!isSupabaseConfigured()) {
    const msg = `Supabase not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local (current url: "${SUPABASE_URL || 'undefined'}"). Restart the dev server after changes.`
    throw new Error(msg)
  }
  _client = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      lock: undefined, // Disable Navigator LockManager to prevent timeout issues
    },
  })
  return _client
}

export function getSupabaseAdmin(): SupabaseClient<Database> {
  console.log("checking connection....")
  if (_adminClient) return _adminClient
  
  // For development, fall back to regular client if no service key
  if (!SUPABASE_SERVICE_KEY) {
    console.warn('No service role key found. Using regular client for admin operations. This may cause RLS issues.')
    console.warn('To fix RLS issues, add VITE_SUPABASE_SERVICE_ROLE_KEY to your .env.local file')
    return getSupabase()
  }
  
  if (!isSupabaseAdminConfigured()) {
    const msg = `Supabase admin not configured. Check VITE_SUPABASE_SERVICE_ROLE_KEY in .env.local`
    throw new Error(msg)
  }
  
  _adminClient = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      lock: undefined, // Disable Navigator LockManager to prevent timeout issues
    }
  })
  return _adminClient
}
