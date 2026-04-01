import { useParams, useNavigate, Link } from "react-router-dom";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import { ConsultationFormCard } from "../components/ConsultationFormCard";
import React, { useEffect, useRef, useState } from "react";
import { useMethodologySteps } from "../hooks/useMethodologySteps";
import { getSidebarCtaContent, getOverviewClosingText, getServiceAreasTitle, getFaqSectionTitle } from "../data/serviceDetailData";
import { 
  ArrowRight, 
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
  ChevronDown,
  ChevronUp,
  Palette,
  Lightbulb,
  ClipboardList,
  Gem,
  Handshake,
  Brain,
  Mountain,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingDown
} from "lucide-react";

const designServiceContent = {
  hero: {
    title: "Design 4.0",
    subtitle:
      "Architect your digital future with data-driven strategic design and transformation blueprints tailored to your goals.",
    backgroundImage: "/images/tmaas-image.png",
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
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
        description: "We break down EPICs into detailed feature use cases, creating actionable plans to achieve your organisation’s digital objectives effectively.",
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

// Service data mapping
const serviceData: Record<string, any> = {
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
    overviewText: "Transform customer experiences with Experience 4.0, our cutting-edge service domain designed to elevate engagement and drive growth. By leveraging AI, data analytics, and omni-channel strategies, we deliver seamless, personalized interactions that boost satisfaction and loyalty. Discover how Experience 4.0 can revolutionize your business and set you apart in today's competitive digital landscape.",
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
      {
        title: "Omnichannel Support",
        description: "Integrate chat, social media, email, and voice for consistent, responsive customer support.",
        cta: "Start"
      },
      {
        title: "Personalised Marketing",
        description: "Use AI and data to craft hyper-personalized campaigns that drive engagement and loyalty.",
        cta: "Start"
      },
      {
        title: "Customer Analytics",
        description: "Enable real-time analytics to predict behavior and optimize customer interactions effectively.",
        cta: "Start"
      },
      {
        title: "Self-Service Portals",
        description: "Empower your customers to resolve queries and manage accounts independently.",
        cta: "Start"
      },
      {
        title: "Augmented Reality",
        description: "Enhance experiences with AR for immersive visuals in retail and real estate sectors.",
        cta: "Start"
      },
      {
        title: "Chatbots and Virtual Assistants",
        description: "Deploy AI chatbots for 24/7 support, ensuring instant responses and reducing wait times.",
        cta: "Start"
      },
      {
        title: "Customer Journey",
        description: "Analyze journeys to eliminate friction and enhance seamless, satisfying customer experiences.",
        cta: "Start"
      },
      {
        title: "Recommendations",
        description: "Enable machine learning to provide tailored suggestions based on customer preferences.",
        cta: "Start"
      },
      {
        title: "Voice Commerce",
        description: "Enable voice-based shopping and support for hands-free convenience and faster service.",
        cta: "Start"
      },
      {
        title: "Loyalty Programs",
        description: "Design gamified loyalty programs to boost engagement, retention, and brand advocacy.",
        cta: "Start"
      }
    ],
    serviceAreas: [
      {
        number: "01",
        title: "Channels4.0",
        description: "Optimizing customer touchpoints across digital channels (web, mobile, social, etc.) to ensure seamless and consistent messaging."
      },
      {
        number: "02",
        title: "DXP4.0",
        description: "Delivering frictionless digital experiences with innovative resources, automated services, and continuous engagement."
      },
      {
        number: "03",
        title: "XRM4.0",
        description: "Building data-driven relationships with clients, customers, partners, and suppliers to create a dynamic ecosystem."
      },
      {
        number: "04",
        title: "MarCom4.0",
        description: "Implementing digital marketing strategies to enhance customer acquisition, retention, and conversion."
      }
    ],
    faqs: [
      {
        question: "How does Experience 4.0 improve customer satisfaction?",
        answer: "Experience 4.0 leverages AI, data analytics, and omnichannel strategies to deliver seamless, personalized interactions, ensuring customers feel understood and valued at every touchpoint."
      },
      {
        question: "What technologies are used in Experience 4.0?",
        answer: "We utilize cutting-edge technologies like AI, machine learning, AR/VR, and real-time analytics to create immersive, frictionless, and engaging customer experiences."
      },
      {
        question: "How long does it take to see results from Experience 4.0 implementation?",
        answer: "Results vary depending on your goals, but many clients see measurable improvements in customer engagement and operational efficiency within weeks of implementation."
      }
    ],
    keyFeatures: [
      {
        title: "Customer Journey Mapping",
        description: "Comprehensive analysis and optimization of every customer touchpoint"
      },
      {
        title: "Omni-Channel Integration",
        description: "Seamless integration across web, mobile, in-store, and emerging channels"
      },
      {
        title: "Experience Analytics",
        description: "Real-time insights into customer behavior and experience metrics"
      },
      {
        title: "Personalization Engine",
        description: "AI-powered personalization that adapts to individual customer needs"
      }
    ],
    caseStudies: [
      {
        client: "Leading Retail Bank",
        challenge: "Fragmented digital experience across channels",
        solution: "Implemented unified omni-channel platform",
        result: "40% increase in digital engagement, 25% reduction in support calls"
      }
    ]
  },
  "agility-4-0": {
    icon: Zap,
    title: "Agility 4.0",
    subtitle: "Accelerate innovation, streamline operations, and adapt quickly with AI-driven agile solutions.",
    description: "Helping businesses become more flexible and responsive to changes and challenges.",
    heroImage: "/images/agility-hero.png",
    overviewText: "In today's digital landscape, adaptability is key to staying ahead. Agility 4.0 empowers your organization to streamline operations, accelerate innovation, and respond swiftly to market changes. By leveraging AI-driven automation, DevOps, and real-time analytics, we help you build a culture of agility that drives efficiency, collaboration, and sustainable growth.",
    videoUrl: "/videos/Agility 4.0.mp4",
    videoThumbnail: "/images/agility-thumbnail.png",
    benefits: [
      {
        icon: FileText,
        title: "Operating Cost Reduction",
        description: "Streamline operations and automate manual tasks to reduce operational expenses and optimize resource allocation for sustainable growth."
      },
      {
        icon: TrendingUp,
        title: "Operational Excellence",
        description: "Enhance quality and delivery through advanced testing, real-time monitoring, and agile methodologies for superior performance."
      },
      {
        icon: UsersRound,
        title: "Organisational Efficiency",
        description: "Accelerate time-to-market, improve cross-functional collaboration, and boost process agility to stay ahead in a competitive landscape."
      },
      {
        icon: DollarSign,
        title: "Revenue Growth",
        description: "Enable faster product development and enhancements, driving quicker market entry and creating new opportunities for customer engagement."
      }
    ],
    whereToStart: [
      {
        title: "DevOps Automation",
        description: "Streamline development, testing, and deployment pipelines for faster, more reliable software delivery.",
        cta: "Start"
      },
      {
        title: "Agile Product Development",
        description: "Enable iterative development and responsiveness to market changes using Scrum and Kanban methodologies.",
        cta: "Start"
      },
      {
        title: "CI/CD",
        description: "Automate code integration, testing, and deployment to enable faster product updates and releases.",
        cta: "Start"
      },
      {
        title: "Data-Driven Decision Making",
        description: "Leverage real-time analytics to optimize performance and drive smarter, faster business decisions.",
        cta: "Start"
      },
      {
        title: "Digital Twin for Operations",
        description: "Simulate and predict operations with virtual models to improve efficiency and reduce downtime.",
        cta: "Start"
      },
      {
        title: "Cloud-Native Infrastructure",
        description: "Build scalable, flexible cloud infrastructure to support digital transformation and operational agility.",
        cta: "Start"
      },
      {
        title: "AI Predictions",
        description: "Minimize downtime and optimize resources by predicting maintenance needs with the aid of AI.",
        cta: "Start"
      },
      {
        title: "Automated Workflow",
        description: "Enhance efficiency and reduce manual tasks through automated production and operations tools.",
        cta: "Start"
      },
      {
        title: "Cross-Functional Collaboration",
        description: "Enable seamless teamwork with digital tools for communication, project management, and collaboration.",
        cta: "Start"
      },
      {
        title: "Agile Project Management",
        description: "Implement agile tools and methodologies to adapt quickly to changes and deliver projects iteratively.",
        cta: "Start"
      }
    ],
    serviceAreas: [
      {
        number: "01",
        title: "DevOps 4.0",
        description: "Optimize the software lifecycle with automation, CI/CD, and continuous monitoring for seamless operations workflows."
      },
      {
        number: "02",
        title: "EA 4.0",
        description: "Align IT assets and investments with business goals using agile enterprise architecture strategies."
      },
      {
        number: "03",
        title: "BPM 4.0",
        description: "Automate and streamline business processes to reduce inefficiencies and enhance operational efficiency."
      },
      {
        number: "04",
        title: "APIOps 4.0",
        description: "Create smooth data flow and interoperability across systems, enabling seamless API management."
      },
      {
        number: "05",
        title: "SecOps 4.0",
        description: "Integrate security into DevOps pipelines for continuous monitoring and risk mitigation."
      },
      {
        number: "06",
        title: "IntelOps 4.0",
        description: "Enable real-time data analytics and intelligence for faster, data-driven decision-making."
      },
      {
        number: "07",
        title: "OpsCenter 4.0",
        description: "Monitor and optimize IT infrastructure with AI-driven automation and real-time insights."
      }
    ],
    faqs: [
      {
        question: "How does Agility 4.0 improve organizational performance?",
        answer: "Agility 4.0 streamlines workflows, reduces bottlenecks, and optimizes resource allocation through iterative processes and real-time feedback, enabling faster delivery of outcomes with minimal waste. Organizations typically see 30-50% improvement in time-to-market and significant increases in team productivity."
      },
      {
        question: "What technologies are used in Agility 4.0?",
        answer: "We utilize cutting-edge technologies like AI, machine learning, cloud-native infrastructure, and digital twins to enable faster decision-making and seamless operations."
      },
      {
        question: "How long does it take to see results from Agility 4.0 implementation?",
        answer: "Organisations typically begin seeing measurable improvements in responsiveness and efficiency within 3–6 months of implementing Agility 4.0, depending on the scope and scale of adoption."
      }
    ]
  },
  "farming-4-0": {
    icon: Sprout,
    title: "Farming 4.0",
    subtitle: "Optimize yields, reduce waste, and ensure sustainability with AI-driven precision farming solutions.",
    description: "Helping businesses become more flexible and responsive to changes and challenges.",
    heroImage: "/images/farming-hero.svg",
    overviewText: "Transform agriculture with Farming 4.0, where cutting-edge technologies like IoT, AI, and data analytics meet sustainable farming practices. Optimize yields, reduce resource waste, and ensure long-term sustainability through precision farming and automated solutions. Our innovative tools empower farmers to make smarter decisions, improve efficiency, and drive profitability while protecting the environment.",
    videoUrl: "/videos/Farming 4.0.mp4",
    videoThumbnail: "/images/farming-thumbnail.png",
    benefits: [
      {
        icon: FileText,
        title: "Operating Cost Reduction",
        description: "Automate farming processes, optimize resource usage, and streamline supply chains to significantly reduce operational expenses and improve profitability."
      },
      {
        icon: TrendingUp,
        title: "Operational Excellence",
        description: "Enhance efficiency with real-time monitoring, predictive analytics, and automated machinery, minimizing waste and improving overall farm performance."
      },
      {
        icon: UsersRound,
        title: "Organisational Efficiency",
        description: "Enable learning experiences, improve workforce coordination, and farming practices to achieve better decision-making and sustainable farm operations."
      },
      {
        icon: DollarSign,
        title: "Revenue Growth",
        description: "Boost yields, achieve better quality, and access new markets through technology-driven practices that increase productivity and profitability."
      }
    ],
    whereToStart: [
      {
        title: "Precision Farming",
        description: "Implement GPS-guided equipment and variable rate technology for optimized planting and harvesting.",
        cta: "Start"
      },
      {
        title: "Automated Irrigation Systems",
        description: "Automate irrigation systems based on weather forecasts and soil moisture data to conserve water.",
        cta: "Start"
      },
      {
        title: "Crop Monitoring with Drones",
        description: "Use drones and satellite imagery for crop health assessment and early disease detection.",
        cta: "Start"
      },
      {
        title: "Predictive Analytics",
        description: "Leverage AI-powered weather predictions and data analytics to optimize farming decisions.",
        cta: "Start"
      },
      {
        title: "Smart Greenhouses",
        description: "Deploy automated climate control and monitoring systems for optimal growing conditions.",
        cta: "Start"
      },
      {
        title: "Farm Management Platforms",
        description: "Centralize farm operations, inventory, and financial management in one digital platform.",
        cta: "Start"
      },
      {
        title: "Livestock Monitoring",
        description: "Track animal health, location, and behavior with wearable IoT devices and analytics.",
        cta: "Start"
      },
      {
        title: "Supply Chain Optimization",
        description: "Use blockchain technology for transparent tracking and efficient supply chain management.",
        cta: "Start"
      },
      {
        title: "Digital Crop Protection",
        description: "Monitor and manage pest control with AI-driven insights and precision application systems.",
        cta: "Start"
      },
      {
        title: "Sustainability Tracking",
        description: "Track environmental impact, carbon footprint, and sustainable farming practices with digital tools.",
        cta: "Start"
      }
    ],
    serviceAreas: [
      {
        number: "01",
        title: "Agriculture 4.0",
        description: "Transform traditional farming with IoT sensors, precision agriculture, automated machinery, and AI-driven crop management for optimized yields and resource efficiency."
      },
      {
        number: "02",
        title: "Livestock 4.0",
        description: "Monitor animal health, behavior, and productivity with wearable IoT devices, automated feeding systems, and predictive analytics for improved livestock management."
      },
      {
        number: "03",
        title: "Forestry 4.0",
        description: "Manage forest resources sustainably with drone monitoring, satellite imagery, and AI-powered analytics for timber tracking, reforestation, and conservation efforts."
      },
      {
        number: "04",
        title: "Conservation 4.0",
        description: "Protect biodiversity and natural resources with smart monitoring systems, environmental sensors, and data-driven conservation strategies for sustainable ecosystem management."
      }
    ],
    faqs: [
      {
        question: "How does Farming 4.0 increase crop yields?",
        answer: "Farming 4.0 uses precision agriculture techniques, IoT sensors, and AI analytics to optimize every aspect of farming - from soil preparation to harvesting. By providing real-time data on soil conditions, weather patterns, and crop health, farmers can make informed decisions that typically result in 20-30% yield improvements."
      },
      {
        question: "What technology is required to implement Farming 4.0?",
        answer: "Basic implementation requires smartphones or tablets for farm management apps, internet connectivity, and IoT sensors for monitoring. Advanced features may include GPS-guided tractors, drones for crop monitoring, and automated irrigation systems. We offer scalable solutions that can start small and grow with your needs."
      },
      {
        question: "How does Farming 4.0 help with market access?",
        answer: "Our digital marketplace platform connects farmers directly with buyers, eliminating intermediaries and ensuring fair prices. Farmers can list their produce, negotiate prices, arrange logistics, and receive payments digitally. Blockchain technology ensures transparency and builds trust between buyers and sellers."
      }
    ]
  },
  "mining-4-0": {
    icon: Mountain,
    title: "Mining 4.0",
    subtitle: "Revolutionize mining operations with smart technologies for enhanced safety, efficiency, and sustainable resource extraction.",
    description: "Transform mining operations with AI, IoT, and automation for safer, more efficient resource extraction.",
    heroImage: "/images/infrastructure-hero.png",
    overviewText: "Transform mining operations with Mining 4.0, leveraging IoT, AI, and automation to enhance safety, optimize resource extraction, and ensure environmental sustainability. From predictive maintenance and autonomous vehicles to real-time monitoring and digital twins, our solutions empower mining companies to reduce costs, improve productivity, and minimize environmental impact while maintaining the highest safety standards.",
    videoUrl: "/videos/Services-4.0.mp4",
    videoThumbnail: "/images/mining-thumbnail.png",
    showVideoComingSoon: true,
    benefits: [
      {
        icon: FileText,
        title: "Operating Cost Reduction",
        description: "Reduce operational costs through automation, predictive maintenance, and optimized resource allocation, minimizing downtime and maximizing equipment utilization."
      },
      {
        icon: TrendingUp,
        title: "Operational Excellence",
        description: "Enhance mining operations with real-time monitoring, AI-driven insights, and automated systems for improved productivity, safety, and resource extraction efficiency."
      },
      {
        icon: UsersRound,
        title: "Organisational Efficiency",
        description: "Improve workforce safety and productivity with digital tools, remote operations, and data-driven decision-making for streamlined mining processes."
      },
      {
        icon: DollarSign,
        title: "Revenue Growth",
        description: "Increase profitability through optimized extraction processes, reduced waste, improved yield quality, and access to previously unreachable resources."
      }
    ],
    whereToStart: [
      {
        title: "Autonomous Mining Vehicles",
        description: "Deploy self-driving trucks and equipment to enhance safety and operational efficiency in mining sites.",
        cta: "Start"
      },
      {
        title: "Predictive Maintenance",
        description: "Use IoT sensors and AI to predict equipment failures and schedule maintenance proactively.",
        cta: "Start"
      },
      {
        title: "Real-Time Monitoring",
        description: "Monitor mine conditions, equipment status, and worker safety with IoT sensors and dashboards.",
        cta: "Start"
      },
      {
        title: "Digital Twin Technology",
        description: "Create virtual replicas of mining operations to simulate, optimize, and predict performance.",
        cta: "Start"
      },
      {
        title: "Smart Drilling Systems",
        description: "Optimize drilling operations with AI-guided precision drilling and automated systems.",
        cta: "Start"
      },
      {
        title: "Environmental Monitoring",
        description: "Track air quality, water usage, and emissions to ensure sustainable mining practices.",
        cta: "Start"
      },
      {
        title: "Remote Operations Centers",
        description: "Enable centralized control of mining operations from remote locations for enhanced safety.",
        cta: "Start"
      },
      {
        title: "Resource Optimisation",
        description: "Use AI and data analytics to maximize ore recovery and minimize waste in extraction.",
        cta: "Start"
      },
      {
        title: "Safety Management Systems",
        description: "Implement wearable IoT devices and AI to monitor worker health and prevent accidents.",
        cta: "Start"
      },
      {
        title: "Supply Chain Integration",
        description: "Optimize logistics and material flow with real-time tracking and automated inventory management.",
        cta: "Start"
      }
    ],
    serviceAreas: [
      {
        number: "01",
        title: "Surface Mining 4.0",
        description: "Optimize open-pit and surface mining operations with autonomous equipment, real-time monitoring, and AI-driven resource planning."
      },
      {
        number: "02",
        title: "Underground Mining 4.0",
        description: "Enhance underground operations with remote-controlled equipment, ventilation monitoring, and advanced safety systems."
      },
      {
        number: "03",
        title: "Exploration 4.0",
        description: "Accelerate mineral exploration with AI-powered geological analysis, drone surveys, and predictive modeling."
      },
      {
        number: "04",
        title: "Processing 4.0",
        description: "Optimize ore processing and refining with automated systems, quality control, and energy-efficient technologies."
      },
      {
        number: "05",
        title: "Safety & Compliance 4.0",
        description: "Ensure regulatory compliance and worker safety with digital monitoring, reporting, and risk management systems."
      }
    ],
    faqs: [
      {
        question: "How does Mining 4.0 improve safety?",
        answer: "Mining 4.0 improves safety through autonomous vehicles that reduce human exposure to hazardous areas, real-time monitoring of environmental conditions, wearable IoT devices that track worker health and location, and AI-powered predictive systems that identify potential hazards before they become dangerous. Remote operations centers allow control of equipment from safe locations."
      },
      {
        question: "What technologies are used in Mining 4.0?",
        answer: "Mining 4.0 utilizes autonomous vehicles and drones, IoT sensors for real-time monitoring, AI and machine learning for predictive analytics, digital twin technology for simulation, robotics for hazardous tasks, advanced data analytics platforms, and integrated communication systems for remote operations."
      },
      {
        question: "How does Mining 4.0 support sustainability?",
        answer: "Mining 4.0 supports sustainability by optimizing resource extraction to minimize waste, monitoring environmental impact in real-time, reducing energy consumption through smart systems, enabling precise water management, tracking emissions and implementing mitigation strategies, and facilitating land rehabilitation through digital planning and monitoring."
      }
    ]
  },
  "plant-4-0": {
    icon: Factory,
    title: "Plant 4.0",
    subtitle: "Optimize operations, reduce costs, and enhance safety with AI-driven industrial automation solutions.",
    description: "Transforming manufacturing plants, supply chains and distribution channels.",
    heroImage: "/images/plant-hero.png",
    overviewText: "Transform industrial operations with Plant 4.0, where cutting-edge technologies like IoT, AI, and predictive maintenance drive efficiency, sustainability, and safety. Optimize energy usage, reduce downtime, and enhance production quality through smart automation and real-time data insights. Our solutions empower industries to achieve operational excellence while reducing costs and environmental impact.",
    videoUrl: "/videos/Plant 4.0.mp4",
    videoThumbnail: "/images/plant-thumbnail.png",
    benefits: [
      {
        icon: FileText,
        title: "Operating Cost Reduction",
        description: "Reduce operational costs by automating processes, optimizing energy use, and leveraging predictive maintenance to minimize downtime and maximize asset utilization."
      },
      {
        icon: TrendingUp,
        title: "Operational Excellence",
        description: "Streamline plant operations with IoT, real-time monitoring, and AI-driven insights, ensuring consistent quality, enhanced productivity, and improved performance."
      },
      {
        icon: UsersRound,
        title: "Organisational Efficiency",
        description: "Improve workforce productivity and resource utilization through smart manufacturing, digital tools, and data-driven decision-making for seamless workflows."
      },
      {
        icon: DollarSign,
        title: "Revenue Growth",
        description: "Boost revenues by optimizing production lines, reducing time-to-market, and unlocking new opportunities through enhanced plant performance and innovation."
      }
    ],
    whereToStart: [
      {
        title: "Predictive Maintenance",
        description: "Enable timely equipment repairs and reduce downtime using AI-driven insights and IoT sensors.",
        cta: "Start"
      },
      {
        title: "Energy Management Optimization",
        description: "Optimize energy consumption and reduce costs with real-time monitoring and data analytics.",
        cta: "Start"
      },
      {
        title: "Smart Manufacturing",
        description: "Enhance production efficiency and reduce errors through automation and digital controls.",
        cta: "Start"
      },
      {
        title: "Supply Chain Optimization",
        description: "Streamline logistics and improve agility with real-time tracking of materials and goods.",
        cta: "Start"
      },
      {
        title: "Digital Twin for Process Optimization",
        description: "Simulate plant operations to identify inefficiencies and optimize performance in real-time.",
        cta: "Start"
      },
      {
        title: "Robotic Process Automation (RPA)",
        description: "Automate repetitive tasks like assembly and inspection to improve speed and accuracy.",
        cta: "Start"
      },
      {
        title: "AI-Powered Quality Control",
        description: "Detect defects and ensure product quality with real-time AI vision systems.",
        cta: "Start"
      },
      {
        title: "Smart Resource Management",
        description: "Optimize water, raw materials, and energy usage to ensure sustainability and efficiency.",
        cta: "Start"
      },
      {
        title: "Remote Monitoring & Control",
        description: "Enable real-time remote monitoring of equipment to ensure safety and compliance.",
        cta: "Start"
      },
      {
        title: "Supply Chain Risk Management",
        description: "Predict disruptions and mitigate risks using AI and big data for resilient operations.",
        cta: "Start"
      }
    ],
    serviceAreas: [
      {
        number: "01",
        title: "Oil & Gas 4.0",
        description: "Optimize exploration, production, and distribution with IoT, AI, and automation solutions."
      },
      {
        number: "02",
        title: "Chemical 4.0",
        description: "Enhance safety, sustainability, and efficiency in chemical manufacturing through digital tools."
      },
      {
        number: "03",
        title: "FMCG 4.0",
        description: "Streamline production, logistics, and inventory management for fast-moving consumer goods."
      },
      {
        number: "04",
        title: "Power 4.0",
        description: "Enable smart grid management and optimize energy generation with real-time data analytics."
      },
      {
        number: "05",
        title: "Mining 4.0",
        description: "Improve resource extraction efficiency and enhance productivity with digital technologies."
      },
      {
        number: "06",
        title: "Water 4.0",
        description: "Optimize water distribution and treatment using IoT and data-driven solutions."
      },
      {
        number: "07",
        title: "Pharmaceutical 4.0",
        description: "Ensure compliance, improve quality, and reduce costs in pharmaceutical manufacturing."
      }
    ],
    faqs: [
      {
        question: "How does Plant 4.0 improve efficiency?",
        answer: "Plant 4.0 improves efficiency by integrating IoT sensors, AI-driven analytics, and automation to optimize production processes, reduce downtime, and enhance resource utilization. Real-time monitoring and predictive maintenance ensure equipment operates at peak performance, while smart manufacturing techniques streamline workflows and minimize waste."
      },
      {
        question: "What technologies are used in Plant 4.0?",
        answer: "Utilize AI-driven predictive maintenance, digital twins, and robotics to enhance operational excellence. Technologies include IoT sensors for real-time monitoring, AI and machine learning for predictive analytics, robotic process automation (RPA), digital twins for simulation, and advanced data analytics platforms."
      },
      {
        question: "How long does it take to see results from Plant 4.0 implementation?",
        answer: "Results can typically be seen within 3-6 months for initial implementations, with full transformation benefits realized over 12-18 months. Quick wins include improved monitoring and reduced downtime, while long-term benefits include optimized operations, significant cost savings, and enhanced productivity across all plant operations."
      }
    ]
  },
  "infrastructure-4-0": {
    icon: Building2,
    title: "Infrastructure 4.0",
    subtitle: "Modernize cities and infrastructure with IoT, AI, and data-driven solutions for sustainability and efficiency.",
    description: "Transforming infrastructure development, construction and asset management.",
    heroImage: "/images/infrastructure-hero.png",
    overviewText: "Transform urban environments and infrastructure with Infrastructure 4.0, leveraging IoT, AI, and data analytics to create smarter, sustainable cities. Optimize energy use, enhance public safety, and streamline urban mobility through predictive maintenance and smart technologies. Our solutions empower planners, developers, and governments to build resilient infrastructure and improve quality of life.",
    videoUrl: "/videos/VD2.mp4",
    videoThumbnail: "/images/infrastructure-thumbnail.png",
    showImageInsteadOfVideo: true,
    showVideoComingSoon: true,
    benefits: [
      {
        icon: FileText,
        title: "Operating Cost Reduction",
        description: "Reduce costs by optimizing energy, water, and resource usage with IoT-driven systems and predictive maintenance for all infrastructure assets."
      },
      {
        icon: TrendingUp,
        title: "Operational Excellence",
        description: "Enhance performance with real-time monitoring, smart technologies, and data-driven insights to ensure efficient and reliable infrastructure operations."
      },
      {
        icon: UsersRound,
        title: "Organisational Efficiency",
        description: "Streamline project planning, construction, and maintenance using digital tools like BIM, AI, and automation for smarter decision-making and execution."
      },
      {
        icon: DollarSign,
        title: "Revenue Growth",
        description: "Unlock new revenue streams by leveraging smart city platforms, data-driven services, and optimized urban infrastructure for innovative business models."
      }
    ],
    whereToStart: [
      {
        title: "Smart City Development",
        description: "Enable efficient urban planning and sustainability through IoT, AI, and real-time data analytics.",
        cta: "Start"
      },
      {
        title: "Energy Management Systems",
        description: "Optimize energy usage in buildings and cities with smart meters and predictive analytics.",
        cta: "Start"
      },
      {
        title: "Predictive Maintenance for Infrastructure",
        description: "Reduce downtime by predicting repairs for roads, bridges, and utilities using AI and sensors.",
        cta: "Start"
      },
      {
        title: "Urban Mobility Solutions",
        description: "Streamline traffic, logistics, and public transport with smart systems and route optimization.",
        cta: "Start"
      },
      {
        title: "Construction Automation and Robotics",
        description: "Enhance speed and safety in construction using drones, 3D printing, and robotic tools.",
        cta: "Start"
      },
      {
        title: "Building Management Systems (BMS)",
        description: "Monitor and optimize energy, security, and operations in buildings with IoT and AI.",
        cta: "Start"
      },
      {
        title: "Water Management",
        description: "Ensure efficient water distribution and waste treatment through digital monitoring and analytics.",
        cta: "Start"
      },
      {
        title: "Digital Twin for Infrastructure",
        description: "Simulate and optimize performance of buildings, roads, and utilities with virtual replicas.",
        cta: "Start"
      },
      {
        title: "Public Safety & Security",
        description: "Enhance safety with AI-driven surveillance, threat detection, and emergency response tools.",
        cta: "Start"
      },
      {
        title: "Smart Grids",
        description: "Monitor and manage power, gas, and water networks for better efficiency and resilience.",
        cta: "Start"
      }
    ],
    serviceAreas: [
      {
        number: "01",
        title: "Smart City 4.0",
        description: "Transform urban spaces with IoT, AI, and data-driven solutions for sustainability and efficiency."
      },
      {
        number: "02",
        title: "Building 4.0",
        description: "Optimize building design, energy use, and maintenance with BIM, IoT, and smart sensors."
      },
      {
        number: "03",
        title: "Construction 4.0",
        description: "Enhance construction processes through automation, robotics, and predictive analytics for smarter execution."
      },
      {
        number: "04",
        title: "Developer 4.0",
        description: "Streamline property development with smart urban planning and data-driven project management tools."
      },
      {
        number: "05",
        title: "Urbanisation 4.0",
        description: "Improve large-scale urbanization projects with digital tools for resource optimization and quality of life."
      }
    ],
    faqs: [
      {
        question: "How does Infrastructure 4.0 drive ROI?",
        answer: "Infrastructure 4.0 drives ROI by reducing operational costs through predictive maintenance, optimizing resource usage with IoT and AI, and improving project efficiency. Smart technologies minimize downtime, extend asset lifecycles, and enable data-driven decision-making that leads to significant cost savings and new revenue opportunities through smart city platforms and services."
      },
      {
        question: "What industries benefit from Infrastructure 4.0?",
        answer: "Urban planning, developers, and governments use our solutions to build smarter cities and sustainable infrastructure systems. This includes construction companies, real estate developers, municipal governments, utility providers, transportation authorities, and facility management companies looking to modernize their infrastructure and operations."
      },
      {
        question: "How quickly can I see results?",
        answer: "Initial results from Infrastructure 4.0 implementation can be seen within 3-6 months, with quick wins in monitoring and efficiency improvements. Full transformation benefits, including significant cost reductions and optimized operations, are typically realized within 12-18 months depending on the scope and scale of implementation."
      }
    ]
  },
  "government-4-0": {
    icon: Landmark,
    title: "Government 4.0",
    subtitle: "Transform governance with digital solutions that enhance transparency, efficiency, and citizen trust.",
    description: "Digitizing public services, improving citizen engagement and governance.",
    heroImage: "/images/government-hero.png",
    overviewText: "Transform public sector operations with Government 4.0, leveraging AI, blockchain, and IoT to enhance governance, transparency, and citizen engagement. Streamline administrative processes, improve service delivery, and foster trust with secure digital solutions. Our innovative tools empower governments to make data-driven decisions, reduce costs, and create smarter, more sustainable cities for future generations.",
    videoUrl: "/videos/Government 4.0.mp4",
    videoThumbnail: "/images/government-thumbnail.png",
    benefits: [
      {
        icon: FileText,
        title: "Operating Cost Reduction",
        description: "Reduce operational costs by automating administrative tasks, streamlining workflows, and digitizing public services for greater efficiency and resource optimization."
      },
      {
        icon: TrendingUp,
        title: "Operational Excellence",
        description: "Enhance government operations with real-time analytics, AI-driven processes, and automated systems to ensure faster, more accurate service delivery and decision-making."
      },
      {
        icon: UsersRound,
        title: "Organisational Efficiency",
        description: "Improve public administration through digital citizen interactions, secure data management, and streamlined internal workflows, reducing manual interventions and inefficiencies."
      },
      {
        icon: DollarSign,
        title: "Revenue Growth",
        description: "Generate new revenue streams by implementing innovative e-government services, digital tax systems, business licensing platforms, and permits for citizens and enterprises."
      }
    ],
    whereToStart: [
      {
        title: "E-Voting",
        description: "Ensure secure, transparent elections with blockchain and digital systems to build citizen trust.",
        cta: "Start"
      },
      {
        title: "Smart City Management",
        description: "Optimize urban systems like traffic, utilities, and waste management using IoT and AI solutions.",
        cta: "Start"
      },
      {
        title: "Digital Identity Management",
        description: "Enable secure citizen access to services with privacy-focused digital identity platforms.",
        cta: "Start"
      },
      {
        title: "Digital Taxation Systems",
        description: "Streamline tax collection and compliance with automated, fraud-resistant digital taxation solutions.",
        cta: "Start"
      },
      {
        title: "AI for Public Policy",
        description: "Leverage AI-driven data analytics to inform evidence-based policymaking and improve outcomes.",
        cta: "Start"
      },
      {
        title: "Public Safety and Security",
        description: "Enhance crime prevention and emergency response with AI-powered surveillance and real-time insights.",
        cta: "Start"
      },
      {
        title: "Government Service Portals",
        description: "Centralize citizen services into user-friendly online platforms for seamless access and engagement.",
        cta: "Start"
      },
      {
        title: "Digital Licensing",
        description: "Automate permit and license issuance to reduce bureaucracy and accelerate approvals for citizens.",
        cta: "Start"
      },
      {
        title: "Citizen Engagement",
        description: "Engage citizens through digital surveys, apps, and social media to improve service responsiveness.",
        cta: "Start"
      },
      {
        title: "Digital Records Management",
        description: "Digitize records and workflows to improve transparency, efficiency, and administrative processes.",
        cta: "Start"
      }
    ],
    serviceAreas: [
      {
        number: "01",
        title: "CentralGov 4.0",
        description: "Digitize central government operations to improve efficiency, transparency, and data-driven decision-making."
      },
      {
        number: "02",
        title: "Municipality 4.0",
        description: "Enhance local governance with smart urban planning and citizen engagement solutions."
      },
      {
        number: "03",
        title: "Regulator 4.0",
        description: "Automate compliance monitoring and risk management for efficient regulatory enforcement."
      },
      {
        number: "04",
        title: "IPA 4.0",
        description: "Promote investment opportunities and streamline business expansion through digital tools."
      },
      {
        number: "05",
        title: "Police 4.0",
        description: "Modernize law enforcement with AI-driven case management and intelligent surveillance systems."
      },
      {
        number: "06",
        title: "Defense 4.0",
        description: "Strengthen defense operations with cybersecurity, AI logistics, and advanced digital weaponry systems."
      },
      {
        number: "07",
        title: "Emergency 4.0",
        description: "Optimize emergency response with real-time data sharing and AI-driven resource management."
      }
    ],
    faqs: [
      {
        question: "How does Government 4.0 drive ROI?",
        answer: "Government 4.0 drives ROI by reducing operational costs through automation, improving service delivery efficiency, and generating new revenue streams through digital services. By streamlining administrative processes, reducing manual interventions, and enabling data-driven decision-making, governments can achieve significant cost savings while improving citizen satisfaction and trust."
      },
      {
        question: "What challenges does Government 4.0 solve?",
        answer: "Modernize outdated systems, enhance citizen engagement, and ensure secure, transparent governance through innovative digital tools. Government 4.0 addresses challenges such as bureaucratic inefficiencies, lack of transparency, poor citizen engagement, data silos, and security vulnerabilities by implementing integrated digital platforms, blockchain for transparency, AI for decision-making, and secure identity management systems."
      },
      {
        question: "How quickly can I see results?",
        answer: "Initial results from Government 4.0 implementation can be seen within 3-6 months for pilot projects and quick wins like digital portals and automated workflows. Full transformation benefits, including comprehensive digital governance, improved citizen satisfaction, and significant cost reductions, are typically realized within 12-24 months depending on the scope and scale of implementation."
      }
    ]
  },
  "hospitality-4-0": {
    icon: Hotel,
    title: "Hospitality 4.0",
    subtitle: "Elevate guest experiences with AI-driven personalization, seamless operations, and smart hospitality solutions.",
    description: "Transforming guest experiences, operations and revenue.",
    heroImage: "/images/hospitality-hero.png",
    overviewText: "Transform guest experiences with Hospitality 4.0, leveraging AI, IoT, and mobile-first solutions to create seamless, personalized journeys. From smart rooms and contactless check-ins to predictive maintenance and real-time feedback, our digital tools enhance guest satisfaction while streamlining operations. Elevate your hospitality business with innovative solutions designed to meet modern traveler expectations and drive loyalty.",
    videoUrl: "/videos/Hospitality 4.0.mp4",
    videoThumbnail: "/images/hospitality-thumbnail.png",
    benefits: [
      {
        icon: FileText,
        title: "Operating Cost Reduction",
        description: "Streamline operations with automation, smart systems, and predictive maintenance to reduce labor costs and improve resource efficiency in hospitality environments."
      },
      {
        icon: TrendingUp,
        title: "Operational Excellence",
        description: "Enhance service consistency and quality control through AI-driven insights, real-time data, and automated workflows for seamless guest experiences."
      },
      {
        icon: UsersRound,
        title: "Organisational Efficiency",
        description: "Boost staff productivity and streamline workflows with digital tools, enabling teams to focus on delivering exceptional guest interactions and high-value tasks."
      },
      {
        icon: DollarSign,
        title: "Revenue Growth",
        description: "Increase revenue through personalized guest experiences, dynamic pricing, targeted marketing, and upselling opportunities enabled by data analytics and digital platforms."
      }
    ],
    whereToStart: [
      {
        title: "Mobile Check-In",
        description: "Enable seamless guest arrivals with contactless check-ins and digital room access for enhanced convenience.",
        cta: "Start"
      },
      {
        title: "Smart Room Management",
        description: "Empower guests to personalize lighting, temperature, and services via IoT-enabled smart room controls.",
        cta: "Start"
      },
      {
        title: "AI Recommendations",
        description: "Deliver tailored dining, activity, and service suggestions based on guest preferences and behavior.",
        cta: "Start"
      },
      {
        title: "Digital Concierge",
        description: "Provide 24/7 virtual support for reservations, local guides, and guest requests through AI-driven platforms.",
        cta: "Start"
      },
      {
        title: "Virtual Waitlists",
        description: "Reduce wait times and enhance guest satisfaction with real-time queue tracking and digital waitlist systems.",
        cta: "Start"
      },
      {
        title: "Real-Time Feedback",
        description: "Capture instant feedback through mobile apps to resolve issues quickly and improve guest-based reviews.",
        cta: "Start"
      },
      {
        title: "Predictive Maintenance",
        description: "Prevent equipment failures with IoT sensors and AI algorithms for uninterrupted operations.",
        cta: "Start"
      },
      {
        title: "Dynamic Pricing Models",
        description: "Optimize revenue by adjusting pricing dynamically based on demand, time, and booking trends.",
        cta: "Start"
      },
      {
        title: "Event Management",
        description: "Streamline event registrations, ticketing, and crowd management for seamless large-scale gatherings.",
        cta: "Start"
      },
      {
        title: "Guest Analytics",
        description: "Leverage data analytics to create targeted marketing campaigns and enhance loyalty programs.",
        cta: "Start"
      }
    ],
    serviceAreas: [
      {
        number: "01",
        title: "Hotel & Stays 4.0",
        description: "Empower hotels with AI, analytics to boost productivity and sustainability in farming."
      },
      {
        number: "02",
        title: "Food & Beverage 4.0",
        description: "Empower dining experiences through AI-driven recommendations, contactless ordering, and enhance service control."
      },
      {
        number: "03",
        title: "Park & Resort 4.0",
        description: "Optimize park visits with digital queueing, ride reservations, and personalized guest interactions."
      },
      {
        number: "04",
        title: "Crowd & Events4.0",
        description: "Streamline event management with digital ticketing, crowd navigation, and real-time engagement tools."
      }
    ],
    faqs: [
      {
        question: "How does Hospitality 4.0 improve guest experiences?",
        answer: "Hospitality 4.0 improves guest experiences by leveraging AI-driven personalization, contactless services, and smart room technologies to create seamless, tailored journeys. From mobile check-ins and digital concierge services to real-time feedback systems and personalized recommendations, guests enjoy enhanced convenience, comfort, and satisfaction throughout their stay."
      },
      {
        question: "What technologies are used in Hospitality 4.0?",
        answer: "Utilize IoT, mobile apps, big data analytics, and AI to enhance operations and deliver personalized services. Key technologies include smart room controls, contactless payment systems, predictive maintenance sensors, dynamic pricing algorithms, guest analytics platforms, and AI-powered chatbots for 24/7 support."
      },
      {
        question: "How long does it take to see results from Hospitality 4.0 implementation?",
        answer: "Initial results from Hospitality 4.0 implementation can be seen within 2-4 months, with quick wins in guest satisfaction scores and operational efficiency. Full transformation benefits, including significant revenue growth, optimized operations, and enhanced guest loyalty, are typically realized within 6-12 months depending on the scope of implementation."
      }
    ]
  },
  "retail-4-0": {
    icon: ShoppingBag,
    title: "Retail 4.0",
    subtitle: "Transform retail with AI-driven personalization, smart inventory, and seamless omnichannel experiences.",
    description: "Reimagining retail experiences, merchandising and e-commerce.",
    heroImage: "/images/retail-hero.png",
    overviewText: "Transform your retail business with Retail 4.0, leveraging AI, IoT, and omnichannel integration to deliver seamless, personalized shopping experiences. From smart inventory management to dynamic pricing and AR-powered virtual try-ons, our solutions enhance customer engagement, streamline operations, and drive revenue growth. Elevate your brand and stay ahead in the competitive retail landscape.",
    videoUrl: "/videos/Retail 4. 0.mp4",
    videoThumbnail: "/images/retail-thumbnail.png",
    benefits: [
      {
        icon: FileText,
        title: "Operating Cost Reduction",
        description: "Reduce operational costs by automating inventory management, optimizing supply chains, and improving workforce efficiency through AI and IoT-driven solutions."
      },
      {
        icon: TrendingUp,
        title: "Operational Excellence",
        description: "Enhance retail operations with real-time data insights, predictive analytics, and seamless omnichannel integration for smoother processes and improved customer service."
      },
      {
        icon: UsersRound,
        title: "Organisational Efficiency",
        description: "Streamline workflows and boost productivity with smart merchandising, automated checkout systems, and AI-driven tools that reduce errors and save time."
      },
      {
        icon: DollarSign,
        title: "Revenue Growth",
        description: "Drive sales and increase customer loyalty through personalized experiences, dynamic pricing, and efficient online-to-offline (O2O) strategies that maximize revenue opportunities."
      }
    ],
    whereToStart: [
      {
        title: "AI Recommendations",
        description: "Enhance customer engagement with AI-driven product suggestions tailored to browsing and purchase history.",
        cta: "Start"
      },
      {
        title: "Inventory Management",
        description: "Optimize stock levels and reduce out-of-stock scenarios using real-time IoT and AI analytics.",
        cta: "Start"
      },
      {
        title: "BOPIS Solutions",
        description: "Enable seamless online-to-offline shopping with convenient pick-up and return options for customers.",
        cta: "Start"
      },
      {
        title: "AI Shopping Assistants",
        description: "Provide 24/7 customer support and personalized guidance through AI-driven chatbots and virtual assistants.",
        cta: "Start"
      },
      {
        title: "Dynamic Pricing Models",
        description: "Adjust pricing dynamically based on demand, competition, and customer behavior to maximize revenue.",
        cta: "Start"
      },
      {
        title: "Shop in Augmented Reality",
        description: "Allow customers to virtually try on products like clothing or furniture to enhance online shopping experiences.",
        cta: "Start"
      }
    ],
    serviceAreas: [
      {
        number: "01",
        title: "Commerce 4.0",
        description: "Integrate online and offline channels for seamless, personalized shopping experiences."
      },
      {
        number: "02",
        title: "PUOD 4.0",
        description: "Streamline operations with pick-up, click-and-collect, and return solutions for customers."
      },
      {
        number: "03",
        title: "Store 4.0",
        description: "Transform physical stores with IoT, AI, and interactive displays for enhanced engagement."
      },
      {
        number: "04",
        title: "Merchandising 4.0",
        description: "Optimize product placement, inventory, and promotions using data-driven merchandising tools."
      }
    ],
    faqs: [
      {
        question: "How does Retail 4.0 drive ROI?",
        answer: "Retail 4.0 drives ROI by optimizing inventory management, reducing operational costs through automation, and increasing sales through personalized customer experiences. AI-driven recommendations boost conversion rates, dynamic pricing maximizes revenue, and omnichannel integration improves customer retention. Retailers typically see 15-30% improvement in sales and significant cost reductions within 6-12 months."
      },
      {
        question: "What challenges does Retail 4.0 solve?",
        answer: "Modernize outdated processes, streamline operations, and deliver personalized, tech-driven solutions that set your business apart from competitors. Retail 4.0 addresses challenges such as inventory inefficiencies, poor customer engagement, fragmented shopping experiences, high operational costs, and inability to compete with e-commerce giants by implementing integrated digital solutions."
      },
      {
        question: "How quickly can I see results?",
        answer: "Initial results from Retail 4.0 implementation can be seen within 2-4 months, with quick wins in customer engagement and inventory optimization. Full transformation benefits, including significant revenue growth, improved operational efficiency, and enhanced customer loyalty, are typically realized within 6-12 months depending on the scope and scale of implementation."
      }
    ]
  },
  "service-4-0": {
    icon: Users,
    title: "Services 4.0",
    subtitle: "Transform traditional services with AI-driven automation, data insights, and seamless digital integration.",
    description: "Revolutionizing service delivery across HR, Legal, Finance, Insurance, and beyond.",
    heroImage: "/images/service-hero.png",
    overviewText: "Transform your service delivery with Services 4.0, leveraging AI-driven automation, data analytics, and seamless digital integration to optimize operations and enhance customer experiences. From automating repetitive tasks to enabling real-time decision-making, our solutions empower businesses across HR, Legal, Finance, Insurance, and more to innovate, reduce costs, and stay ahead in a competitive market.",
    videoUrl: "/videos/Services-4.0.mp4",
    videoThumbnail: "/images/service-thumbnail.png",
    benefits: [
      {
        icon: FileText,
        title: "Operating Cost Reduction",
        description: "Automate repetitive tasks and streamline workflows to significantly reduce operational costs and improve resource allocation across your organization."
      },
      {
        icon: TrendingUp,
        title: "Operational Excellence",
        description: "Enhance service delivery with AI-driven processes, real-time data processing, and seamless digital integration for faster, more accurate outcomes."
      },
      {
        icon: UsersRound,
        title: "Organisational Efficiency",
        description: "Optimize processes, improve data flow, and enable agile decision-making through interconnected digital platforms and workforce analytics."
      },
      {
        icon: DollarSign,
        title: "Revenue Growth",
        description: "Drive revenue through innovative service models, personalized customer experiences, and increased engagement enabled by predictive analytics and automation."
      }
    ],
    whereToStart: [
      {
        title: "AI Customer Support",
        description: "Enhance customer interactions with AI-powered chatbots and virtual assistants for 24/7 support.",
        cta: "Start"
      },
      {
        title: "Claims Processing",
        description: "Streamline claims handling in insurance and finance to reduce errors and turnaround times.",
        cta: "Start"
      },
      {
        title: "Digital Onboarding",
        description: "Enable secure, automated identity verification and KYC checks for seamless customer onboarding.",
        cta: "Start"
      },
      {
        title: "Data-Driven Marketing",
        description: "Deliver targeted campaigns and content recommendations using advanced data analytics.",
        cta: "Start"
      },
      {
        title: "Dynamic Pricing Systems",
        description: "Optimize pricing and inventory levels in real-time using AI and predictive analytics.",
        cta: "Start"
      },
      {
        title: "Predictive Maintenance",
        description: "Anticipate maintenance needs and improve uptime with IoT-driven predictive insights.",
        cta: "Start"
      },
      {
        title: "Contract Management",
        description: "Automate document reviews, approvals, and storage for faster, error-free workflows.",
        cta: "Start"
      },
      {
        title: "Workforce Optimization",
        description: "Empower HR teams with data-driven insights for better workforce planning and performance.",
        cta: "Start"
      },
      {
        title: "Omnichannel Experiences",
        description: "Integrate online, mobile, and offline touchpoints for consistent, frictionless service delivery.",
        cta: "Start"
      },
      {
        title: "Real-Time Analytics",
        description: "Enable quick, informed decisions with real-time data processing and actionable insights.",
        cta: "Start"
      }
    ],
    serviceAreas: [
      {
        number: "01",
        title: "Advisory 4.0",
        description: "Empower decision-making with AI-driven insights, data analytics, and strategic digital advisory solutions."
      },
      {
        number: "02",
        title: "Legal 4.0",
        description: "Streamline legal processes with automated document management, contract reviews, and compliance tools."
      },
      {
        number: "03",
        title: "Finance 4.0",
        description: "Optimize financial operations through data analytics, fraud detection, and real-time reporting."
      },
      {
        number: "04",
        title: "Insurance 4.0",
        description: "Enhance claims processing, risk assessments, and customer service with automation and AI."
      },
      {
        number: "05",
        title: "HR 4.0",
        description: "Transform workforce planning, training, and performance management with data-driven HR solutions."
      },
      {
        number: "06",
        title: "Education 4.0",
        description: "Enable personalized learning experiences with AI-powered platforms and digital content delivery."
      },
      {
        number: "07",
        title: "Bank 4.0",
        description: "Deliver seamless banking experiences through omnichannel platforms and real-time transaction insights."
      },
      {
        number: "08",
        title: "Media 4.0",
        description: "Optimize content delivery, audience engagement, and ad targeting with data-driven media solutions."
      },
      {
        number: "09",
        title: "Telco 4.0",
        description: "Enhance network performance, customer service delivery with AI and IoT integration."
      }
    ],
    faqs: [
      {
        question: "How does Services 4.0 drive ROI?",
        answer: "Services 4.0 drives ROI by automating repetitive tasks, reducing operational costs, and improving service delivery efficiency. AI-driven insights enable better decision-making, while digital integration streamlines workflows and enhances customer experiences. Organizations typically see 20-40% cost reductions and significant improvements in service quality within 6-12 months."
      },
      {
        question: "What challenges does Services 4.0 solve?",
        answer: "Modernize outdated processes, streamline operations, and deliver personalized, tech-driven solutions that set your business apart from competitors. Services 4.0 addresses challenges such as manual processes, data silos, poor customer engagement, compliance risks, and high operational costs by implementing integrated digital platforms, AI automation, and real-time analytics."
      },
      {
        question: "How quickly can I see results?",
        answer: "Initial results from Services 4.0 implementation can be seen within 2-4 months, with quick wins in process automation and customer engagement. Full transformation benefits, including significant cost reductions, improved operational efficiency, and enhanced service delivery, are typically realized within 6-12 months depending on the scope and scale of implementation."
      }
    ]
  },
  "logistics-4-0": {
    icon: Truck,
    title: "Logistics 4.0",
    subtitle: "Optimize supply chains with real-time tracking, AI-driven insights, and seamless automation solutions.",
    description: "Integrating supply chain and logistics management.",
    heroImage: "/images/logistics-hero.png",
    overviewText: "Transform your logistics operations with Logistics 4.0, leveraging IoT, AI, and automation to optimize supply chains and improve efficiency. From real-time tracking and predictive maintenance to route optimization and blockchain transparency, our solutions ensure faster deliveries, reduced costs, and enhanced customer satisfaction. Elevate your logistics business with cutting-edge digital tools designed for the future.",
    videoUrl: "/videos/Logistics 4.0.mp4",
    videoThumbnail: "/images/logistics-thumbnail.png",
    benefits: [
      {
        icon: FileText,
        title: "Operating Cost Reduction",
        description: "Reduce logistics and transportation costs through route optimization, fuel-efficient fleet management, and automated cargo handling for maximum efficiency."
      },
      {
        icon: TrendingUp,
        title: "Operational Excellence",
        description: "Enhance delivery accuracy, minimize delays, and improve supply chain management with real-time tracking and AI-driven decision-making tools."
      },
      {
        icon: UsersRound,
        title: "Organisational Efficiency",
        description: "Streamline supply chain operations, reduce overhead, and improve cross-functional coordination with IoT automation and data analytics."
      },
      {
        icon: DollarSign,
        title: "Revenue Growth",
        description: "Boost profitability by improving customer satisfaction, optimizing delivery times, and offering advanced logistics services like blockchain transparency."
      }
    ],
    whereToStart: [
      {
        title: "Real-Time Tracking",
        description: "Enable end-to-end visibility of shipments, vehicles, and inventory with IoT-powered tracking solutions.",
        cta: "Start"
      },
      {
        title: "Predictive Maintenance",
        description: "Prevent equipment failures and reduce downtime with AI-driven maintenance scheduling for vehicles and machinery.",
        cta: "Start"
      },
      {
        title: "Supply Chain Optimization",
        description: "Optimize inventory levels and demand forecasting using data analytics and machine learning insights.",
        cta: "Start"
      },
      {
        title: "Route Optimization",
        description: "Reduce fuel costs and delivery times with AI-powered route planning for efficient logistics operations.",
        cta: "Start"
      },
      {
        title: "Warehouse Automation",
        description: "Streamline sorting, storage, and retrieval processes with robotic systems and automated workflows.",
        cta: "Start"
      },
      {
        title: "Blockchain",
        description: "Ensure secure, traceable transactions and supply chain activities with blockchain-enabled record keeping.",
        cta: "Start"
      },
      {
        title: "Last-Mile Delivery",
        description: "Enhance final-stage delivery efficiency with real-time data and AI-driven logistics solutions.",
        cta: "Start"
      },
      {
        title: "Dynamic Pricing",
        description: "Adjust shipping costs dynamically based on demand, location, and time using AI and machine learning.",
        cta: "Start"
      },
      {
        title: "Demand Forecasting",
        description: "Anticipate product demand and optimize logistics planning with advanced machine learning models.",
        cta: "Start"
      }
    ],
    serviceAreas: [
      {
        number: "01",
        title: "Postal 4.0",
        description: "Streamline postal logistics, tracking, and transport with real-time data and automation."
      },
      {
        number: "02",
        title: "Logistics 4.0",
        description: "Enhance 3PL, 4PL, warehousing, and transport operations through AI and IoT solutions."
      },
      {
        number: "03",
        title: "Supply Chain 4.0",
        description: "Optimize planning, design, and 3PL services with predictive analytics and data-driven insights."
      },
      {
        number: "04",
        title: "Delivery 4.0",
        description: "Improve last-mile delivery, tracking, and customer experience with smart logistics tools."
      },
      {
        number: "05",
        title: "Freight 4.0",
        description: "Transform freight forwarding with blockchain transparency and real-time shipment tracking."
      },
      {
        number: "06",
        title: "Rail 4.0",
        description: "Modernize railways, trains, and metros with IoT automation and predictive maintenance."
      },
      {
        number: "07",
        title: "Airline 4.0",
        description: "Enhance flight operations, cargo management, and passenger experiences with digital tools."
      },
      {
        number: "08",
        title: "Airport 4.0",
        description: "Streamline entry, check-in, boarding, and airport experiences through smart technologies."
      },
      {
        number: "09",
        title: "Road Transport 4.0",
        description: "Optimize road transport systems with route planning, IoT sensors, and real-time monitoring."
      },
      {
        number: "10",
        title: "Water Transport 4.0",
        description: "Enable efficient water-based logistics with automated cargo handling and real-time tracking."
      }
    ],
    faqs: [
      {
        question: "How does Logistics 4.0 drive ROI?",
        answer: "Logistics 4.0 drives ROI by reducing operational costs through route optimization, fuel efficiency, and automated processes. Real-time tracking and predictive maintenance minimize delays and downtime, while AI-driven insights improve supply chain efficiency. Organizations typically see 20-35% cost reductions and significant improvements in delivery times and customer satisfaction within 6-12 months."
      },
      {
        question: "What challenges does Logistics 4.0 solve?",
        answer: "Modernize outdated logistics systems, streamline supply chains, and deliver seamless, tech-driven solutions that set your business apart from competitors. Logistics 4.0 addresses challenges such as poor visibility, inefficient routing, high fuel costs, delayed deliveries, inventory mismanagement, and lack of transparency by implementing integrated IoT, AI, and blockchain solutions."
      },
      {
        question: "How quickly can I see results?",
        answer: "Initial results from Logistics 4.0 implementation can be seen within 2-4 months, with quick wins in tracking visibility and route optimization. Full transformation benefits, including significant cost reductions, improved delivery times, and enhanced supply chain efficiency, are typically realized within 6-12 months depending on the scope and scale of implementation."
      }
    ]
  },
  "wellness-4-0": {
    icon: Heart,
    title: "Wellness 4.0",
    subtitle: "Transform health and wellness with personalized care, remote monitoring, and integrated digital solutions.",
    description: "Wellness and personal health care services.",
    heroImage: "/images/wellness-hero.png",
    overviewText: "Transform health and wellness with Wellness 4.0, leveraging AI, IoT, and telehealth to deliver personalized, accessible care. From remote patient monitoring and chronic disease management to mental health support and elderly care, our solutions enhance well-being while optimizing operational efficiency. Elevate your services with cutting-edge digital tools designed to improve lives and streamline care delivery.",
    videoUrl: "/videos/Wellness 4.0.mp4",
    videoThumbnail: "/images/wellness-thumbnail.png",
    benefits: [
      {
        icon: FileText,
        title: "Operating Cost Reduction",
        description: "Reduce healthcare costs through remote monitoring, automation, and optimized resource utilization for efficient service delivery."
      },
      {
        icon: TrendingUp,
        title: "Operational Excellence",
        description: "Streamline care coordination, improve patient outcomes, and enhance service delivery with AI-driven tools and integrated platforms."
      },
      {
        icon: UsersRound,
        title: "Organisational Efficiency",
        description: "Enhance workflow efficiency, minimize delays, and manage diverse care services seamlessly with digital health solutions."
      },
      {
        icon: DollarSign,
        title: "Revenue Growth",
        description: "Expand service offerings and drive user adoption with personalized wellness programs, telehealth, and digital care innovations."
      }
    ],
    whereToStart: [
      {
        title: "Virtual Appointments",
        description: "Enable remote consultations and reduce wait times with secure, real-time virtual healthcare services.",
        cta: "Start"
      },
      {
        title: "Chronic Illness Monitoring",
        description: "Monitor and manage chronic conditions proactively using AI-driven tools and connected devices.",
        cta: "Start"
      },
      {
        title: "Digital Elderly Care",
        description: "Enhance senior safety and health with IoT-enabled remote monitoring and emergency alert systems.",
        cta: "Start"
      },
      {
        title: "Childcare Platforms",
        description: "Streamline childcare scheduling, monitoring, and development tracking through intuitive digital tools.",
        cta: "Start"
      },
      {
        title: "Mental Health Support",
        description: "Provide accessible therapy, self-help tools, and mindfulness apps for better mental wellness outcomes.",
        cta: "Start"
      },
      {
        title: "Disability Assistance",
        description: "Empower individuals with disabilities through tailored digital solutions for daily living support.",
        cta: "Start"
      },
      {
        title: "Social Care Coordination",
        description: "Connect caregivers, families, and service providers on unified platforms for seamless care coordination.",
        cta: "Start"
      },
      {
        title: "Personalised Wellness",
        description: "Deliver AI-powered fitness, diet, and mental health plans tailored to individual needs and goals.",
        cta: "Start"
      },
      {
        title: "Remote Patient Monitoring",
        description: "Collect real-time health data and send alerts to caregivers for proactive and preventive care.",
        cta: "Start"
      },
      {
        title: "Integrated Healthcare",
        description: "Unify patient records, appointments, and services into one platform for streamlined operations.",
        cta: "Start"
      }
    ],
    serviceAreas: [
      {
        number: "01",
        title: "Healthcare 4.0",
        description: "Transform patient care with telemedicine, diagnostics, and integrated digital health platforms."
      },
      {
        number: "02",
        title: "Mental Health 4.0",
        description: "Enhance mental wellness through online therapy, self-help tools, and mindfulness apps."
      },
      {
        number: "03",
        title: "Child Care 4.0",
        description: "Streamline childcare services with digital tools for safety, education, and development tracking."
      },
      {
        number: "04",
        title: "Elderly Care 4.0",
        description: "Enable senior care with IoT-enabled monitoring, health alerts, and remote support systems."
      },
      {
        number: "05",
        title: "Disability Care 4.0",
        description: "Empower individuals with disabilities using tailored digital solutions for daily living assistance."
      },
      {
        number: "06",
        title: "Social Care 4.0",
        description: "Connect caregivers and families on unified platforms for coordinated social care delivery."
      }
    ],
    faqs: [
      {
        question: "How does Wellness 4.0 improve patient care?",
        answer: "Wellness 4.0 improves patient care by enabling remote monitoring, virtual consultations, and personalized treatment plans through AI and IoT technologies. Patients receive timely interventions, better chronic disease management, and enhanced access to healthcare services, leading to improved outcomes and satisfaction."
      },
      {
        question: "What technologies are used in Wellness 4.0?",
        answer: "Wellness 4.0 utilizes AI for diagnostics and personalized care, IoT for remote patient monitoring, telehealth platforms for virtual consultations, wearable devices for health tracking, and integrated digital platforms for seamless care coordination. These technologies work together to deliver comprehensive, accessible healthcare solutions."
      },
      {
        question: "How quickly can I see results?",
        answer: "Initial results from Wellness 4.0 implementation can be seen within 2-4 months, with quick wins in patient engagement and remote monitoring capabilities. Full transformation benefits, including improved patient outcomes, reduced costs, and enhanced operational efficiency, are typically realized within 6-12 months depending on the scope of implementation."
      }
    ]
  },
  "intelligence-4-0": {
    icon: Brain,
    title: "Intelligence 4.0",
    subtitle: "Leverage AI and analytics to gain actionable insights, driving smarter decision-making and business strategies.",
    description: "Leverage AI and analytics to gain actionable insights, driving smarter decision-making and business strategies.",
    heroImage: "/images/Service_landing_hero_image.png",
    overviewText: "Transform your organization with Intelligence 4.0, where AI, machine learning, and advanced analytics converge to unlock actionable insights. Make data-driven decisions faster, predict market trends, and optimize operations with intelligent automation that drives competitive advantage and sustainable growth.",
    videoUrl: "/videos/Services-4.0.mp4",
    videoThumbnail: "/images/Service_landing_hero_image.png",
    showVideoComingSoon: true,
    benefits: [
      {
        icon: FileText,
        title: "Data-Driven Decisions",
        description: "Enable faster, more accurate decision-making with real-time analytics and predictive insights."
      },
      {
        icon: TrendingUp,
        title: "Predictive Analytics",
        description: "Anticipate market trends and customer behavior to stay ahead of the competition."
      },
      {
        icon: UsersRound,
        title: "Intelligent Automation",
        description: "Automate complex processes with AI-powered systems that learn and adapt over time."
      },
      {
        icon: DollarSign,
        title: "Revenue Optimization",
        description: "Identify new revenue opportunities and optimize pricing strategies with advanced analytics."
      }
    ],
    whereToStart: [
      {
        title: "Business Intelligence",
        description: "Implement comprehensive BI dashboards for real-time visibility into business performance.",
        cta: "Start"
      },
      {
        title: "Predictive Analytics",
        description: "Leverage machine learning to forecast trends and optimize business outcomes.",
        cta: "Start"
      },
      {
        title: "AI-Powered Insights",
        description: "Deploy AI systems that automatically identify patterns and recommend actions.",
        cta: "Start"
      }
    ],
    serviceAreas: [
      {
        number: "01",
        title: "Business Intelligence",
        description: "Transform raw data into actionable insights with advanced analytics and visualization tools."
      },
      {
        number: "02",
        title: "Predictive Analytics",
        description: "Forecast future trends and behaviors using machine learning and statistical models."
      },
      {
        number: "03",
        title: "AI & Machine Learning",
        description: "Implement intelligent systems that learn, adapt, and optimize business processes automatically."
      }
    ],
    faqs: [
      {
        question: "How does Intelligence 4.0 improve decision-making?",
        answer: "Intelligence 4.0 provides real-time insights, predictive analytics, and AI-powered recommendations that enable faster, more accurate decisions based on comprehensive data analysis."
      },
      {
        question: "What data sources can Intelligence 4.0 integrate?",
        answer: "Intelligence 4.0 can integrate data from multiple sources including databases, cloud platforms, IoT devices, social media, and third-party APIs to provide a holistic view of your business."
      },
      {
        question: "How long does implementation take?",
        answer: "Basic implementation can be completed in 2-3 months, with advanced AI capabilities rolled out over 6-12 months depending on complexity and data readiness."
      }
    ]
  },
  "workspace-4-0": {
    icon: Users,
    title: "Workspace 4.0",
    subtitle: "Transform your digital workplace with collaborative tools and technologies that enhance productivity and employee engagement.",
    description: "Transform your digital workplace with collaborative tools and technologies that enhance productivity and employee engagement.",
    heroImage: "/images/Service_landing_hero_image.png",
    overviewText: "Revolutionize how your teams work with Workspace 4.0, where digital collaboration, intelligent automation, and employee experience converge. Create a flexible, productive work environment that empowers employees, enhances collaboration, and drives organizational success in the digital age.",
    videoUrl: "/videos/Services-4.0.mp4",
    videoThumbnail: "/images/Service_landing_hero_image.png",
    showVideoComingSoon: true,
    benefits: [
      {
        icon: Users,
        title: "Seamless Collaboration",
        description: "Break down silos with unified communication platforms that connect teams across locations and time zones."
      },
      {
        icon: Zap,
        title: "Productivity Acceleration",
        description: "Eliminate workflow bottlenecks with intelligent automation and streamlined digital processes."
      },
      {
        icon: Heart,
        title: "Employee Satisfaction",
        description: "Create engaging work experiences that boost morale, retention, and overall job satisfaction."
      },
      {
        icon: TrendingDown,
        title: "Reduced Overhead",
        description: "Optimize workspace utilization and reduce facility costs through smart space management."
      }
    ],
    whereToStart: [
      {
        title: "Digital Collaboration",
        description: "Implement unified communication and collaboration platforms for seamless teamwork.",
        cta: "Start"
      },
      {
        title: "Workspace Automation",
        description: "Automate routine tasks and workflows to free up time for strategic work.",
        cta: "Start"
      },
      {
        title: "Employee Experience",
        description: "Create engaging digital experiences that enhance employee satisfaction and productivity.",
        cta: "Start"
      }
    ],
    serviceAreas: [
      {
        number: "01",
        title: "Digital Collaboration",
        description: "Enable seamless communication and teamwork with integrated collaboration platforms."
      },
      {
        number: "02",
        title: "Workspace Management",
        description: "Optimize physical and digital workspace utilization with smart management tools."
      },
      {
        number: "03",
        title: "Employee Experience",
        description: "Enhance engagement and productivity with personalized digital workplace experiences."
      }
    ],
    faqs: [
      {
        question: "How does Workspace 4.0 improve productivity?",
        answer: "Workspace 4.0 streamlines workflows, automates routine tasks, and provides seamless collaboration tools that enable employees to work more efficiently from anywhere."
      },
      {
        question: "Can Workspace 4.0 support remote and hybrid work?",
        answer: "Yes, Workspace 4.0 is designed to support flexible work arrangements with cloud-based tools, virtual collaboration platforms, and secure remote access capabilities."
      },
      {
        question: "What is the implementation timeline?",
        answer: "Basic workspace transformation can be achieved in 3-4 months, with full digital workplace capabilities deployed over 6-9 months depending on organizational size and complexity."
      }
    ]
  },
  "governance-4-0": {
    icon: Landmark,
    title: "Governance 4.0",
    subtitle: "Establish robust governance frameworks to ensure compliance, risk management, and strategic alignment across your organization.",
    description: "Establish robust governance frameworks to ensure compliance, risk management, and strategic alignment across your organization.",
    heroImage: "/images/government-hero.png",
    overviewText: "Strengthen organizational governance with Governance 4.0, where digital tools, automated compliance, and intelligent risk management converge. Ensure regulatory compliance, mitigate risks, and maintain strategic alignment while enabling agile decision-making and transparent operations.",
    videoUrl: "/videos/Government 4.0.mp4",
    videoThumbnail: "/images/government-hero.png",
    benefits: [
      {
        icon: Shield,
        title: "Automated Compliance",
        description: "Maintain continuous regulatory adherence with real-time monitoring and automated reporting systems."
      },
      {
        icon: AlertTriangle,
        title: "Proactive Risk Mitigation",
        description: "Identify and address potential risks before they impact operations through intelligent risk assessment."
      },
      {
        icon: CheckCircle,
        title: "Policy Consistency",
        description: "Ensure uniform policy application and governance standards across all organizational levels."
      },
      {
        icon: Clock,
        title: "Audit Readiness",
        description: "Maintain audit-ready documentation and processes with automated compliance tracking and reporting."
      }
    ],
    whereToStart: [
      {
        title: "Compliance Management",
        description: "Implement automated systems to monitor and ensure regulatory compliance across operations.",
        cta: "Start"
      },
      {
        title: "Risk Assessment",
        description: "Deploy intelligent risk management tools to identify and mitigate potential threats.",
        cta: "Start"
      },
      {
        title: "Policy Management",
        description: "Centralize and automate policy creation, distribution, and compliance tracking.",
        cta: "Start"
      }
    ],
    serviceAreas: [
      {
        number: "01",
        title: "Compliance Management",
        description: "Automate regulatory compliance monitoring, reporting, and audit preparation processes."
      },
      {
        number: "02",
        title: "Risk Management",
        description: "Implement comprehensive risk assessment and mitigation frameworks with real-time monitoring."
      },
      {
        number: "03",
        title: "Policy Governance",
        description: "Centralize policy management and ensure consistent application across the organization."
      }
    ],
    faqs: [
      {
        question: "How does Governance 4.0 ensure compliance?",
        answer: "Governance 4.0 uses automated monitoring, real-time alerts, and comprehensive reporting to ensure continuous compliance with regulatory requirements and internal policies."
      },
      {
        question: "Can Governance 4.0 adapt to changing regulations?",
        answer: "Yes, Governance 4.0 includes flexible frameworks and automated updates that adapt to evolving regulatory landscapes, ensuring ongoing compliance."
      },
      {
        question: "What is the implementation process?",
        answer: "Implementation typically takes 4-6 months, starting with compliance assessment, followed by system deployment, policy integration, and team training."
      }
    ]
  },
  "backoffice-4-0": {
    icon: Building2,
    title: "Backoffice 4.0",
    subtitle: "Streamline back-office operations with automation and intelligent systems to improve efficiency and reduce operational costs.",
    description: "Streamline back-office operations with automation and intelligent systems to improve efficiency and reduce operational costs.",
    heroImage: "/images/infrastructure-hero.png",
    overviewText: "Transform back-office operations with Backoffice 4.0, where intelligent automation, process optimization, and digital workflows converge. Reduce manual tasks, eliminate errors, and accelerate processing times while freeing your team to focus on strategic initiatives that drive business growth.",
    videoUrl: "/videos/Services-4.0.mp4",
    videoThumbnail: "/images/infrastructure-hero.png",
    showVideoComingSoon: true,
    benefits: [
      {
        icon: Zap,
        title: "Intelligent Automation",
        description: "Eliminate manual data entry and repetitive tasks with RPA and AI-powered process automation."
      },
      {
        icon: Clock,
        title: "Faster Processing",
        description: "Accelerate transaction processing and reduce cycle times from days to hours or minutes."
      },
      {
        icon: Target,
        title: "Error Elimination",
        description: "Achieve near-zero error rates through automated validation and intelligent quality controls."
      },
      {
        icon: TrendingDown,
        title: "Operational Savings",
        description: "Reduce back-office costs by 30-50% through process optimization and resource reallocation."
      }
    ],
    whereToStart: [
      {
        title: "Process Automation",
        description: "Implement RPA and intelligent automation for repetitive back-office tasks.",
        cta: "Start"
      },
      {
        title: "Document Management",
        description: "Digitize and automate document processing, storage, and retrieval systems.",
        cta: "Start"
      },
      {
        title: "Workflow Optimization",
        description: "Streamline and optimize back-office workflows for maximum efficiency.",
        cta: "Start"
      }
    ],
    serviceAreas: [
      {
        number: "01",
        title: "Finance & Accounting",
        description: "Automate financial processes including invoicing, reconciliation, and reporting."
      },
      {
        number: "02",
        title: "HR Operations",
        description: "Streamline HR processes from recruitment to payroll with intelligent automation."
      },
      {
        number: "03",
        title: "Document Processing",
        description: "Digitize and automate document management, processing, and archival systems."
      }
    ],
    faqs: [
      {
        question: "How does Backoffice 4.0 reduce costs?",
        answer: "Backoffice 4.0 reduces costs by automating manual processes, eliminating errors, accelerating processing times, and optimizing resource allocation, typically resulting in 30-50% cost savings."
      },
      {
        question: "What processes can be automated?",
        answer: "Most repetitive back-office processes can be automated including data entry, invoice processing, report generation, document management, and routine administrative tasks."
      },
      {
        question: "How long does implementation take?",
        answer: "Initial automation can be deployed in 2-3 months for specific processes, with comprehensive back-office transformation completed over 6-9 months depending on scope."
      }
    ]
  }
};

// Deploy 4.0 specific content
const deployServiceContent = {
  hero: {
    title: "Deploy 4.0",
    subtitle: "Implement scalable digital solutions with precision-guided by data-driven strategies and organizational goals.",
    backgroundImage: "/images/landingpage_hero.png",
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
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

const DesignServiceDetailPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(1);
  
  // Use the custom hook for methodology steps
  const { activeStep, stepsContainerRef, setStepRef } = useMethodologySteps({
    stepsCount: designServiceContent.methodology.steps.length
  });

  const {
    hero,
    blueprintSection,
    stats,
    industryExpertise,
    transformationApproach,
    methodology
  } = designServiceContent;

  const navigate = useNavigate();

  const handleScrollToContact = () => {
    navigate('/consultation');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative h-[520px] overflow-hidden bg-secondary-900">
        <div className="absolute inset-0">
          <img src={hero.backgroundImage} alt={hero.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/85 to-secondary-900/30" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{hero.title}</h1>
          <p className="text-white/80 text-lg mb-3 max-w-2xl">{hero.subtitle}</p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleScrollToContact}
              className="px-8 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-600 transition-colors inline-flex items-center gap-2"
            >
              Get in Touch
              <ArrowRight size={18} />
            </button>
          </div>
          <div className="mt-10 flex items-center text-sm text-white/80 gap-2 flex-wrap">
            {hero.breadcrumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                {crumb.href ? (
                  <Link to={crumb.href} className="hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
                {index !== hero.breadcrumbs.length - 1 && <span>›</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Blueprint */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative max-w-xl mx-auto w-full">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img src={blueprintSection.imagePrimary} alt="Transformation workshop" className="w-full h-[520px] object-cover" />
            </div>
            <div className="absolute -bottom-10 left-14 w-2/3 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img src={blueprintSection.imageOverlay} alt="Digital future" className="w-full h-[260px] object-cover" />
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{blueprintSection.title}</h2>
            <p className="text-gray-600 text-lg">{blueprintSection.description}</p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleScrollToContact}
                className="px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-600 transition-colors inline-flex items-center gap-2"
              >
                {blueprintSection.primaryCta.label}
                <ArrowRight size={16} />
              </button>
              <Link
                to={blueprintSection.secondaryCta.href}
                className="px-6 py-3 border border-gray-300 text-gray-900 font-semibold rounded-full hover:bg-gray-50 transition-colors"
              >
                {blueprintSection.secondaryCta.label}
              </Link>
            </div>
            <div className="space-y-4 pt-4">
              {blueprintSection.faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={faq.question} className="border border-gray-200 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-gray-900"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    {isOpen && <div className="px-5 pb-5 text-gray-600 text-sm">{faq.answer}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.value} className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                <p className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Methodology */}
      <section className="py-20 bg-[#f5f5f5] overflow-hidden">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary mb-3">
              {methodology.eyebrow}
            </p>
            <h2 className="text-4xl font-bold text-gray-900">{methodology.title}</h2>
            <div className="relative mt-10 h-[520px]">
              <div className="hidden md:block absolute left-6 top-0 bottom-0 w-px bg-gray-300 pointer-events-none" />
              <div
                ref={stepsContainerRef}
                className="space-y-10 h-full overflow-y-auto pr-3 sm:pr-5 scrollbar-hide"
              >
                {methodology.steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isLast = index === methodology.steps.length - 1;
                  const isActive = activeStep === index;
                  return (
                    <div
                      key={step.number}
                      ref={setStepRef(index)}
                      data-index={index}
                      className={`flex gap-6 items-start transition-all duration-300 ${
                        isActive ? "translate-x-1" : ""
                      }`}
                    >
                      <div className="flex flex-col items-center min-w-[3rem]">
                        <span
                          className={`text-sm font-semibold tracking-widest ${
                            isActive ? "text-secondary-900" : "text-gray-500"
                          }`}
                        >
                          {step.number}
                        </span>
                        {!isLast && <div className="hidden md:block w-px flex-1 bg-gray-300 mt-2" />}
                      </div>
                      <div
                        className={`flex-1 rounded-2xl border p-6 transition-all duration-300 ${
                          isActive ? "border-white bg-white shadow-lg" : "border-gray-200 bg-white shadow-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                          <div
                            className={`w-12 h-12 rounded-full border flex items-center justify-center ${
                              isActive
                                ? "border-primary/30 text-primary bg-primary/10"
                                : "border-gray-200 text-gray-500 bg-white"
                            }`}
                          >
                            <StepIcon className="w-5 h-5" strokeWidth={1.5} />
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              onClick={handleScrollToContact}
              className="mt-10 inline-flex items-center gap-3 px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-600 transition-colors"
            >
              {methodology.ctaLabel}
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="relative flex items-center justify-center h-full">
            <div className="w-full h-[560px] md:h-[620px] overflow-hidden shadow-2xl rounded-3xl">
              <img
                src={methodology.image}
                alt="Design collaboration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Structured approach */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-sm uppercase tracking-widest text-primary mb-3">{transformationApproach.eyebrow}</p>
            <h2 className="text-4xl font-bold text-gray-900">{transformationApproach.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transformationApproach.steps.map((step) => (
              <div 
                key={step.number} 
                className="group relative border border-gray-200 rounded-2xl p-6 bg-white hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
              >
                {/* Animated background overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/90 to-secondary-800/90 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <p className="text-sm text-gray-400 group-hover:text-white/60 mb-3 transition-colors duration-300">{step.number}.</p>
                  <h3 className="font-semibold text-gray-900 group-hover:text-white mb-2 transition-colors duration-300">{step.title}</h3>
                  <p className="text-gray-600 group-hover:text-white/80 text-sm transition-colors duration-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry expertise */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">{industryExpertise.title}</h2>
            <p className="text-gray-600 text-lg mb-6">{industryExpertise.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {industryExpertise.cards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h3>
                  <div className="h-px bg-gray-200 mb-4" />
                  <p className="text-gray-600 flex-1">{card.description}</p>
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-600 transition-colors"
            >
              {industryExpertise.ctaLabel}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer isLoggedIn={false} />
      
      {/* Add keyframes for animations */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const DeployServiceDetailPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(1);
  
  // Use the custom hook for methodology steps
  const { activeStep, stepsContainerRef, setStepRef } = useMethodologySteps({
    stepsCount: deployServiceContent.methodology.steps.length
  });

  const navigate = useNavigate();

  const handleScrollToContact = () => {
    navigate('/consultation');
  };

  const {
    hero,
    blueprintSection,
    stats,
    industryExpertise,
    transformationApproach,
    methodology
  } = deployServiceContent;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative h-[520px] overflow-hidden bg-secondary-900">
        <div className="absolute inset-0">
          <img src={hero.backgroundImage} alt={hero.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/85 to-secondary-900/30" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{hero.title}</h1>
          <p className="text-white/80 text-lg mb-3 max-w-2xl">{hero.subtitle}</p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleScrollToContact}
              className="px-8 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-600 transition-colors inline-flex items-center gap-2"
            >
              Get in Touch
              <ArrowRight size={18} />
            </button>
          </div>
          <div className="mt-10 flex items-center text-sm text-white/80 gap-2 flex-wrap">
            {hero.breadcrumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                {crumb.href ? (
                  <Link to={crumb.href} className="hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
                {index !== hero.breadcrumbs.length - 1 && <span>›</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Blueprint */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative max-w-xl mx-auto w-full">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img src={blueprintSection.imagePrimary} alt="Deployment workshop" className="w-full h-[520px] object-cover" />
            </div>
            <div className="absolute -bottom-10 left-14 w-2/3 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img src={blueprintSection.imageOverlay} alt="Digital execution" className="w-full h-[260px] object-cover" />
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{blueprintSection.title}</h2>
            <p className="text-gray-600 text-lg">{blueprintSection.description}</p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleScrollToContact}
                className="px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-600 transition-colors inline-flex items-center gap-2"
              >
                {blueprintSection.primaryCta.label}
                <ArrowRight size={16} />
              </button>
              <Link
                to={blueprintSection.secondaryCta.href}
                className="px-6 py-3 border border-gray-300 text-gray-900 font-semibold rounded-full hover:bg-gray-50 transition-colors"
              >
                {blueprintSection.secondaryCta.label}
              </Link>
            </div>
            <div className="space-y-4 pt-4">
              {blueprintSection.faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={faq.question} className="border border-gray-200 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-gray-900"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    {isOpen && <div className="px-5 pb-5 text-gray-600 text-sm">{faq.answer}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.value} className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                <p className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-20 bg-[#f5f5f5] overflow-hidden">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary mb-3">
              {methodology.eyebrow}
            </p>
            <h2 className="text-4xl font-bold text-gray-900">{methodology.title}</h2>
            <div className="relative mt-10 h-[520px]">
              <div className="hidden md:block absolute left-6 top-0 bottom-0 w-px bg-gray-300 pointer-events-none" />
              <div
                ref={stepsContainerRef}
                className="space-y-10 h-full overflow-y-auto pr-3 sm:pr-5 scrollbar-hide"
              >
                {methodology.steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isLast = index === methodology.steps.length - 1;
                  const isActive = activeStep === index;
                  return (
                    <div
                      key={step.number}
                      ref={setStepRef(index)}
                      data-index={index}
                      className={`flex gap-6 items-start transition-all duration-300 ${
                        isActive ? "translate-x-1" : ""
                      }`}
                    >
                      <div className="flex flex-col items-center min-w-[3rem]">
                        <span
                          className={`text-sm font-semibold tracking-widest ${
                            isActive ? "text-secondary-900" : "text-gray-500"
                          }`}
                        >
                          {step.number}
                        </span>
                        {!isLast && <div className="hidden md:block w-px flex-1 bg-gray-300 mt-2" />}
                      </div>
                      <div
                        className={`flex-1 rounded-2xl border p-6 transition-all duration-300 ${
                          isActive ? "border-white bg-white shadow-lg" : "border-gray-200 bg-white shadow-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                          <div
                            className={`w-12 h-12 rounded-full border flex items-center justify-center ${
                              isActive
                                ? "border-primary/30 text-primary bg-primary/10"
                                : "border-gray-200 text-gray-500 bg-white"
                            }`}
                          >
                            <StepIcon className="w-5 h-5" strokeWidth={1.5} />
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              onClick={handleScrollToContact}
              className="mt-10 inline-flex items-center gap-3 px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-600 transition-colors"
            >
              {methodology.ctaLabel}
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="relative h-full flex items-stretch">
            <div className="w-full h-[560px] md:h-[620px] overflow-hidden shadow-2xl rounded-3xl">
              <img
                src={methodology.image}
                alt="Deployment collaboration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Structured approach */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-sm uppercase tracking-widest text-primary mb-3">{transformationApproach.eyebrow}</p>
            <h2 className="text-4xl font-bold text-gray-900">{transformationApproach.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transformationApproach.steps.map((step) => (
              <div 
                key={step.number} 
                className="group relative border border-gray-200 rounded-2xl p-6 bg-white hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/90 to-secondary-800/90 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
                <div className="relative z-10">
                  <p className="text-sm text-gray-400 group-hover:text-white/60 mb-3 transition-colors duration-300">{step.number}.</p>
                  <h3 className="font-semibold text-gray-900 group-hover:text-white mb-2 transition-colors duration-300">{step.title}</h3>
                  <p className="text-gray-600 group-hover:text-white/80 text-sm transition-colors duration-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Expertise */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">{industryExpertise.title}</h2>
            <p className="text-gray-600 text-lg mb-6">{industryExpertise.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {industryExpertise.cards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h3>
                  <div className="h-px bg-gray-200 mb-4" />
                  <p className="text-gray-600 flex-1">{card.description}</p>
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-600 transition-colors"
            >
              {industryExpertise.ctaLabel}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [sidebarStyle, setSidebarStyle] = useState<React.CSSProperties>({});
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const footerSectionRef = useRef<HTMLElement>(null);
  
  const service = slug ? serviceData[slug] : null;

  if (slug === "design-4-0") {
    return <DesignServiceDetailPage />;
  }

  if (slug === "deploy-4-0") {
    return <DeployServiceDetailPage />;
  }

  // Get all services for sidebar (excluding Design 4.0 and Deploy 4.0)
  const allServices = Object.keys(serviceData)
    .filter(key => key !== "design-4-0" && key !== "deploy-4-0")
    .map(key => ({
      slug: key,
      title: serviceData[key].title
    }));

  if (!service) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <button
            onClick={() => navigate("/services")}
            className="text-primary hover:underline"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  const Icon = service.icon;

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Handle sidebar fixed positioning
  useEffect(() => {
    const handleScroll = () => {
      // Only apply sticky behavior on desktop (lg breakpoint and above)
      if (window.innerWidth < 1024) {
        setSidebarStyle({});
        return;
      }

      if (!sidebarRef.current || !mainContentRef.current || !footerSectionRef.current) return;

      const sidebarEl = sidebarRef.current;
      const mainContentRect = mainContentRef.current.getBoundingClientRect();
      const footerRect = footerSectionRef.current.getBoundingClientRect();
      const sidebarHeight = sidebarEl.offsetHeight;
      const sidebarWidth = sidebarEl.offsetWidth;
      
      // Get the original left position from the parent container
      const parentRect = sidebarEl.parentElement?.getBoundingClientRect();
      const sidebarLeft = parentRect?.left || 0;
      
      // When to start being fixed (when main content section reaches top)
      const startFixed = mainContentRect.top <= 24;
      
      // When to stop being fixed (when footer section is about to overlap)
      const stopFixed = footerRect.top <= sidebarHeight + 48;
      
      if (startFixed && !stopFixed) {
        // Fixed position while scrolling through content
        setSidebarStyle({
          position: 'fixed',
          top: '24px',
          left: `${sidebarLeft}px`,
          width: `${sidebarWidth}px`,
          zIndex: 40
        });
      } else if (stopFixed) {
        // Stop at the bottom before footer
        setSidebarStyle({
          position: 'absolute',
          bottom: '0',
          left: '0',
          width: '100%',
          zIndex: 40
        });
      } else {
        // Default sticky position
        setSidebarStyle({});
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll(); // Initial call
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[400px] bg-gray-900">
        <div className="absolute inset-0">
          <img 
            src={service.heroImage} 
            alt={service.title}
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/80 to-secondary-900/40" />
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-5xl font-bold text-white mb-4">{service.title}</h1>
          <p className="text-xl text-white/90 max-w-2xl mb-8">{service.subtitle}</p>
          
          <div className="flex gap-4">
            <button 
              onClick={() => {
                const element = document.getElementById('contact-form');
                element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-6 py-3 bg-white text-secondary-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              Get in Touch
              <ArrowRight size={18} />
            </button>
          </div>
          
          {/* Breadcrumb */}
          <div className="absolute bottom-6 left-4 text-white/70 text-sm">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">›</span>
            <Link to="/services" className="hover:text-white">Services</Link>
            <span className="mx-2">›</span>
            <span className="text-white">{service.title}</span>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section ref={mainContentRef} className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Hidden on mobile, visible on desktop */}
            <aside className="hidden lg:block lg:col-span-1 relative">
              <div ref={sidebarRef} style={sidebarStyle} className="bg-gray-50 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Our Services</h3>
                <nav className="space-y-2">
                  {allServices.map((s) => (
                    <Link
                      key={s.slug}
                      to={`/services/${s.slug}`}
                      className={`block px-4 py-3 rounded-lg transition-colors ${
                        s.slug === slug
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {s.title}
                    </Link>
                  ))}
                  <Link
                    to="/services"
                    className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    Go to All Services
                  </Link>
                </nav>
                
                {/* CTA Box */}
                <div className="mt-8 bg-secondary-900 text-white p-6">
                  <h4 className="font-bold text-lg mb-2">
                    {getSidebarCtaContent(service.title).title}
                  </h4>
                  <p className="text-sm text-white/80 mb-4">
                    {getSidebarCtaContent(service.title).description}
                  </p>
                  <button 
                    onClick={() => {
                      const element = document.getElementById('contact-form');
                      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="w-full px-4 py-3 bg-white text-secondary-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    Contact Us
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content - Full width on mobile, 3 columns on desktop */}
            <div className="lg:col-span-3">
              {/* Overview */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Overview</h2>
                <p className="text-gray-600 leading-relaxed mb-8">
                  {service.overviewText}
                </p>
                
                {/* Video or Image */}
                <div className="rounded-2xl overflow-hidden bg-gray-900 aspect-video">
                  {service.showImageInsteadOfVideo ? (
                    <img
                      className="w-full h-full object-cover"
                      src={service.videoThumbnail || "/images/Service_landing_hero_image.png"}
                      alt={`${service.title} overview`}
                    />
                  ) : service.showVideoComingSoon ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <div className="text-center text-white">
                        <div className="text-2xl font-bold mb-2">Video Coming Soon</div>
                        <div className="text-gray-300">We're preparing an exclusive video for {service.title}</div>
                      </div>
                    </div>
                  ) : (
                    <video
                      key={`${slug}-video`}
                      className="w-full h-full object-cover"
                      controls
                      poster={service.videoThumbnail || "/images/Service_landing_hero_image.png"}
                    >
                      <source src={service.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
                
                <p className="text-gray-600 leading-relaxed mt-6">
                  {getOverviewClosingText(slug || '')}
                </p>
              </div>

              {/* Key Benefits */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Benefits</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {service.benefits.map((benefit: any, index: number) => {
                    const BenefitIcon = benefit.icon;
                    return (
                      <div key={index} className="flex gap-4 p-6 bg-gray-50 rounded-xl">
                        <div className="flex-shrink-0">
                          <BenefitIcon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                          <p className="text-sm text-gray-600">{benefit.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Where to Start */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Where to Start</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {service.whereToStart.map((item: any, index: number) => (
                    <div 
                      key={index} 
                      className="group relative border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                      {/* Animated background overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
                      
                      {/* Content */}
                      <div className="relative z-10">
                        <h3 className="font-bold text-gray-900 mb-3">{item.title}</h3>
                        <div className="h-px bg-gray-200 mb-3"></div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Areas */}
              <div className="mb-16">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">Service Areas</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {service.serviceAreas.map((area: any, index: number) => (
                    <div 
                      key={index} 
                      className="group relative border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                      {/* Animated background overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/90 to-secondary-800/90 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
                      
                      {/* Content */}
                      <div className="relative z-10">
                        <p className="text-sm text-gray-400 group-hover:text-white/60 mb-3 transition-colors duration-300">{area.number}</p>
                        <h3 className="font-bold text-gray-900 group-hover:text-white mb-2 transition-colors duration-300">{area.title}</h3>
                        <p className="text-sm text-gray-600 group-hover:text-white/80 transition-colors duration-300">{area.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ and Contact Section */}
      <section
        ref={footerSectionRef}
        id="contact-form"
        className="relative py-16 overflow-hidden text-white"
        style={{
          backgroundImage: "url('/images/Form_background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-secondary-900/80" />
        <div className="relative container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* FAQ */}
            <div>
              <h2 className="text-3xl font-bold mb-8">
                {getFaqSectionTitle(slug || '')}
              </h2>
              
              <div className="space-y-4">
                {service.faqs.map((faq: any, index: number) => (
                  <div key={index} className="border border-white/20 rounded-lg">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="font-semibold">{faq.question}</span>
                      {openFaq === index ? (
                        <ChevronUp className="w-5 h-5 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 flex-shrink-0" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="px-4 pb-4 text-white/80">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <ConsultationFormCard 
              submitLabel={service.consultation?.ctaLabel ?? "Submit Request"} 
              defaultSector={slug || ""}
              disableSectorSelection={true}
            />
          </div>
        </div>
      </section>

      <Footer isLoggedIn={false} />
    </div>
  );
}
