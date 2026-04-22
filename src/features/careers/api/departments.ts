import type { Department } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asDepartment(row: any): Department | null {
  const id = row?.id;
  const name =
    row?.name ?? row?.department_name ?? row?.title ?? row?.label ?? row?.slug ?? null;
  if ((typeof id !== "number" && typeof id !== "string") || !name || typeof name !== "string")
    return null;
  return { id, name };
}

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(path, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function listDepartments(): Promise<Department[]> {
  const data = await apiFetch("/api/admin/departments");
  const mapped = (data as unknown[]).map(asDepartment).filter(Boolean) as Department[];
  return mapped.sort((a, b) => a.name.localeCompare(b.name));
}

export async function createDepartment(name: string): Promise<Department> {
  const data = await apiFetch("/api/admin/departments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const dept = asDepartment(data);
  if (!dept) throw new Error("Failed to create department.");
  return dept;
}

export async function deleteDepartment(id: Department["id"]): Promise<void> {
  await apiFetch(`/api/admin/departments/${id}`, { method: "DELETE" });
}
