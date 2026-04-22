import { supabaseBrowser } from "@/lib/supabaseBrowser";

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
  const { data, error } = await supabaseBrowser
    .from("job_applications")
    .select([
      "id", "job_id", "job_posting_id", "job_title",
      "first_name", "last_name", "email", "phone",
      "linkedin_url", "portfolio_url", "current_location",
      "years_of_experience", "current_company", "current_job_role",
      "notice_period", "expected_salary", "cover_letter",
      "resume_url", "resume_filename",
      "additional_documents_url", "additional_documents_filename",
      "application_status", "rejection_reason", "internal_notes",
      "status_history", "applied_at", "updated_at",
    ].join(","))
    .order("applied_at", { ascending: false });

  if (error) throw new Error(error.message);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []) as unknown as AdminJobApplication[];
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
  const { data: existing, error: getErr } = await supabaseBrowser
    .from("job_applications")
    .select("application_status,status_history")
    .eq("id", id)
    .maybeSingle();

  if (getErr || !existing) throw new Error("Application not found.");

  const prevStatus = (existing.application_status as string | null) ?? null;
  const prevHistory = (existing.status_history as unknown) ?? [];
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

  const { error } = await supabaseBrowser
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

  if (error) throw new Error(error.message);
}

export async function deleteAdminApplication(id: string): Promise<void> {
  const { error } = await supabaseBrowser
    .from("job_applications")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
