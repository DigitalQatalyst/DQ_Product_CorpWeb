import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-admin-auth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type Params = Promise<{ id: string }>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPatch(input: any): Record<string, unknown> {
  const p: Record<string, unknown> = {};
  if (input.id !== undefined) p.id = input.id;
  if (input.slug !== undefined) p.slug = input.slug;
  if (input.name !== undefined) p.name = input.name;
  if (input.title !== undefined) p.title = input.title;
  if (input.subtitle !== undefined) p.subtitle = input.subtitle;
  if (input.focus !== undefined) p.focus = input.focus;
  if (input.sectorGroupId !== undefined) p.sector_group_id = input.sectorGroupId;
  if (input.iconName !== undefined) p.icon_name = input.iconName;
  if (input.heroImage !== undefined) p.hero_image = input.heroImage;
  if (input.overviewImage !== undefined) p.overview_image = input.overviewImage;
  if (input.overviewVideo !== undefined) p.overview_video = input.overviewVideo;
  if (input.overviewDescription !== undefined) p.overview_description = input.overviewDescription;
  if (input.technologies !== undefined) p.technologies = input.technologies;
  if (input.benefits !== undefined) p.benefits = input.benefits;
  if (input.useCases !== undefined) p.use_cases = input.useCases;
  if (input.stats !== undefined) p.stats = input.stats;
  if (input.corePillars !== undefined) p.core_pillars = input.corePillars;
  if (input.whyReasons !== undefined) p.why_reasons = input.whyReasons;
  if (input.keyBenefits !== undefined) p.key_benefits = input.keyBenefits;
  if (input.whereToStartItems !== undefined) p.where_to_start_items = input.whereToStartItems;
  if (input.focusAreasItems !== undefined) p.focus_areas_items = input.focusAreasItems;
  if (input.sortOrder !== undefined) p.sort_order = input.sortOrder;
  return p;
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const input = await request.json();
  const { data, error } = await getSupabaseAdmin()
    .from("sectors")
    .update(toPatch(input))
    .eq("id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { error } = await getSupabaseAdmin().from("sectors").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
