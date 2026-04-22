import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-admin-auth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request: NextRequest) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string | null) ?? "misc";

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
  const objectPath = `${folder}/${Date.now()}.${ext}`;
  const db = getSupabaseAdmin();

  const { error: uploadError } = await db.storage
    .from("service-images")
    .upload(objectPath, file, { upsert: true, contentType: mime });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data } = db.storage.from("service-images").getPublicUrl(objectPath);
  return NextResponse.json({ path: objectPath, url: data.publicUrl });
}
