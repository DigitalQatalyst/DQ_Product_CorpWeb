import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdminAuth, requireServiceRoleConfigured } from "../_utils";

export async function GET(request: Request) {
  const unauthorized = await requireAdminAuth(request);
  if (unauthorized) return unauthorized;
  const missingKey = requireServiceRoleConfigured();
  if (missingKey) return missingKey;

  const { data, error } = await getSupabaseAdmin()
    .from("job_applications")
    .select(
      [
        "id",
        "job_id",
        "job_posting_id",
        "job_title",
        "first_name",
        "last_name",
        "email",
        "phone",
        "linkedin_url",
        "portfolio_url",
        "current_location",
        "years_of_experience",
        "current_company",
        "current_job_role",
        "notice_period",
        "expected_salary",
        "cover_letter",
        "resume_url",
        "resume_filename",
        "additional_documents_url",
        "additional_documents_filename",
        "application_status",
        "rejection_reason",
        "internal_notes",
        "status_history",
        "applied_at",
        "updated_at",
      ].join(","),
    )
    .order("applied_at", { ascending: false });

  if (error) {
    console.error("[admin/applications] list failed", error);
    return NextResponse.json({ applications: [] });
  }

  return NextResponse.json({ applications: data ?? [] });
}

