import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-admin-auth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await getSupabaseAdmin()
    .from("job_postings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const input = await request.json();
  const { data, error } = await getSupabaseAdmin()
    .from("job_postings")
    .insert({
      title: input.title,
      department: input.department,
      location: input.location,
      type: input.type,
      level: input.level,
      description: input.description,
      requirements: input.requirements,
      responsibilities: input.responsibilities,
      skills: input.skills ?? null,
      open_positions: input.openPositions ?? null,
      posted_date: input.postedDate ?? null,
      status: input.status,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
