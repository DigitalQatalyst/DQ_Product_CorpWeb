import {
  Palette, Rocket,
  Target, Zap, Brain, Users, Building2, Landmark,
  Mountain, Sprout,
  Factory, Truck,
  ShoppingBag, Hotel, Heart,
  type LucideIcon,
} from "lucide-react";

export type SectorCategory =
  | "cross-sector"
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "quinary";

export interface SectorItem {
  icon: LucideIcon;
  title: string;
  description: string;
  slug: string;
  sector: SectorCategory;
}

export interface SectorGroup {
  id: SectorCategory;
  label: string;
  description: string;
}

export const sectorGroups: SectorGroup[] = [
  {
    id: "cross-sector",
    label: "Cross-Sector Domain",
    description: "Common Digital Business Platforms enabling Experience, Agility, Intelligence, and Workspace transformation across industries.",
  },
  {
    id: "primary",
    label: "Primary Sector",
    description: "Field and resource industries accelerating digital harvesting and operational efficiency.",
  },
  {
    id: "secondary",
    label: "Secondary Sector",
    description: "Production and infrastructure sectors modernising facilities, logistics, and industrial systems.",
  },
  {
    id: "tertiary",
    label: "Tertiary Sector",
    description: "Transaction-based industries transforming government, retail, and service ecosystems.",
  },
  {
    id: "quaternary",
    label: "Quaternary Sector",
    description: "Hospitality industries redefined through intelligent ecosystems and enhanced guest experiences.",
  },
  {
    id: "quinary",
    label: "Quinary Sector",
    description: "Healthcare and wellbeing industries transforming patient care and wellness services through advanced technology.",
  },
];

export const allSectors: SectorItem[] = [
  // ── Cross-Sector ──────────────────────────────────────────────────────────
  { icon: Target,    title: "Experience 4.0",  description: "Creating smooth, enjoyable experiences across all digital channels.",                                                                    slug: "experience-4-0",   sector: "cross-sector" },
  { icon: Zap,       title: "Agility 4.0",     description: "Helping businesses become more flexible and responsive to changes and challenges.",                                                      slug: "agility-4-0",      sector: "cross-sector" },
  { icon: Brain,     title: "Intelligence 4.0",description: "Leverage AI and analytics to gain actionable insights, driving smarter decision-making and business strategies.",                        slug: "intelligence-4-0", sector: "cross-sector" },
  { icon: Users,     title: "Workspace 4.0",   description: "Transform your digital workplace with collaborative tools and technologies that enhance productivity and employee engagement.",            slug: "workspace-4-0",    sector: "cross-sector" },
  { icon: Landmark,  title: "Governance 4.0",  description: "Establish robust governance frameworks to ensure compliance, risk management, and strategic alignment across your organization.",         slug: "governance-4-0",   sector: "cross-sector" },
  { icon: Building2, title: "Backoffice 4.0",  description: "Streamline back-office operations with automation and intelligent systems to improve efficiency and reduce operational costs.",           slug: "backoffice-4-0",   sector: "cross-sector" },

  // ── Primary ───────────────────────────────────────────────────────────────
  { icon: Mountain, title: "Mining 4.0",  description: "Revolutionize mining operations with smart technologies for enhanced safety, efficiency, and sustainable resource extraction.", slug: "mining-4-0",  sector: "primary" },
  { icon: Sprout,   title: "Farming 4.0", description: "Transform agricultural practices with precision farming, IoT sensors, and data analytics to optimize yields and sustainability.", slug: "farming-4-0", sector: "primary" },

  // ── Secondary ─────────────────────────────────────────────────────────────
  { icon: Factory,   title: "Plant 4.0",          description: "Optimize manufacturing plants and supply chains with advanced technology to increase efficiency and flexibility.",                    slug: "plant-4-0",          sector: "secondary" },
  { icon: Truck,     title: "Logistics 4.0",       description: "Improve supply chain operations and logistics management for greater speed, flexibility, and cost efficiency.",                      slug: "logistics-4-0",      sector: "secondary" },
  { icon: Building2, title: "Infrastructure 4.0",  description: "Revamp infrastructure and asset management with innovative tools to drive sustainability and improve operational performance.",       slug: "infrastructure-4-0", sector: "secondary" },

  // ── Tertiary ──────────────────────────────────────────────────────────────
  { icon: Landmark,   title: "Government 4.0", description: "Digitizing public services, improving citizen engagement and governance.",                                                              slug: "government-4-0", sector: "tertiary" },
  { icon: Users,      title: "Services 4.0",   description: "Enhance service delivery and boost customer satisfaction with smarter processes and real-time insights.",                               slug: "service-4-0",    sector: "tertiary" },
  { icon: ShoppingBag,title: "Retail 4.0",     description: "Reimagine retail experiences and optimize merchandising strategies to meet the evolving needs of consumers.",                           slug: "retail-4-0",     sector: "tertiary" },

  // ── Quaternary ────────────────────────────────────────────────────────────
  { icon: Hotel, title: "Hospitality 4.0", description: "Elevate guest experiences and operational efficiency by integrating cutting-edge technology across hospitality services.", slug: "hospitality-4-0", sector: "quaternary" },

  // ── Quinary ───────────────────────────────────────────────────────────────
  { icon: Heart, title: "Wellness 4.0", description: "Transform wellness and healthcare services by leveraging technology to enhance patient care and improve overall well-being.", slug: "wellness-4-0", sector: "quinary" },
];

// ── Services (Design + Deploy) ────────────────────────────────────────────────

export interface ServiceItem {
  icon: LucideIcon;
  title: string;
  slug: string;
  description: string;
  tags: string[];
}

export const mainServices: ServiceItem[] = [
  {
    icon: Palette,
    title: "Design 4.0",
    slug: "design-4-0",
    description: "End-to-end digital design services that create seamless experiences aligned with your business goals, enhancing customer engagement and operational efficiency.",
    tags: ["Digital Experience", "Digital Core", "Connected Intelligence"],
  },
  {
    icon: Rocket,
    title: "Deploy 4.0",
    slug: "deploy-4-0",
    description: "Rapidly deploy and scale your digital solutions with flexible options, from cloud-based SaaS solutions to on-prem services that ensure full control and compliance.",
    tags: ["Cloud Native", "SaaS Solutions", "On-Premises", "Enterprise", "Compliance"],
  },
];

// Helper — get sectors grouped by category
export function getSectorsByGroup(): Array<SectorGroup & { items: SectorItem[] }> {
  return sectorGroups.map((group) => ({
    ...group,
    items: allSectors.filter((s) => s.sector === group.id),
  }));
}
