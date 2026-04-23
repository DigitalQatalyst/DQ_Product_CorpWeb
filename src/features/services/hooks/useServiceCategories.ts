import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Faq { question: string; answer: string }
export interface Stat { value: string; label: string }
export interface MethodologyStep { number: string; title: string; description: string }
export interface TransformationStep { number: string; title: string; description: string }
export interface IndustryCard { title: string; description: string }
export interface Cta { label: string; href: string }

export interface ServiceCategory {
  id: string; name: string; slug: string; description: string;
  tags: string[]; isPublished: boolean; createdAt: string; updatedAt: string;
  heroTitle: string; heroSubtitle: string; heroBgImage: string;
  bpTitle: string; bpDescription: string; bpPrimaryCta: Cta; bpSecondaryCta: Cta;
  bpImagePrimary: string; bpImageOverlay: string; bpFaqs: Faq[]; stats: Stat[];
  methodEyebrow: string; methodTitle: string; methodCtaLabel: string;
  methodImage: string; methodSteps: MethodologyStep[];
  transformEyebrow: string; transformTitle: string; transformSteps: TransformationStep[];
  industryTitle: string; industryDescription: string; industryCtaLabel: string;
  industryCards: IndustryCard[];
}

export type ServiceCategoryInput = Omit<ServiceCategory, "id" | "createdAt" | "updatedAt">;

// ─── Row mapper ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromRow(r: any): ServiceCategory {
  return {
    id: r.id, name: r.name, slug: r.slug, description: r.description ?? "",
    tags: r.tags ?? [], isPublished: !!r.is_published,
    createdAt: r.created_at, updatedAt: r.updated_at,
    heroTitle: r.hero_title ?? "", heroSubtitle: r.hero_subtitle ?? "",
    heroBgImage: r.hero_bg_image ?? "", bpTitle: r.bp_title ?? "",
    bpDescription: r.bp_description ?? "",
    bpPrimaryCta: r.bp_primary_cta ?? { label: "", href: "" },
    bpSecondaryCta: r.bp_secondary_cta ?? { label: "", href: "" },
    bpImagePrimary: r.bp_image_primary ?? "", bpImageOverlay: r.bp_image_overlay ?? "",
    bpFaqs: r.bp_faqs ?? [], stats: r.stats ?? [],
    methodEyebrow: r.method_eyebrow ?? "", methodTitle: r.method_title ?? "",
    methodCtaLabel: r.method_cta_label ?? "", methodImage: r.method_image ?? "",
    methodSteps: r.method_steps ?? [], transformEyebrow: r.transform_eyebrow ?? "",
    transformTitle: r.transform_title ?? "", transformSteps: r.transform_steps ?? [],
    industryTitle: r.industry_title ?? "", industryDescription: r.industry_description ?? "",
    industryCtaLabel: r.industry_cta_label ?? "", industryCards: r.industry_cards ?? [],
  };
}

// ─── API helpers ──────────────────────────────────────────────────────────────

function apiUrl(path: string) {
  if (typeof window !== "undefined") return path;
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
  const base = process.env.NEXT_PUBLIC_APP_URL ?? vercelUrl ?? "http://localhost:3000";
  return `${base}${path}`;
}

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(apiUrl(path), { credentials: "include", ...init });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

// ─── Fetch functions (used by server components + hooks) ─────────────────────

export async function listServiceCategories(): Promise<ServiceCategory[]> {
  const data = await apiFetch("/api/admin/service-categories");
  return (data as unknown[]).map(fromRow);
}

export async function listPublishedServiceCategories(): Promise<ServiceCategory[]> {
  const data = await apiFetch("/api/service-categories");
  return (data as unknown[]).map(fromRow);
}

export async function getServiceCategoryBySlug(slug: string): Promise<ServiceCategory | null> {
  try {
    const data = await apiFetch(`/api/service-categories/${slug}`);
    return fromRow(data);
  } catch {
    return null;
  }
}

export async function createServiceCategory(input: ServiceCategoryInput): Promise<ServiceCategory> {
  const data = await apiFetch("/api/admin/service-categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return fromRow(data);
}

export async function updateServiceCategory(id: string, input: Partial<ServiceCategoryInput>): Promise<ServiceCategory> {
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

export async function uploadServiceImage(file: File, folder: string): Promise<{ path: string; url: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  const res = await fetch("/api/admin/service-images", { method: "POST", body: formData });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Upload failed: ${res.status}`);
  }
  return res.json();
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const SERVICE_CATEGORIES_KEY = ["service-categories"] as const;

export function useServiceCategories() {
  return useQuery({ queryKey: SERVICE_CATEGORIES_KEY, queryFn: listServiceCategories });
}

export function usePublishedServiceCategories() {
  return useQuery({
    queryKey: [...SERVICE_CATEGORIES_KEY, "published"],
    queryFn: listPublishedServiceCategories,
  });
}

export function useServiceCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: [...SERVICE_CATEGORIES_KEY, slug],
    queryFn: () => getServiceCategoryBySlug(slug),
    enabled: !!slug,
  });
}

export function useCreateServiceCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ServiceCategoryInput) => createServiceCategory(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: SERVICE_CATEGORIES_KEY }),
  });
}

export function useUpdateServiceCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ServiceCategoryInput> }) =>
      updateServiceCategory(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: SERVICE_CATEGORIES_KEY }),
  });
}

export function useDeleteServiceCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteServiceCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SERVICE_CATEGORIES_KEY }),
  });
}
