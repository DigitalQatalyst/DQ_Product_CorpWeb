import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-admin-auth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type Params = Promise<{ id: string }>;

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { error } = await getSupabaseAdmin()
    .from("job_locations")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

