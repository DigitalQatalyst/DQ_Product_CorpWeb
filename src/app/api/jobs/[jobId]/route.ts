import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function parseJsonbArray(val: unknown): string[] {
  if (Array.isArray(val)) return val as string[];
  if (val && typeof val === "object" && "items" in val)
    return (val as { items: string[] }).items;
  if (typeof val === "string") {
    try {
      const p = JSON.parse(val);
      return Array.isArray(p) ? p : (p.items ?? []);
    } catch {
      return [];
    }
  }
  return [];
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params;
  const { data, error } = await supabase
    .from("job_postings")
    .select("*")
    .eq("id", Number(jobId))
    .single();

  if (error || !data) return NextResponse.json(null, { status: 404 });

  return NextResponse.json({
    id: data.id,
    title: data.title,
    department: data.department,
    location: data.location,
    type: data.type,
    level: data.level,
    description: data.description,
    requirements: parseJsonbArray(data.requirements),
    responsibilities: parseJsonbArray(data.responsibilities),
    skills: data.skills,
    openPositions: data.open_positions,
    postedDate: data.posted_date || data.created_at,
  });
}
