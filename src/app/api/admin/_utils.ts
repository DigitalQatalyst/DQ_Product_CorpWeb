import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { hasSupabaseSecretKey } from "@/lib/supabase-env";
import { isAdminProfileRole } from "@/lib/admin-role";

export type AdminAuthResult =
  | { ok: true }
  | { ok: false; response: NextResponse };

/**
 * Validates ADMIN_TOKEN, or Bearer user JWT + `public.profiles.role` = `admin`.
 */
export async function authenticateAdminRequest(request: Request): Promise<AdminAuthResult> {
  const expectedToken = process.env.ADMIN_TOKEN;
  const gotToken = request.headers.get("x-admin-token") ?? "";
  if (expectedToken && gotToken === expectedToken) {
    return { ok: true };
  }

  const authz = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(authz);
  const jwt = match?.[1];
  if (!jwt) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin.auth.getUser(jwt);
    if (error || !data?.user) {
      return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }

    const user = data.user;
    if (!user.email) {
      return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }

    const { data: profile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!isAdminProfileRole(profile?.role as string | undefined)) {
      return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    }
    return { ok: true };
  } catch {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
}

export async function requireAdminAuth(request: Request): Promise<NextResponse | null> {
  const missingKey = requireServiceRoleConfigured();
  if (missingKey) return missingKey;

  const result = await authenticateAdminRequest(request);
  if (!result.ok) return result.response;
  return null;
}

export function requireServiceRoleConfigured(): NextResponse | null {
  if (hasSupabaseSecretKey()) return null;
  return NextResponse.json(
    {
      error:
        "Server Supabase secret is not configured. Set SUPABASE_SECRET_KEY (new) or SUPABASE_SERVICE_ROLE_KEY (legacy).",
    },
    { status: 500 },
  );
}
