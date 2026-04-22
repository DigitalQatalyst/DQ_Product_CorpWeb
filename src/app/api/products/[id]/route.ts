import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const [productRes, detailRes] = await Promise.all([
    supabase
      .from("products")
      .select("id,name,code,description,category,tags,image_path,cta_type,is_published")
      .eq("id", id)
      .eq("is_published", true)
      .single(),
    supabase
      .from("product_details")
      .select(
        "product_id,about_paragraphs,feature_descriptions,problem_statement,solution_statement,capabilities_label,capabilities,practical_values",
      )
      .eq("product_id", id)
      .maybeSingle(),
  ]);

  if (productRes.error || !productRes.data) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product: productRes.data, detail: detailRes.data ?? null });
}
