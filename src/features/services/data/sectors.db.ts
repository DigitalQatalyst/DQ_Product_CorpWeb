import {
  TrendingUp, Zap, CheckCircle, Users, Brain, Target,
  Landmark, Building2, Mountain, Sprout, Factory, Truck,
  ShoppingBag, Hotel, Heart, type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  TrendingUp, Zap, CheckCircle, Users, Brain, Target,
  Landmark, Building2, Mountain, Sprout, Factory, Truck,
  ShoppingBag, Hotel, Heart,
};

export function resolveIcon(name: string): LucideIcon {
  return iconMap[name] ?? Zap;
}

// ── Resolved (component-ready) types ─────────────────────────────────────────

export interface SectorData {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  focus: string;
  heroImage: string;
  overviewImage?: string;
  overviewVideo?: string;
  overviewDescription?: string;
  technologies: string[];
  benefits: string[];
  useCases: string[];
  stats: [
    { value: string; label: string },
    { value: string; label: string },
    { value: string; label: string },
  ];
  corePillars: Array<{ title: string; description: string }>;
  whyReasons: Array<{ icon: LucideIcon; title: string; description: string }>;
  keyBenefits?: Array<{ icon: LucideIcon; title: string; description: string }>;
  whereToStartItems?: Array<{ title: string; description: string }>;
  focusAreasItems?: Array<{ number: string; title: string; description: string }>;
}

// ── Raw DB shape ──────────────────────────────────────────────────────────────

export interface DbSectorItem {
  id: string;
  slug: string;
  name: string;
  title: string;
  subtitle: string;
  focus: string;
  sector_group_id: string;
  icon_name: string;
  hero_image: string;
  overview_image?: string;
  overview_video?: string;
  overview_description?: string;
  technologies: string[];
  benefits: string[];
  use_cases: string[];
  stats: Array<{ value: string; label: string }>;
  core_pillars: Array<{ title: string; description: string }>;
  why_reasons: Array<{ icon: string; title: string; description: string }>;
  key_benefits: Array<{ icon: string; title: string; description: string }>;
  where_to_start_items: Array<{ title: string; description: string }>;
  focus_areas_items: Array<{ number: string; title: string; description: string }>;
}

export function toSectorData(db: DbSectorItem): SectorData {
  return {
    id: db.id,
    name: db.name,
    title: db.title,
    subtitle: db.subtitle,
    focus: db.focus,
    heroImage: db.hero_image,
    overviewImage: db.overview_image,
    overviewVideo: db.overview_video,
    overviewDescription: db.overview_description,
    technologies: db.technologies,
    benefits: db.benefits,
    useCases: db.use_cases,
    stats: db.stats as SectorData["stats"],
    corePillars: db.core_pillars,
    whyReasons: db.why_reasons.map((r) => ({ ...r, icon: resolveIcon(r.icon) })),
    keyBenefits: db.key_benefits.length
      ? db.key_benefits.map((b) => ({ ...b, icon: resolveIcon(b.icon) }))
      : undefined,
    whereToStartItems: db.where_to_start_items.length ? db.where_to_start_items : undefined,
    focusAreasItems: db.focus_areas_items.length ? db.focus_areas_items : undefined,
  };
}
