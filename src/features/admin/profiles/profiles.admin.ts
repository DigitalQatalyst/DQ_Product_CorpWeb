/**
 * Admin profile operations — direct Supabase calls using the browser client.
 */
import { supabaseBrowser } from "@/lib/supabaseBrowser";

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

export async function listAdminProfiles(): Promise<AdminProfileRow[]> {
  const { data, error } = await supabaseBrowser
    .from("profiles")
    .select("id,email,first_name,last_name,full_name,role,avatar_url,created_at,updated_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminProfileRow[];
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
  const update: typeof patch = {};
  if (patch.role !== undefined) {
    const r = String(patch.role).trim().toLowerCase();
    if (r !== "user" && r !== "admin") throw new Error("Role must be user or admin");
    update.role = r;
  }
  if (patch.first_name !== undefined) update.first_name = patch.first_name;
  if (patch.last_name !== undefined) update.last_name = patch.last_name;
  if (patch.email !== undefined) update.email = patch.email;

  if (Object.keys(update).length === 0) throw new Error("No fields to update");

  const { data, error } = await supabaseBrowser
    .from("profiles")
    .update(update)
    .eq("id", id)
    .select("id,email,first_name,last_name,full_name,role,avatar_url,created_at,updated_at")
    .single();

  if (error) throw new Error(error.message);
  return data as AdminProfileRow;
}
