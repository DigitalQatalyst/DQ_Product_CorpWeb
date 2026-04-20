import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdminAuth, requireServiceRoleConfigured } from "../../../_utils";

function sanitizeFilename(name: string): string {
  return name.replaceAll(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauthorized = await requireAdminAuth(request);
  if (unauthorized) return unauthorized;
  const missingKey = requireServiceRoleConfigured();
  if (missingKey) return missingKey;

  const { id } = await params;
  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  const safeName = sanitizeFilename(file.name || "image");
  const ext = safeName.includes(".") ? safeName.split(".").pop() : "";
  const objectPath = `products/${id}/hero.${ext || "png"}`;

  const { error: uploadError } = await getSupabaseAdmin().storage
    .from("product-images")
    .upload(objectPath, file, { upsert: true, contentType: file.type || undefined });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 });
  }

  const { error: updateError } = await getSupabaseAdmin()
    .from("products")
    .update({ image_path: objectPath })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  const { data } = getSupabaseAdmin().storage.from("product-images").getPublicUrl(objectPath);

  return NextResponse.json({ id, imagePath: objectPath, imageUrl: data.publicUrl });
}

