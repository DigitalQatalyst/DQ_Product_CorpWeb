export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  provider: string;
  category: "Design Services" | "Deploy Services (SaaS)" | "Deploy Services (On-Prem)";
  tags: string[];
  serviceCategory: string;
  serviceAvailability: string;
  serviceReadiness: string;
  duration: string;
  // Detail page content
  overview: {
    paragraphs: string[];
    keyAreas: string[];
    targetAudience: string[];
  };
  deliveryStages: Array<{
    number: number;
    title: string;
    subtitle: string;
    outcome: string;
    achieved: string[];
    deliverables: string[];
  }>;
  deliverables: Array<{ title: string; description: string }>;
  requiredInputs: Array<{ category: string; items: string[] }>;
}

export const serviceItems: ServiceItem[] = [
  {
    id: "digital-core-dws-strategy",
    title: "Digital Workspace Strategy",
    description:
      "Enable seamless collaboration and productivity across your organisation. We deliver clear workspace architectures, collaboration frameworks, and practical design artifacts that enable your teams to work efficiently and securely across your Digital Business Platform.",
    provider: "DigitalQatalyst",
    category: "Design Services",
    tags: ["Core Systems", "Cloud Architecture", "Compliance"],
    serviceCategory: "Digital Core / DWS",
    serviceAvailability: "Available",
    serviceReadiness: "Ready to Order",
    duration: "1–2 weeks",
    overview: {
      paragraphs: [
        "Our approach is intentionally different from traditional workspace consulting. We do not produce static collaboration strategies or theoretical workspace models. Instead, we focus on defining clear workspace architectures, collaboration frameworks, and practical design artifacts (supported by working prototypes) that enable your teams to work efficiently and securely with confidence.",
        "Delivering meaningful workspace transformation requires more than implementing collaboration tools. It demands a cohesive design that aligns workspace technologies, collaboration processes, security frameworks, and productivity models within a well-defined Digital Business Platform context.",
        "The service produces implementation-ready specifications and validated prototypes that enable confident investment and execution across:",
      ],
      keyAreas: [
        "Collaboration Platforms & Tools",
        "Productivity & Communication Systems",
        "Security & Access Management",
        "Workspace Integration & Automation",
      ],
      targetAudience: [
        "Need practical workspace architectures and working collaboration prototypes, not theoretical recommendations",
        "Are modernising or scaling collaboration and productivity capabilities",
        "Operate in distributed or hybrid work environments",
        "Want to move from workspace strategy to seamless collaboration with confidence",
      ],
    },
    deliveryStages: [
      {
        number: 1,
        title: "Envision",
        subtitle: "Strategic clarity and direction",
        outcome: "A clear digital workspace vision aligned to business and technology strategy.",
        achieved: [
          "Workspace vision, positioning, and mandate",
          "Alignment with business priorities and technology direction",
          "Identification of gaps across collaboration and productivity platforms",
        ],
        deliverables: ["Workspace Strategy Report (strategic sections)", "Visual Strategy Summary"],
      },
      {
        number: 2,
        title: "Model",
        subtitle: "Target-state design and operating model",
        outcome: "A defined target state for how digital workspace is designed, delivered, and governed.",
        achieved: [
          "Target capabilities and operating model",
          "Platform and enabling technology architecture",
          "Governance and operating structures",
        ],
        deliverables: ["Workspace Strategy Report (target design)", "Architecture and operating model visuals"],
      },
      {
        number: 3,
        title: "Specify",
        subtitle: "Build-ready requirements",
        outcome: "Clear, actionable specifications ready to drive implementation.",
        achieved: [
          "Prioritised roadmap and initiatives",
          "Functional and non-functional requirements",
          "Workspace, data, and integration specifications",
        ],
        deliverables: ["Digital Workspace Platform Specifications", "Requirements and prioritised feature backlog"],
      },
      {
        number: 4,
        title: "Prototype",
        subtitle: "Validated workspace demonstrations",
        outcome: "Validated designs demonstrated through real workspace scenarios.",
        achieved: [
          "Prototypes for priority digital workspace use cases",
          "Demonstrations across collaboration, productivity, and security",
          "Validation of assumptions and refinement of designs",
        ],
        deliverables: ["Digital Workspace Platform Prototype", "Interactive demos and workspace simulations"],
      },
    ],
    deliverables: [
      { title: "Visual Strategy Summary", description: "A one-page visual overview of the workspace vision, target state, and key design decisions." },
      { title: "Workspace Strategy Report", description: "A structured document capturing the analysis, strategic decisions, and target design underpinning the recommendations." },
      { title: "Workspace Platform Specifications", description: "Clear requirements and a prioritised feature backlog to guide strategy-aligned implementation." },
      { title: "Workspace Platform Prototype", description: "Interactive screens and demonstrations that simulate real workspace scenarios and enable early feedback." },
    ],
    requiredInputs: [
      { category: "Business Vision", items: ["Strategy", "Business model", "Value streams"] },
      { category: "Enterprise Assets", items: ["Business", "Data", "Application", "Technology"] },
      { category: "Workspace Assets", items: ["Current tools", "Collaboration patterns", "User personas"] },
      { category: "Transformation Portfolio", items: ["Roadmaps", "Initiatives", "Requirements"] },
    ],
  },
  {
    id: "digital-organisation-strategy",
    title: "Digital Organisation Strategy",
    description:
      "Transform your entire organisation with a comprehensive Digital Business Platform strategy. We deliver clear enterprise architectures, transformation roadmaps, and practical design artifacts that enable your organisation to execute confidently across all four platform pillars.",
    provider: "DigitalQatalyst",
    category: "Design Services",
    tags: ["Strategy", "Architecture", "Digital Transformation"],
    serviceCategory: "Digital Core / DWS",
    serviceAvailability: "Available",
    serviceReadiness: "Ready to Order",
    duration: "2–3 weeks",
    overview: {
      paragraphs: [
        "Our approach is intentionally different from traditional enterprise consulting. We do not produce static transformation strategies or theoretical operating models. Instead, we focus on defining clear enterprise architectures, integrated platform designs, and practical design artifacts (supported by working prototypes) that enable you to move from organisational vision to platform execution with confidence.",
        "Delivering meaningful digital transformation requires more than implementing individual solutions. It demands a cohesive design that aligns all four pillars of the Digital Business Platform: customer experiences, employee collaboration, data intelligence, and secure operations within a unified, well-defined enterprise context.",
        "The service produces implementation-ready specifications and validated prototypes that enable confident investment and execution across:",
      ],
      keyAreas: [
        "Digital Experience Platform (DXP)",
        "Digital Workspace (DWS)",
        "Digital Intelligence & Analytics (DIA)",
        "Security & DevOps (SecDevOps)",
      ],
      targetAudience: [
        "Need comprehensive enterprise platform architectures and working prototypes, not theoretical recommendations",
        "Are undertaking large-scale digital transformation across the organisation",
        "Want to integrate customer experience, employee collaboration, data intelligence, and secure operations",
        "Want to move from enterprise vision to platform execution with confidence",
      ],
    },
    deliveryStages: [
      {
        number: 1,
        title: "Envision",
        subtitle: "Strategic clarity and direction",
        outcome: "A clear enterprise digital vision aligned to business and technology strategy.",
        achieved: [
          "Enterprise vision, positioning, and mandate",
          "Alignment with business priorities and technology direction",
          "Identification of gaps across all four platform pillars",
        ],
        deliverables: ["Enterprise Strategy Report (strategic sections)", "Visual Strategy Summary"],
      },
      {
        number: 2,
        title: "Model",
        subtitle: "Target-state design and operating model",
        outcome: "A defined target state for how the enterprise digital platform is designed, delivered, and governed.",
        achieved: [
          "Target capabilities and operating model",
          "Integrated platform architecture across all four pillars",
          "Governance and operating structures",
        ],
        deliverables: ["Enterprise Strategy Report (target design)", "Architecture and operating model visuals"],
      },
      {
        number: 3,
        title: "Specify",
        subtitle: "Build-ready requirements",
        outcome: "Clear, actionable specifications ready to drive implementation.",
        achieved: [
          "Prioritised roadmap and initiatives",
          "Functional and non-functional requirements",
          "Cross-platform integration specifications",
        ],
        deliverables: ["Enterprise Platform Specifications", "Requirements and prioritised feature backlog"],
      },
      {
        number: 4,
        title: "Prototype",
        subtitle: "Validated enterprise demonstrations",
        outcome: "Validated designs demonstrated through real enterprise scenarios.",
        achieved: [
          "Prototypes for priority enterprise use cases",
          "Demonstrations across all four platform pillars",
          "Validation of assumptions and refinement of designs",
        ],
        deliverables: ["Enterprise Platform Prototype", "Interactive demos and enterprise simulations"],
      },
    ],
    deliverables: [
      { title: "Visual Strategy Summary", description: "A one-page visual overview of the enterprise vision, target state, and key design decisions." },
      { title: "Enterprise Strategy Report", description: "A structured document capturing the analysis, strategic decisions, and target design underpinning the recommendations." },
      { title: "Enterprise Platform Specifications", description: "Clear requirements and a prioritised feature backlog to guide strategy-aligned implementation." },
      { title: "Enterprise Platform Prototype", description: "Interactive screens and demonstrations that simulate real enterprise scenarios and enable early feedback." },
    ],
    requiredInputs: [
      { category: "Business Vision", items: ["Strategy", "Business model", "Value streams"] },
      { category: "Enterprise Assets", items: ["Business", "Data", "Application", "Technology"] },
      { category: "Experience Assets", items: ["Customer segments", "Journeys", "Touchpoints"] },
      { category: "Transformation Portfolio", items: ["Roadmaps", "Initiatives", "Requirements"] },
    ],
  },
  {
    id: "digital-intelligence-strategy",
    title: "Digital Intelligence Strategy",
    description:
      "Transform data into actionable intelligence. We deliver clear data models, analytics architectures, and practical design artifacts that enable your organisation to make data-driven decisions with confidence across your Digital Business Platform.",
    provider: "DigitalQatalyst",
    category: "Design Services",
    tags: ["AI/ML", "Data Integration", "Analytics Platform"],
    serviceCategory: "Connected Intelligence",
    serviceAvailability: "Available",
    serviceReadiness: "Ready to Order",
    duration: "1–2 weeks",
    overview: {
      paragraphs: [
        "Our approach is intentionally different from traditional data consulting. We do not produce static data strategies or theoretical data models. Instead, we focus on defining clear data architectures, analytics frameworks, and practical design artifacts (supported by working prototypes) that enable you to move from data chaos to data-driven insights with confidence.",
        "Delivering meaningful data intelligence requires more than implementing analytics tools. It demands a cohesive design that aligns data sources, analytics capabilities, governance frameworks, and operating models within a well-defined Digital Business Platform context.",
        "The service produces implementation-ready specifications and validated prototypes that enable confident investment and execution across:",
      ],
      keyAreas: [
        "Data Architecture & Integration",
        "Analytics & Business Intelligence",
        "AI & Machine Learning Capabilities",
        "Data Governance & Quality",
      ],
      targetAudience: [
        "Need practical data architectures and working analytics prototypes, not theoretical recommendations",
        "Are modernising or scaling data and analytics capabilities",
        "Operate in data-intensive or regulated environments",
        "Want to move from data strategy to data-driven insights with confidence",
      ],
    },
    deliveryStages: [
      {
        number: 1,
        title: "Envision",
        subtitle: "Strategic clarity and direction",
        outcome: "A clear data intelligence vision aligned to business and technology strategy.",
        achieved: [
          "Data vision, positioning, and mandate",
          "Alignment with business priorities and technology direction",
          "Identification of gaps across data and analytics platforms",
        ],
        deliverables: ["Intelligence Strategy Report (strategic sections)", "Visual Strategy Summary"],
      },
      {
        number: 2,
        title: "Model",
        subtitle: "Target-state design and operating model",
        outcome: "A defined target state for how data intelligence is designed, delivered, and governed.",
        achieved: [
          "Target data capabilities and operating model",
          "Platform and enabling technology architecture",
          "Data governance and operating structures",
        ],
        deliverables: ["Intelligence Strategy Report (target design)", "Architecture and operating model visuals"],
      },
      {
        number: 3,
        title: "Specify",
        subtitle: "Build-ready requirements",
        outcome: "Clear, actionable specifications ready to drive implementation.",
        achieved: [
          "Prioritised roadmap and initiatives",
          "Functional and non-functional requirements",
          "Data, analytics, and integration specifications",
        ],
        deliverables: ["Digital Intelligence Platform Specifications", "Requirements and prioritised feature backlog"],
      },
      {
        number: 4,
        title: "Prototype",
        subtitle: "Validated intelligence demonstrations",
        outcome: "Validated designs demonstrated through real data intelligence scenarios.",
        achieved: [
          "Prototypes for priority data intelligence use cases",
          "Demonstrations across analytics, AI/ML, and data governance",
          "Validation of assumptions and refinement of designs",
        ],
        deliverables: ["Digital Intelligence Platform Prototype", "Interactive demos and analytics simulations"],
      },
    ],
    deliverables: [
      { title: "Visual Strategy Summary", description: "A one-page visual overview of the data intelligence vision, target state, and key design decisions." },
      { title: "Intelligence Strategy Report", description: "A structured document capturing the analysis, strategic decisions, and target design underpinning the recommendations." },
      { title: "Intelligence Platform Specifications", description: "Clear requirements and a prioritised feature backlog to guide strategy-aligned implementation." },
      { title: "Intelligence Platform Prototype", description: "Interactive screens and demonstrations that simulate real analytics scenarios and enable early feedback." },
    ],
    requiredInputs: [
      { category: "Business Vision", items: ["Strategy", "Business model", "Value streams"] },
      { category: "Data Assets", items: ["Data sources", "Existing models", "Analytics tools"] },
      { category: "Governance Assets", items: ["Data policies", "Compliance requirements", "Quality standards"] },
      { category: "Transformation Portfolio", items: ["Roadmaps", "Initiatives", "Requirements"] },
    ],
  },
  {
    id: "digital-experience-strategy",
    title: "Digital Experience Strategy",
    description:
      "Move from strategic intent to execution with confidence. We deliver clear experience models, target architectures, and practical design artifacts—supported by working prototypes—that enable your organisation to invest decisively across your Digital Business Platform.",
    provider: "DigitalQatalyst",
    category: "Design Services",
    tags: ["Design", "Available", "Digital Experience"],
    serviceCategory: "Digital Experience",
    serviceAvailability: "Available",
    serviceReadiness: "Ready to Order",
    duration: "1–2 weeks",
    overview: {
      paragraphs: [
        "Our approach is intentionally different from traditional consulting. We do not produce static strategies or theoretical recommendations. Instead, we focus on defining clear experience models, target architectures, and practical design artifacts—supported by working prototypes—that enable you to move from strategic intent to execution with confidence.",
        "Delivering meaningful digital experience requires more than improving individual channels. It demands a cohesive design that aligns customer journeys, data, platforms, and operating models within a well-defined Digital Business Platform context.",
        "The service produces implementation-ready specifications and validated prototypes that enable confident investment and execution across:",
      ],
      keyAreas: [
        "Digital Experience Platforms (DXP)",
        "Digital Workspace (DWS)",
        "Digital Intelligence & Analytics (DIA)",
        "Security & DevOps (SecDevOps)",
      ],
      targetAudience: [
        "Need practical design artifacts and working prototypes, not theoretical recommendations",
        "Are modernising or scaling digital customer experiences",
        "Operate in regulated or complex enterprise environments",
        "Want to move from strategic intent to execution with confidence",
      ],
    },
    deliveryStages: [
      {
        number: 1,
        title: "Envision",
        subtitle: "Strategic clarity and direction",
        outcome: "A clear digital experience vision aligned to business and technology strategy.",
        achieved: [
          "Experience vision, positioning, and mandate",
          "Alignment with business priorities and technology direction",
          "Identification of gaps across customer journeys and platforms",
        ],
        deliverables: ["Digital Experience Strategy Report (strategic sections)", "Visual Strategy Summary"],
      },
      {
        number: 2,
        title: "Model",
        subtitle: "Target-state design and operating model",
        outcome: "A defined target state for how digital experience is designed, delivered, and governed.",
        achieved: [
          "Target capabilities and operating model",
          "Platform and enabling technology architecture",
          "Governance and operating structures",
        ],
        deliverables: ["Digital Experience Strategy Report (target design)", "Architecture and operating model visuals"],
      },
      {
        number: 3,
        title: "Specify",
        subtitle: "Build-ready requirements",
        outcome: "Clear, actionable specifications ready to drive implementation.",
        achieved: [
          "Prioritised roadmap and initiatives",
          "Functional and non-functional requirements",
          "Experience, data, and integration specifications",
        ],
        deliverables: ["Digital Experience Platform Specifications", "Requirements and prioritised feature backlog"],
      },
      {
        number: 4,
        title: "Prototype",
        subtitle: "Validated experience demonstrations",
        outcome: "Validated designs demonstrated through real experience scenarios.",
        achieved: [
          "Prototypes for priority digital experience use cases",
          "Demonstrations across DXP, DWS, SecDevOps, and DIA",
          "Validation of assumptions and refinement of designs",
        ],
        deliverables: ["Digital Experience Platform Prototype", "Interactive demos and experience simulations"],
      },
    ],
    deliverables: [
      { title: "Visual Strategy Summary", description: "A one-page visual overview of the digital experience vision, target state, and key design decisions." },
      { title: "Digital Experience Strategy Report", description: "A structured document capturing the analysis, strategic decisions, and target design underpinning the recommendations." },
      { title: "Digital Experience Platform Specifications", description: "Clear requirements and a prioritised feature backlog to guide strategy-aligned implementation." },
      { title: "Digital Experience Platform Prototype", description: "Interactive screens and demonstrations that simulate real experience scenarios and enable early feedback." },
    ],
    requiredInputs: [
      { category: "Business Vision", items: ["Strategy", "Business model", "Value streams"] },
      { category: "Enterprise Assets", items: ["Business", "Data", "Application", "Technology"] },
      { category: "Experience Assets", items: ["Customer segments", "Journeys", "Touchpoints"] },
      { category: "Transformation Portfolio", items: ["Roadmaps", "Initiatives", "Requirements"] },
    ],
  },
  {
    id: "devops-strategy",
    title: "SecDevOps Strategy",
    description:
      "Build security into every layer of your digital platform. We deliver clear security architectures, DevOps frameworks, and practical design artifacts that enable your organisation to deploy securely and operate confidently across your Digital Business Platform.",
    provider: "DigitalQatalyst",
    category: "Design Services",
    tags: ["DevOps", "CI/CD", "Automation", "Security"],
    serviceCategory: "Connected Intelligence",
    serviceAvailability: "Available",
    serviceReadiness: "Ready to Order",
    duration: "1–2 weeks",
    overview: {
      paragraphs: [
        "Our approach is intentionally different from traditional security consulting. We do not produce static security policies or theoretical compliance frameworks. Instead, we focus on defining clear security architectures, DevOps practices, and practical design artifacts (supported by working prototypes) that enable you to move from security concerns to secure operations with confidence.",
        "Delivering meaningful security and operational excellence requires more than implementing security tools. It demands a cohesive design that aligns security controls, DevOps practices, compliance requirements, and operating models within a well-defined Digital Business Platform context.",
        "The service produces implementation-ready specifications and validated prototypes that enable confident investment and execution across:",
      ],
      keyAreas: [
        "Security Architecture & Controls",
        "DevOps & CI/CD Pipelines",
        "Compliance & Governance",
        "Infrastructure & Cloud Security",
      ],
      targetAudience: [
        "Need practical security architectures and working DevOps prototypes, not theoretical recommendations",
        "Are modernising or scaling security and operational capabilities",
        "Operate in regulated or high-security environments",
        "Want to move from security strategy to secure operations with confidence",
      ],
    },
    deliveryStages: [
      {
        number: 1,
        title: "Envision",
        subtitle: "Strategic clarity and direction",
        outcome: "A clear SecDevOps vision aligned to business and technology strategy.",
        achieved: [
          "Security vision, positioning, and mandate",
          "Alignment with business priorities and compliance requirements",
          "Identification of gaps across security and DevOps practices",
        ],
        deliverables: ["SecDevOps Strategy Report (strategic sections)", "Visual Strategy Summary"],
      },
      {
        number: 2,
        title: "Model",
        subtitle: "Target-state design and operating model",
        outcome: "A defined target state for how security and DevOps are designed, delivered, and governed.",
        achieved: [
          "Target security capabilities and operating model",
          "Platform and enabling technology architecture",
          "Compliance and governance structures",
        ],
        deliverables: ["SecDevOps Strategy Report (target design)", "Architecture and operating model visuals"],
      },
      {
        number: 3,
        title: "Specify",
        subtitle: "Build-ready requirements",
        outcome: "Clear, actionable specifications ready to drive implementation.",
        achieved: [
          "Prioritised roadmap and initiatives",
          "Security and DevOps requirements",
          "Pipeline and infrastructure specifications",
        ],
        deliverables: ["SecDevOps Platform Specifications", "Requirements and prioritised feature backlog"],
      },
      {
        number: 4,
        title: "Prototype",
        subtitle: "Validated security demonstrations",
        outcome: "Validated designs demonstrated through real security and DevOps scenarios.",
        achieved: [
          "Prototypes for priority SecDevOps use cases",
          "Demonstrations across security controls, CI/CD, and compliance",
          "Validation of assumptions and refinement of designs",
        ],
        deliverables: ["SecDevOps Platform Prototype", "Interactive demos and pipeline simulations"],
      },
    ],
    deliverables: [
      { title: "Visual Strategy Summary", description: "A one-page visual overview of the SecDevOps vision, target state, and key design decisions." },
      { title: "SecDevOps Strategy Report", description: "A structured document capturing the analysis, strategic decisions, and target design underpinning the recommendations." },
      { title: "SecDevOps Platform Specifications", description: "Clear requirements and a prioritised feature backlog to guide strategy-aligned implementation." },
      { title: "SecDevOps Platform Prototype", description: "Interactive screens and demonstrations that simulate real security and DevOps scenarios." },
    ],
    requiredInputs: [
      { category: "Business Vision", items: ["Strategy", "Business model", "Value streams"] },
      { category: "Security Assets", items: ["Current controls", "Compliance requirements", "Risk register"] },
      { category: "DevOps Assets", items: ["Current pipelines", "Infrastructure", "Toolchain"] },
      { category: "Transformation Portfolio", items: ["Roadmaps", "Initiatives", "Requirements"] },
    ],
  },
];

export const SERVICE_TABS = [
  {
    id: "design-services",
    label: "Design Services",
    description: "Strategic design and architecture services",
  },
  {
    id: "deploy-services-saas",
    label: "Deploy Services (SaaS)",
    description: "Cloud-based deployment services",
  },
  {
    id: "deploy-services-onprem",
    label: "Deploy Services (On-Prem)",
    description: "On-premise deployment services",
  },
] as const;

export type ServiceTabId = (typeof SERVICE_TABS)[number]["id"];

export const FILTER_CONFIG = [
  {
    id: "serviceCategory",
    title: "Service Category",
    options: [
      { id: "digital-experience", label: "Digital Experience" },
      { id: "digital-core-dws", label: "Digital Core / DWS" },
      { id: "connected-intelligence", label: "Connected Intelligence" },
    ],
  },
  {
    id: "serviceAvailability",
    title: "Service Availability",
    options: [
      { id: "available", label: "Available" },
      { id: "coming-soon", label: "Coming Soon" },
    ],
  },
  {
    id: "serviceReadiness",
    title: "Service Readiness",
    options: [
      { id: "ready-to-order", label: "Ready to Order" },
      { id: "has-dependency", label: "Has Dependency" },
    ],
  },
] as const;
