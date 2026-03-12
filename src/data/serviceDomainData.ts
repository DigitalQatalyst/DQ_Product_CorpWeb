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

export interface ServiceBenefit {
  icon: any;
  title: string;
  description: string;
}

export interface WhereToStartItem {
  title: string;
  description: string;
  cta?: string;
  question?: string;
  answer?: string;
}

export interface ServiceArea {
  number: string;
  title: string;
  description: string;
  icon?: any;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceDomainData {
  icon: any;
  title: string;
  subtitle?: string;
  description?: string;
  heroImage?: string;
  overviewText?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  showImageInsteadOfVideo?: boolean;
  benefits?: ServiceBenefit[];
  whereToStart?: WhereToStartItem[];
  serviceAreas?: ServiceArea[];
  faqs?: ServiceFaq[];
  keyFeatures?: any[];
  caseStudies?: any[];
  consultation?: {
    ctaLabel?: string;
  };
}

// Service data mapping
export const serviceData: Record<string, ServiceDomainData> = {
  "design-4-0": {
    icon: Palette,
    title: "Design 4.0"
  },
  "deploy-4-0": {
    icon: Rocket,
    title: "Deploy 4.0",
    subtitle: "Implement scalable digital solutions with precision-guided by data-driven strategies and organizational goals.",
    description: "We implement scalable digital solutions with precision, guided by data-driven strategies and organizational goals.",
    heroImage: "/images/Service_landing_hero_image.png",
    overviewText: "Accelerate transformation with blueprint-led strategies that save time and costs. Our blueprints accelerate Digital Business Platform (DBP) deployment, enabling faster, cost-effective implementation, while ensuring high-quality outcomes.",
    videoUrl: "/videos/Deploy 4.0.mp4",
    benefits: [
      {
        icon: FileText,
        title: "25%",
        description: "Approximate percentage of time saved with deploy 4.0."
      },
      {
        icon: TrendingUp,
        title: "50%",
        description: "Approximate percentage of cost saved with Deploy 4.0."
      },
      {
        icon: UsersRound,
        title: "50+",
        description: "Digital Business Platforms (DBPs) deployed to date."
      },
      {
        icon: DollarSign,
        title: "15+",
        description: "Years of experience deploying Digital Business Platforms globally."
      }
    ],
    whereToStart: [
      {
        question: "What is a DBP?",
        answer: "A Digital Business Platform (DBP) is the end state of an organization's digital transformation journey. It represents a fully integrated set of systems and tools that enable digital operations to function seamlessly.",
        title: "",
        description: ""
      },
      {
        question: "How long does the deployment process take?",
        answer: "Deployment timelines vary based on complexity and scope. Typically, initial deployments can be completed within 3-6 months, with full transformation realized over 12-18 months.",
        title: "",
        description: ""
      },
      {
        question: "What happens after deployment is complete?",
        answer: "Post-deployment, we provide ongoing support, monitoring, and optimization services to ensure your digital platform continues to deliver value and adapts to evolving business needs.",
        title: "",
        description: ""
      }
    ],
    serviceAreas: [
      {
        number: "01",
        title: "Formulate",
        description: "We define EPIC use cases that align with your business outcomes, ensuring a strategic foundation for your Digital transformation journey.",
        icon: Lightbulb
      },
      {
        number: "02",
        title: "Specify",
        description: "We break down EPICs into detailed FEATURES use cases, creating actionable plans to achieve your implementation's digital objectives effectively.",
        icon: ClipboardList
      },
      {
        number: "03",
        title: "Deliver",
        description: "We implement USER STORY use cases through iterative development, ensuring seamless execution and alignment with your digital transformation goals.",
        icon: Gem
      }
    ],
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
        answer: "Post-deployment, we provide ongoing support, monitoring, and optimization services to ensure your digital platform continues to deliver value and adapts to evolving business needs."
      }
    ]
  },
  "experience-4-0": {
    icon: Target,
    title: "Experience 4.0",
    subtitle: "Transform customer journeys with seamless, personalized experiences that drive loyalty and growth.",
    description: "Creating smooth, enjoyable experiences across all digital channels.",
    heroImage: "/images/experience 4.0-hero.png",
    overviewText: "Transform customer experiences with Experience4.0, our cutting-edge service domain designed to elevate engagement and drive growth. By leveraging AI, data analytics, and omni-channel strategies, we deliver seamless, personalized interactions that boost satisfaction and loyalty. Discover how Experience4.0 can revolutionize your business and set you apart in today's competitive digital landscape.",
    videoUrl: "/videos/Experience 4.0.mp4",
    videoThumbnail: "/images/experience-thumbnail.png",
    benefits: [
      {
        icon: FileText,
        title: "Operating Cost Reduction",
        description: "Streamline operations with automated workflows and AI-powered tools, reducing operational expenses for sustainable growth."
      },
      {
        icon: TrendingUp,
        title: "Operational Excellence",
        description: "Enhance consistency and speed of service delivery through optimized processes, ensuring superior performance and customer satisfaction."
      },
      {
        icon: UsersRound,
        title: "Organisational Efficiency",
        description: "Improve cross-functional collaboration and data-driven decision-making, empowering teams to work more effectively across the organization."
      },
      {
        icon: DollarSign,
        title: "Revenue Growth",
        description: "Boost customer retention and tap into new revenue streams by delivering exceptional experiences that drive loyalty."
      }
    ],
    whereToStart: [
      { title: "Omnichannel Support", description: "Integrate chat, social media, email, and voice for consistent, responsive customer support.", cta: "Start" },
      { title: "Personalized Marketing", description: "Use AI and data to craft hyper-personalized campaigns that drive engagement and loyalty.", cta: "Start" },
      { title: "Customer Analytics", description: "Enable real-time analytics to predict behavior and optimize customer interactions effectively.", cta: "Start" },
      { title: "Self-Service Portals", description: "Empower your customers to resolve queries and manage accounts independently.", cta: "Start" },
      { title: "Augmented Reality", description: "Enhance experiences with AR for immersive visuals in retail and real estate sectors.", cta: "Start" },
      { title: "Chatbots and VA", description: "Deploy AI chatbots for 24/7 support, ensuring instant responses and reducing wait times.", cta: "Start" },
      { title: "Customer Journey", description: "Analyze journeys to eliminate friction and enhance seamless, satisfying customer experiences.", cta: "Start" },
      { title: "Recommendations", description: "Enable machine learning to provide tailored suggestions based on customer preferences.", cta: "Start" },
      { title: "Voice Commerce", description: "Enable voice-based shopping and support for hands-free convenience and faster service.", cta: "Start" },
      { title: "Loyalty Programs", description: "Design gamified loyalty programs to boost engagement, retention, and brand advocacy.", cta: "Start" }
    ],
    serviceAreas: [
      { number: "01", title: "Channels4.0", description: "Optimizing customer touchpoints across digital channels (web, mobile, social, etc.) to ensure seamless and consistent messaging." },
      { number: "02", title: "DXP4.0", description: "Delivering frictionless digital experiences with innovative resources, automated services, and continuous engagement." },
      { number: "03", title: "XRM4.0", description: "Building data-driven relationships with clients, customers, partners, and suppliers to create a dynamic ecosystem." },
      { number: "04", title: "MarCom4.0", description: "Implementing digital marketing strategies to enhance customer acquisition, retention, and conversion." }
    ],
    faqs: [
      { question: "How does Experience4.0 improve customer satisfaction?", answer: "Experience4.0 leverages AI, data analytics, and omnichannel strategies to deliver seamless, personalized interactions, ensuring customers feel understood and valued at every touchpoint." },
      { question: "What technologies are used in Experience4.0?", answer: "We utilize cutting-edge technologies like AI, machine learning, AR/VR, and real-time analytics to create immersive, frictionless, and engaging customer experiences." },
      { question: "How long does it take to see results from Experience4.0 implementation?", answer: "Results vary depending on your goals, but many clients see measurable improvements in customer engagement and operational efficiency within weeks of implementation." }
    ]
  },
  "agility-4-0": {
    icon: Zap,
    title: "Agility 4.0",
    subtitle: "Accelerate innovation, streamline operations, and adapt quickly with AI-driven agile solutions.",
    description: "Helping businesses become more flexible and responsive to changes and challenges.",
    heroImage: "/images/agility-hero.png",
    overviewText: "In today's digital landscape, adaptability is key to staying ahead. Agility4.0 empowers your organization to streamline operations, accelerate innovation, and respond swiftly to market changes. By leveraging AI-driven automation, DevOps, and real-time analytics, we help you build a culture of agility that drives efficiency, collaboration, and sustainable growth.",
    videoUrl: "/videos/Agility 4.0.mp4",
    videoThumbnail: "/images/agility-thumbnail.png",
    benefits: [
      { icon: FileText, title: "Operating Cost Reduction", description: "Streamline operations and automate manual tasks to reduce operational expenses and optimize resource allocation for sustainable growth." },
      { icon: TrendingUp, title: "Operational Excellence", description: "Enhance quality and delivery through advanced testing, real-time monitoring, and agile methodologies for superior performance." },
      { icon: UsersRound, title: "Organisational Efficiency", description: "Accelerate time-to-market, improve cross-functional collaboration, and boost process agility to stay ahead in a competitive landscape." },
      { icon: DollarSign, title: "Revenue Growth", description: "Enable faster product development and enhancements, driving quicker market entry and creating new opportunities for customer engagement." }
    ],
    whereToStart: [
      { title: "DevOps Automation", description: "Streamline development, testing, and deployment pipelines for faster, more reliable software delivery.", cta: "Start" },
      { title: "Agile Product Development", description: "Enable iterative development and responsiveness to market changes using Scrum and Kanban methodologies.", cta: "Start" },
      { title: "CI/CD", description: "Automate code integration, testing, and deployment to enable faster product updates and releases.", cta: "Start" },
      { title: "Data-Driven Decision Making", description: "Leverage real-time analytics to optimize performance and drive smarter, faster business decisions.", cta: "Start" },
      { title: "Digital Twin for Operations", description: "Simulate and predict operations with virtual models to improve efficiency and reduce downtime.", cta: "Start" },
      { title: "Cloud-Native Infrastructure", description: "Build scalable, flexible cloud infrastructure to support digital transformation and operational agility.", cta: "Start" },
      { title: "AI Predictions", description: "Minimize downtime and optimize resources by predicting maintenance needs with the aid of AI.", cta: "Start" },
      { title: "Automated Workflow", description: "Enhance efficiency and reduce manual tasks through automated production and operations tools.", cta: "Start" },
      { title: "Cross-Functional Collaboration", description: "Enable seamless teamwork with digital tools for communication, project management, and collaboration.", cta: "Start" },
      { title: "Agile Project Management", description: "Implement agile tools and methodologies to adapt quickly to changes and deliver projects iteratively.", cta: "Start" }
    ],
    serviceAreas: [
      { number: "01", title: "DevOps4.0", description: "Optimize the software lifecycle with automation, CI/CD, and continuous monitoring for seamless operations workflows." },
      { number: "02", title: "EA4.0", description: "Align IT assets and investments with business goals using agile enterprise architecture strategies." },
      { number: "03", title: "BPM4.0", description: "Automate and streamline business processes to reduce inefficiencies and enhance operational efficiency." },
      { number: "04", title: "APIOps", description: "Create smooth data flow and interoperability across systems, enabling seamless API management." },
      { number: "05", title: "SecOps", description: "Integrate security into DevOps pipelines for continuous monitoring and risk mitigation." },
      { number: "06", title: "IntelOps", description: "Enable real-time data analytics and intelligence for faster, data-driven decision-making." },
      { number: "07", title: "OpsCenter4.0", description: "Monitor and optimize IT infrastructure with AI-driven automation and real-time insights." }
    ],
    faqs: [
      { question: "How does Agility4.0 improve organizational performance?", answer: "Agility4.0 streamlines workflows, reduces bottlenecks, and optimizes resource allocation through iterative processes and real-time feedback, enabling faster delivery of outcomes with minimal waste. Organizations typically see 30-50% improvement in time-to-market and significant increases in team productivity." },
      { question: "What technologies are used in Agility 4.0?", answer: "We utilize cutting-edge technologies like AI, machine learning, cloud-native infrastructure, and digital twins to enable faster decision-making and seamless operations." },
      { question: "How long does it take to see results from Agility 4.0 implementation?", answer: "Organisations typically begin seeing measurable improvements in responsiveness and efficiency within 3–6 months of implementing Agility4.0, depending on the scope and scale of adoption." }
    ]
  }
};

// Add remaining service domains
