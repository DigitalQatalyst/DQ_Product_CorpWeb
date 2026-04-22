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

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(path, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function listAdminApplications(): Promise<AdminJobApplication[]> {
  return apiFetch("/api/admin/applications");
}

export async function updateAdminApplication(
  id: string,
  input: {
    status: ApplicationStatus;
    rejectionReason?: string | null;
    internalNotes?: string | null;
    notifyMessage?: string | null;
  },
): Promise<void> {
  await apiFetch(`/api/admin/applications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function deleteAdminApplication(id: string): Promise<void> {
  await apiFetch(`/api/admin/applications/${id}`, { method: "DELETE" });
}
