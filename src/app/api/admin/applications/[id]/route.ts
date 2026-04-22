import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-admin-auth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type Params = Promise<{ id: string }>;

export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const input = await request.json();
  const db = getSupabaseAdmin();

  const { data: existing, error: getErr } = await db
    .from("job_applications")
    .select("application_status,status_history")
    .eq("id", id)
    .maybeSingle();

  if (getErr || !existing) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  const prevStatus = (existing.application_status as string | null) ?? null;
  const prevHistory = existing.status_history ?? [];
  const historyArray = Array.isArray(prevHistory) ? prevHistory : [];
  const now = new Date().toISOString();

  const nextHistory = [
    ...historyArray,
    {
      at: now,
      from: prevStatus,
      to: input.status,
      message: input.status === "rejected" ? (input.rejectionReason ?? null) : null,
    },
  ];

  const { error } = await db
    .from("job_applications")
    .update({
      application_status: input.status,
      status_changed_at: now,
      rejection_reason: input.status === "rejected" ? (input.rejectionReason ?? null) : null,
      internal_notes: input.internalNotes ?? null,
      status_history: nextHistory,
      updated_at: now,
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { error } = await getSupabaseAdmin()
    .from("job_applications")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
