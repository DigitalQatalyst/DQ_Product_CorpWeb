import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-admin-auth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getSupabaseAdmin();
  const now = new Date().toISOString();

  const [appsRes, interviewsRes, postingsRes, usersRes] = await Promise.all([
    db.from("job_applications")
      .select("id,first_name,last_name,job_title,application_status,applied_at")
      .order("applied_at", { ascending: false }),
    db.from("interviews")
      .select("id,candidate_name,scheduled_date,interview_type,status")
      .order("scheduled_date", { ascending: false }),
    db.from("job_postings")
      .select("id,title,location,type,status")
      .order("created_at", { ascending: false }),
    db.from("admin_users")
      .select("id,is_active")
      .order("created_at", { ascending: false }),
  ]);

  const applications = appsRes.data ?? [];
  const interviews = (interviewsRes.data ?? []).filter(
    (iv: { status: string; scheduled_date: string }) =>
      iv.status === "scheduled" && iv.scheduled_date > now,
  );
  const postings = postingsRes.data ?? [];
  const adminUsers = usersRes.data ?? [];

  return NextResponse.json({
    applications,
    interviews,
    postings,
    adminUsers,
  });
}
