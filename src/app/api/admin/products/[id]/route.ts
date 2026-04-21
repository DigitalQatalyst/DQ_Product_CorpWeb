import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdminAuth, requireServiceRoleConfigured } from "../../_utils";

type ProductCtaType = "waitlist" | "demo" | "tour";

function publicImageUrl(imagePath: string | null): string | undefined {
  if (!imagePath) return undefined;
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  const { data } = getSupabaseAdmin().storage.from("product-images").getPublicUrl(imagePath);
  return data.publicUrl || undefined;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauthorized = await requireAdminAuth(request);
  if (unauthorized) return unauthorized;
  const missingKey = requireServiceRoleConfigured();
  if (missingKey) return missingKey;

  const { id } = await params;

  const [prodRes, detailRes] = await Promise.all([
    getSupabaseAdmin()
      .from("products")
      .select("id,name,code,description,category,tags,image_path,cta_type,is_published")
      .eq("id", id)
      .single(),
    getSupabaseAdmin()
      .from("product_details")
      .select(
        "product_id,about_paragraphs,feature_descriptions,problem_statement,solution_statement,capabilities_label,capabilities,practical_values",
      )
      .eq("product_id", id)
      .maybeSingle(),
  ]);

  if (prodRes.error || !prodRes.data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const p = prodRes.data as unknown as {
    id: string;
    name: string;
    code: string;
    description: string;
    category: string;
    tags: string[] | null;
    image_path: string | null;
    cta_type: ProductCtaType;
    is_published: boolean;
  };
  const d = (detailRes.data as unknown as {
    about_paragraphs: string[] | null;
    feature_descriptions: Record<string, string> | null;
    problem_statement: string | null;
    solution_statement: string | null;
    capabilities_label: string | null;
    capabilities: Array<{ title: string; body: string; accent: "primary" | "secondary" }> | null;
    practical_values: Array<{ icon: string; title: string; subtitle: string }> | null;
  } | null) ?? null;

  return NextResponse.json({
    product: {
      id: p.id,
      name: p.name ?? "",
      code: p.code ?? "",
      description: p.description ?? "",
      category: p.category ?? "",
      tags: p.tags ?? [],
      imagePath: p.image_path ?? null,
      imageUrl: publicImageUrl(p.image_path ?? null),
      ctaType: p.cta_type ?? "waitlist",
      isPublished: !!p.is_published,
    },
    detail: {
      aboutParagraphs: d?.about_paragraphs ?? [],
      featureDescriptions: d?.feature_descriptions ?? {},
      problemStatement: d?.problem_statement ?? "",
      solutionStatement: d?.solution_statement ?? "",
      capabilitiesLabel: d?.capabilities_label ?? "Key Capabilities",
      capabilities:
        d?.capabilities ?? [],
      practicalValues:
        d?.practical_values ?? [],
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauthorized = await requireAdminAuth(request);
  if (unauthorized) return unauthorized;
  const missingKey = requireServiceRoleConfigured();
  if (missingKey) return missingKey;

  const { id } = await params;
  const body = (await request.json()) as { isPublished?: boolean };

  if (body.isPublished === undefined) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin()
    .from("products")
    .update({ is_published: body.isPublished })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ id });
}

