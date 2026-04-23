import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-admin-auth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { createCalendarEventWithMeet, hasGoogleCalendarConfig } from "@/lib/googleCalendar";

export async function GET(request: NextRequest) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await getSupabaseAdmin()
    .from("interviews")
    .select("*")
    .order("scheduled_date", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const input = await request.json();
  const db = getSupabaseAdmin();

  const start = new Date(input.scheduledStartIso);
  const end = new Date(start.getTime() + input.durationMinutes * 60 * 1000);

  const { data: app, error: appErr } = await db
    .from("job_applications")
    .select("id,job_title,first_name,last_name,email")
    .eq("id", input.applicationId)
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
        description: input.notes ?? undefined,
        startIso: start.toISOString(),
        endIso: end.toISOString(),
        attendeeEmail: app.email as string,
      });
      meetUrl = created.meetLink;
      calendarEventId = created.eventId;
      calendarHtmlLink = created.htmlLink;
    } catch (e) {
      console.error("[interviews] Google Calendar failed", e);
    }
  }

  const baseRow: Record<string, unknown> = {
    candidate_name: candidateName,
    scheduled_date: start.toISOString(),
    interview_type: input.interviewType,
    status: "scheduled",
    meet_url: meetUrl,
    calendar_event_id: calendarEventId,
    calendar_html_link: calendarHtmlLink,
    notes: input.notes ?? null,
    application_id: input.applicationId,
  };

  const attempts = [
    baseRow,
    {
      candidate_name: candidateName,
      scheduled_date: start.toISOString(),
      interview_type: input.interviewType,
      status: "scheduled",
    },
  ];

  let lastErr: string | null = null;
  for (const row of attempts) {
    const { error } = await db.from("interviews").insert(row).select("*").maybeSingle();
    if (!error) {
      return NextResponse.json({ meetUrl, calendarEventId, calendarHtmlLink }, { status: 201 });
    }
    lastErr = error.message ?? "Insert failed.";
    const schemaish = lastErr!.includes("column") || lastErr!.includes("does not exist");
    if (!schemaish) return NextResponse.json({ error: lastErr }, { status: 500 });
  }

  return NextResponse.json({ error: lastErr ?? "Failed to schedule interview." }, { status: 500 });
}
