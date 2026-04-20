import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function requireAdminAuth(request: Request): Promise<NextResponse | null> {
  // Temporary dev escape hatch
  const expectedToken = process.env.ADMIN_TOKEN;
  const gotToken = request.headers.get("x-admin-token") ?? "";
  if (expectedToken && gotToken === expectedToken) return null;

  const authz = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(authz);
  const jwt = match?.[1];
  if (!jwt) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin.auth.getUser(jwt);
    if (error || !data?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = data.user;
    const email = user.email ?? "";
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // allowlist check
    const { data: row } = await admin
      .from("admin_users")
      .select("is_active")
      .eq("user_id", user.id)
      .single();

    if (!row?.is_active) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return null;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export function requireServiceRoleConfigured(): NextResponse | null {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  return NextResponse.json(
    { error: "SUPABASE_SERVICE_ROLE_KEY is not configured on the server." },
    { status: 500 },
  );
}

