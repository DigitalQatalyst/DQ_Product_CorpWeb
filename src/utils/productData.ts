import React from "react";
import {
  Settings,
  LayoutGrid,
  GraduationCap,
  BookOpen,
  Users,
  Target,
  TrendingUp,
} from "lucide-react";
import type { ProductType } from "../types/product";

export const dqProducts: ProductType[] = [
  {
    id: "tmaas",
    name: "Transformation Management as a Service",
    code: "TMaaS",
    description:
      "Low-cost, architecture-led marketplace for digital transformation initiatives using AI-powered, ready-to-launch blueprints. Accelerate impact, reduce costs, and ensure scalability with our best-practice-based transformation services.",
    tags: ["Architecture-led", "Data-driven", "Best-Practice-based"],
    demoUrl: "/products/tmaas/demo",
    learnMoreUrl: "/products/tmaas",
    category: "Service",
    icon: React.createElement(Settings, {
      size: 32,
      className: "text-primary-500",
    }),
    imageUrl: "/images/tmaas-image.png",
  },
  {
    id: "dtmp",
    name: "Digital Transformation Management Platform",
    code: "DTMP",
    description:
      "An end-to-end platform for managing digital transformation initiatives, offering centralized data management and real-time decision-making insights.",
    tags: ["Repository", "Analytics", "Portal"],
    demoUrl: "/products/dtmp/demo",
    learnMoreUrl: "/products/dtmp",
    category: "Platform",
    icon: React.createElement(LayoutGrid, {
      size: 32,
      className: "text-primary-500",
    }),
    imageUrl: "/images/dtmp-image.png",
  },
  {
    id: "dtma",
    name: "Digital Transformation Management Academy",
    code: "DTMA",
    description:
      "Comprehensive learning academy for digital transformation leaders and practitioners. Access expert-led courses, certifications, and resources to build transformation capabilities.",
    tags: ["Training Programs", "Certification", "Expert-Led Workshops"],
    demoUrl: "/products/dtma/demo",
    learnMoreUrl: "/products/dtma",
    category: "Education",
    icon: React.createElement(GraduationCap, {
      size: 32,
      className: "text-primary-500",
    }),
    imageUrl:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",
  },
  {
    id: "dtmb",
    name: "Digital Transformation Management Book",
    code: "DTMB",
    description:
      "DTMB offers concise, actionable insights on digital transformation through expert-authored books, making complex concepts accessible to leaders.",
    tags: [
      "Actionable Insights",
      "Bite-Sized Learning",
      "Practical Case Studies",
    ],
    demoUrl: "/products/dtmb/demo",
    learnMoreUrl: "/products/dtmb",
    category: "Resources",
    icon: React.createElement(BookOpen, {
      size: 32,
      className: "text-primary-500",
    }),
    imageUrl:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=600&fit=crop",
  },
  {
    id: "dtmcc",
    name: "Digital Working Studios",
    code: "DWS",
    description:
      "In Economy 4.0, success requires digital workers—professionals who thrive through human-machine collaboration. Digital Working Studios (DWS) empowers this new workforce with spaces designed for AI-augmented productivity. Our first studio is in Nairobi, Kenya (Babadogo), with global expansion underway.",
    tags: ["Digital Workers", "AI Collaboration", "Global Network"],
    demoUrl: "/products/dtmcc/demo",
    learnMoreUrl: "/products/dtmcc",
    category: "Collaboration",
    icon: React.createElement(Users, {
      size: 32,
      className: "text-primary-500",
    }),
    imageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
  },
  {
    id: "dtmi",
    name: "Digital Transformation Management Insights",
    code: "DTMI",
    description:
      "Global digital transformation management insights platform structured by 6xD and sector lenses. Access research-driven insights, articles, case studies, and digital transformation content from industry experts and thought leaders.",
    tags: ["Market Intelligence", "Research Insights", "Industry Analysis"],
    demoUrl: "/products/dtmi/demo",
    learnMoreUrl: "/products/dtmi",
    category: "Intelligence",
    icon: React.createElement(TrendingUp, {
      size: 32,
      className: "text-primary-500",
    }),
    imageUrl: "/images/DTMI-banner.png",
  },
  {
    id: "plant40",
    name: "Plant 4.0",
    code: "Plant 4.0",
    description:
      "Tailored solutions for asset-intensive industries that optimize asset management and operational efficiency to maximize ROI.",
    tags: [
      "Asset Management",
      "Operational Efficiency",
      "Sustainability Focus",
    ],
    demoUrl: "/products/plant40/demo",
    learnMoreUrl: "/products/plant40",
    category: "Platform",
    icon: React.createElement(Target, {
      size: 32,
      className: "text-primary-500",
    }),
    imageUrl: "/images/plant4.0-image.png",
  },
];
