import { supabase } from "@/lib/supabase";

export interface ServiceOverview {
  paragraphs: string[];
  keyAreas: string[];
  targetAudience: string[];
}

export interface DeliveryStage {
  number: number;
  title: string;
  subtitle: string;
  outcome: string;
  achieved: string[];
  deliverables: string[];
}

export interface ServiceDeliverable {
  title: string;
  description: string;
}

export interface RequiredInput {
  category: string;
  items: string[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  provider: string;
  category: string;
  tags: string[];
  serviceCategory: string;
  serviceAvailability: string;
  serviceReadiness: string;
  duration: string;
  overview: ServiceOverview;
  deliveryStages: DeliveryStage[];
  deliverables: ServiceDeliverable[];
  requiredInputs: RequiredInput[];
  isPublished: boolean;
  sortOrder: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromRow(r: any): Service {
  return {
    id: r.id,
    title: r.title,
    description: r.description ?? "",
    provider: r.provider ?? "DigitalQatalyst",
    category: r.category,
    tags: r.tags ?? [],
    serviceCategory: r.service_category ?? "",
    serviceAvailability: r.service_availability ?? "Available",
    serviceReadiness: r.service_readiness ?? "Ready to Order",
    duration: r.duration ?? "",
    overview: r.overview ?? { paragraphs: [], keyAreas: [], targetAudience: [] },
    deliveryStages: r.delivery_stages ?? [],
    deliverables: r.deliverables ?? [],
    requiredInputs: r.required_inputs ?? [],
    isPublished: !!r.is_published,
    sortOrder: r.sort_order ?? 0,
  };
}

export async function listPublishedServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function getServiceById(id: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();
  if (error) throw error;
  return data ? fromRow(data) : null;
}
