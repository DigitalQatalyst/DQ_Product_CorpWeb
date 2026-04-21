import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdminAuth, requireServiceRoleConfigured } from "../_utils";

type ProductCtaType = "waitlist" | "demo" | "tour";

type IncomingDetail = {
  aboutParagraphs: string[];
  featureDescriptions: Record<string, string>;
  problemStatement: string;
  solutionStatement: string;
  capabilitiesLabel: string;
  capabilities: Array<{ title: string; body: string; accent: "primary" | "secondary" }>;
  practicalValues: Array<{ icon: string; title: string; subtitle: string }>;
};

function publicImageUrl(imagePath: string | null): string | undefined {
  if (!imagePath) return undefined;
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  const { data } = getSupabaseAdmin().storage.from("product-images").getPublicUrl(imagePath);
  return data.publicUrl || undefined;
}

export async function GET(request: Request) {
  const unauthorized = await requireAdminAuth(request);
  if (unauthorized) return unauthorized;
  const missingKey = requireServiceRoleConfigured();
  if (missingKey) return missingKey;

  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select("id,name,code,description,category,tags,image_path,cta_type,is_published")
    .order("name", { ascending: true });

  if (error) return NextResponse.json({ products: [] });

  return NextResponse.json({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    products: ((data as any[]) ?? []).map((p: any) => ({
      id: p.id as string,
      name: p.name as string,
      code: p.code as string,
      description: p.description as string,
      category: p.category as string,
      tags: (p.tags as string[]) ?? [],
      imagePath: (p.image_path as string | null) ?? null,
      imageUrl: publicImageUrl((p.image_path as string | null) ?? null),
      ctaType: (p.cta_type as ProductCtaType) ?? "waitlist",
      isPublished: !!p.is_published,
    })),
  });
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminAuth(request);
  if (unauthorized) return unauthorized;
  const missingKey = requireServiceRoleConfigured();
  if (missingKey) return missingKey;

  const body = (await request.json()) as {
    id: string;
    name: string;
    code: string;
    description: string;
    category: string;
    tags: string[];
    ctaType: ProductCtaType;
    isPublished: boolean;
    detail: IncomingDetail;
  };

  const id = (body.id ?? "").trim();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const prodUpsert = await getSupabaseAdmin().from("products").upsert(
    {
      id,
      name: body.name ?? "",
      code: body.code ?? "",
      description: body.description ?? "",
      category: body.category ?? "",
      tags: body.tags ?? [],
      cta_type: body.ctaType ?? "waitlist",
      is_published: !!body.isPublished,
    },
    { onConflict: "id" },
  );
  if (prodUpsert.error) return NextResponse.json({ error: prodUpsert.error.message }, { status: 400 });

  const d = body.detail ?? ({} as IncomingDetail);
  const detailsUpsert = await getSupabaseAdmin().from("product_details").upsert(
    {
      product_id: id,
      about_paragraphs: d.aboutParagraphs ?? [],
      feature_descriptions: d.featureDescriptions ?? {},
      problem_statement: d.problemStatement ?? "",
      solution_statement: d.solutionStatement ?? "",
      capabilities_label: d.capabilitiesLabel ?? "Key Capabilities",
      capabilities: d.capabilities ?? [],
      practical_values: d.practicalValues ?? [],
    },
    { onConflict: "product_id" },
  );
  if (detailsUpsert.error) return NextResponse.json({ error: detailsUpsert.error.message }, { status: 400 });

  return NextResponse.json({ id });
}

export async function PATCH(request: Request) {
  const unauthorized = await requireAdminAuth(request);
  if (unauthorized) return unauthorized;
  const missingKey = requireServiceRoleConfigured();
  if (missingKey) return missingKey;

  const body = (await request.json()) as {
    id: string;
    name?: string;
    code?: string;
    description?: string;
    category?: string;
    tags?: string[];
    ctaType?: ProductCtaType;
    isPublished?: boolean;
    detail?: Partial<IncomingDetail>;
  };

  const id = (body.id ?? "").trim();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const prodUpdate = await getSupabaseAdmin()
    .from("products")
    .update({
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.code !== undefined ? { code: body.code } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(body.category !== undefined ? { category: body.category } : {}),
      ...(body.tags !== undefined ? { tags: body.tags } : {}),
      ...(body.ctaType !== undefined ? { cta_type: body.ctaType } : {}),
      ...(body.isPublished !== undefined ? { is_published: body.isPublished } : {}),
    })
    .eq("id", id);

  if (prodUpdate.error) return NextResponse.json({ error: prodUpdate.error.message }, { status: 400 });

  if (body.detail) {
    const d = body.detail;
    const detailsUpdate = await getSupabaseAdmin()
      .from("product_details")
      .upsert(
        {
          product_id: id,
          ...(d.aboutParagraphs !== undefined ? { about_paragraphs: d.aboutParagraphs } : {}),
          ...(d.featureDescriptions !== undefined ? { feature_descriptions: d.featureDescriptions } : {}),
          ...(d.problemStatement !== undefined ? { problem_statement: d.problemStatement } : {}),
          ...(d.solutionStatement !== undefined ? { solution_statement: d.solutionStatement } : {}),
          ...(d.capabilitiesLabel !== undefined ? { capabilities_label: d.capabilitiesLabel } : {}),
          ...(d.capabilities !== undefined ? { capabilities: d.capabilities } : {}),
          ...(d.practicalValues !== undefined ? { practical_values: d.practicalValues } : {}),
        },
        { onConflict: "product_id" },
      );
    if (detailsUpdate.error) return NextResponse.json({ error: detailsUpdate.error.message }, { status: 400 });
  }

  return NextResponse.json({ id });
}

