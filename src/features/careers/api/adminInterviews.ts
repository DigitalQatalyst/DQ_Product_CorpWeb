import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { createCalendarEventWithMeet, hasGoogleCalendarConfig } from "@/lib/googleCalendar";

export type AdminInterview = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export async function listAdminInterviews(): Promise<AdminInterview[]> {
  const { data, error } = await supabaseBrowser
    .from("interviews")
    .select("*")
    .order("scheduled_date", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as AdminInterview[];
}

export async function scheduleAdminInterview(input: {
  applicationId: string;
  scheduledStartIso: string;
  durationMinutes: number;
  interviewType: string;
  notes?: string;
}): Promise<{
  meetUrl: string | null;
  calendarEventId: string | null;
  calendarHtmlLink: string | null;
}> {
  const start = new Date(input.scheduledStartIso);
  const end = new Date(start.getTime() + input.durationMinutes * 60 * 1000);

  const { data: app, error: appErr } = await supabaseBrowser
    .from("job_applications")
    .select("id,job_title,first_name,last_name,email")
    .eq("id", input.applicationId)
    .maybeSingle();

  if (appErr || !app) throw new Error("Application not found.");

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
      console.error("[scheduleAdminInterview] Google Calendar failed", e);
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

  const attempts: Record<string, unknown>[] = [
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
    const { error } = await supabaseBrowser.from("interviews").insert(row).select("*").maybeSingle();
    if (!error) return { meetUrl, calendarEventId, calendarHtmlLink };
    lastErr = error.message ?? "Insert failed.";
    const schemaish = lastErr.includes("column") || lastErr.includes("does not exist");
    if (!schemaish) throw new Error(lastErr);
  }

  throw new Error(lastErr ?? "Failed to schedule interview.");
}
