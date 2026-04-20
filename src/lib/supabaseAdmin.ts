import { createClient } from "@supabase/supabase-js";
import { getSupabaseSecretKey, getSupabaseUrl } from "@/lib/supabase-env";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached: any = null;

export function getSupabaseAdmin(): any {
  if (cached) return cached;

  cached = createClient(getSupabaseUrl(), getSupabaseSecretKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
