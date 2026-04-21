import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdminAuth, requireServiceRoleConfigured } from "../../../_utils";

/** Matches `product-images` bucket `allowed_mime_types` / `file_size_limit` in Supabase. */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

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

  const mime = (file.type || "").toLowerCase().split(";")[0]?.trim() ?? "";
  if (!ALLOWED_IMAGE_TYPES.has(mime)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, and GIF images are allowed." },
      { status: 400 },
    );
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "Image must be 5 MB or smaller." },
      { status: 400 },
    );
  }

  const safeName = sanitizeFilename(file.name || "image");
  const extFromName = safeName.includes(".") ? safeName.split(".").pop() : "";
  const ext = MIME_TO_EXT[mime] ?? extFromName ?? "png";
  const objectPath = `products/${id}/hero.${ext}`;

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

