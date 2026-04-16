import {
  Settings,
  GraduationCap,
  TrendingUp,
  Rocket,
  Database,
  Cloud,
  Brain,
  FileText,
  Network,
  Building,
} from "lucide-react";

export type ProductClass =
  | "all"
  | "class01"
  | "class02"
  | "class03"
  | "class04";

export const stats = [
  {
    value: "50%",
    title: "Cut Transformation Costs",
    description:
      "DQ's productized solutions save you significantly compared to traditional consulting models, delivering cost-effective results without compromising quality.",
  },
  {
    value: "80%",
    title: "Accelerate Transformation",
    description:
      "Our streamlined approach allows you to reach Digital Organization maturity in a fraction of the time, optimizing your resources and boosting efficiency.",
  },
  {
    value: "360°",
    title: "Unlock Insights for Growth",
    description:
      "Enhance services, products, and positioning with data-driven insights that continuously improve your business, helping you stay competitive and innovative.",
  },
  {
    value: "15+",
    title: "Years of Product Development",
    description:
      "With 15+ years of product development, DQ has refined more than 10 products and services to meet market needs, driving long-term growth and transformation.",
  },
];

export const testimonials = [
  {
    quote:
      "Digital Qatalyst brought architectural clarity and execution discipline that significantly elevated our Digital Business Products growth agenda. This was not simply advisory work; it was structured design that positioned us for sustainable digital growth.",
    name: "Dr. Tariq Aslam",
    title: "VP Digital | ABB EMEA",
    initials: "TA",
  },
  {
    quote:
      "Digital Qatalyst helped us rethink how research operations can function in a digitally enabled environment. The result has been improved efficiency, stronger clarity on digital priorities, and a more future-ready research function.",
    name: "Cho Edwards",
    title: "Product Manager | Procter & Gamble (UK)",
    initials: "CE",
  },
];

export const sixXDFramework = [
  {
    number: 1,
    title: "Digital Economy (DE)",
    description:
      "Transform your business to thrive in the digital economy with data-driven decisions that unlock new revenue and increase profitability.",
    href: "/dtmi/article/why-traditional-organizations-are-obsolete",
  },
  {
    number: 2,
    title: "Digital Cognitive Organization (DCO)",
    description:
      "Leverage AI and automation to drive smarter decision-making and enhance operational agility in real-time.",
    href: "/dtmi/article/why-traditional-business-models-are-doomed",
  },
  {
    number: 3,
    title: "Digital Business Platform (DBP)",
    description:
      "Streamline workflows and improve collaboration with a unified platform that integrates all key business functions.",
    href: "/dtmi/article/traditional-digital-transformation-is-dead",
  },
  {
    number: 4,
    title: "Digital Transformation (DT2.0)",
    description:
      "Accelerate your transformation with strategic digital technologies that enhance performance and meet evolving customer needs.",
    href: "/expert-interviews/digital-transformation-strategies-modern-businesses",
  },
  {
    number: 5,
    title: "Digital Worker & Workspace (DW/WS)",
    description:
      "Empower your workforce with intelligent tools that boost productivity, collaboration, and engagement in the digital workspace.",
    href: "/dtmi/article/why-traditional-business-models-are-doomed",
  },
  {
    number: 6,
    title: "Digital Accelerators",
    description:
      "Speed up your transformation with ready-to-use, scalable solutions that drive fast implementation and continuous growth.",
    href: "/marketplace/dtmi/prediction-analysis",
  },
];

export type OfferingItem = {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
};

export type OfferingClass = {
  id: ProductClass;
  label: string;
  title: string;
  subtitle: string;
  cols: "2" | "3";
  items: OfferingItem[];
};

export const offeringClasses: OfferingClass[] = [
  {
    id: "class01",
    label: "Class 01 DBP Services",
    title: "Class 01 — DBP Services",
    subtitle:
      "Blueprint-based advisory and implementation forming the architectural foundation of transformation.",
    cols: "2",
    items: [
      {
        icon: Settings,
        title: "DBP Designs – Strategy, Architecture, Roadmaps",
        description:
          "Blueprint-based advisory defining digital strategy, architecture, operating models, and sector transformation roadmaps.",
        href: "/services/design-4-0",
        linkLabel: "Learn More",
      },
      {
        icon: Rocket,
        title: "DBP Deploys – Platform Implementation",
        description:
          "Blueprint-driven implementation of Experience 4.0, Agility 4.0, Intelligence 4.0, Workspace 4.0, and Sector 4.0 platforms.",
        href: "/services/deploy-4-0",
        linkLabel: "Learn More",
      },
    ],
  },
  {
    id: "class02",
    label: "Class 02 DT 2.0 Products",
    title: "Class 02 — DT 2.0 Products",
    subtitle:
      "Platforms that industrialize and automate transformation execution across the organization.",
    cols: "3",
    items: [
      {
        icon: Database,
        title: "DTMP – Specification & Orchestration Platform",
        description:
          "End-to-end DBP specification and orchestration platform accelerating strategy, design, deployment, and adoption.",
        href: "/products/dtmp",
        linkLabel: "Learn More",
      },
      {
        icon: Cloud,
        title: "TMaaS – Transformation as a Service",
        description:
          "Marketplace-driven managed transformation initiatives delivered as scalable Transformation-as-a-Service.",
        href: "/products/tmaas",
        linkLabel: "Learn More",
      },
      {
        icon: Brain,
        title: "DTO4T (TwinGM AI) – AI-Guided Transformation",
        description:
          "AI-guided digital twin transformation platform reinforcing precision execution as a continuous discipline.",
        href: "/products/plant40",
        linkLabel: "Learn More",
      },
    ],
  },
  {
    id: "class03",
    label: "Class 03 DCO Products",
    title: "Class 03 — DCO Products",
    subtitle:
      "Intellectual infrastructure enabling organizations to understand and operate as Digital Cognitive Organizations.",
    cols: "3",
    items: [
      {
        icon: TrendingUp,
        title: "DTMI – Digital Transformation Management Insights",
        description:
          "Global digital transformation management insights platform structured by 6xD and sector lenses.",
        href: "/products/dtmi",
        linkLabel: "Learn More",
      },
      {
        icon: GraduationCap,
        title: "DTMA – Digital Transformation Academy",
        description:
          "Structured learning programs building competencies for operating in Digital Cognitive Organizations.",
        href: "/products/dtma",
        linkLabel: "Learn More",
      },
      {
        icon: FileText,
        title: "DTMB (6xD / GHC Series) – Published Intellectual Foundation",
        description:
          "Published intellectual foundation codifying DQ's digital transformation frameworks.",
        href: "/products/dtmb",
        linkLabel: "Learn More",
      },
    ],
  },
  {
    id: "class04",
    label: "Class 04 TxM Platforms",
    title: "Class 04 — TxM Platforms",
    subtitle:
      "Live transaction ecosystems operationalizing transformation into economic infrastructure.",
    cols: "2",
    items: [
      {
        icon: Network,
        title: "TxM (B2B2C) – Consumer Ecosystems",
        description:
          "Consumer and experience ecosystems powered by unified DBPs enabling near-perfect life transactions.",
        href: "/consultation",
        linkLabel: "Book Consultation",
      },
      {
        icon: Building,
        title: "TxM (B2B2B) – Enterprise Ecosystems",
        description:
          "Enterprise transaction ecosystems enabling scalable partner and supply chain collaboration.",
        href: "/consultation",
        linkLabel: "Book Consultation",
      },
    ],
  },
];

export const productOptions = [
  { value: "DTMP", label: "DTMP - Specification & Orchestration Platform" },
  { value: "TMaaS", label: "TMaaS - Transformation as a Service" },
  { value: "DTO4T", label: "DTO4T (TwinGM AI) - AI-Guided Transformation" },
  { value: "DTMI", label: "DTMI - Digital Transformation Market Insights" },
  { value: "DTMA", label: "DTMA - Digital Transformation Academy" },
  { value: "DTMB", label: "DTMB - Published Intellectual Foundation" },
  { value: "TxM-B2B2C", label: "TxM (B2B2C) - Consumer Ecosystems" },
  { value: "TxM-B2B2B", label: "TxM (B2B2B) - Enterprise Ecosystems" },
  { value: "DBP-Services", label: "DBP Services - Design & Deploy" },
  { value: "Multiple", label: "Multiple Products" },
  { value: "Not-Sure", label: "Not Sure Yet" },
];

export const companySizeOptions = [
  { value: "1-50", label: "1-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1000+", label: "1000+ employees" },
];
