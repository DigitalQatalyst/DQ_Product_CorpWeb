import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Service } from "./useServices";
export type { Service } from "./useServices";
export type ServiceInput = Omit<Service, "sortOrder"> & { sortOrder?: number };

// ─── Fetch functions ──────────────────────────────────────────────────────────

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(path, { credentials: "include", ...init });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromRow(r: any): Service {
  return {
    id: r.id, title: r.title, description: r.description ?? "",
    provider: r.provider ?? "DigitalQatalyst", category: r.category,
    tags: r.tags ?? [], serviceCategory: r.service_category ?? "",
    serviceAvailability: r.service_availability ?? "Available",
    serviceReadiness: r.service_readiness ?? "Ready to Order",
    duration: r.duration ?? "",
    overview: r.overview ?? { paragraphs: [], keyAreas: [], targetAudience: [] },
    deliveryStages: r.delivery_stages ?? [], deliverables: r.deliverables ?? [],
    requiredInputs: r.required_inputs ?? [],
    isPublished: !!r.is_published, sortOrder: r.sort_order ?? 0,
  };
}

export async function listAllServices(): Promise<Service[]> {
  const data = await apiFetch("/api/admin/services");
  return (data as unknown[]).map(fromRow);
}

export async function createService(input: ServiceInput): Promise<Service> {
  const data = await apiFetch("/api/admin/services", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return fromRow(data);
}

export async function updateService(id: string, input: Partial<ServiceInput>): Promise<Service> {
  const data = await apiFetch(`/api/admin/services/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return fromRow(data);
}

export async function deleteService(id: string): Promise<void> {
  await apiFetch(`/api/admin/services/${id}`, { method: "DELETE" });
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

const KEY = ["services-admin"] as const;

export function useAllServices() {
  return useQuery({ queryKey: KEY, queryFn: listAllServices });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ServiceInput) => createService(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ServiceInput> }) =>
      updateService(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
