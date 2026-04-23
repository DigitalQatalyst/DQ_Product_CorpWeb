import { useQuery } from "@tanstack/react-query";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ServiceOverview { paragraphs: string[]; keyAreas: string[]; targetAudience: string[] }
export interface DeliveryStage { number: number; title: string; subtitle: string; outcome: string; achieved: string[]; deliverables: string[] }
export interface ServiceDeliverable { title: string; description: string }
export interface RequiredInput { category: string; items: string[] }

export interface Service {
  id: string; title: string; description: string; provider: string;
  category: string; tags: string[]; serviceCategory: string;
  serviceAvailability: string; serviceReadiness: string; duration: string;
  overview: ServiceOverview; deliveryStages: DeliveryStage[];
  deliverables: ServiceDeliverable[]; requiredInputs: RequiredInput[];
  isPublished: boolean; sortOrder: number;
}

// ─── Row mapper ───────────────────────────────────────────────────────────────

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

// ─── API helpers ──────────────────────────────────────────────────────────────

function apiUrl(path: string) {
  if (typeof window !== "undefined") return path;
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
  const base = process.env.NEXT_PUBLIC_APP_URL ?? vercelUrl ?? "http://localhost:3000";
  return `${base}${path}`;
}

async function apiFetch(path: string) {
  const res = await fetch(apiUrl(path));
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

// ─── Fetch functions (used by server components + hooks) ─────────────────────

export async function listPublishedServices(): Promise<Service[]> {
  const data = await apiFetch("/api/services");
  return (data as unknown[]).map(fromRow);
}

export async function getServiceById(id: string): Promise<Service | null> {
  try {
    const data = await apiFetch(`/api/services/${id}`);
    return fromRow(data);
  } catch {
    return null;
  }
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const SERVICES_KEY = ["services"] as const;

export function usePublishedServices() {
  return useQuery({ queryKey: SERVICES_KEY, queryFn: listPublishedServices });
}

export function useServiceById(id: string) {
  return useQuery({
    queryKey: [...SERVICES_KEY, id],
    queryFn: () => getServiceById(id),
    enabled: !!id,
  });
}
