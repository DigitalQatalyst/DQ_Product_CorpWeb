export type AdminInterview = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(path, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function listAdminInterviews(): Promise<AdminInterview[]> {
  return apiFetch("/api/admin/interviews");
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
  return apiFetch("/api/admin/interviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}
