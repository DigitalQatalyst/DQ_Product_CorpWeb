/**
 * Admin service image upload — direct Supabase storage call using the browser client.
 */
import { supabaseBrowser } from "@/lib/supabaseBrowser";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function uploadServiceImage(
  file: File,
  folder: string,
): Promise<{ path: string; url: string }> {
  const mime = (file.type || "").toLowerCase().split(";")[0]?.trim() ?? "";

  if (!ALLOWED_TYPES.has(mime)) throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be 5 MB or smaller.");

  const ext = MIME_TO_EXT[mime] ?? "png";
  const objectPath = `${folder}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabaseBrowser.storage
    .from("service-images")
    .upload(objectPath, file, { upsert: true, contentType: mime });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabaseBrowser.storage.from("service-images").getPublicUrl(objectPath);
  return { path: objectPath, url: data.publicUrl };
}
