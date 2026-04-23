import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-admin-auth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type Params = Promise<{ id: string }>;

export async function GET(request: NextRequest, { params }: { params: Params }) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = getSupabaseAdmin();

  const [prodRes, detailRes] = await Promise.all([
    db
      .from("products")
      .select("id,name,code,description,category,tags,image_path,cta_type,is_published")
      .eq("id", id)
      .single(),
    db
      .from("product_details")
      .select(
        "product_id,about_paragraphs,feature_descriptions,problem_statement,solution_statement,capabilities_label,capabilities,practical_values",
      )
      .eq("product_id", id)
      .maybeSingle(),
  ]);

  if (prodRes.error || !prodRes.data) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product: prodRes.data, detail: detailRes.data ?? null });
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const db = getSupabaseAdmin();

  const { error: prodError } = await db.from("products").upsert(
    {
      id,
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
  if (prodError) return NextResponse.json({ error: prodError.message }, { status: 500 });

  const d = body.detail;
  const { error: detailError } = await db.from("product_details").upsert(
    {
      product_id: id,
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
  if (detailError) return NextResponse.json({ error: detailError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const patch = await request.json();
  const db = getSupabaseAdmin();

  const update: Record<string, unknown> = {};
  if (patch.name !== undefined) update.name = patch.name;
  if (patch.code !== undefined) update.code = patch.code;
  if (patch.description !== undefined) update.description = patch.description;
  if (patch.category !== undefined) update.category = patch.category;
  if (patch.tags !== undefined) update.tags = patch.tags;
  if (patch.ctaType !== undefined) update.cta_type = patch.ctaType;
  if (patch.isPublished !== undefined) update.is_published = patch.isPublished;

  const { error } = await db.from("products").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
