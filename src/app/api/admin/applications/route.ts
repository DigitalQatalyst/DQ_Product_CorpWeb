import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-admin-auth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const FIELDS = [
  "id", "job_id", "job_posting_id", "job_title",
  "first_name", "last_name", "email", "phone",
  "linkedin_url", "portfolio_url", "current_location",
  "years_of_experience", "current_company", "current_job_role",
  "notice_period", "expected_salary", "cover_letter",
  "resume_url", "resume_filename",
  "additional_documents_url", "additional_documents_filename",
  "application_status", "rejection_reason", "internal_notes",
  "status_history", "applied_at", "updated_at",
].join(",");

export async function GET(request: NextRequest) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await getSupabaseAdmin()
    .from("job_applications")
    .select(FIELDS)
    .order("applied_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
