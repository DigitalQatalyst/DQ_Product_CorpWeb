/**
 * Admin product operations — direct Supabase calls using the browser client.
 * RLS allows authenticated admin users to read/write products.
 */
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import type { ProductCtaType } from "@/features/products/api/products.queries";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProduct(p: any): AdminProduct {
  return {
    id: p.id,
    name: p.name ?? "",
    code: p.code ?? "",
    description: p.description ?? "",
    category: p.category ?? "",
    tags: p.tags ?? [],
    imagePath: p.image_path ?? null,
    imageUrl: p.image_path ?? undefined,
    ctaType: p.cta_type ?? "waitlist",
    isPublished: !!p.is_published,
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

export async function listAdminProducts(): Promise<AdminProduct[]> {
  const { data, error } = await supabaseBrowser
    .from("products")
    .select("id,name,code,description,category,tags,image_path,cta_type,is_published")
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToProduct);
}

export async function getAdminProductWithDetail(id: string): Promise<AdminProductWithDetail | null> {
  const [prodRes, detailRes] = await Promise.all([
    supabaseBrowser
      .from("products")
      .select("id,name,code,description,category,tags,image_path,cta_type,is_published")
      .eq("id", id)
      .single(),
    supabaseBrowser
      .from("product_details")
      .select("product_id,about_paragraphs,feature_descriptions,problem_statement,solution_statement,capabilities_label,capabilities,practical_values")
      .eq("product_id", id)
      .maybeSingle(),
  ]);
  if (prodRes.error || !prodRes.data) return null;
  return { product: rowToProduct(prodRes.data), detail: rowToDetail(detailRes.data) };
}

export async function upsertAdminProduct(body: {
  id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  tags: string[];
  ctaType: ProductCtaType;
  isPublished: boolean;
  detail: AdminProductDetail;
}): Promise<void> {
  const { error: prodError } = await supabaseBrowser.from("products").upsert(
    {
      id: body.id,
      name: body.name,
      code: body.code,
      description: body.description,
      category: body.category,
      tags: body.tags,
      cta_type: body.ctaType,
      is_published: body.isPublished,
    },
    { onConflict: "id" },
  );
  if (prodError) throw new Error(prodError.message);

  const d = body.detail;
  const { error: detailError } = await supabaseBrowser.from("product_details").upsert(
    {
      product_id: body.id,
      about_paragraphs: d.aboutParagraphs,
      feature_descriptions: d.featureDescriptions,
      problem_statement: d.problemStatement,
      solution_statement: d.solutionStatement,
      capabilities_label: d.capabilitiesLabel,
      capabilities: d.capabilities,
      practical_values: d.practicalValues,
    },
    { onConflict: "product_id" },
  );
  if (detailError) throw new Error(detailError.message);
}

export async function patchAdminProduct(
  id: string,
  patch: Partial<{
    name: string; code: string; description: string; category: string;
    tags: string[]; ctaType: ProductCtaType; isPublished: boolean;
  }>,
): Promise<void> {
  const { error } = await supabaseBrowser
    .from("products")
    .update({
      ...(patch.name !== undefined && { name: patch.name }),
      ...(patch.code !== undefined && { code: patch.code }),
      ...(patch.description !== undefined && { description: patch.description }),
      ...(patch.category !== undefined && { category: patch.category }),
      ...(patch.tags !== undefined && { tags: patch.tags }),
      ...(patch.ctaType !== undefined && { cta_type: patch.ctaType }),
      ...(patch.isPublished !== undefined && { is_published: patch.isPublished }),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function uploadProductImage(
  productId: string,
  file: File,
): Promise<{ imagePath: string; imageUrl: string }> {
  const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
  const EXT_MAP: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
  const mime = (file.type || "").toLowerCase().split(";")[0]?.trim() ?? "";

  if (!ALLOWED.has(mime)) throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be 5 MB or smaller.");

  const ext = EXT_MAP[mime] ?? "png";
  const objectPath = `products/${productId}/hero.${ext}`;

  const { error: uploadError } = await supabaseBrowser.storage
    .from("product-images")
    .upload(objectPath, file, { upsert: true, contentType: mime });
  if (uploadError) throw new Error(uploadError.message);

  const { error: updateError } = await supabaseBrowser
    .from("products").update({ image_path: objectPath }).eq("id", productId);
  if (updateError) throw new Error(updateError.message);

  const { data } = supabaseBrowser.storage.from("product-images").getPublicUrl(objectPath);
  return { imagePath: objectPath, imageUrl: data.publicUrl };
}
