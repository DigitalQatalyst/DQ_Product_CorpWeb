/**
 * Authenticated fetch for admin API routes.
 * Automatically attaches the current Supabase session token as a Bearer header.
 * Use this for all /api/admin/* calls from client components.
 */
import { supabaseBrowser } from "@/lib/supabaseBrowser";

type FetchInput = Parameters<typeof fetch>;

export async function adminFetch(
  url: FetchInput[0],
  init: RequestInit = {},
): Promise<Response> {
  const { data } = await supabaseBrowser.auth.getSession();
  const token = data.session?.access_token;

  const headers = new Headers(init.headers);
  if (token) headers.set("authorization", `Bearer ${token}`);

  return fetch(url, { ...init, headers });
}

export async function adminFetchJson<T>(
  url: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await adminFetch(url, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}
