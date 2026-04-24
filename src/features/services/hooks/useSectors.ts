import { useQuery } from "@tanstack/react-query";
import { resolveIcon, type SectorData } from "@/features/services/data/sectors.db";

export interface SectorGroupWithItems {
  id: string;
  label: string;
  description: string;
  sort_order: number;
  items: Array<{ id: string; slug: string; name: string; subtitle: string }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromRow(r: any): SectorData {
  return {
    id: r.id, name: r.name, title: r.title, subtitle: r.subtitle, focus: r.focus,
    heroImage: r.hero_image, overviewImage: r.overview_image, overviewVideo: r.overview_video,
    overviewDescription: r.overview_description,
    technologies: r.technologies ?? [], benefits: r.benefits ?? [], useCases: r.use_cases ?? [],
    stats: r.stats, corePillars: r.core_pillars ?? [],
    whyReasons: (r.why_reasons ?? []).map((x: { icon: string; title: string; description: string }) => ({ ...x, icon: resolveIcon(x.icon) })),
    keyBenefits: r.key_benefits?.length ? r.key_benefits.map((x: { icon: string; title: string; description: string }) => ({ ...x, icon: resolveIcon(x.icon) })) : undefined,
    whereToStartItems: r.where_to_start_items?.length ? r.where_to_start_items : undefined,
    focusAreasItems: r.focus_areas_items?.length ? r.focus_areas_items : undefined,
  };
}

async function getDb() {
  const { getSupabaseAdmin } = await import("@/lib/supabaseAdmin");
  return getSupabaseAdmin();
}

export async function listSectorGroups(): Promise<SectorGroupWithItems[]> {
  const db = await getDb();
  const [{ data: groups, error: g }, { data: sectors, error: s }] = await Promise.all([
    db.from("sector_groups").select("*").order("sort_order", { ascending: true }),
    db.from("sectors").select("id, slug, name, subtitle, icon_name, sector_group_id, sort_order").order("sort_order", { ascending: true }),
  ]);
  if (g) throw new Error(g.message);
  if (s) throw new Error(s.message);
  return (groups ?? []).map((group: any) => ({ ...group, items: (sectors ?? []).filter((sec: any) => sec.sector_group_id === group.id) }));
}

export async function getSectorBySlug(slug: string): Promise<SectorData | null> {
  const db = await getDb();
  const { data, error } = await db.from("sectors").select("*").eq("slug", slug).maybeSingle();
  if (error || !data) return null;
  return fromRow(data);
}

export const SECTORS_KEY = ["sectors"] as const;

export function useSectorGroups() {
  return useQuery({ queryKey: SECTORS_KEY, queryFn: listSectorGroups });
}

export function useSector(slug: string) {
  return useQuery({ queryKey: [...SECTORS_KEY, slug], queryFn: () => getSectorBySlug(slug), enabled: !!slug });
}
