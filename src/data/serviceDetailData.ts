import { 
  Target, 
  Zap, 
  Rocket,
  Sprout, 
  Factory, 
  Building2, 
  Landmark, 
  Hotel, 
  ShoppingBag, 
  Users, 
  Truck, 
  Heart,
  FileText,
  TrendingUp,
  UsersRound,
  DollarSign,
  Palette,
  Lightbulb,
  ClipboardList,
  Gem,
  Handshake
} from "lucide-react";

// Design 4.0 specific content
export const designServiceContent = {
  hero: {
    title: "Design 4.0",
    subtitle:
      "Architect your digital future with data-driven strategic design and transformation blueprints tailored to your goals.",
    backgroundImage: "/images/tmaas-image.png",
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Industry", href: "/services" },
      { label: "Design 4.0" }
    ]
  },
  blueprintSection: {
    title: "Transform your organisation with easy-to-implement blueprints",
    description:
      "From vision to blueprint, we help you define your target Digital Business Platform (DBP), identify gaps, and create a roadmap for successful transformation.",
    primaryCta: { label: "Get Started", href: "/consultation" },
    secondaryCta: { label: "Explore Service Domains", href: "/services" },
    faqs: [
      {
        question: "What is a DBP?",
        answer:
          "A Digital Business Platform (DBP) is a modular architecture that connects strategy, design, and delivery so every initiative ties back to measurable outcomes."
      },
      {
        question: "What makes Design 4.0 different from traditional design approaches?",
        answer:
          "Unlike traditional approaches, Design 4.0 uses data-driven methodologies, TOGAF frameworks, and lifecycle management to ensure holistic, scalable, and future-ready digital transformations."
      },
      {
        question: "What deliverables can I expect from a Design 4.0 project?",
        answer:
          "Expect discovery workshops, operating model blueprints, capability maps, and prioritized execution roadmaps that accelerate decision-making."
      }
    ],
    imagePrimary: "/images/Image-4.svg",
    imageOverlay: "/images/Image-5.svg"
  },
  stats: [
    { value: "30%", label: "Approximate success rate of traditional digital transformations." },
    { value: "99%", label: "Success rate of transformations with Design 4.0 approach." },
    { value: "100+", label: "Digital Business Platforms designed to date." },
    { value: "15+", label: "Years designing Digital Business Platforms globally." }
  ],
  industryExpertise: {
    title: "Industry Expertise",
    description: "Specialised knowledge across key industries with tailored transformation approaches",
    ctaLabel: "Explore All Industries",
    cards: [
      {
        icon: Sprout,
        title: "Farming 4.0",
        description: "Agriculture, forestry, conservation and livestock digital transformation."
      },
      {
        icon: Zap,
        title: "Agility 4.0",
        description: "Digital design and deployment of agile, adaptable, and modular solutions."
      },
      {
        icon: Target,
        title: "Experience 4.0",
        description: "Design and deploy seamless user experiences across every channel."
      }
    ]
  },
  transformationApproach: {
    eyebrow: "Looking beyond tomorrow to create a digital future!",
    title: "Unlock Sustainable Success with a Structured Digital Transformation Approach",
    steps: [
      { number: "01", title: "Unified Framework", description: "Achieve a cohesive transformation framework to guide all initiatives and ensure consistent progress." },
      { number: "02", title: "Clear Digital Target", description: "Establish a definitive view of your organization as a digital entity with a unified vision." },
      { number: "03", title: "Integrated Controls", description: "Implement unifying controls across initiatives to ensure alignment and scalability." },
      { number: "04", title: "Holistic Oversight", description: "Ensure fitness for purpose with holistic controls and governance." },
      { number: "05", title: "Full Operational Visibility", description: "Gain critical visibility into transactions, costs, and performance." },
      { number: "06", title: "Portfolio Management", description: "Accelerate portfolio controls with automation for proactive oversight." },
      { number: "07", title: "Structured Growth", description: "Operationalize and track digital growth with clear structures." }
    ]
  },
  methodology: {
    eyebrow: "Architecting a digital future that aligns with your goals",
    title: "How we design your digital organisation",
    ctaLabel: "Contact Us",
    steps: [
      {
        number: "01",
        title: "Formulate",
        description: "We define EPIC use cases that align with your business outcomes, ensuring a strategic foundation for your digital transformation journey.",
        icon: FileText
      },
      {
        number: "02",
        title: "Specify",
        description: "We break down EPICs into detailed FEATURE use cases, creating actionable plans to achieve your organisation's digital objectives effectively.",
        icon: ClipboardList
      },
      {
        number: "03",
        title: "Deliver",
        description: "We implement USER STORY use cases through iterative development, ensuring seamless execution and alignment with your digital transformation goals.",
        icon: Handshake
      },
      {
        number: "04",
        title: "Transition",
        description: "We facilitate the smooth adoption of solutions, ensuring your team is equipped and prepared for sustained success in the digital economy.",
        icon: Handshake
      }
    ],
    image: "/images/Image-design.svg"
  },
  deploySection: {
    eyebrow: "Realising a digital future that aligns with your goals",
    title: "How we deploy your Digital Business Platform (DBP)",
    ctaLabel: "Contact Us",
    steps: [
      {
        number: "02",
        title: "Specify",
        description: "We break down EPICs into detailed feature use cases, creating actionable plans to achieve your organisation's digital objectives effectively.",
        icon: ClipboardList
      },
      {
        number: "03",
        title: "Deliver",
        description: "We implement user story use cases through iterative development, ensuring seamless execution and alignment with your transformation goals.",
        icon: Target
      },
      {
        number: "04",
        title: "Transition",
        description: "We facilitate the smooth adoption of solutions, ensuring teams are equipped and prepared for sustained success in the digital economy.",
        icon: Handshake
      }
    ],
    image: "/images/landingpage_hero.png"
  },
  consultation: {
    title: "No matter your organization's size, industry, or sector, we will help you realize your digital state.",
    description:
      "With 15 years of industry experience, we deeply understand what you need and are fully equipped to kickstart your digital transformation journey.",
    bullets: [
      "Reduce costs by up to 50%",
      "Save time with ready-to-deploy solutions",
      "Improve your digital ROI",
      "Achieve consistent, high-quality results"
    ],
    backgroundImage: "/images/Form_background.jpg",
    ctaLabel: "Submit Request"
  }
};

// Deploy 4.0 specific content
export const deployServiceContent = {
  hero: {
    title: "Deploy 4.0",
    subtitle: "Implement scalable digital solutions with precision-guided by data-driven strategies and organizational goals.",
    backgroundImage: "/images/landingpage_hero.png",
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Industry", href: "/services" },
      { label: "Deploy 4.0" }
    ]
  },
  blueprintSection: {
    title: "Accelerate transformation with blueprint-led strategies that save time and costs.",
    description: "Our blueprints accelerate Digital Business Platform (DBP) deployment, enabling faster, cost-effective implementation, while ensuring high-quality outcomes.",
    primaryCta: { label: "Get Started", href: "/consultation" },
    secondaryCta: { label: "Explore Service Domains", href: "/services" },
    imagePrimary: "/images/deploy-long.svg",
    imageOverlay: "/images/deploy-short.svg",
    faqs: [
      {
        question: "What is a DBP?",
        answer: "A Digital Business Platform (DBP) is the end state of an organization's digital transformation journey. It represents a fully integrated set of systems and tools that enable digital operations to function seamlessly."
      },
      {
        question: "How long does the deployment process take?",
        answer: "Deployment timelines vary based on complexity and scope. Typically, initial deployments can be completed within 3-6 months, with full transformation realized over 12-18 months."
      },
      {
        question: "What happens after deployment is complete?",
        answer: "Post-deployment support includes change enablement, optimization sprints, and managed services to sustain outcomes and drive continuous improvements."
      }
    ]
  },
  stats: [
    { value: "30%", label: "Average reduction in deployment time using blueprint-led execution." },
    { value: "50%", label: "Lower cost overruns through precise scope control and automation." },
    { value: "100+", label: "Enterprise platforms deployed using Deploy 4.0 playbooks." },
    { value: "24/7", label: "Operations monitoring and support coverage." }
  ],
  industryExpertise: {
    title: "Operational Mastery Across Industries",
    description: "We deploy platforms across multiple domains with proven delivery controls.",
    ctaLabel: "Explore All Industries",
    cards: [
      {
        icon: Factory,
        title: "Plant 4.0",
        description: "Digitally enabled plants with predictive maintenance, robotics, and automated QA."
      },
      {
        icon: Building2,
        title: "Infrastructure 4.0",
        description: "Smart infrastructure delivery with integrated project controls and BIM workflows."
      },
      {
        icon: Landmark,
        title: "Government 4.0",
        description: "Secure citizen services with data sharing hubs and interoperable cloud platforms."
      }
    ]
  },
  transformationApproach: designServiceContent.transformationApproach,
  methodology: {
    ...designServiceContent.methodology,
    image: "/images/deploy img.svg"
  }
};

// Helper function to get sidebar CTA content based on service title
export const getSidebarCtaContent = (serviceTitle: string) => {
  const ctaMap: Record<string, { title: string; description: string }> = {
    "Agility 4.0": {
      title: "Transform your Operations with Agility 4.0",
      description: "Elevate engagement and drive growth. Submit your details, and our experts will guide you."
    },
    "Farming 4.0": {
      title: "Transform your Farm with Farming 4.0",
      description: "Optimize yields and ensure sustainability. Submit your details, and our experts will guide you."
    },
    "Plant 4.0": {
      title: "Revolutionize Your Plant with Digital Innovation",
      description: "Optimize operations, reduce costs, and enhance safety. Submit your details, and our experts will guide you."
    },
    "Infrastructure 4.0": {
      title: "Build Smart Cities with Infrastructure 4.0",
      description: "Optimize urban environments, reduce costs, and enhance sustainability. Submit your details, and our experts will guide you."
    },
    "Government 4.0": {
      title: "Transform Governance with Digital Innovation",
      description: "Enhance transparency, efficiency, and citizen trust through AI, blockchain, and e-government solutions. Submit your details, and our experts will guide you."
    },
    "Hospitality 4.0": {
      title: "Transform Hospitality with Digital Solutions",
      description: "Deliver unforgettable guest experiences, streamline operations, and drive revenue growth through AI, IoT, and mobile-first innovation. Submit your details, and let us guide you to success."
    },
    "Retail 4.0": {
      title: "Unlock the Future of Retail",
      description: "Optimize yields and reduce waste. Submit your details, and our experts will guide you."
    },
    "Service 4.0": {
      title: "Transform Services with Digital Innovation",
      description: "Optimize operations, enhance customer experiences, and drive growth through AI, automation, and data-driven insights. Submit your details, and let us guide you to success."
    },
    "Logistics 4.0": {
      title: "Transform your Logistics Operations Today",
      description: "Optimize supply chains, reduce costs, and improve delivery accuracy through AI, IoT, and automation. Submit your details now, and let us guide you to success."
    },
    "Healthcare & Wellness 4.0": {
      title: "Deliver Smarter, more Effective Wellness Solutions",
      description: "Enhance care delivery, reduce costs, and improve patient outcomes through AI, IoT, and telehealth solutions. Submit your details now, and let us guide you to success."
    }
  };

  return ctaMap[serviceTitle] || {
    title: `Transform your Customer Experiences with ${serviceTitle}`,
    description: "Elevate engagement and drive growth. Submit your details, and our experts will guide you."
  };
};

// Helper function to get overview closing text based on slug
export const getOverviewClosingText = (slug: string): string => {
  const textMap: Record<string, string> = {
    'agility-4-0': "Ready to transform your operations? With Agility4.0, you can reduce time-to-market, enhance cross-functional collaboration, and optimize workflows through cutting-edge technologies. Our solutions ensure seamless integration, continuous improvement, and scalable infrastructure, enabling you to focus on what matters most—delivering value to your customers. Partner with us to unlock your organization's full potential today.",
    'farming-4-0': "Ready to revolutionize your farm? Farming4.0 delivers smart irrigation, crop monitoring, and livestock management solutions tailored to your needs. By leveraging real-time data and predictive analytics, we help you enhance productivity, minimize costs, and achieve sustainable growth. Partner with us today to unlock the full potential of modern agriculture and secure a brighter future.",
    'plant-4-0': "Ready to revolutionize your plant operations? Plant4.0 delivers tailored solutions for manufacturing, oil & gas, chemicals, power, mining, and more. By leveraging digital twins, robotics, and AI-powered analytics, we help you streamline workflows, improve asset performance, and unlock new revenue streams. Partner with us today to future-proof your industrial operations.",
    'infrastructure-4-0': "Ready to revolutionize your infrastructure projects? Infrastructure 4.0 delivers tailored solutions for smart cities, efficient buildings, and sustainable urban planning. By integrating digital twins, automation, and real-time data insights, we help you reduce costs, improve performance, and unlock new opportunities. Partner with us today to future-proof your infrastructure and drive sustainable growth.",
    'government-4-0': "Ready to modernize your government services? Government4.0 delivers tailored solutions for e-governance, smart cities, and regulatory compliance. By integrating advanced technologies like AI-driven policymaking and blockchain for transparency, we help you achieve operational excellence and citizen satisfaction. Partner with us today to unlock the full potential of digital transformation in the public sector.",
    'hospitality-4-0': "Ready to redefine hospitality? Hospitality4.0 delivers tailored solutions for hotels, restaurants, parks, and events. By integrating AI-driven personalization, dynamic pricing, and smart facility management, we help you reduce costs, improve efficiency, and boost revenue. Partner with us today to unlock the full potential of digital transformation and stay ahead in the competitive hospitality market.",
    'retail-4-0': "Ready to revolutionize your retail strategy? Retail4.0 delivers tailored solutions for smart stores, data-driven merchandising, and frictionless payment systems. By integrating advanced technologies like AI-powered recommendations and real-time analytics, we help you optimize operations, boost sales, and build lasting customer loyalty. Partner with us today to unlock the future of retail.",
    'wellness-4-0': "Ready to revolutionize wellness? Wellness4.0 delivers tailored solutions for healthcare providers, caregivers, and families. By integrating virtual consultations, real-time monitoring, and AI-driven insights, we help you reduce costs, improve outcomes, and expand access to care. Partner with us today to unlock the full potential of digital transformation in health and wellness services.",
    'logistics-4-0': "Ready to revolutionize your supply chain? Logistics4.0 delivers tailored solutions for real-time tracking, warehouse automation, and last-mile delivery optimization. By integrating AI-driven insights and seamless technologies, we help you streamline operations, reduce costs, and deliver exceptional customer experiences. Partner with us today to unlock the full potential of digital transformation in logistics.",
    'service-4-0': "Ready to revolutionize your services? Services4.0 delivers tailored solutions for industries like banking, education, media, and telecommunications. By integrating omnichannel platforms, predictive analytics, and automated workflows, we help you streamline processes, improve efficiency, and drive growth. Partner with us today to unlock the full potential of digital transformation and elevate your service offerings."
  };

  return textMap[slug] || "Ready to redefine customer journeys? Experience4.0 empowers businesses to integrate advanced technologies, optimize touchpoints, and build lasting relationships. From real-time analytics to AI-driven personalization, our solutions ensure frictionless interactions that delight customers and drive measurable ROI. Partner with us to unlock the full potential of digital transformation and future-proof your business today.";
};

// Helper function to get service areas title based on slug
export const getServiceAreasTitle = (slug: string): string => {
  const titleMap: Record<string, string> = {
    'agility-4-0': "Key focus areas to empower your organization with adaptive, agile, and scalable operations",
    'farming-4-0': "Key focus areas to drive sustainable, efficient, and tech-driven agricultural transformation",
    'plant-4-0': "Key focus areas to drive efficiency, sustainability, and innovation in industrial operations",
    'infrastructure-4-0': "Key focus areas to build smarter, sustainable, and connected urban environments",
    'government-4-0': "Key focus areas to enhance governance, transparency, and citizen-centric digital transformation",
    'hospitality-4-0': "Key focus areas to deliver seamless, personalized, and tech-driven hospitality experiences",
    'retail-4-0': "Key focus areas to deliver seamless, personalized, and tech-driven retail experiences",
    'wellness-4-0': "Key focus areas to drive digital innovation in healthcare and wellness",
    'logistics-4-0': "Key focus areas to drive digital innovation and operational excellence across industries",
    'service-4-0': "Key focus areas to drive digital innovation and operational excellence across industries"
  };

  return titleMap[slug] || "Key focus areas to enable you deliver exceptional, seamless, and personalized customer experiences";
};

// Helper function to get FAQ section title based on slug
export const getFaqSectionTitle = (slug: string): string => {
  const titleMap: Record<string, string> = {
    'agility-4-0': "Whether you want to streamline operations, accelerate product development, or enhance cross-functional collaboration, our team works across industries to design strategies that elevate your organizational agility.",
    'farming-4-0': "No matter how big your farm is or what type of crops you grow, we can help you optimize yields, reduce waste, and achieve sustainable farming practices to meet your business goals.",
    'plant-4-0': "Whether you want to improve asset management, streamline production lines, or drive sustainability, our team works across industrial sectors to design strategies that elevate your plant's performance and resilience.",
    'infrastructure-4-0': "From urban planning to predictive maintenance, we empower you to optimize costs, improve performance, and unlock new revenue streams through data-driven innovation and smart technologies.",
    'government-4-0': "Transform public sector operations with digital solutions that enhance governance, citizen trust, and operational efficiency through AI, blockchain, and smart technologies.",
    'hospitality-4-0': "Transform your hospitality business with cutting-edge digital solutions that enhance guest experiences, streamline operations, and drive sustainable revenue growth.",
    'retail-4-0': "Transform your retail operations with digital solutions that deliver seamless customer experiences, optimize operations, and drive growth across physical and digital touchpoints.",
    'wellness-4-0': "Revolutionize health and wellness services with digital solutions that deliver personalized care, real-time insights, and seamless access across all life stages, from childcare to elderly care.",
    'logistics-4-0': "Transform your logistics operations with cutting-edge digital tools that optimize supply chains, enhance real-time tracking, and deliver superior customer experiences.",
    'service-4-0': "Revolutionize your business with digital tools that optimize service delivery, enhance customer experiences, and drive innovation across HR, Legal, Finance, Insurance, and beyond."
  };

  return titleMap[slug] || "Whether you want to enhance customer satisfaction, streamline interactions, or drive growth through personalization, our team works across industries to design strategies that elevate your customer journeys.";
};
