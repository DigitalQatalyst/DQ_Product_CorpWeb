/**
 * Admin profile operations — calls internal API routes.
 */

export interface AdminProfileRow {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  role: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(path, { credentials: "include", ...init });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function listAdminProfiles(): Promise<AdminProfileRow[]> {
  return apiFetch("/api/admin/profiles");
}

export async function patchAdminProfile(
  id: string,
  patch: {
    role?: string;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
  },
): Promise<AdminProfileRow> {
  return apiFetch(`/api/admin/profiles/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
}
