import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-admin-auth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRow(input: Record<string, any>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (input.name !== undefined) row.name = input.name;
  if (input.slug !== undefined) row.slug = input.slug;
  if (input.description !== undefined) row.description = input.description;
  if (input.tags !== undefined) row.tags = input.tags;
  if (input.isPublished !== undefined) row.is_published = input.isPublished;
  if (input.heroTitle !== undefined) row.hero_title = input.heroTitle;
  if (input.heroSubtitle !== undefined) row.hero_subtitle = input.heroSubtitle;
  if (input.heroBgImage !== undefined) row.hero_bg_image = input.heroBgImage;
  if (input.bpTitle !== undefined) row.bp_title = input.bpTitle;
  if (input.bpDescription !== undefined) row.bp_description = input.bpDescription;
  if (input.bpPrimaryCta !== undefined) row.bp_primary_cta = input.bpPrimaryCta;
  if (input.bpSecondaryCta !== undefined) row.bp_secondary_cta = input.bpSecondaryCta;
  if (input.bpImagePrimary !== undefined) row.bp_image_primary = input.bpImagePrimary;
  if (input.bpImageOverlay !== undefined) row.bp_image_overlay = input.bpImageOverlay;
  if (input.bpFaqs !== undefined) row.bp_faqs = input.bpFaqs;
  if (input.stats !== undefined) row.stats = input.stats;
  if (input.methodEyebrow !== undefined) row.method_eyebrow = input.methodEyebrow;
  if (input.methodTitle !== undefined) row.method_title = input.methodTitle;
  if (input.methodCtaLabel !== undefined) row.method_cta_label = input.methodCtaLabel;
  if (input.methodImage !== undefined) row.method_image = input.methodImage;
  if (input.methodSteps !== undefined) row.method_steps = input.methodSteps;
  if (input.transformEyebrow !== undefined) row.transform_eyebrow = input.transformEyebrow;
  if (input.transformTitle !== undefined) row.transform_title = input.transformTitle;
  if (input.transformSteps !== undefined) row.transform_steps = input.transformSteps;
  if (input.industryTitle !== undefined) row.industry_title = input.industryTitle;
  if (input.industryDescription !== undefined) row.industry_description = input.industryDescription;
  if (input.industryCtaLabel !== undefined) row.industry_cta_label = input.industryCtaLabel;
  if (input.industryCards !== undefined) row.industry_cards = input.industryCards;
  return row;
}

export async function GET(request: NextRequest) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await getSupabaseAdmin()
    .from("service_categories")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const input = await request.json();
  const { data, error } = await getSupabaseAdmin()
    .from("service_categories")
    .insert(toRow(input))
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
