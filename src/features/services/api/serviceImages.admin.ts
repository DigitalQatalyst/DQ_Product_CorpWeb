/**
 * Admin service image upload — calls internal API route.
 * No direct Supabase storage access from the browser.
 */

export async function uploadServiceImage(
  file: File,
  folder: string,
): Promise<{ path: string; url: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch("/api/admin/service-images", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Upload failed: ${res.status}`);
  }

  return res.json();
}
