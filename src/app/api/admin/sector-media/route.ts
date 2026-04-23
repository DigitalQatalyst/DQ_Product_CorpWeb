import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-admin-auth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const ALLOWED_IMAGE = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_VIDEO = new Set(["video/mp4", "video/webm", "video/ogg"]);

const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif",
  "video/mp4": "mp4", "video/webm": "webm", "video/ogg": "ogv",
};

export async function POST(request: NextRequest) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string | null) ?? "misc";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const mime = (file.type || "").toLowerCase().split(";")[0]?.trim() ?? "";
  const isImage = ALLOWED_IMAGE.has(mime);
  const isVideo = ALLOWED_VIDEO.has(mime);

  if (!isImage && !isVideo)
    return NextResponse.json({ error: "Only images (JPEG/PNG/WebP/GIF) and videos (MP4/WebM/OGG) are allowed." }, { status: 400 });

  const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
  if (file.size > maxSize)
    return NextResponse.json({ error: `File must be ${isVideo ? "50" : "5"} MB or smaller.` }, { status: 400 });

  const ext = EXT_MAP[mime] ?? "bin";
  const objectPath = `${folder}/${Date.now()}.${ext}`;
  const db = getSupabaseAdmin();

  const { error: uploadError } = await db.storage
    .from("sector-media")
    .upload(objectPath, file, { upsert: true, contentType: mime });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data } = db.storage.from("sector-media").getPublicUrl(objectPath);
  return NextResponse.json({ path: objectPath, url: data.publicUrl });
}
