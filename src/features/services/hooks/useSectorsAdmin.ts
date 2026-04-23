import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SectorRow {
  id: string;
  slug: string;
  name: string;
  title: string;
  subtitle: string;
  focus: string;
  sectorGroupId: string;
  iconName: string;
  heroImage: string;
  overviewImage: string;
  overviewVideo: string;
  overviewDescription: string;
  technologies: string[];
  benefits: string[];
  useCases: string[];
  stats: Array<{ value: string; label: string }>;
  corePillars: Array<{ title: string; description: string }>;
  whyReasons: Array<{ icon: string; title: string; description: string }>;
  keyBenefits: Array<{ icon: string; title: string; description: string }>;
  whereToStartItems: Array<{ title: string; description: string }>;
  focusAreasItems: Array<{ number: string; title: string; description: string }>;
  sortOrder: number;
}

export type SectorInput = Omit<SectorRow, "sortOrder"> & { sortOrder?: number };

// ─── Row mapper ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromRow(r: any): SectorRow {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    title: r.title,
    subtitle: r.subtitle ?? "",
    focus: r.focus ?? "",
    sectorGroupId: r.sector_group_id,
    iconName: r.icon_name ?? "",
    heroImage: r.hero_image ?? "",
    overviewImage: r.overview_image ?? "",
    overviewVideo: r.overview_video ?? "",
    overviewDescription: r.overview_description ?? "",
    technologies: r.technologies ?? [],
    benefits: r.benefits ?? [],
    useCases: r.use_cases ?? [],
    stats: r.stats ?? [],
    corePillars: r.core_pillars ?? [],
    whyReasons: r.why_reasons ?? [],
    keyBenefits: r.key_benefits ?? [],
    whereToStartItems: r.where_to_start_items ?? [],
    focusAreasItems: r.focus_areas_items ?? [],
    sortOrder: r.sort_order ?? 0,
  };
}

// ─── API ──────────────────────────────────────────────────────────────────────

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(path, { credentials: "include", ...init });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function listAllSectors(): Promise<SectorRow[]> {
  const data = await apiFetch("/api/admin/sectors");
  return (data as unknown[]).map(fromRow);
}

export async function createSector(input: SectorInput): Promise<SectorRow> {
  const data = await apiFetch("/api/admin/sectors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return fromRow(data);
}

export async function updateSector(id: string, input: Partial<SectorInput>): Promise<SectorRow> {
  const data = await apiFetch(`/api/admin/sectors/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return fromRow(data);
}

export async function deleteSector(id: string): Promise<void> {
  await apiFetch(`/api/admin/sectors/${id}`, { method: "DELETE" });
}

export async function uploadSectorMedia(file: File, folder: string): Promise<{ path: string; url: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  const res = await fetch("/api/admin/sector-media", { method: "POST", body: formData });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Upload failed: ${res.status}`);
  }
  return res.json();
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

const KEY = ["sectors-admin"] as const;

export function useAllSectors() {
  return useQuery({ queryKey: KEY, queryFn: listAllSectors });
}

export function useCreateSector() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SectorInput) => createSector(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateSector() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<SectorInput> }) =>
      updateSector(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteSector() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSector(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
