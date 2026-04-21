import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdminAuth, requireServiceRoleConfigured } from "../../_utils";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauthorized = await requireAdminAuth(request);
  if (unauthorized) return unauthorized;
  const missingKey = requireServiceRoleConfigured();
  if (missingKey) return missingKey;

  const { id } = await params;
  const body = (await request.json()) as {
    role?: string;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
  };

  const patch: {
    role?: string;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
  } = {};

  if (body.role !== undefined) {
    const r = String(body.role).trim().toLowerCase();
    if (r !== "user" && r !== "admin") {
      return NextResponse.json({ error: "Role must be user or admin" }, { status: 400 });
    }
    patch.role = r;
  }
  if (body.first_name !== undefined) patch.first_name = body.first_name;
  if (body.last_name !== undefined) patch.last_name = body.last_name;
  if (body.email !== undefined) patch.email = body.email;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("profiles")
    .update(patch)
    .eq("id", id)
    .select("id,email,first_name,last_name,full_name,role,avatar_url,created_at,updated_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ profile: data });
}
