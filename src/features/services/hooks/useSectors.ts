import { useQuery } from "@tanstack/react-query";
import { resolveIcon, type SectorData } from "@/features/services/data/sectors.db";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SectorGroupWithItems {
  id: string;
  label: string;
  description: string;
  sort_order: number;
  items: Array<{ id: string; slug: string; name: string }>;
}

// ─── API helpers ──────────────────────────────────────────────────────────────

function apiUrl(path: string) {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    (typeof window === "undefined" ? "http://localhost:3000" : "");
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

// ─── Row mapper ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromRow(r: any): SectorData {
  return {
    id: r.id,
    name: r.name,
    title: r.title,
    subtitle: r.subtitle,
    focus: r.focus,
    heroImage: r.hero_image,
    overviewImage: r.overview_image,
    overviewVideo: r.overview_video,
    overviewDescription: r.overview_description,
    technologies: r.technologies ?? [],
    benefits: r.benefits ?? [],
    useCases: r.use_cases ?? [],
    stats: r.stats,
    corePillars: r.core_pillars ?? [],
    whyReasons: (r.why_reasons ?? []).map((x: { icon: string; title: string; description: string }) => ({
      ...x,
      icon: resolveIcon(x.icon),
    })),
    keyBenefits: r.key_benefits?.length
      ? r.key_benefits.map((x: { icon: string; title: string; description: string }) => ({
          ...x,
          icon: resolveIcon(x.icon),
        }))
      : undefined,
    whereToStartItems: r.where_to_start_items?.length ? r.where_to_start_items : undefined,
    focusAreasItems: r.focus_areas_items?.length ? r.focus_areas_items : undefined,
  };
}

// ─── Fetch functions (used by server components + hooks) ─────────────────────

export async function listSectorGroups(): Promise<SectorGroupWithItems[]> {
  return apiFetch("/api/sectors");
}

export async function getSectorBySlug(slug: string): Promise<SectorData | null> {
  try {
    const data = await apiFetch(`/api/sectors/${slug}`);
    return fromRow(data);
  } catch {
    return null;
  }
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const SECTORS_KEY = ["sectors"] as const;

export function useSectorGroups() {
  return useQuery({ queryKey: SECTORS_KEY, queryFn: listSectorGroups });
}

export function useSector(slug: string) {
  return useQuery({
    queryKey: [...SECTORS_KEY, slug],
    queryFn: () => getSectorBySlug(slug),
    enabled: !!slug,
  });
}
