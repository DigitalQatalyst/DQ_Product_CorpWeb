import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const rawUrl = (import.meta as any)?.env?.VITE_SUPABASE_URL
const rawKey = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY
const rawServiceKey = (import.meta as any)?.env?.VITE_SUPABASE_SERVICE_ROLE_KEY
const SUPABASE_URL = typeof rawUrl === 'string' ? rawUrl.trim() : 'https://juukvchxgaycuuvzbpbp.supabase.co'
const SUPABASE_ANON_KEY = typeof rawKey === 'string' ? rawKey.trim() : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1dWt2Y2h4Z2F5Y3V1dnpicGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MzgyMTksImV4cCI6MjA4OTMxNDIxOX0.yqDvVQtWRCzokwV3hmtJNQqglbNQcIW0fljagvuficw'
const SUPABASE_SERVICE_KEY = typeof rawServiceKey === 'string' ? rawServiceKey.trim() : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1dWt2Y2h4Z2F5Y3V1dnpicGJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzczODIxOSwiZXhwIjoyMDg5MzE0MjE5fQ.3-LDvkNi7NuJmoIe3rrqVmuToV-_StSVq89WN5VZO9Y'

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
  _client = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
  return _client
}

export function getSupabaseAdmin(): SupabaseClient<Database> {
  console.log("checking connection....")
  if (_adminClient) return _adminClient
  
  // Try service role key first
  if (SUPABASE_SERVICE_KEY && isSupabaseAdminConfigured()) {
    console.log('Using service role key for admin operations');
    _adminClient = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        lock: undefined, // Disable Navigator LockManager
      }
    })
    return _adminClient
  }

  // Fallback: try using anon key with elevated privileges
  if (SUPABASE_ANON_KEY && isSupabaseConfigured()) {
    console.warn('Service role key invalid. Using regular client as fallback. Some admin operations may be limited.');
    console.warn('To fix this, generate a new service role key in Supabase Dashboard → Settings → API');
    
    _adminClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        lock: undefined, // Disable Navigator LockManager
      }
    })
    return _adminClient
  }

  const msg = `Supabase not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local (current url: "${SUPABASE_URL || 'undefined'}"). Restart dev server after changes.`
  throw new Error(msg)
}
