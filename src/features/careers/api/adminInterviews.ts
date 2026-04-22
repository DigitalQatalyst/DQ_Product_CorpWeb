export type AdminInterview = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export async function listAdminInterviews(): Promise<AdminInterview[]> {
  const res = await fetch("/api/admin/interviews", { method: "GET" });
  if (!res.ok) throw new Error("Failed to load interviews.");
  const json = (await res.json()) as { interviews: AdminInterview[] };
  return json.interviews ?? [];
}

export async function scheduleAdminInterview(input: {
  applicationId: string;
  scheduledStartIso: string;
  durationMinutes: number;
  interviewType: string;
  notes?: string;
}) {
  const res = await fetch("/api/admin/interviews/schedule", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const text = await res.text().catch(() => "");
  if (!res.ok) throw new Error(text || "Failed to schedule interview.");
  return JSON.parse(text) as {
    ok: true;
    meetUrl: string | null;
    calendarEventId: string | null;
    calendarHtmlLink: string | null;
  };
}

