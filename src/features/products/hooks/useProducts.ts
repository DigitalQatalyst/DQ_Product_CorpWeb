import { useQuery } from "@tanstack/react-query";
import type { ProductType } from "@/types/product";

export type ProductCtaType = "waitlist" | "demo" | "tour";

export type ProductDetail = {
  aboutParagraphs: string[];
  featureDescriptions: Record<string, string>;
  problemStatement: string;
  solutionStatement: string;
  capabilitiesLabel: string;
  capabilities: Array<{ title: string; body: string; accent: "primary" | "secondary" }>;
  practicalValues: Array<{ icon: string; title: string; subtitle: string }>;
};

// ─── Row mappers ──────────────────────────────────────────────────────────────

type ProductRow = {
  id: string; name: string; code: string; description: string;
  category: string; tags: string[] | null; image_path: string | null;
  cta_type: ProductCtaType; is_published: boolean;
};

type ProductDetailsRow = {
  product_id: string;
  about_paragraphs: string[] | null;
  feature_descriptions: Record<string, string> | null;
  problem_statement: string | null; solution_statement: string | null;
  capabilities_label: string | null;
  capabilities: Array<{ title: string; body: string; accent: "primary" | "secondary" }> | null;
  practical_values: Array<{ icon: string; title: string; subtitle: string }> | null;
};

function asStringArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.filter((x) => typeof x === "string") as string[];
  return [];
}

function asObjectRecord(val: unknown): Record<string, string> {
  if (!val || typeof val !== "object") return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(val as Record<string, unknown>))
    if (typeof v === "string") out[k] = v;
  return out;
}

function asCapabilities(val: unknown): Array<{ title: string; body: string; accent: "primary" | "secondary" }> {
  if (!Array.isArray(val)) return [];
  return val.map((x) => {
    if (!x || typeof x !== "object") return null;
    const o = x as Record<string, unknown>;
    const title = typeof o.title === "string" ? o.title : "";
    const body = typeof o.body === "string" ? o.body : "";
    const accent = o.accent === "secondary" ? "secondary" : "primary";
    if (!title || !body) return null;
    return { title, body, accent };
  }).filter(Boolean) as Array<{ title: string; body: string; accent: "primary" | "secondary" }>;
}

function asPracticalValues(val: unknown): Array<{ icon: string; title: string; subtitle: string }> {
  if (!Array.isArray(val)) return [];
  return val.map((x) => {
    if (!x || typeof x !== "object") return null;
    const o = x as Record<string, unknown>;
    const icon = typeof o.icon === "string" ? o.icon : "";
    const title = typeof o.title === "string" ? o.title : "";
    const subtitle = typeof o.subtitle === "string" ? o.subtitle : "";
    if (!icon || !title || !subtitle) return null;
    return { icon, title, subtitle };
  }).filter(Boolean) as Array<{ icon: string; title: string; subtitle: string }>;
}

function resolvePublicImageUrl(imagePath: string | null): string | undefined {
  if (!imagePath) return undefined;
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return undefined;
  return `${url}/storage/v1/object/public/product-images/${imagePath}`;
}

function mapProductRow(row: ProductRow): ProductType & { ctaType: ProductCtaType } {
  return {
    id: row.id, name: row.name, code: row.code, description: row.description,
    tags: asStringArray(row.tags),
    demoUrl: `/products/marketplace/${row.id}/demo`,
    learnMoreUrl: `/products/marketplace/${row.id}`,
    category: row.category,
    imageUrl: resolvePublicImageUrl(row.image_path),
    ctaType: row.cta_type,
  };
}

function mapProductDetailsRow(row: ProductDetailsRow | null): ProductDetail {
  return {
    aboutParagraphs: asStringArray(row?.about_paragraphs),
    featureDescriptions: asObjectRecord(row?.feature_descriptions),
    problemStatement: typeof row?.problem_statement === "string" ? row.problem_statement : "",
    solutionStatement: typeof row?.solution_statement === "string" ? row.solution_statement : "",
    capabilitiesLabel: typeof row?.capabilities_label === "string" && row.capabilities_label ? row.capabilities_label : "Key Capabilities",
    capabilities: asCapabilities(row?.capabilities),
    practicalValues: asPracticalValues(row?.practical_values),
  };
}

// ─── API helpers ──────────────────────────────────────────────────────────────

function apiUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.NEXT_PUBLIC_APP_URL) return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  return `http://localhost:3000${path}`;
}

async function apiFetch(path: string) {
  const res = await fetch(apiUrl(path), { cache: "no-store" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

// ─── Public fetch functions (used by server components + hooks) ───────────────

export async function listPublishedProducts(): Promise<Array<ProductType & { ctaType: ProductCtaType }>> {
  const data: ProductRow[] = await apiFetch("/api/products");
  return data.map(mapProductRow);
}

export async function getPublishedProductWithDetails(productId: string): Promise<{
  product: (ProductType & { ctaType: ProductCtaType }) | null;
  detail: ProductDetail | null;
}> {
  try {
    const data: { product: ProductRow; detail: ProductDetailsRow | null } = await apiFetch(`/api/products/${productId}`);
    return { product: mapProductRow(data.product), detail: mapProductDetailsRow(data.detail) };
  } catch {
    return { product: null, detail: null };
  }
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const PRODUCTS_KEY = ["products"] as const;

export function usePublishedProducts() {
  return useQuery({ queryKey: PRODUCTS_KEY, queryFn: listPublishedProducts });
}

export function usePublishedProduct(id: string) {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, id],
    queryFn: () => getPublishedProductWithDetails(id),
    enabled: !!id,
  });
}
