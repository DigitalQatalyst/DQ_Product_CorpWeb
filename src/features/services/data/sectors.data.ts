import { TrendingUp, Zap, CheckCircle, Users, type LucideIcon } from "lucide-react";

export interface CorePillar { title: string; description: string }
export interface WhyReason { icon: LucideIcon; title: string; description: string }
export interface Stat { value: string; label: string }

export interface SectorData {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  focus: string;
  corePillars: CorePillar[];
  whyReasons: WhyReason[];
  technologies: string[];
  benefits: string[];
  useCases: string[];
  stats: [Stat, Stat, Stat];
  heroImage: string;
}

const sectorsData: Record<string, SectorData> = {
  agility: {
    id: "agility", name: "Agility 4.0",
    title: "Agility 4.0: Empowering Organizational Adaptability in the Digital Economy",
    subtitle: "Empowering organizations to quickly adapt to changing market conditions, evolving customer needs, and rapid technological shifts",
    focus: "Agility 4.0 is the framework that empowers organizations to quickly adapt to changing market conditions, evolving customer needs, and rapid technological shifts. In the Digital Economy 4.0, businesses must be flexible, adaptive, and capable of making decisions quickly to stay competitive.",
    corePillars: [
      { title: "Agile Methodologies", description: "Approaches like Scrum and Kanban that enable flexibility and iterative development." },
      { title: "DevOps", description: "Bridging development and operations to streamline the software delivery process." },
      { title: "Lean Practices", description: "Focusing on efficiency by eliminating waste and maximizing value." },
    ],
    whyReasons: [
      { icon: TrendingUp, title: "Reduce Time-to-Market", description: "Achieve faster product delivery with shorter development cycles." },
      { icon: Zap, title: "Increase Productivity", description: "Streamline workflows and remove friction to improve overall team efficiency." },
      { icon: CheckCircle, title: "Cut Costs", description: "Eliminate inefficiencies and focus on high-value work to reduce operational expenses." },
      { icon: Users, title: "Foster Innovation", description: "Leverage continuous feedback and iteration to stay competitive and drive innovation." },
    ],
    technologies: ["AI & Machine Learning", "Cloud Computing", "Automation Tools", "Collaborative Platforms", "DevOps & CI/CD", "Agile Project Management"],
    benefits: ["Increased Speed: Agile teams deliver solutions faster with shorter iteration cycles", "Cost Efficiency: Eliminating waste reduces operational costs", "Better Customer Experiences: Continuous feedback allows businesses to create better products", "Enhanced Collaboration: Agile practices break down silos", "Scalability: Scale processes while maintaining speed and efficiency", "Foster Innovation: Continuous feedback drives innovation"],
    useCases: ["Agile Transformation in Software Development: Streamline software development processes", "DevOps for Continuous Deployment: Automate testing, deployment, and monitoring", "Automated Testing for Quicker Feedback: Identify issues early in the development process", "Cloud-Native Application Development: Develop scalable applications quickly", "Real-Time Feedback Loops: Collect feedback from customers continuously"],
    stats: [{ label: "Faster Time-to-Market", value: "40%" }, { label: "Increased Productivity", value: "35%" }, { label: "Reduced Costs", value: "30%" }],
    heroImage: "/images/agility-hero.png",
  },
  experience: {
    id: "experience", name: "Experience 4.0",
    title: "Experience 4.0: Enhancing Customer Experiences in the Digital Economy",
    subtitle: "Deliver seamless, personalized, and intelligent customer journeys across every digital touchpoint",
    focus: "Experience 4.0 helps organizations engage customers more effectively in the Digital Economy. It integrates personalization, AI-driven insights, and connected digital platforms to create seamless, high-impact experiences.",
    corePillars: [
      { title: "AI & Personalization Engines", description: "Deliver tailored experiences by analyzing customer data in real-time." },
      { title: "Customer Experience (CX) Platforms", description: "Unify customer data and interactions across all digital and physical channels." },
      { title: "Interactive & Immersive Technologies", description: "Use AR, VR, and intelligent interfaces to create engaging, next-generation experiences." },
    ],
    whyReasons: [
      { icon: TrendingUp, title: "Increase Customer Satisfaction", description: "Create personalized experiences that delight customers and exceed expectations." },
      { icon: Zap, title: "Improve Conversion Rates", description: "Reduce friction across digital touchpoints and optimize engagement flows." },
      { icon: CheckCircle, title: "Strengthen Customer Retention", description: "Build loyalty through consistent and meaningful interactions." },
      { icon: Users, title: "Gain Real-Time Insights", description: "Leverage behavioral data to drive smarter business decisions." },
    ],
    technologies: ["AI & Machine Learning", "Data Analytics & Behavioral Insights", "Chatbots & Virtual Assistants", "Augmented & Virtual Reality (AR/VR)", "Omnichannel Engagement"],
    benefits: ["Increase Customer Satisfaction: Create personalized experiences that delight customers", "Boost Revenue Growth: Optimized journeys lead to higher conversions", "Reduce Customer Churn: Consistent engagement strengthens long-term loyalty", "Improve Operational Efficiency: Automation reduces manual effort", "Enable Better Decision-Making: Real-time insights enable proactive actions", "Enhance Brand Loyalty: Build long-term trust through consistent interactions"],
    useCases: ["AI-Powered Personalization: Improve product recommendations for higher sales", "Virtual Showrooms & AR Visualization: Let customers explore products in immersive environments", "Intelligent Customer Support: Resolve queries instantly with chatbots", "Predictive Customer Analytics: Anticipate needs before customers take action", "Omnichannel Engagement: Ensure seamless interaction across all touchpoints"],
    stats: [{ label: "Increase in customer satisfaction", value: "45%" }, { label: "Boost in conversion rates", value: "38%" }, { label: "Improvement in customer retention", value: "42%" }],
    heroImage: "/images/experience 4.0-hero.png",
  },
  farming: {
    id: "farming", name: "Farming 4.0",
    title: "Farming 4.0: Modernizing Agriculture Through Digital Innovation",
    subtitle: "Modernizing Agriculture Through Digital Innovation",
    focus: "Farming 4.0 modernizes agriculture using technologies like precision farming, IoT sensors, and data analytics to enhance crop production, resource efficiency, and sustainability.",
    corePillars: [
      { title: "AI & Machine Learning", description: "Automates decision-making and improves efficiency." },
      { title: "Precision Agriculture with IoT Sensors", description: "Monitors soil conditions and optimizes irrigation." },
      { title: "Drone-Based Monitoring", description: "Tracks crop health using aerial imagery." },
    ],
    whyReasons: [
      { icon: TrendingUp, title: "Increase Yield", description: "Boost crop yield through optimized farming techniques." },
      { icon: Zap, title: "Improve Resource Efficiency", description: "Reduce waste and optimize resource usage." },
      { icon: CheckCircle, title: "Enhance Sustainability", description: "Integrate sustainable practices for long-term viability." },
      { icon: Users, title: "Better Market Access", description: "Connect directly with buyers through digital platforms." },
    ],
    technologies: ["AI & Machine Learning", "Cloud Computing", "Automation Tools", "Collaborative Platforms", "DevOps & CI/CD", "Agile Project Management"],
    benefits: ["Optimized Crop Yields: Improve crop production with smarter farming techniques", "Efficient Resource Management: Optimize resources like water and fertilizer", "Reduced Environmental Impact: Minimize resource usage and environmental harm", "Real-Time Monitoring and Alerts: Monitor crop conditions for better decision-making", "Improved Sustainability Practices: Implement long-term sustainable farming techniques", "Enhanced Supply Chain Transparency: Trace products from farm to table"],
    useCases: ["Precision Agriculture with IoT Sensors: Monitor soil conditions and optimize irrigation", "Drone-Based Crop Monitoring: Track crop health using drones and aerial imagery", "AI-Powered Yield Prediction: Predict crop yields based on environmental factors", "Automated Irrigation Systems: Reduce water usage and improve crop health", "Blockchain-Based Food Traceability: Ensure transparency from farm to table"],
    stats: [{ label: "Yield Improvement", value: "25%" }, { label: "Resource Efficiency", value: "35%" }, { label: "Cost Reduction", value: "28%" }],
    heroImage: "/images/farming-hero.svg",
  },
  government: {
    id: "government", name: "Government 4.0",
    title: "Government 4.0: Digital Transformation in the Public Sector",
    subtitle: "Digital Transformation in the Public Sector",
    focus: "Digital transformation in the public sector. This sector aims to enhance public administration and citizen services through e-government solutions, data-driven decision-making, and digital engagement platforms.",
    corePillars: [
      { title: "E-Government Platforms", description: "Centralized digital portals for seamless citizen service delivery." },
      { title: "Blockchain for Transparency", description: "Immutable records ensuring accountability and trust in public systems." },
      { title: "AI for Smart Governance", description: "Data-driven policy making and automated public service management." },
    ],
    whyReasons: [
      { icon: TrendingUp, title: "Improve Transparency", description: "Build citizen trust through open, accountable digital governance." },
      { icon: Zap, title: "Streamline Services", description: "Reduce bureaucracy and deliver faster, more efficient public services." },
      { icon: CheckCircle, title: "Data-Driven Policy", description: "Make better decisions with real-time analytics and citizen insights." },
      { icon: Users, title: "Enhance Engagement", description: "Connect citizens with government through modern digital channels." },
    ],
    technologies: ["Blockchain for Transparency", "Cloud Computing", "AI for Smart Governance", "Cybersecurity Solutions", "Data Analytics & BI", "Digital Identity Systems"],
    benefits: ["Improved transparency and accountability", "Enhanced citizen engagement", "Streamlined public services", "Data-driven policy making", "Reduced bureaucracy", "Increased operational efficiency"],
    useCases: ["E-government portals and services", "Smart city infrastructure management", "Digital identity and authentication", "Blockchain-based public records", "AI-powered citizen service chatbots"],
    stats: [{ label: "Service Efficiency", value: "50%" }, { label: "Citizen Satisfaction", value: "42%" }, { label: "Cost Savings", value: "35%" }],
    heroImage: "/images/government-hero.png",
  },
  hospitality: {
    id: "hospitality", name: "Hospitality 4.0",
    title: "Hospitality 4.0: Digitizing the Hospitality Industry",
    subtitle: "Digitizing the Hospitality Industry",
    focus: "This sector involves digitizing the hospitality industry (hotels, restaurants, resorts, etc.), providing seamless experiences for customers and enhancing back-office operations.",
    corePillars: [
      { title: "Smart Room Technology", description: "IoT-enabled rooms that adapt to guest preferences automatically." },
      { title: "AI-Driven Personalization", description: "Tailored recommendations and services based on guest behavior." },
      { title: "Contactless Operations", description: "Seamless check-in, payments, and service delivery without friction." },
    ],
    whyReasons: [
      { icon: TrendingUp, title: "Elevate Guest Experiences", description: "Deliver personalized, memorable stays that drive loyalty." },
      { icon: Zap, title: "Optimize Operations", description: "Automate back-office tasks and reduce operational overhead." },
      { icon: CheckCircle, title: "Increase Revenue", description: "Dynamic pricing and upselling powered by real-time data." },
      { icon: Users, title: "Enhance Safety", description: "Contactless technologies improve hygiene and guest confidence." },
    ],
    technologies: ["AI-Driven Service Automation", "Internet of Things (IoT)", "Predictive Analytics", "Digital Booking Systems", "Contactless Technologies", "Smart Room Controls"],
    benefits: ["Personalized guest experiences", "Contactless check-in and services", "Optimized operations and staffing", "Enhanced safety and hygiene", "Improved revenue management", "Real-time guest feedback"],
    useCases: ["Smart hotel rooms with IoT controls", "AI-powered concierge services", "Contactless payment and check-in", "Predictive maintenance for facilities", "Dynamic pricing and revenue optimization"],
    stats: [{ label: "Guest Satisfaction", value: "48%" }, { label: "Operational Efficiency", value: "40%" }, { label: "Revenue Growth", value: "32%" }],
    heroImage: "/images/hospitality-hero.png",
  },
  infrastructure: {
    id: "infrastructure", name: "Infrastructure 4.0",
    title: "Infrastructure 4.0: Modernizing Physical Infrastructure",
    subtitle: "Modernizing Physical Infrastructure",
    focus: "The modernization of physical infrastructure (e.g., smart cities, transportation networks, utilities) through IoT, automation, and data systems to improve operational efficiency, resource management, and sustainability.",
    corePillars: [
      { title: "Smart Grids & IoT", description: "Connected sensors and networks enabling real-time infrastructure monitoring." },
      { title: "Digital Twins", description: "Virtual replicas of physical assets for simulation and optimization." },
      { title: "Predictive Maintenance", description: "AI-driven systems that anticipate failures before they occur." },
    ],
    whyReasons: [
      { icon: TrendingUp, title: "Optimize Resources", description: "Reduce waste and improve efficiency across all infrastructure assets." },
      { icon: Zap, title: "Enhance Sustainability", description: "Meet environmental goals with smart energy and water management." },
      { icon: CheckCircle, title: "Reduce Costs", description: "Predictive maintenance and automation lower operational expenses." },
      { icon: Users, title: "Improve Public Safety", description: "Real-time monitoring ensures safer cities and communities." },
    ],
    technologies: ["Smart Grids", "IoT Sensors", "AI & Predictive Analytics", "Big Data Analytics", "Digital Twins", "Energy Management Systems"],
    benefits: ["Optimized resource management", "Improved sustainability", "Reduced operational costs", "Enhanced public safety", "Real-time monitoring and control", "Predictive maintenance"],
    useCases: ["Smart city infrastructure management", "Intelligent transportation systems", "Smart grid energy distribution", "Water management and conservation", "Digital twin simulations for urban planning"],
    stats: [{ label: "Energy Efficiency", value: "45%" }, { label: "Cost Reduction", value: "38%" }, { label: "Sustainability Improvement", value: "52%" }],
    heroImage: "/images/infrastructure-hero.png",
  },
  logistics: {
    id: "logistics", name: "Logistics 4.0",
    title: "Logistics 4.0: Digital Transformation in Supply Chains",
    subtitle: "Digital Transformation in Supply Chains",
    focus: "Digital transformation in supply chains and logistics. This sector focuses on optimizing route planning, warehouse management, and real-time tracking of goods and shipments to enhance efficiency, reduce costs, and improve service delivery.",
    corePillars: [
      { title: "Real-Time Tracking", description: "IoT devices providing end-to-end visibility across the supply chain." },
      { title: "AI-Powered Optimization", description: "Machine learning for demand forecasting and route optimization." },
      { title: "Warehouse Automation", description: "Robotics and automation streamlining storage and fulfillment." },
    ],
    whyReasons: [
      { icon: TrendingUp, title: "Optimize Routes", description: "AI-driven route planning reduces delivery times and fuel costs." },
      { icon: Zap, title: "Real-Time Visibility", description: "Track shipments and inventory in real time across the supply chain." },
      { icon: CheckCircle, title: "Reduce Costs", description: "Automation and optimization lower operational expenses significantly." },
      { icon: Users, title: "Improve Accuracy", description: "Eliminate errors with automated picking, packing, and tracking." },
    ],
    technologies: ["Blockchain", "AI & Machine Learning", "IoT Tracking Devices", "Robotics & Automation", "Autonomous Vehicles", "Warehouse Management Systems"],
    benefits: ["Optimized route planning", "Real-time shipment tracking", "Reduced delivery times", "Lower operational costs", "Enhanced supply chain visibility", "Improved inventory management"],
    useCases: ["Autonomous delivery vehicles", "Blockchain-based supply chain tracking", "AI-powered demand forecasting", "Robotic warehouse automation", "Real-time fleet management"],
    stats: [{ label: "Delivery Speed", value: "35%" }, { label: "Cost Reduction", value: "42%" }, { label: "Accuracy Improvement", value: "48%" }],
    heroImage: "/images/logistics-hero.png",
  },
  mining: {
    id: "mining", name: "Mining 4.0",
    title: "Mining 4.0: Revolutionizing Resource Extraction",
    subtitle: "Revolutionize mining operations with smart technologies for enhanced safety, efficiency, and sustainable resource extraction.",
    focus: "Mining 4.0 transforms mining operations by integrating IoT, AI, and automation to enhance safety, optimize resource extraction, and ensure environmental sustainability.",
    corePillars: [
      { title: "Autonomous Equipment", description: "Self-driving vehicles and remote-controlled machinery reducing human exposure to hazardous environments." },
      { title: "Predictive Maintenance", description: "IoT sensors and AI anticipating equipment failures before they cause costly downtime." },
      { title: "Real-Time Monitoring", description: "Continuous visibility into mine conditions, worker safety, and equipment status." },
    ],
    whyReasons: [
      { icon: TrendingUp, title: "Improve Safety", description: "Autonomous systems reduce worker exposure to dangerous conditions." },
      { icon: Zap, title: "Reduce Downtime", description: "Predictive maintenance prevents unplanned equipment failures." },
      { icon: CheckCircle, title: "Optimize Extraction", description: "AI-driven insights maximize ore recovery and minimize waste." },
      { icon: Users, title: "Ensure Sustainability", description: "Real-time environmental monitoring supports responsible mining." },
    ],
    technologies: ["Autonomous Vehicles", "IoT Sensors", "AI & Predictive Analytics", "Digital Twins", "Remote Operations Centers", "Environmental Monitoring Systems"],
    benefits: ["Enhanced worker safety through autonomous operations", "Reduced unplanned downtime via predictive maintenance", "Optimized resource extraction and ore recovery", "Lower operational costs through automation", "Real-time environmental compliance monitoring", "Improved supply chain integration"],
    useCases: ["Autonomous mining vehicles: Deploy self-driving trucks to enhance safety", "Predictive maintenance: Use IoT and AI to predict equipment failures", "Digital twin technology: Create virtual replicas to simulate operations", "Remote operations centers: Control equipment from safe locations", "Environmental monitoring: Track air quality, water usage, and emissions"],
    stats: [{ label: "Safety Improvement", value: "60%" }, { label: "Downtime Reduction", value: "45%" }, { label: "Cost Savings", value: "35%" }],
    heroImage: "/images/infrastructure-hero.png",
  },
  plant: {
    id: "plant", name: "Plant 4.0",
    title: "Plant 4.0: Digitizing Manufacturing Plants",
    subtitle: "Digitizing Manufacturing Plants",
    focus: "Refers to digitizing manufacturing plants and industrial facilities by integrating smart factory solutions that use automation, robotics, and AI to streamline production processes, reduce downtime, and increase efficiency.",
    corePillars: [
      { title: "Industrial IoT (IIoT)", description: "Connected sensors enabling real-time monitoring of all plant assets." },
      { title: "Predictive Maintenance", description: "AI systems that anticipate equipment failures before they occur." },
      { title: "Digital Twins", description: "Virtual plant replicas for simulation, optimization, and training." },
    ],
    whyReasons: [
      { icon: TrendingUp, title: "Boost Production", description: "Optimize production lines for maximum throughput and quality." },
      { icon: Zap, title: "Reduce Downtime", description: "Predictive maintenance prevents costly unplanned outages." },
      { icon: CheckCircle, title: "Improve Quality", description: "AI-powered quality control catches defects in real time." },
      { icon: Users, title: "Enhance Safety", description: "Smart monitoring protects workers and assets across the plant." },
    ],
    technologies: ["Industrial IoT (IIoT)", "AI & Machine Learning", "Robotics & Automation", "Predictive Maintenance", "3D Printing", "Digital Twins"],
    benefits: ["Increased production efficiency", "Reduced downtime", "Predictive maintenance", "Quality control automation", "Flexible manufacturing", "Real-time production monitoring"],
    useCases: ["Smart factory automation", "Predictive maintenance systems", "Digital twin simulations", "Robotic assembly lines", "AI-powered quality control"],
    stats: [{ label: "Production Efficiency", value: "55%" }, { label: "Downtime Reduction", value: "48%" }, { label: "Quality Improvement", value: "40%" }],
    heroImage: "/images/plant-hero.png",
  },
  retail: {
    id: "retail", name: "Retail 4.0",
    title: "Retail 4.0: Transforming the Retail Industry",
    subtitle: "Transforming the Retail Industry",
    focus: "This sector is focused on transforming the retail industry through digital tools, creating personalized shopping experiences, improving supply chain management, and integrating online and offline customer journeys.",
    corePillars: [
      { title: "AI-Driven Personalization", description: "Tailored product recommendations and marketing based on customer data." },
      { title: "Omnichannel Integration", description: "Seamless shopping experience across online, mobile, and in-store channels." },
      { title: "Smart Inventory Management", description: "IoT and AI ensuring optimal stock levels and reducing waste." },
    ],
    whyReasons: [
      { icon: TrendingUp, title: "Personalize Experiences", description: "AI-driven recommendations increase basket size and loyalty." },
      { icon: Zap, title: "Streamline Operations", description: "Automate inventory, checkout, and supply chain processes." },
      { icon: CheckCircle, title: "Boost Conversions", description: "Reduce friction at every touchpoint to drive more sales." },
      { icon: Users, title: "Build Loyalty", description: "Consistent omnichannel experiences keep customers coming back." },
    ],
    technologies: ["E-commerce Platforms", "AI-Driven Recommendations", "Augmented Reality", "Virtual Fitting Rooms", "IoT Sensors", "Customer Analytics"],
    benefits: ["Personalized shopping experiences", "Seamless omnichannel integration", "Improved inventory management", "Enhanced customer insights", "Increased sales conversion", "Reduced operational costs"],
    useCases: ["AI-powered product recommendations", "Virtual try-on and fitting rooms", "Smart shelves and inventory tracking", "Personalized marketing campaigns", "Cashierless checkout systems"],
    stats: [{ label: "Sales Growth", value: "38%" }, { label: "Customer Engagement", value: "45%" }, { label: "Conversion Rate", value: "42%" }],
    heroImage: "/images/retail-hero.png",
  },
  service: {
    id: "service", name: "Services 4.0",
    title: "Services 4.0: Digitization of Service-Based Industries",
    subtitle: "Digitization of Service-Based Industries",
    focus: "Refers to the digitization of service-based industries, enhancing the customer experience by offering automation, AI-driven service management, and seamless interactions between customers and service providers.",
    corePillars: [
      { title: "AI-Powered Automation", description: "Intelligent systems handling routine service tasks at scale." },
      { title: "CRM & Service Platforms", description: "Unified platforms managing all customer interactions and service requests." },
      { title: "Predictive Analytics", description: "Anticipating service needs before customers even raise them." },
    ],
    whyReasons: [
      { icon: TrendingUp, title: "Faster Service Delivery", description: "Automation reduces response times and service backlogs." },
      { icon: Zap, title: "Reduce Costs", description: "Automated workflows lower the cost per service interaction." },
      { icon: CheckCircle, title: "Improve Satisfaction", description: "Consistent, personalized service builds lasting customer loyalty." },
      { icon: Users, title: "Scale Efficiently", description: "Handle growing service volumes without proportional cost increases." },
    ],
    technologies: ["AI & Machine Learning", "Automation Platforms", "Chatbots & Virtual Assistants", "Service Management Systems", "CRM Platforms", "Predictive Analytics"],
    benefits: ["Faster service delivery", "Personalized customer interactions", "Automated service processes", "Improved customer satisfaction", "Reduced operational costs", "Enhanced service quality"],
    useCases: ["AI-powered customer service chatbots", "Automated service ticketing systems", "Predictive service maintenance", "Personalized service recommendations", "Self-service portals"],
    stats: [{ label: "Service Speed", value: "50%" }, { label: "Customer Satisfaction", value: "46%" }, { label: "Cost Efficiency", value: "40%" }],
    heroImage: "/images/service-hero.png",
  },
  wellness: {
    id: "wellness", name: "Wellness 4.0",
    title: "Wellness 4.0: Digitizing Health and Wellness Services",
    subtitle: "Digitizing Health and Wellness Services",
    focus: "Focuses on digitizing health and wellness services, promoting a healthier lifestyle through AI-driven health monitoring, wearable devices, and telemedicine.",
    corePillars: [
      { title: "IoT Wearables & Monitoring", description: "Continuous health tracking through connected devices and sensors." },
      { title: "Telemedicine Platforms", description: "Remote consultations and care delivery at scale." },
      { title: "Predictive Health Analytics", description: "AI identifying health risks before they become critical." },
    ],
    whyReasons: [
      { icon: TrendingUp, title: "Improve Outcomes", description: "Early detection and personalized care lead to better health results." },
      { icon: Zap, title: "Expand Access", description: "Telemedicine brings quality care to underserved populations." },
      { icon: CheckCircle, title: "Reduce Costs", description: "Preventive care and remote monitoring lower overall healthcare spend." },
      { icon: Users, title: "Engage Patients", description: "Digital tools keep patients actively involved in their own health." },
    ],
    technologies: ["IoT Wearables", "AI & Machine Learning", "Telemedicine Platforms", "Health Monitoring Devices", "Predictive Health Analytics", "Mobile Health Apps"],
    benefits: ["Personalized health insights", "Remote health monitoring", "Early disease detection", "Improved patient outcomes", "Accessible healthcare services", "Preventive care focus"],
    useCases: ["Wearable health monitoring devices", "AI-powered health diagnostics", "Telemedicine consultations", "Personalized fitness and nutrition plans", "Predictive health risk assessment"],
    stats: [{ label: "Health Outcomes", value: "42%" }, { label: "Patient Engagement", value: "55%" }, { label: "Cost Savings", value: "38%" }],
    heroImage: "/images/wellness-hero.png",
  },
  intelligence: {
    id: "intelligence", name: "Intelligence 4.0",
    title: "Intelligence 4.0: AI-Driven Insights for Smarter Decisions",
    subtitle: "Leverage AI and analytics to gain actionable insights, driving smarter decision-making and business strategies.",
    focus: "Intelligence 4.0 transforms raw data into strategic advantage through AI-driven analytics, predictive modeling, and intelligent automation.",
    corePillars: [
      { title: "AI & Machine Learning", description: "Intelligent systems that learn, adapt, and continuously optimize business processes." },
      { title: "Predictive Analytics", description: "Forecast future trends and behaviors using machine learning and statistical models." },
      { title: "Business Intelligence Platforms", description: "Unified dashboards providing real-time visibility across all organizational data." },
    ],
    whyReasons: [
      { icon: TrendingUp, title: "Better Decisions", description: "Real-time insights enable faster, more accurate strategic decisions." },
      { icon: Zap, title: "Predict Outcomes", description: "Anticipate market shifts and customer behavior before they happen." },
      { icon: CheckCircle, title: "Reduce Risk", description: "Data-driven risk assessment minimizes costly mistakes." },
      { icon: Users, title: "Unlock Growth", description: "Identify new opportunities hidden in your data." },
    ],
    technologies: ["AI & Machine Learning", "Big Data Analytics", "Business Intelligence Platforms", "Predictive Modeling", "Natural Language Processing", "Real-Time Data Pipelines"],
    benefits: ["Faster, more accurate decision-making", "Predictive insights into market and customer trends", "Reduced operational and strategic risk", "Automated reporting and data processing", "Unified view of business performance", "Competitive intelligence and market analysis"],
    useCases: ["Predictive analytics: Forecast demand, churn, and market trends", "AI-powered dashboards: Real-time KPI monitoring across all business units", "Customer intelligence: Understand behavior patterns to personalize at scale", "Risk modeling: Identify and mitigate risks before they materialize", "Automated reporting: Eliminate manual data aggregation"],
    stats: [{ label: "Decision Speed", value: "70%" }, { label: "Forecast Accuracy", value: "85%" }, { label: "Risk Reduction", value: "50%" }],
    heroImage: "/images/service-hero.png",
  },
  workspace: {
    id: "workspace", name: "Workspace 4.0",
    title: "Workspace 4.0: The Future of Digital Work",
    subtitle: "Transform your digital workplace with collaborative tools and technologies that enhance productivity and employee engagement.",
    focus: "Workspace 4.0 revolutionizes how teams work by converging digital collaboration, intelligent automation, and employee experience.",
    corePillars: [
      { title: "Unified Collaboration Platforms", description: "Integrated tools connecting teams across locations, time zones, and devices seamlessly." },
      { title: "Intelligent Automation", description: "AI-powered workflows eliminating repetitive tasks and freeing teams for strategic work." },
      { title: "Employee Experience Design", description: "Digital environments designed around people to maximize engagement and satisfaction." },
    ],
    whyReasons: [
      { icon: TrendingUp, title: "Boost Productivity", description: "Eliminate bottlenecks with intelligent automation and streamlined workflows." },
      { icon: Zap, title: "Enable Flexibility", description: "Support remote, hybrid, and in-office work seamlessly." },
      { icon: CheckCircle, title: "Improve Retention", description: "Engaging digital experiences increase employee satisfaction and loyalty." },
      { icon: Users, title: "Break Down Silos", description: "Unified platforms connect teams and knowledge across the organization." },
    ],
    technologies: ["Collaboration Platforms", "AI Workflow Automation", "Cloud Infrastructure", "Digital Workspace Management", "Employee Analytics", "Smart Office IoT"],
    benefits: ["Increased team productivity through automation", "Seamless remote and hybrid work support", "Improved employee satisfaction and retention", "Reduced overhead through smart space management", "Faster onboarding with digital tools", "Enhanced cross-functional collaboration"],
    useCases: ["Digital collaboration: Unified communication platforms for seamless teamwork", "Workspace automation: Automate routine tasks to free time for strategic work", "Employee experience: Personalized digital environments that boost engagement", "Smart office management: IoT-enabled space optimization", "Remote work enablement: Secure cloud-based tools for distributed teams"],
    stats: [{ label: "Productivity Increase", value: "45%" }, { label: "Employee Satisfaction", value: "60%" }, { label: "Overhead Reduction", value: "30%" }],
    heroImage: "/images/Service_landing_hero_image.png",
  },
  governance: {
    id: "governance", name: "Governance 4.0",
    title: "Governance 4.0: Robust Frameworks for the Digital Age",
    subtitle: "Establish robust governance frameworks to ensure compliance, risk management, and strategic alignment across your organization.",
    focus: "Governance 4.0 strengthens organizational governance through digital tools, automated compliance, and intelligent risk management.",
    corePillars: [
      { title: "Automated Compliance", description: "Continuous regulatory monitoring and automated reporting to maintain adherence at all times." },
      { title: "Intelligent Risk Management", description: "AI-driven risk assessment identifying and addressing threats before they impact operations." },
      { title: "Policy Governance", description: "Centralized policy management ensuring consistent application across the entire organization." },
    ],
    whyReasons: [
      { icon: TrendingUp, title: "Ensure Compliance", description: "Automated monitoring keeps you continuously compliant with evolving regulations." },
      { icon: Zap, title: "Mitigate Risk", description: "Proactive risk identification prevents costly incidents and disruptions." },
      { icon: CheckCircle, title: "Maintain Audit Readiness", description: "Always-on documentation and tracking ensures you're ready for any audit." },
      { icon: Users, title: "Align Strategy", description: "Governance frameworks keep all initiatives aligned with organizational goals." },
    ],
    technologies: ["Compliance Management Systems", "Risk Assessment Platforms", "Policy Management Tools", "Audit Trail Systems", "Regulatory Intelligence", "GRC Platforms"],
    benefits: ["Continuous regulatory compliance monitoring", "Proactive risk identification and mitigation", "Consistent policy application across the organization", "Audit-ready documentation at all times", "Reduced compliance costs through automation", "Strategic alignment across all business units"],
    useCases: ["Compliance management: Automated monitoring and reporting", "Risk assessment: Intelligent frameworks identifying threats", "Policy governance: Centralized creation and compliance tracking", "Audit preparation: Always-ready documentation and process trails", "Regulatory adaptation: Flexible frameworks that evolve with regulations"],
    stats: [{ label: "Compliance Rate", value: "99%" }, { label: "Risk Reduction", value: "55%" }, { label: "Audit Readiness", value: "100%" }],
    heroImage: "/images/government-hero.png",
  },
  backoffice: {
    id: "backoffice", name: "Backoffice 4.0",
    title: "Backoffice 4.0: Intelligent Back-Office Transformation",
    subtitle: "Streamline back-office operations with automation and intelligent systems to improve efficiency and reduce operational costs.",
    focus: "Backoffice 4.0 transforms back-office operations through intelligent automation, process optimization, and digital workflows.",
    corePillars: [
      { title: "Robotic Process Automation (RPA)", description: "Software robots handling repetitive data entry, processing, and administrative tasks at scale." },
      { title: "Intelligent Document Processing", description: "AI extracting and processing information from documents automatically and accurately." },
      { title: "Workflow Orchestration", description: "End-to-end digital workflows connecting systems and eliminating manual handoffs." },
    ],
    whyReasons: [
      { icon: TrendingUp, title: "Reduce Costs", description: "Automation cuts back-office operational costs by up to 50%." },
      { icon: Zap, title: "Accelerate Processing", description: "Digital workflows process tasks in minutes instead of days." },
      { icon: CheckCircle, title: "Eliminate Errors", description: "Automated systems remove human error from critical processes." },
      { icon: Users, title: "Free Your Team", description: "Staff focus on high-value work instead of repetitive manual tasks." },
    ],
    technologies: ["Robotic Process Automation (RPA)", "AI Document Processing", "Workflow Management Systems", "ERP Integration", "Digital Archiving", "Process Mining"],
    benefits: ["Up to 50% reduction in operational costs", "Faster processing times across all back-office functions", "Elimination of manual errors in critical processes", "Improved compliance through automated audit trails", "Scalable operations without proportional headcount growth", "Enhanced employee satisfaction through meaningful work"],
    useCases: ["Invoice processing: Automated extraction, validation, and payment processing", "HR operations: Digital onboarding, payroll, and employee record management", "Contract management: AI-powered review, approval, and storage workflows", "Financial reporting: Automated data aggregation and report generation", "Compliance tracking: Automated audit trails and regulatory documentation"],
    stats: [{ label: "Cost Reduction", value: "50%" }, { label: "Processing Speed", value: "80%" }, { label: "Error Elimination", value: "95%" }],
    heroImage: "/images/infrastructure-hero.png",
  },
};

const slugToKey: Record<string, string> = {
  "agility-4-0": "agility", "experience-4-0": "experience", "farming-4-0": "farming",
  "government-4-0": "government", "hospitality-4-0": "hospitality", "infrastructure-4-0": "infrastructure",
  "logistics-4-0": "logistics", "mining-4-0": "mining", "plant-4-0": "plant",
  "retail-4-0": "retail", "service-4-0": "service", "wellness-4-0": "wellness",
  "intelligence-4-0": "intelligence", "workspace-4-0": "workspace",
  "governance-4-0": "governance", "backoffice-4-0": "backoffice",
};

export function getSectorData(slug: string): SectorData | null {
  return sectorsData[slugToKey[slug] ?? slug] ?? null;
}

export const allSectorSlugs = Object.keys(slugToKey);
