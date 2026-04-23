import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-admin-auth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const mime = (file.type || "").toLowerCase().split(";")[0]?.trim() ?? "";
  if (!ALLOWED.has(mime)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, and GIF images are allowed." },
      { status: 400 },
    );
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be 5 MB or smaller." }, { status: 400 });
  }

  const ext = EXT_MAP[mime] ?? "png";
  const objectPath = `products/${id}/hero.${ext}`;
  const db = getSupabaseAdmin();

  const { error: uploadError } = await db.storage
    .from("product-images")
    .upload(objectPath, file, { upsert: true, contentType: mime });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { error: updateError } = await db
    .from("products")
    .update({ image_path: objectPath })
    .eq("id", id);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  const { data } = db.storage.from("product-images").getPublicUrl(objectPath);
  return NextResponse.json({ imagePath: objectPath, imageUrl: data.publicUrl });
}
