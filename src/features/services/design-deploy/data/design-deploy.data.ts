import {
  Palette, Rocket,
  FileText, ClipboardList, Handshake, Target,
  Sprout, Zap, Factory, Building2, Landmark,
  type LucideIcon,
} from "lucide-react";

export interface MethodologyStep { number: string; title: string; description: string; icon: LucideIcon }
export interface TransformationStep { number: string; title: string; description: string }
export interface IndustryCard { icon: LucideIcon; title: string; description: string }
export interface Faq { question: string; answer: string }
export interface Stat { value: string; label: string }

export interface ServiceContent {
  id: "design" | "deploy";
  slug: string;
  // card data (used on services landing page)
  cardIcon: LucideIcon;
  cardTitle: string;
  cardDescription: string;
  tags: string[];
  // page data
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    breadcrumbs: { label: string; href?: string }[];
  };
  blueprintSection: {
    title: string;
    description: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    imagePrimary: string;
    imageOverlay: string;
    faqs: Faq[];
  };
  stats: Stat[];
  methodology: { eyebrow: string; title: string; ctaLabel: string; image: string; steps: MethodologyStep[] };
  transformationApproach: { eyebrow: string; title: string; steps: TransformationStep[] };
  industryExpertise: { title: string; description: string; ctaLabel: string; cards: IndustryCard[] };
}

const sharedTransformationSteps: TransformationStep[] = [
  { number: "01", title: "Unified Framework",          description: "Achieve a cohesive transformation framework to guide all initiatives and ensure consistent progress." },
  { number: "02", title: "Clear Digital Target",        description: "Establish a definitive view of your organization as a digital entity with a unified vision." },
  { number: "03", title: "Integrated Controls",         description: "Implement unifying controls across initiatives to ensure alignment and scalability." },
  { number: "04", title: "Holistic Oversight",          description: "Ensure fitness for purpose with holistic controls and governance." },
  { number: "05", title: "Full Operational Visibility", description: "Gain critical visibility into transactions, costs, and performance." },
  { number: "06", title: "Portfolio Management",        description: "Accelerate portfolio controls with automation for proactive oversight." },
  { number: "07", title: "Structured Growth",           description: "Operationalize and track digital growth with clear structures." },
];

export const designDeployData: ServiceContent[] = [
  {
    id: "design",
    slug: "design-4-0",
    cardIcon: Palette,
    cardTitle: "Design Services",
    cardDescription: "End-to-end digital design services that create seamless experiences aligned with your business goals, enhancing customer engagement and operational efficiency.",
    tags: ["Digital Experience", "Digital Core", "Connected Intelligence"],
    hero: {
      title: "Design 4.0",
      subtitle: "Architect your digital future with data-driven strategic design and transformation blueprints tailored to your goals.",
      backgroundImage: "/images/tmaas-image.png",
      breadcrumbs: [{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "Design 4.0" }],
    },
    blueprintSection: {
      title: "Transform your organisation with easy-to-implement blueprints",
      description: "From vision to blueprint, we help you define your target Digital Business Platform (DBP), identify gaps, and create a roadmap for successful transformation.",
      primaryCta: { label: "Get Started", href: "/consultation" },
      secondaryCta: { label: "Explore Service Domains", href: "/services" },
      imagePrimary: "/images/Image-4.svg",
      imageOverlay: "/images/Image-5.svg",
      faqs: [
        { question: "What is a DBP?", answer: "A Digital Business Platform (DBP) is a modular architecture that connects strategy, design, and delivery so every initiative ties back to measurable outcomes." },
        { question: "What makes Design 4.0 different from traditional design approaches?", answer: "Unlike traditional approaches, Design 4.0 uses data-driven methodologies, TOGAF frameworks, and lifecycle management to ensure holistic, scalable, and future-ready digital transformations." },
        { question: "What deliverables can I expect from a Design 4.0 project?", answer: "Expect discovery workshops, operating model blueprints, capability maps, and prioritized execution roadmaps that accelerate decision-making." },
      ],
    },
    stats: [
      { value: "30%",  label: "Approximate success rate of traditional digital transformations." },
      { value: "99%",  label: "Success rate of transformations with Design 4.0 approach." },
      { value: "100+", label: "Digital Business Platforms designed to date." },
      { value: "15+",  label: "Years designing Digital Business Platforms globally." },
    ],
    methodology: {
      eyebrow: "Architecting a digital future that aligns with your goals",
      title: "How we design your digital organisation",
      ctaLabel: "Contact Us",
      image: "/images/Image-design.svg",
      steps: [
        { number: "01", title: "Formulate",  description: "We define EPIC use cases that align with your business outcomes, ensuring a strategic foundation for your digital transformation journey.", icon: FileText },
        { number: "02", title: "Specify",    description: "We break down EPICs into detailed FEATURE use cases, creating actionable plans to achieve your organisation's digital objectives effectively.", icon: ClipboardList },
        { number: "03", title: "Deliver",    description: "We implement USER STORY use cases through iterative development, ensuring seamless execution and alignment with your digital transformation goals.", icon: Handshake },
        { number: "04", title: "Transition", description: "We facilitate the smooth adoption of solutions, ensuring your team is equipped and prepared for sustained success in the digital economy.", icon: Handshake },
      ],
    },
    transformationApproach: {
      eyebrow: "Looking beyond tomorrow to create a digital future!",
      title: "Unlock Sustainable Success with a Structured Digital Transformation Approach",
      steps: sharedTransformationSteps,
    },
    industryExpertise: {
      title: "Industry Expertise",
      description: "Specialised knowledge across key industries with tailored transformation approaches",
      ctaLabel: "Explore All Industries",
      cards: [
        { icon: Sprout, title: "Farming 4.0",    description: "Agriculture, forestry, conservation and livestock digital transformation." },
        { icon: Zap,    title: "Agility 4.0",    description: "Digital design and deployment of agile, adaptable, and modular solutions." },
        { icon: Target, title: "Experience 4.0", description: "Design and deploy seamless user experiences across every channel." },
      ],
    },
  },
  {
    id: "deploy",
    slug: "deploy-4-0",
    cardIcon: Rocket,
    cardTitle: "Deploy Services (SaaS & On-Prem)",
    cardDescription: "Rapidly deploy and scale your digital solutions with flexible options, from cloud-based SaaS solutions to on-prem services that ensure full control and compliance.",
    tags: ["Cloud Native", "SaaS Solutions", "On-Premises", "Enterprise", "Compliance"],
    hero: {
      title: "Deploy 4.0",
      subtitle: "Implement scalable digital solutions with precision-guided by data-driven strategies and organizational goals.",
      backgroundImage: "/images/landingpage_hero.png",
      breadcrumbs: [{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "Deploy 4.0" }],
    },
    blueprintSection: {
      title: "Accelerate transformation with blueprint-led strategies that save time and costs.",
      description: "Our blueprints accelerate Digital Business Platform (DBP) deployment, enabling faster, cost-effective implementation, while ensuring high-quality outcomes.",
      primaryCta: { label: "Get Started", href: "/consultation" },
      secondaryCta: { label: "Explore Service Domains", href: "/services" },
      imagePrimary: "/images/deploy-long.svg",
      imageOverlay: "/images/deploy-short.svg",
      faqs: [
        { question: "What is a DBP?", answer: "A Digital Business Platform (DBP) is the end state of an organization's digital transformation journey. It represents a fully integrated set of systems and tools that enable digital operations to function seamlessly." },
        { question: "How long does the deployment process take?", answer: "Deployment timelines vary based on complexity and scope. Typically, initial deployments can be completed within 3-6 months, with full transformation realized over 12-18 months." },
        { question: "What happens after deployment is complete?", answer: "Post-deployment support includes change enablement, optimization sprints, and managed services to sustain outcomes and drive continuous improvements." },
      ],
    },
    stats: [
      { value: "30%",  label: "Average reduction in deployment time using blueprint-led execution." },
      { value: "50%",  label: "Lower cost overruns through precise scope control and automation." },
      { value: "100+", label: "Enterprise platforms deployed using Deploy 4.0 playbooks." },
      { value: "24/7", label: "Operations monitoring and support coverage." },
    ],
    methodology: {
      eyebrow: "Realising a digital future that aligns with your goals",
      title: "How we deploy your Digital Business Platform (DBP)",
      ctaLabel: "Contact Us",
      image: "/images/deploy img.svg",
      steps: [
        { number: "02", title: "Specify",    description: "We break down EPICs into detailed feature use cases, creating actionable plans to achieve your organisation's digital objectives effectively.", icon: ClipboardList },
        { number: "03", title: "Deliver",    description: "We implement user story use cases through iterative development, ensuring seamless execution and alignment with your transformation goals.", icon: Target },
        { number: "04", title: "Transition", description: "We facilitate the smooth adoption of solutions, ensuring teams are equipped and prepared for sustained success in the digital economy.", icon: Handshake },
      ],
    },
    transformationApproach: {
      eyebrow: "Realising a digital future that aligns with your goals",
      title: "Unlock Sustainable Success with a Structured Digital Transformation Approach",
      steps: sharedTransformationSteps,
    },
    industryExpertise: {
      title: "Operational Mastery Across Industries",
      description: "We deploy platforms across multiple domains with proven delivery controls.",
      ctaLabel: "Explore All Industries",
      cards: [
        { icon: Factory,   title: "Plant 4.0",         description: "Digitally enabled plants with predictive maintenance, robotics, and automated QA." },
        { icon: Building2, title: "Infrastructure 4.0", description: "Smart infrastructure delivery with integrated project controls and BIM workflows." },
        { icon: Landmark,  title: "Government 4.0",     description: "Secure citizen services with data sharing hubs and interoperable cloud platforms." },
      ],
    },
  },
];
