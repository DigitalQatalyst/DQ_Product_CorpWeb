import { supabaseBrowser } from "@/lib/supabaseBrowser";
import type { Department } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asDepartment(row: any): Department | null {
  const id = row?.id;
  const name =
    row?.name ??
    row?.department_name ??
    row?.title ??
    row?.label ??
    row?.slug ??
    null;

  if (
    (typeof id !== "number" && typeof id !== "string") ||
    !name ||
    typeof name !== "string"
  )
    return null;
  return { id, name };
}

export async function listDepartments() {
  const { data, error } = await supabaseBrowser
    .from("departments")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;

  const mapped = (data ?? []).map(asDepartment).filter(Boolean) as Department[];
  return mapped.sort((a, b) => a.name.localeCompare(b.name));
}

export async function createDepartment(name: string) {
  const cleaned = name.trim();
  if (!cleaned) throw new Error("Department name is required.");

  // Some schemas enforce unique department names; handle conflicts gracefully.
  const { data, error } = await supabaseBrowser
    .from("departments")
    .upsert({ name: cleaned }, { onConflict: "name" })
    .select("*")
    .single();

  if (!error) {
    const dept = asDepartment(data);
    if (!dept) throw new Error("Failed to create department.");
    return dept;
  }

  // Fallback: if the unique index isn't on `name` or upsert isn't supported,
  // fetch existing row by name when possible.
  const { data: existing, error: fetchErr } = await supabaseBrowser
    .from("departments")
    .select("*")
    .eq("name", cleaned)
    .maybeSingle();

  if (!fetchErr && existing) {
    const dept = asDepartment(existing);
    if (dept) return dept;
  }

  throw error;
}

