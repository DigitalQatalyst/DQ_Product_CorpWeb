import { supabase } from "@/lib/supabase";

export interface Faq { question: string; answer: string }
export interface Stat { value: string; label: string }
export interface MethodologyStep { number: string; title: string; description: string }
export interface TransformationStep { number: string; title: string; description: string }
export interface IndustryCard { title: string; description: string }
export interface Cta { label: string; href: string }

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  // hero
  heroTitle: string;
  heroSubtitle: string;
  heroBgImage: string;
  // blueprint
  bpTitle: string;
  bpDescription: string;
  bpPrimaryCta: Cta;
  bpSecondaryCta: Cta;
  bpImagePrimary: string;
  bpImageOverlay: string;
  bpFaqs: Faq[];
  // stats
  stats: Stat[];
  // methodology
  methodEyebrow: string;
  methodTitle: string;
  methodCtaLabel: string;
  methodImage: string;
  methodSteps: MethodologyStep[];
  // transformation
  transformEyebrow: string;
  transformTitle: string;
  transformSteps: TransformationStep[];
  // industry
  industryTitle: string;
  industryDescription: string;
  industryCtaLabel: string;
  industryCards: IndustryCard[];
}

export type ServiceCategoryInput = Omit<ServiceCategory, "id" | "createdAt" | "updatedAt">;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromRow(r: any): ServiceCategory {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description ?? "",
    tags: r.tags ?? [],
    isPublished: !!r.is_published,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    heroTitle: r.hero_title ?? "",
    heroSubtitle: r.hero_subtitle ?? "",
    heroBgImage: r.hero_bg_image ?? "",
    bpTitle: r.bp_title ?? "",
    bpDescription: r.bp_description ?? "",
    bpPrimaryCta: r.bp_primary_cta ?? { label: "", href: "" },
    bpSecondaryCta: r.bp_secondary_cta ?? { label: "", href: "" },
    bpImagePrimary: r.bp_image_primary ?? "",
    bpImageOverlay: r.bp_image_overlay ?? "",
    bpFaqs: r.bp_faqs ?? [],
    stats: r.stats ?? [],
    methodEyebrow: r.method_eyebrow ?? "",
    methodTitle: r.method_title ?? "",
    methodCtaLabel: r.method_cta_label ?? "",
    methodImage: r.method_image ?? "",
    methodSteps: r.method_steps ?? [],
    transformEyebrow: r.transform_eyebrow ?? "",
    transformTitle: r.transform_title ?? "",
    transformSteps: r.transform_steps ?? [],
    industryTitle: r.industry_title ?? "",
    industryDescription: r.industry_description ?? "",
    industryCtaLabel: r.industry_cta_label ?? "",
    industryCards: r.industry_cards ?? [],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRow(input: Partial<ServiceCategoryInput>): Record<string, any> {
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

export async function listServiceCategories(): Promise<ServiceCategory[]> {
  const { data, error } = await supabase
    .from("service_categories")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function listPublishedServiceCategories(): Promise<ServiceCategory[]> {
  const { data, error } = await supabase
    .from("service_categories")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function getServiceCategoryBySlug(slug: string): Promise<ServiceCategory | null> {
  const { data, error } = await supabase
    .from("service_categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) throw error;
  return data ? fromRow(data) : null;
}

export async function createServiceCategory(input: ServiceCategoryInput): Promise<ServiceCategory> {
  const { data, error } = await supabase
    .from("service_categories")
    .insert(toRow(input))
    .select("*")
    .single();
  if (error) throw error;
  return fromRow(data);
}

export async function updateServiceCategory(
  id: string,
  input: Partial<ServiceCategoryInput>,
): Promise<ServiceCategory> {
  const { data, error } = await supabase
    .from("service_categories")
    .update({ ...toRow(input), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return fromRow(data);
}

export async function deleteServiceCategory(id: string): Promise<void> {
  const { error } = await supabase.from("service_categories").delete().eq("id", id);
  if (error) throw error;
}
