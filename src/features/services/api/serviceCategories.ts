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

function apiUrl(path: string) {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    (typeof window === "undefined" ? "http://localhost:3000" : "");
  return `${base}${path}`;
}

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(apiUrl(path), init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

// ─── Public reads — calls API routes ─────────────────────────────────────────

/** Used by admin client hooks. */
export async function listServiceCategories(): Promise<ServiceCategory[]> {
  const data = await apiFetch("/api/admin/service-categories");
  return (data as unknown[]).map(fromRow);
}

/** Used by public client hooks (ServicesMarketplacePage, ServiceCategoryCards, etc.). */
export async function listPublishedServiceCategories(): Promise<ServiceCategory[]> {
  const data = await apiFetch("/api/service-categories");
  return (data as unknown[]).map(fromRow);
}

/** Used by public client hooks (ServiceCategoryPage). */
export async function getServiceCategoryBySlug(slug: string): Promise<ServiceCategory | null> {
  try {
    const data = await apiFetch(`/api/service-categories/${slug}`);
    return fromRow(data);
  } catch {
    return null;
  }
}

// ─── Admin writes — calls API routes ─────────────────────────────────────────

export async function createServiceCategory(input: ServiceCategoryInput): Promise<ServiceCategory> {
  const data = await apiFetch("/api/admin/service-categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return fromRow(data);
}

export async function updateServiceCategory(
  id: string,
  input: Partial<ServiceCategoryInput>,
): Promise<ServiceCategory> {
  const data = await apiFetch(`/api/admin/service-categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return fromRow(data);
}

export async function deleteServiceCategory(id: string): Promise<void> {
  await apiFetch(`/api/admin/service-categories/${id}`, { method: "DELETE" });
}
