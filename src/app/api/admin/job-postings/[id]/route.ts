import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-admin-auth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type Params = Promise<{ id: string }>;

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const input = await request.json();
  const { data, error } = await getSupabaseAdmin()
    .from("job_postings")
    .update({
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
    .eq("id", Number(id))
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { error } = await getSupabaseAdmin()
    .from("job_postings")
    .delete()
    .eq("id", Number(id));

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
