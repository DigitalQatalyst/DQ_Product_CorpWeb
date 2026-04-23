/**
 * Shared helper for admin API route handlers.
 * Returns the authenticated admin userId or null.
 *
 * Auth strategy (in order):
 *  1. Cookie session — set by Supabase SSR after sign-in
 *  2. Bearer token  — fallback for non-browser clients / CLI tools
 *
 * Role check (in order):
 *  1. JWT claims (user_metadata / app_metadata) — fast, no DB round-trip
 *  2. profiles table — fallback when claims are stale or absent
 */
import { createServerClient } from "@supabase/ssr";
import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminProfileRole } from "@/lib/admin-role";

export async function getAdminUserId(request: NextRequest): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: () => {},
    },
  });

  // ── 1. Resolve user from cookie session ──────────────────────────────────
  let userId: string | null = null;
  let claimRole: string | undefined;

  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    userId = user.id;
    claimRole =
      (user.user_metadata?.role as string | undefined) ??
      (user.app_metadata?.role as string | undefined);

    // Fast path — role already in JWT claims
    if (isAdminProfileRole(claimRole)) return userId;
  }

  // ── 2. Fall back to Bearer token ─────────────────────────────────────────
  if (!userId) {
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (token) {
      const { data: { user: tokenUser } } = await supabase.auth.getUser(token);
      if (tokenUser) {
        userId = tokenUser.id;
        claimRole =
          (tokenUser.user_metadata?.role as string | undefined) ??
          (tokenUser.app_metadata?.role as string | undefined);

        if (isAdminProfileRole(claimRole)) return userId;
      }
    }
  }

  if (!userId) return null;

  // ── 3. Slow path — check profiles table (stale/absent JWT claims) ────────
  const { data: profile } = await getSupabaseAdmin()
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  return isAdminProfileRole(profile?.role as string | undefined) ? userId : null;
}
