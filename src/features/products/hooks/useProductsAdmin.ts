import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProductCtaType, ProductDetail } from "./useProducts";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminProduct {
  id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  tags: string[];
  imagePath: string | null;
  imageUrl: string | undefined;
  ctaType: ProductCtaType;
  isPublished: boolean;
}

export interface AdminProductDetail {
  aboutParagraphs: string[];
  featureDescriptions: Record<string, string>;
  problemStatement: string;
  solutionStatement: string;
  capabilitiesLabel: string;
  capabilities: Array<{ title: string; body: string; accent: "primary" | "secondary" }>;
  practicalValues: Array<{ icon: string; title: string; subtitle: string }>;
}

export interface AdminProductWithDetail {
  product: AdminProduct;
  detail: AdminProductDetail;
}

// ─── Row mapper ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProduct(p: any): AdminProduct {
  return {
    id: p.id, name: p.name ?? "", code: p.code ?? "",
    description: p.description ?? "", category: p.category ?? "",
    tags: p.tags ?? [], imagePath: p.image_path ?? null,
    imageUrl: p.image_path ?? undefined,
    ctaType: p.cta_type ?? "waitlist", isPublished: !!p.is_published,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToDetail(d: any | null): AdminProductDetail {
  return {
    aboutParagraphs: d?.about_paragraphs ?? [],
    featureDescriptions: d?.feature_descriptions ?? {},
    problemStatement: d?.problem_statement ?? "",
    solutionStatement: d?.solution_statement ?? "",
    capabilitiesLabel: d?.capabilities_label ?? "Key Capabilities",
    capabilities: d?.capabilities ?? [],
    practicalValues: d?.practical_values ?? [],
  };
}

// ─── Fetch functions ──────────────────────────────────────────────────────────

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(path, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function listAdminProducts(): Promise<AdminProduct[]> {
  const data = await apiFetch("/api/admin/products");
  return (data as unknown[]).map(rowToProduct);
}

export async function getAdminProductWithDetail(id: string): Promise<AdminProductWithDetail | null> {
  try {
    const data = await apiFetch(`/api/admin/products/${id}`);
    return { product: rowToProduct(data.product), detail: rowToDetail(data.detail) };
  } catch {
    return null;
  }
}

export async function upsertAdminProduct(body: {
  id: string; name: string; code: string; description: string;
  category: string; tags: string[]; ctaType: ProductCtaType;
  isPublished: boolean; detail: AdminProductDetail;
}): Promise<void> {
  await apiFetch(`/api/admin/products/${body.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function patchAdminProduct(
  id: string,
  patch: Partial<{ name: string; code: string; description: string; category: string; tags: string[]; ctaType: ProductCtaType; isPublished: boolean }>,
): Promise<void> {
  await apiFetch(`/api/admin/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
}

export async function uploadProductImage(productId: string, file: File): Promise<{ imagePath: string; imageUrl: string }> {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch(`/api/admin/products/${productId}/image`, { method: "POST", body: formData });
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const PRODUCTS_ADMIN_KEY = ["products-admin"] as const;

export function useAdminProducts() {
  return useQuery({ queryKey: PRODUCTS_ADMIN_KEY, queryFn: listAdminProducts });
}

export function useAdminProduct(id: string) {
  return useQuery({
    queryKey: [...PRODUCTS_ADMIN_KEY, id],
    queryFn: () => getAdminProductWithDetail(id),
    enabled: !!id,
  });
}

export function useUpsertProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; name: string; code: string; description: string; category: string; tags: string[]; ctaType: ProductCtaType; isPublished: boolean; detail: AdminProductDetail }) =>
      upsertAdminProduct(input),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: PRODUCTS_ADMIN_KEY });
      qc.invalidateQueries({ queryKey: [...PRODUCTS_ADMIN_KEY, vars.id] });
    },
  });
}

export function usePatchProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<AdminProduct> }) =>
      patchAdminProduct(id, patch),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: PRODUCTS_ADMIN_KEY });
      qc.invalidateQueries({ queryKey: [...PRODUCTS_ADMIN_KEY, vars.id] });
    },
  });
}

export function useUploadProductImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => uploadProductImage(id, file),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [...PRODUCTS_ADMIN_KEY, vars.id] });
    },
  });
}

// Re-export types needed by consumers
export type { ProductCtaType, ProductDetail };
