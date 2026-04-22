import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdminAuth, requireServiceRoleConfigured } from "../../_utils";

type Status =
  | "pending"
  | "reviewing"
  | "shortlisted"
  | "accepted"
  | "rejected";

type Body = {
  status?: Status;
  rejectionReason?: string | null;
  internalNotes?: string | null;
  notifyMessage?: string | null;
};

function cleanNullable(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s ? s : null;
}

async function notifyApplicant(opts: {
  email: string;
  subject: string;
  message: string;
}) {
  // No email provider wired in this repo yet.
  // Keep it explicit so it’s easy to integrate (Resend/Postmark/etc.) later.
  console.info("[admin/applications] notifyApplicant (stub)", opts);
  return { notified: false as const };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauthorized = await requireAdminAuth(request);
  if (unauthorized) return unauthorized;
  const missingKey = requireServiceRoleConfigured();
  if (missingKey) return missingKey;

  const { id } = await params;
  const appId = id;

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const status = body.status;
  const rejectionReason = cleanNullable(body.rejectionReason);
  const internalNotes = cleanNullable(body.internalNotes);
  const notifyMessage = cleanNullable(body.notifyMessage);

  if (!status) {
    return NextResponse.json({ error: "status is required." }, { status: 400 });
  }

  const admin = getSupabaseAdmin();

  const { data: existing, error: getErr } = await admin
    .from("job_applications")
    .select("id,email,first_name,last_name,job_title,application_status,status_history")
    .eq("id", appId)
    .maybeSingle();

  if (getErr || !existing) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  const prevStatus = (existing.application_status as string | null) ?? null;
  const prevHistory = (existing.status_history as unknown) ?? [];
  const historyArray = Array.isArray(prevHistory) ? prevHistory : [];
  const now = new Date().toISOString();

  const nextHistory = [
    ...historyArray,
    {
      at: now,
      from: prevStatus,
      to: status,
      message:
        status === "rejected"
          ? rejectionReason
          : status === "accepted"
            ? notifyMessage
            : null,
    },
  ];

  const patch: Record<string, unknown> = {
    application_status: status,
    status_changed_at: now,
    rejection_reason: status === "rejected" ? rejectionReason : null,
    internal_notes: internalNotes,
    status_history: nextHistory,
    updated_at: now,
  };

  const { error: upErr } = await admin
    .from("job_applications")
    .update(patch)
    .eq("id", appId);

  if (upErr) {
    console.error("[admin/applications] update failed", upErr);
    return NextResponse.json({ error: upErr.message }, { status: 400 });
  }

  let notify = { notified: false as const };
  if ((status === "rejected" || status === "accepted") && notifyMessage) {
    const subject =
      status === "rejected"
        ? `Update on your application: ${existing.job_title}`
        : `Next steps: ${existing.job_title}`;
    notify = await notifyApplicant({
      email: existing.email as string,
      subject,
      message: notifyMessage,
    });
  }

  return NextResponse.json({ ok: true, ...notify });
}

