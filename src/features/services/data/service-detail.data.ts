// Service detail data — populated per service as they are migrated.
import type { ElementType } from "react";

export interface Faq { question: string; answer: string }
export interface Benefit { icon: ElementType; title: string; description: string }
export interface WhereToStartItem { title: string; description: string }
export interface ServiceArea { number: string; title: string; description: string }

export interface GenericServiceData {
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  overviewText: string;
  overviewClosingText: string;
  videoUrl?: string;
  videoThumbnail?: string;
  showVideoComingSoon?: boolean;
  benefits: Benefit[];
  whereToStart: WhereToStartItem[];
  serviceAreas: ServiceArea[];
  faqs: Faq[];
  sidebarCta: { title: string; description: string };
  faqSectionTitle: string;
}

export const serviceRegistry: Record<string, GenericServiceData> = {};

export const allServiceSlugs = [
  { slug: "experience-4-0", title: "Experience 4.0" },
  { slug: "agility-4-0", title: "Agility 4.0" },
  { slug: "farming-4-0", title: "Farming 4.0" },
  { slug: "plant-4-0", title: "Plant 4.0" },
  { slug: "infrastructure-4-0", title: "Infrastructure 4.0" },
  { slug: "government-4-0", title: "Government 4.0" },
  { slug: "hospitality-4-0", title: "Hospitality 4.0" },
  { slug: "retail-4-0", title: "Retail 4.0" },
  { slug: "service-4-0", title: "Services 4.0" },
  { slug: "logistics-4-0", title: "Logistics 4.0" },
  { slug: "wellness-4-0", title: "Wellness 4.0" },
  { slug: "mining-4-0", title: "Mining 4.0" },
  { slug: "intelligence-4-0", title: "Intelligence 4.0" },
  { slug: "workspace-4-0", title: "Workspace 4.0" },
  { slug: "governance-4-0", title: "Governance 4.0" },
  { slug: "backoffice-4-0", title: "Backoffice 4.0" },
];
