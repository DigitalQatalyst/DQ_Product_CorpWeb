import { createClient } from "@supabase/supabase-js";

// This app doesn't currently use generated Supabase `Database` types.
// We intentionally keep this client loosely typed to avoid `never` types for table names.
let cached: any = null;

export function getSupabaseAdmin(): any {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is required.");
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required.");

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

