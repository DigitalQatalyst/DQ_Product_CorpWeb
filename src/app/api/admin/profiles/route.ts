import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdminAuth, requireServiceRoleConfigured } from "../_utils";

export async function GET(request: Request) {
  const unauthorized = await requireAdminAuth(request);
  if (unauthorized) return unauthorized;
  const missingKey = requireServiceRoleConfigured();
  if (missingKey) return missingKey;

  const { data, error } = await getSupabaseAdmin()
    .from("profiles")
    .select("id,email,first_name,last_name,full_name,role,avatar_url,created_at,updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ profiles: data ?? [] });
}
