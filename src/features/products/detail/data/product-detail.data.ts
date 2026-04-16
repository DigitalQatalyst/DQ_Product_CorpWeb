// ─── Feature descriptions ────────────────────────────────────────────────────

const featureDescriptions: Record<string, Record<string, string>> = {
  tmaas: {
    "Architecture-led": "Strategic blueprints and frameworks that guide your transformation with proven architectural patterns and best practices.",
    "Data-driven": "AI-powered insights and analytics that inform decision-making and optimize transformation outcomes.",
    "Best-Practice-based": "Leverage industry-proven methodologies and ready-to-launch blueprints for accelerated implementation.",
  },
  dtmp: {
    Repository: "A comprehensive architectural repository to store, manage, and track digital transformation assets and blueprints.",
    Analytics: "Integrated analytics provide actionable insights, tracking KPIs and progress across transformation initiatives.",
    Portal: "A user-friendly portal to access, manage, and collaborate on transformation blueprints, reports, and metrics.",
  },
  dtma: {
    "Training Programs": "Tailored training programs that build key skills for effective digital leadership and execution.",
    Certification: "Certification tracks to validate expertise in digital transformation methodologies and strategies.",
    "Expert-Led Workshops": "Interactive workshops led by industry experts to dive deep into transformation strategies.",
  },
  dtmb: {
    "Actionable Insights": "Provides concise, expert-authored content that simplifies complex digital transformation concepts.",
    "Bite-Sized Learning": "Short, digestible chapters allow busy leaders to quickly grasp key transformation strategies.",
    "Practical Case Studies": "Real-world case studies provide actionable examples for overcoming digital transformation challenges.",
  },
  dtmi: {
    "Market Intelligence": "Access comprehensive management insights and trends in digital transformation across industries.",
    "Research Insights": "Expert-driven research and analysis on emerging technologies, methodologies, and transformation strategies.",
    "Industry Analysis": "Deep-dive analysis of sector-specific transformation patterns, challenges, and opportunities.",
  },
  dtmcc: {
    "Digital Workers": "Spaces designed for human-machine collaboration, empowering professionals to thrive in Economy 4.0.",
    "AI Collaboration": "High-speed connectivity and AI-integrated workstations for seamless human-AI collaboration.",
    "Global Network": "Access to a growing network of studios worldwide, starting with our Nairobi location.",
  },
  plant40: {
    "Asset Management": "Integrates advanced digital tools to optimize asset performance, reduce downtime, and enhance lifecycle management.",
    "Operational Efficiency": "Streamlines operations, improving productivity and reducing costs with smart automation.",
    "Sustainability Focus": "Supports sustainable practices through data-driven insights and eco-friendly transformation strategies.",
  },
};

export function getFeatureDescription(productId: string, tag: string): string {
  return (
    featureDescriptions[productId]?.[tag] ??
    `Comprehensive ${tag.toLowerCase()} capabilities designed to accelerate your digital transformation journey.`
  );
}

// ─── About content ────────────────────────────────────────────────────────────

const aboutContent: Record<string, string[]> = {
  tmaas: [
    "TMaaS (Transformation Management as a Service) is DQ's revolutionary approach to digital transformation that combines the flexibility of a marketplace with the precision of architecture-led design. Unlike traditional consulting models that are expensive and time-consuming, TMaaS delivers transformation initiatives through AI-powered, ready-to-launch blueprints that accelerate impact while reducing costs.",
    "Built on our proven DT 2.0 methodology, TMaaS enables organizations to access transformation services on-demand, with tailored digital blueprints that are data-driven and best-practice-based. This approach ensures scalability, reduces implementation risk, and delivers measurable outcomes faster than conventional transformation approaches.",
    "TMaaS represents the future of digital transformation — where organizations can access world-class transformation capabilities as easily as subscribing to a service, with the confidence that comes from architecture-led design and proven methodologies.",
  ],
  dtmp: [
    "DTMP (Digital Transformation Management Platform) is DQ's comprehensive end-to-end platform designed to bring clarity and control to digital transformation initiatives. In a world where organizations struggle with fragmented tools, disconnected portfolios, and lack of real-time visibility, DTMP provides the unified system that transformation leaders need to succeed.",
    "The platform integrates portfolios, analytics, workflows, and compliance into a single, powerful system that gives leaders complete end-to-end visibility while enabling teams to execute transformation with discipline and speed.",
    "More than just a management tool, DTMP is the digital backbone that enables organizations to plan, track, and optimize their entire transformation portfolio with the precision and insight needed to achieve Digital Cognitive Organization status.",
  ],
  dtma: [
    "DTMA (Digital Transformation Management Academy) is DQ's comprehensive learning ecosystem designed to build the digital transformation capabilities that organizations need to succeed in Economy 4.0. Recognizing that transformation success depends on people as much as technology, DTMA bridges the critical skills gap that causes many digital initiatives to fail.",
    "Through blended learning programs, hands-on labs, and expert coaching, DTMA equips teams with practical skills, proven methodologies, and industry certifications. The academy combines flexible online learning with in-person workshops, ensuring that learning is both accessible and immediately applicable.",
    "DTMA is more than education — it's capability building that reduces transformation risk, accelerates adoption, and ensures that your organization has the human capital needed to sustain digital transformation success long-term.",
  ],
  dtmb: [
    "DTMB (Digital Transformation Management Books) represents DQ's commitment to making digital transformation knowledge accessible to busy executives and decision-makers. In a world where transformation insights are often buried in dense academic texts, DTMB delivers concise, actionable wisdom that leaders can immediately apply.",
    "Each book in the DTMB series is expertly authored and designed for executive consumption — offering bite-sized insights, practical case studies, and clear frameworks that cut through complexity.",
    "DTMB transforms complex digital transformation concepts into digestible, actionable guidance that enables faster decision-making, better strategic alignment, and more successful transformation outcomes.",
  ],
  dtmcc: [
    "Digital Working Studios (DWS) represent DQ's vision for the future of work in Economy 4.0, where success belongs to digital workers — professionals who thrive through seamless human-machine collaboration. Traditional workspaces weren't designed for AI-powered workflows, limiting organizations' ability to leverage the full potential of digital technologies.",
    "DWS provides purpose-built environments that enable powerful collaboration between human intelligence and machine intelligence. Our studios feature AI-ready infrastructure, high-speed connectivity, and collaborative spaces where professionals can seamlessly integrate AI tools into their daily workflows.",
    "Starting with our flagship studio in Nairobi, Kenya (Babadogo), DWS is expanding globally to create a network of spaces where the digital workforce of tomorrow can thrive today.",
  ],
  dtmi: [
    "DTMI (Digital Transformation Management Insights) is DQ's comprehensive intelligence platform that provides structured, research-driven insights into the rapidly evolving world of digital transformation. In an era where transformation knowledge is fragmented and often lacks sector-specific depth, DTMI delivers the strategic intelligence that leaders need.",
    "Built on our proprietary 6xD framework and enhanced with sector-specific lenses, DTMI provides access to expert-driven research, industry analysis, case studies, and transformation insights from thought leaders worldwide.",
    "DTMI serves as the knowledge backbone for transformation leaders, providing the market intelligence, research insights, and industry analysis needed to navigate digital transformation with confidence and strategic clarity.",
  ],
  plant40: [
    "Plant 4.0 is DQ's specialized digital transformation solution designed specifically for asset-intensive industries including manufacturing, oil & gas, utilities, and mining. These industries face unique challenges — aging infrastructure, unplanned downtime, complex operations, and increasing pressure for sustainability.",
    "Plant 4.0 combines advanced digital tools, real-time monitoring, smart automation, and predictive analytics to optimize asset performance throughout the entire lifecycle. The solution addresses the complete spectrum of industrial transformation.",
    "More than just industrial digitization, Plant 4.0 represents a comprehensive approach to transforming asset-intensive operations into intelligent, sustainable, and highly efficient digital enterprises.",
  ],
};

export function getAboutParagraphs(productId: string): string[] {
  return (
    aboutContent[productId] ?? [
      "This innovative solution is designed to help organizations navigate the complexities of digital transformation in today's rapidly evolving business landscape.",
    ]
  );
}

// ─── Capability sections ──────────────────────────────────────────────────────

export type CapabilityItem = { title: string; body: string; accent: "primary" | "secondary" };
export type PracticalValueItem = { icon: string; title: string; subtitle: string };

export type ProductContent = {
  problemStatement: string;
  solutionStatement: string;
  capabilitiesLabel: string;
  capabilities: CapabilityItem[];
  practicalValues: PracticalValueItem[];
};

// SVG path strings for practical value icons
const icons = {
  money: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  bolt: "M13 10V3L4 14h7v7l9-11h-7z",
  check: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  eye: "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  clipboard: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  shield: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  chart: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  trending: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  globe: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
};

const productContent: Record<string, ProductContent> = {
  tmaas: {
    problemStatement: "Organizations face high costs, complexity, and inflexibility in digital transformation, lacking tailored and efficient tools. Traditional approaches often result in lengthy implementation timelines, budget overruns, and solutions that don't scale with business needs.",
    solutionStatement: "TMaaS is a low-cost, architecture-led marketplace for digital transformation initiatives using AI-powered, ready-to-launch blueprints. We accelerate impact, reduce costs, and ensure scalability through our architecture-led, data-driven, and best-practice-based approach.",
    capabilitiesLabel: "TMaaS Services",
    capabilities: [
      { title: "Design", body: "Translate insights into clear blueprints and actionable digital strategies.", accent: "primary" },
      { title: "Deploy", body: "Turn your transformation roadmap into reality with seamless execution and delivery tracking.", accent: "secondary" },
      { title: "Drive", body: "Support teams, optimise outcomes, and ensure long-term digital performance.", accent: "primary" },
    ],
    practicalValues: [
      { icon: icons.money, title: "Low-Cost Entry", subtitle: "Affordable starting point for transformation initiatives" },
      { icon: icons.bolt, title: "Faster Results", subtitle: "Reduced time to value from transformation programs" },
      { icon: icons.check, title: "Higher Success", subtitle: "Increased success rate of transformation programs" },
    ],
  },
  dtmp: {
    problemStatement: "Organizations struggle to manage digital transformation without unified visibility. Fragmented tools, disconnected portfolios, and lack of real-time tracking create chaos—making it impossible for leaders to see progress clearly or for teams to execute with discipline and speed.",
    solutionStatement: "DTMP is a unified platform that enables organizations to plan, track, and manage digital transformation with clarity. It integrates portfolios, analytics, workflows, and compliance into a single system, giving leaders end-to-end visibility.",
    capabilitiesLabel: "DTMP Capabilities",
    capabilities: [
      { title: "Portfolio Management", body: "Unified view of all transformation initiatives—enabling leaders to plan, prioritize, and track progress.", accent: "primary" },
      { title: "Analytics & Insights", body: "Real-time analytics and KPI tracking that provide end-to-end visibility into transformation performance.", accent: "secondary" },
      { title: "Workflows & Compliance", body: "Integrated workflows and compliance tracking that ensure teams execute with discipline.", accent: "primary" },
    ],
    practicalValues: [
      { icon: icons.eye, title: "End-to-End Visibility", subtitle: "Complete transparency across all transformation initiatives" },
      { icon: icons.bolt, title: "Faster Execution", subtitle: "Teams execute with discipline and speed" },
      { icon: icons.clipboard, title: "Unified System", subtitle: "Single platform for portfolios, analytics, and compliance" },
    ],
  },
  dtma: {
    problemStatement: "Digital transformation projects often fail due to skill gaps, lack of structured approaches, and resistance to change. Organizations struggle to build internal capabilities, leading to increased delivery risk and poor adoption rates.",
    solutionStatement: "DTMA is your organization's gateway to building digital transformation capabilities. We equip your teams with practical skills, proven methodologies, and industry certifications through blended training, hands-on labs, and expert coaching.",
    capabilitiesLabel: "DTMA Services",
    capabilities: [
      { title: "Training Programs", body: "Blended learning programs with flexible online and in-person training that builds key skills for effective digital leadership.", accent: "primary" },
      { title: "Certification", body: "Industry-recognized credentials that validate transformation expertise and signal change enablement capabilities.", accent: "secondary" },
      { title: "Expert-Led Workshops", body: "Hands-on labs and coaching sessions with transformation specialists using real-world scenarios.", accent: "primary" },
    ],
    practicalValues: [
      { icon: icons.bolt, title: "Faster Delivery", subtitle: "60% faster project delivery with trained teams" },
      { icon: icons.check, title: "Higher Adoption", subtitle: "85% higher adoption rates across initiatives" },
      { icon: icons.shield, title: "Reduced Risk", subtitle: "40% reduction in transformation risks" },
    ],
  },
  dtmb: {
    problemStatement: "Busy executives need quick access to transformation knowledge without wading through dense technical jargon or lengthy academic texts. Traditional resources are too time-consuming and often fail to provide practical, actionable insights.",
    solutionStatement: "DTMB is DQ's series of insightful and accessible books designed for executives and decision-makers. Each book offers concise, bite-sized insights that break down critical concepts into practical, actionable information.",
    capabilitiesLabel: "DTMB Features",
    capabilities: [
      { title: "Actionable Insights", body: "Concise, expert-authored content that simplifies complex digital transformation concepts for executives.", accent: "primary" },
      { title: "Bite-Sized Learning", body: "Short, digestible chapters allow busy leaders to quickly grasp key transformation strategies.", accent: "secondary" },
      { title: "Practical Case Studies", body: "Real-world case studies provide actionable examples for overcoming digital transformation challenges.", accent: "primary" },
    ],
    practicalValues: [
      { icon: icons.bolt, title: "Faster Decisions", subtitle: "80% faster executive decision-making" },
      { icon: icons.check, title: "Better Alignment", subtitle: "90% improved strategic alignment" },
      { icon: icons.chart, title: "Better Outcomes", subtitle: "65% better transformation outcomes" },
    ],
  },
  dtmcc: {
    problemStatement: "Traditional workspaces aren't designed for the AI-powered workflows of Economy 4.0. Organizations struggle to provide environments optimized for human-machine collaboration, limiting their teams' ability to leverage AI tools effectively.",
    solutionStatement: "Digital Working Studios (DWS) are purpose-built environments that enable powerful collaboration between human intelligence and machine intelligence. Our studios provide AI-ready infrastructure, high-speed connectivity, and collaborative spaces.",
    capabilitiesLabel: "DWS Features",
    capabilities: [
      { title: "Digital Worker Enablement", body: "Spaces designed for human-machine collaboration, empowering professionals to thrive in Economy 4.0.", accent: "primary" },
      { title: "AI-Ready Infrastructure", body: "High-speed connectivity and AI-integrated workstations for seamless human-AI collaboration.", accent: "secondary" },
      { title: "Global Network", body: "Access to a growing network of studios worldwide, starting with our Nairobi location.", accent: "primary" },
    ],
    practicalValues: [
      { icon: icons.bolt, title: "Higher Productivity", subtitle: "45% increase in team productivity" },
      { icon: icons.check, title: "Better AI Adoption", subtitle: "75% better AI tool adoption" },
      { icon: icons.trending, title: "Faster Innovation", subtitle: "60% faster innovation cycles" },
    ],
  },
  dtmi: {
    problemStatement: "Organizations struggle to access reliable, structured insights about digital transformation trends and industry-specific transformation patterns. Traditional research is fragmented, expensive, and often lacks the sector-specific depth needed for strategic decision-making.",
    solutionStatement: "DTMI is a comprehensive digital transformation management insights platform that provides structured intelligence through our 6xD framework and sector-specific lenses. Access expert-driven research, industry analysis, and case studies.",
    capabilitiesLabel: "DTMI Features",
    capabilities: [
      { title: "Market Intelligence", body: "Access comprehensive management insights and trends in digital transformation across industries.", accent: "primary" },
      { title: "Research Insights", body: "Expert-driven research and analysis on emerging technologies, methodologies, and transformation strategies.", accent: "secondary" },
      { title: "Industry Analysis", body: "Deep-dive analysis of sector-specific transformation patterns, challenges, and opportunities.", accent: "primary" },
    ],
    practicalValues: [
      { icon: icons.chart, title: "Better Decisions", subtitle: "70% improvement in strategic decision quality" },
      { icon: icons.bolt, title: "Faster Insights", subtitle: "85% faster access to market intelligence" },
      { icon: icons.shield, title: "Reduced Risk", subtitle: "50% reduction in transformation risks" },
    ],
  },
  plant40: {
    problemStatement: "Asset-intensive industries like manufacturing, oil & gas, and utilities face complex challenges: aging infrastructure, unplanned downtime, inefficient operations, and mounting pressure for sustainability.",
    solutionStatement: "Plant 4.0 is DQ's specialized digital transformation solution that combines advanced digital tools, real-time monitoring, and smart automation to optimize asset performance, minimize downtime, and drive sustainability.",
    capabilitiesLabel: "Plant 4.0 Capabilities",
    capabilities: [
      { title: "Asset Management", body: "Optimize asset performance, reduce downtime, and enhance lifecycle management with advanced digital tools.", accent: "primary" },
      { title: "Operational Efficiency", body: "Streamline operations, improve productivity, and reduce costs with smart automation and real-time monitoring.", accent: "secondary" },
      { title: "Sustainability Focus", body: "Reduce environmental footprint and adopt eco-friendly practices through data-driven insights.", accent: "primary" },
    ],
    practicalValues: [
      { icon: icons.check, title: "Reduced Downtime", subtitle: "Predictive maintenance minimizes unplanned outages" },
      { icon: icons.money, title: "Lower Costs", subtitle: "Optimize operations and reduce maintenance expenses" },
      { icon: icons.globe, title: "Sustainability", subtitle: "Achieve environmental goals with data-driven insights" },
    ],
  },
};

export function getProductContent(productId: string): ProductContent {
  return (
    productContent[productId] ?? {
      problemStatement: "Organizations face complex challenges in digital transformation that require tailored, efficient solutions.",
      solutionStatement: "This solution provides the tools and insights needed to drive meaningful change and achieve lasting results.",
      capabilitiesLabel: "Key Capabilities",
      capabilities: [],
      practicalValues: [],
    }
  );
}

// ─── Category description ─────────────────────────────────────────────────────

const categoryDescriptions: Record<string, string> = {
  dtmcc: "Digital Working Studios belongs to the Collaboration category, enabling digital workers who thrive through human-machine collaboration. In Economy 4.0, our studios provide the environment where professionals seamlessly integrate AI and machine intelligence into their work.",
  dtmi: "DTMI belongs to the Intelligence category, providing comprehensive management insights and research-driven intelligence for digital transformation. This category focuses on delivering structured knowledge, industry analysis, and strategic insights that inform decision-making.",
};

export function getCategoryDescription(productId: string, category: string): string {
  return (
    categoryDescriptions[productId] ??
    `This product belongs to the ${category} category, providing specialized solutions for organizations looking to enhance their digital transformation capabilities through strategic guidance, proven methodologies, and practical tools.`
  );
}
