import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdminAuth, requireServiceRoleConfigured } from "../../_utils";
import { createCalendarEventWithMeet, hasGoogleCalendarConfig } from "@/lib/googleCalendar";

type Body = {
  applicationId?: string;
  scheduledStartIso?: string;
  durationMinutes?: number;
  interviewType?: string;
  notes?: string;
};

function cleanString(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s ? s : null;
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminAuth(request);
  if (unauthorized) return unauthorized;
  const missingKey = requireServiceRoleConfigured();
  if (missingKey) return missingKey;

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const applicationId = cleanString(body.applicationId);
  const scheduledStartIso = cleanString(body.scheduledStartIso);
  const interviewType = cleanString(body.interviewType) ?? "Google Meet";
  const notes = cleanString(body.notes);
  const durationMinutes =
    typeof body.durationMinutes === "number" ? body.durationMinutes : Number(body.durationMinutes);

  if (!applicationId || !scheduledStartIso || !Number.isFinite(durationMinutes)) {
    return NextResponse.json(
      { error: "applicationId, scheduledStartIso, durationMinutes are required." },
      { status: 400 },
    );
  }

  const start = new Date(scheduledStartIso);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  const endIso = end.toISOString();

  const admin = getSupabaseAdmin();
  const { data: app, error: appErr } = await admin
    .from("job_applications")
    .select("id,job_title,first_name,last_name,email")
    .eq("id", applicationId)
    .maybeSingle();

  if (appErr || !app) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  const candidateName = `${app.first_name ?? ""} ${app.last_name ?? ""}`.trim();

  let meetUrl: string | null = null;
  let calendarEventId: string | null = null;
  let calendarHtmlLink: string | null = null;

  if (hasGoogleCalendarConfig()) {
    try {
      const created = await createCalendarEventWithMeet({
        summary: `Interview: ${candidateName} — ${app.job_title}`,
        description: notes ?? undefined,
        startIso: start.toISOString(),
        endIso,
        attendeeEmail: app.email as string,
      });
      meetUrl = created.meetLink;
      calendarEventId = created.eventId;
      calendarHtmlLink = created.htmlLink;
    } catch (e) {
      console.error("[admin/interviews] google create failed", e);
      // Continue: we still save the interview row.
    }
  }

  const baseRow: Record<string, unknown> = {
    candidate_name: candidateName,
    scheduled_date: start.toISOString(),
    interview_type: interviewType,
    status: "scheduled",
    meet_url: meetUrl,
    calendar_event_id: calendarEventId,
    calendar_html_link: calendarHtmlLink,
    notes,
    application_id: applicationId,
  };

  // Be tolerant to table shape differences.
  const attempts: Record<string, unknown>[] = [
    baseRow,
    // Minimal columns known to exist from AdminDashboard types.
    {
      candidate_name: candidateName,
      scheduled_date: start.toISOString(),
      interview_type: interviewType,
      status: "scheduled",
    },
  ];

  let lastErr: string | null = null;
  for (const row of attempts) {
    const { error } = await admin.from("interviews").insert(row).select("*").maybeSingle();
    if (!error) {
      return NextResponse.json(
        { ok: true, meetUrl, calendarEventId, calendarHtmlLink },
        { status: 201 },
      );
    }
    lastErr = error.message ?? "Insert failed.";
    // If it's a schema error, try fallback; otherwise return.
    const msg = lastErr;
    const schemaish = msg.includes("column") || msg.includes("does not exist");
    if (!schemaish) {
      return NextResponse.json({ error: msg }, { status: 400 });
    }
  }

  return NextResponse.json({ error: lastErr ?? "Failed to schedule interview." }, { status: 500 });
}

