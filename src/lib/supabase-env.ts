/**
 * Supabase env resolution.
 * Supports new platform keys (sb_publishable_… / sb_secret_…) and legacy JWT anon / service_role.
 */

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required (Project Settings → API → Project URL).");
  }
  return url;
}

/** Browser + public anon client (publishable replaces legacy anon JWT). */
export function getSupabasePublishableKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!key) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (new) or NEXT_PUBLIC_SUPABASE_ANON_KEY (legacy).",
    );
  }
  return key;
}

/** Server-only elevated access (secret replaces legacy service_role JWT). */
export function getSupabaseSecretKey(): string {
  const key =
    process.env.SUPABASE_SECRET_KEY?.trim() ?? process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) {
    throw new Error(
      "Set SUPABASE_SECRET_KEY (new) or SUPABASE_SERVICE_ROLE_KEY (legacy) on the server only.",
    );
  }
  return key;
}

export function hasSupabaseSecretKey(): boolean {
  return !!(
    process.env.SUPABASE_SECRET_KEY?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}
