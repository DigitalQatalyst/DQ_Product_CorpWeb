import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-admin-auth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await getSupabaseAdmin()
    .from("sectors")
    .select("*")
    .order("sector_group_id")
    .order("sort_order");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const input = await request.json();
  const { data, error } = await getSupabaseAdmin()
    .from("sectors")
    .insert(toRow(input))
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRow(input: any) {
  return {
    id: input.id,
    slug: input.slug,
    name: input.name,
    title: input.title,
    subtitle: input.subtitle,
    focus: input.focus,
    sector_group_id: input.sectorGroupId,
    icon_name: input.iconName,
    hero_image: input.heroImage,
    overview_image: input.overviewImage ?? null,
    overview_video: input.overviewVideo ?? null,
    overview_description: input.overviewDescription ?? null,
    technologies: input.technologies ?? [],
    benefits: input.benefits ?? [],
    use_cases: input.useCases ?? [],
    stats: input.stats ?? [],
    core_pillars: input.corePillars ?? [],
    why_reasons: input.whyReasons ?? [],
    key_benefits: input.keyBenefits ?? [],
    where_to_start_items: input.whereToStartItems ?? [],
    focus_areas_items: input.focusAreasItems ?? [],
    sort_order: input.sortOrder ?? 0,
  };
}
