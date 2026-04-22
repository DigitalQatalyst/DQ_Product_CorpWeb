import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { hasSupabaseSecretKey } from "@/lib/supabase-env";
import { isAdminProfileRole } from "@/lib/admin-role";

export type AdminAuthResult =
  | { ok: true; userId: string }
  | { ok: false; response: NextResponse };

/**
 * Authenticates an admin API request.
 * Reads the session from cookies (set by @supabase/ssr) and verifies the user
 * has the admin role in the profiles table.
 */
export async function authenticateAdminRequest(
  request: NextRequest | Request,
): Promise<AdminAuthResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Build a response to capture any cookie refreshes
  const response = new NextResponse();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () =>
        "cookies" in request && typeof (request as NextRequest).cookies?.getAll === "function"
          ? (request as NextRequest).cookies.getAll()
          : [],
      setAll: (toSet) =>
        toSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        ),
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Also try Bearer token from Authorization header
    const authHeader =
      "headers" in request
        ? (request as Request).headers.get("authorization")
        : null;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (token) {
      const { data: tokenUser } = await supabase.auth.getUser(token);
      if (tokenUser.user) {
        const claimRole =
          (tokenUser.user.user_metadata?.role as string | undefined) ??
          (tokenUser.user.app_metadata?.role as string | undefined);
        if (isAdminProfileRole(claimRole)) return { ok: true, userId: tokenUser.user.id };

        const admin = getSupabaseAdmin();
        const { data: profile } = await admin
          .from("profiles")
          .select("role")
          .eq("id", tokenUser.user.id)
          .maybeSingle();
        if (isAdminProfileRole(profile?.role as string | undefined)) {
          return { ok: true, userId: tokenUser.user.id };
        }
        return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
      }
    }

    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  // Fast path: role already in JWT claims
  const claimRole =
    (user.user_metadata?.role as string | undefined) ??
    (user.app_metadata?.role as string | undefined);

  if (isAdminProfileRole(claimRole)) {
    return { ok: true, userId: user.id };
  }

  // Slow path: check profiles table
  const admin = getSupabaseAdmin();
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!isAdminProfileRole(profile?.role as string | undefined)) {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { ok: true, userId: user.id };
}

export async function requireAdminAuth(
  request: NextRequest | Request,
): Promise<NextResponse | null> {
  const missingKey = requireServiceRoleConfigured();
  if (missingKey) return missingKey;

  const result = await authenticateAdminRequest(request);
  if (!result.ok) return result.response;
  return null;
}

export function requireServiceRoleConfigured(): NextResponse | null {
  if (hasSupabaseSecretKey()) return null;
  return NextResponse.json(
    { error: "SUPABASE_SECRET_KEY is not configured on the server." },
    { status: 500 },
  );
}
