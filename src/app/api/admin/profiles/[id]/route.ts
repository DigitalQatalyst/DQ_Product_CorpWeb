import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-admin-auth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const SELECT = "id,email,first_name,last_name,full_name,role,avatar_url,created_at,updated_at";

type Params = Promise<{ id: string }>;

export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const patch = await request.json();

  const update: Record<string, unknown> = {};
  if (patch.role !== undefined) {
    const r = String(patch.role).trim().toLowerCase();
    if (r !== "user" && r !== "admin")
      return NextResponse.json({ error: "Role must be user or admin" }, { status: 400 });
    update.role = r;
  }
  if (patch.first_name !== undefined) update.first_name = patch.first_name;
  if (patch.last_name !== undefined) update.last_name = patch.last_name;
  if (patch.email !== undefined) update.email = patch.email;

  if (Object.keys(update).length === 0)
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });

  const { data, error } = await getSupabaseAdmin()
    .from("profiles")
    .update(update)
    .eq("id", id)
    .select(SELECT)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
