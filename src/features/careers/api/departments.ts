import { supabase } from "@/lib/supabase";
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

  if (typeof id !== "number" || !name || typeof name !== "string") return null;
  return { id, name };
}

export async function listDepartments() {
  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;

  const mapped = (data ?? []).map(asDepartment).filter(Boolean) as Department[];
  return mapped.sort((a, b) => a.name.localeCompare(b.name));
}

