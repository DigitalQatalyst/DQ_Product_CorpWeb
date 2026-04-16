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

export async function GET() {
  const { data, error } = await supabase
    .from("job_postings")
    .select("*")
    .eq("status", "open")
    .order("posted_date", { ascending: false });

  if (error) return NextResponse.json([]);

  return NextResponse.json(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data ?? []).map((j: any) => ({
      id: j.id,
      title: j.title,
      department: j.department,
      location: j.location,
      type: j.type,
      level: j.level,
      description: j.description,
      requirements: parseJsonbArray(j.requirements),
      responsibilities: parseJsonbArray(j.responsibilities),
      skills: j.skills,
      openPositions: j.open_positions,
      postedDate: j.posted_date || j.created_at,
    })),
  );
}
