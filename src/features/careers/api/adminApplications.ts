export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "shortlisted"
  | "accepted"
  | "rejected";

export type AdminJobApplication = {
  id: string;
  job_id: number;
  job_posting_id: number | null;
  job_title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  linkedin_url: string | null;
  portfolio_url: string | null;
  current_location: string;
  years_of_experience: string;
  current_company: string | null;
  current_job_role: string | null;
  notice_period: string;
  expected_salary: string | null;
  cover_letter: string;
  resume_url: string;
  resume_filename: string;
  additional_documents_url: string | null;
  additional_documents_filename: string | null;
  application_status: ApplicationStatus | null;
  rejection_reason: string | null;
  internal_notes: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  status_history: any[] | null;
  applied_at: string | null;
  updated_at: string | null;
};

export async function listAdminApplications(): Promise<AdminJobApplication[]> {
  const res = await fetch("/api/admin/applications", { method: "GET" });
  if (!res.ok) throw new Error("Failed to load applications.");
  const json = (await res.json()) as { applications: AdminJobApplication[] };
  return json.applications ?? [];
}

export async function updateAdminApplication(
  id: string,
  input: {
    status: ApplicationStatus;
    rejectionReason?: string | null;
    internalNotes?: string | null;
    notifyMessage?: string | null;
  },
) {
  const res = await fetch(`/api/admin/applications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const text = await res.text().catch(() => "");
  if (!res.ok) throw new Error(text || "Failed to update application.");
  return JSON.parse(text) as { ok: true; notified: boolean };
}

export async function deleteAdminApplication(id: string) {
  const res = await fetch(`/api/admin/applications/${id}`, { method: "DELETE" });
  const text = await res.text().catch(() => "");
  if (!res.ok) throw new Error(text || "Failed to delete application.");
  return JSON.parse(text) as { ok: true };
}

