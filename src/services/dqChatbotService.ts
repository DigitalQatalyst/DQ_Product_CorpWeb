import OpenAI from 'openai';

// Types for the DQ chatbot
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Initialize Azure OpenAI
const apiKey = (import.meta as any).env?.VITE_AZURE_OPENAI_API_KEY || '';
const endpoint = (import.meta as any).env?.VITE_AZURE_OPENAI_ENDPOINT || '';
const deploymentName = (import.meta as any).env?.VITE_AZURE_OPENAI_DEPLOYMENT_NAME || '';
const apiVersion = (import.meta as any).env?.VITE_AZURE_OPENAI_API_VERSION || '2024-08-01-preview';

const openai = (apiKey && endpoint && deploymentName) ? new OpenAI({
  apiKey,
  baseURL: `${endpoint}/openai/deployments/${deploymentName}`,
  defaultQuery: { 'api-version': apiVersion },
  defaultHeaders: {
    'api-key': apiKey,
  },
  dangerouslyAllowBrowser: true // Required for client-side usage
}) : null;

const DQ_KNOWLEDGE_BASE = `
# DigitalQatalyst (DQ) Knowledge Base

## Our Mission & Vision
DQ is on a mission to "Accelerate Life's Transactions Improvements, using Digital Blueprints."

We help organizations across all sectors better leverage digital technologies to deliver highly engaging and pro-active services in every interaction and transaction they offer.

Our vision is "To perfect life's transactions" - driven by Digital Blueprints that guide organizations to become Digital Cognitive Organizations (DCOs).

---

## SECTION 1: DQ's Digital Transformation Framework (D1-D6)
This section explains the WHY behind what we do - the framework and justification for our approach.

### D1: Recognizing the Digital Economy
The first step is acknowledging that the economy has fundamentally changed. The market is digital, and organizations must adapt to this new reality where technology, data, and innovation are at the forefront.

### D2: Destination - Digital Cognitive Organization (DCO)
Organizations must become Digital Cognitive Organizations (DCOs) - entities that integrate both human and machine intelligence, leveraging AI, automation, and data analytics to enhance decision-making and drive business value.

### D3: The Digital Business Platform (DBP)
The central, integrated hub that pulls together all of an organization's data, processes, and systems. The DBP acts as the digital backbone, enabling smarter decision-making and better customer engagement.

### D4: Digital Transformation 2.0 (DT 2.0)
Our revolutionary approach that leverages best practices and data to create a faster, smarter path to becoming a DCO, reducing risk and accelerating transformation.

### D5: The Digital Worker and Digital Workspace
Combining human talent with intelligent machines in digital workspaces where humans and AI collaborate to drive productivity and innovation.

### D6: Digital Accelerators
Our suite of tools and platforms (DQ Products) that fast-track transformation.

---

## SECTION 2: DQ Products
Our Digital Accelerators - tools and platforms that help organizations fast-track their transformation journey.

### TMaaS (Transformation Management as a Service)
Self-service marketplace for on-demand transformation services with tailored digital blueprints, AI-driven recommendations, and flexible subscription models.

### DTO4T (Digital Twin Of Organisation for Transformation)
AI-driven platform providing diagnostics, real-time tracking, and automated documentation for digital transformation with tools like DBP Clinic and DocWriter.

### DTMP (Digital Transformation Management Platform)
Comprehensive platform managing transformation initiatives with analytics, repositories, portals, and compliance tracking. Includes Resource Marketplace with Blueprints, Services, and Insights.

### DTMA (Digital Transformation Management Academy)
E-learning platform with personalized AI recommendations, dynamic course catalog, progress tracking, and badge-based recognition for digital skills development.

### DTMI (Digital Transformation Management Insights)
AI-powered research-driven magazine platform providing curated content like articles, case studies, podcasts, and white papers on Digital Cognitive Organizations.

### DTMB (Digital Transformation Management Books)
Comprehensive resource platform offering books, white papers, and strategic frameworks for transformation knowledge and implementation guides.

### DWS (Digital Working Studios)
Spaces enabling digital workers in Economy 4.0 through human-machine collaboration. First studio in Nairobi, Kenya (Babadogo), empowering professionals to thrive with AI-augmented productivity.

---

## SECTION 3: DQ Service Areas (11 Domains)
Our specialized service domains organized by key sectors of the digital economy.

### Cross-Sector Domains:
1. Experience4.0 - Digital design and deployment of seamless user experiences across all channels with omnichannel engagement, personalization at scale, and AI-driven customer experience.
2. Agility4.0 - Digital design and deployment of agile, adaptable solutions with continuous delivery, DevOps, automation, and real-time data analytics.

### Primary Sector:
3. Farming4.0 - Digital transformation in agriculture, conservation, forestry, and livestock management.

### Secondary Sector:
4. Plant4.0 - Digital transformation for manufacturing including oil, gas, chemicals, power, water, mining, and pharmaceuticals.
5. Infrastructure4.0 - Digital transformation for infrastructure development, property, construction, and urbanization.

### Tertiary Sector:
6. Government4.0 - Digital transformation in government services including policy, regulation, compliance, and emergency services.
7. Hospitality4.0 - Digital transformation in hospitality including hotels, resorts, restaurants, and event management.
8. Retail4.0 - Digital transformation in retail including commerce, merchandising, stores, and customer interactions.

### Quaternary Sector:
9. Service4.0 - Digital transformation for service industries including advisory, consulting, professional services, HR, education, banking, media, and telecommunications.
10. Logistics4.0 - Digital transformation in logistics, transportation, and supply chain management.

### Quinary Sector:
11. Wellness4.0 - Digital transformation in healthcare and wellness including patient care, medical services, and wellness management.

---

## SECTION 4: DQ's Digital Transformation Methodology - DT 2.0
This is our proprietary methodology for guiding organizations through their digital transformation journey.

### Why DQ is Different: Architecture-Led and Data-Driven
What makes DQ's digital transformation services different from other organizations is that our approach is ARCHITECTURE-LED and DATA-DRIVEN. We emphasize that for any organization, lifecycle management needs to be driven by portfolio management - that's why we go big in leveraging organizational data to drive transformation.

### The Three Core Lifecycles
DT 2.0 consists of three primary lifecycles: Design, Deploy, and Manage. This is the digital transformation journey we do for all our clients.

### 1. Design Lifecycle (4 Stages)
The Design phase is critical to setting the vision, goals, and roadmap. This is how we bring our architecture-led and data-driven approach to life:

- ENVISION: Define the vision, mission, and goals for digital transformation. Establish OKRs that guide success. Identify key trends and success factors.

- TARGET: Develop the organizational architecture required to support the target state. Create practice solution architecture that supports future business models. Define operational models.

- BASELINE: Conduct a comprehensive portfolio assessment across business, technology, and governance to evaluate current capabilities. Align current state with future target state.

- BLUEPRINT: Create a detailed implementation roadmap for deploying the Digital Business Platform (DBP). Develop project cards and platform activation plans.

### 2. Deploy Lifecycle
The Deploy phase focuses on realizing the Digital Business Platform through careful orchestration:

- FORMULATE: Define portfolio backlogs, solution backlogs, and business cases. Map out specific value cases and metrics.

- SPECIFY: Develop solution and DevOps architectures. Capture detailed requirements.

- DELIVER: Plan, build, and deploy solutions based on specifications. Ensure systems are integrated and scalable.

- TRANSITION: Conduct change management, user training, system adoption plans, and feedback mechanisms.

### 3. Manage Lifecycle
The Manage phase ensures continuous alignment with strategic goals:

- GOVERNANCE & PERFORMANCE: Control DBP realization, monitor performance, create correction and optimization plans.

- ARCHITECTURE & PORTFOLIO: Ensure continuous alignment between business and technology portfolios.

- DEMAND MANAGEMENT: Keep DBP flexible and responsive to changing business priorities.

- CHANGE & CULTURE: Foster innovation and adaptability through change management frameworks.

### Broad Service Offerings
Based on the three lifecycles, our broad service offerings are:
- Design Services (Envision, Target, Baseline, Blueprint)
- Deploy Services (Formulate, Specify, Deliver, Transition)
- Manage Services (Governance, Architecture, Demand, Change)

---

## SECTION 5: DQ Storybook - Our Internal Operations, Vision & Beliefs

### The DQ Golden Honeycomb of Competencies (GHC)
The GHC is our master framework - a Framework of Frameworks - that articulates the complete DNA of DigitalQatalyst. It brings together visionary, strategic, operational, psychological, and behavioural design dimensions into a single, unified organisational system.

The GHC defines: How we think, How we work, How we create value, How we grow.

### The 7 Core Elements of GHC:

1. THE DQ VISION (Purpose) - "To perfect life's transactions"
Our why is driven by Digital Blueprints that guide organizations to become Digital Cognitive Organizations.

2. HOUSE OF VALUES (HoV) - Culture
Three Mantras guide our behavior:
- Self-Development: "We grow ourselves and others through every experience"
- Lean Working: "We pursue clarity, efficiency, and prompt outcomes"
- Value Co-Creation: "We partner with others to create greater impact together"
Plus 12 Guiding Values for practical behaviors.

3. PERSONA (Identity)
The traits that define who thrives at DQ:
- Purpose-driven - Anchored in the why
- Perceptive - Aware of system, self, and signals
- Proactive - Acting before being asked
- Persevering - Unshaken by ambiguity or challenge
- Precise - Making clarity and craft non-negotiable

4. AGILE TMS (Task Management System)
How we turn strategy into motion - weekly sprints, daily check-ins, Co-Working Sessions, Blitz Sprints, and Feedback Loops.

5. AGILE SoS (System of Systems) - Governance
Four systems that help us move fast without losing direction:
- System of Governance (SoG) - Strategic direction
- System of Quality (SoQ) - Excellence and mastery
- System of Value (SoV) - Impact and outcomes
- System of Discipline (SoD) - Root friction resolution

6. AGILE FLOWS (Value Streams)
Six-stage value chain: Market to Lead → Lead to Opportunity → Opportunity to Order → Order to Fulfillment → Fulfillment to Revenue → Revenue to Loyalty

7. AGILE DTMF (Products)
Our modular library of toolkits, blueprints, and playbooks for transformation.

---

## Digital Business Platform (DBP) Towers
Five key dimensions of digital maturity:
1. Digital Experience (DXP) - Customer-facing digital touchpoints
2. Digital Workspace (DWS) - Internal collaboration and productivity  
3. Data & Intelligence (DIA) - Data management and analytics
4. Security & DevOps (SDO) - Cybersecurity and development practices
5. Digital Business Platform (DBP) - Overall digital maturity

## Key Artefacts
- Digital Canvas: Maps capabilities across 12 Digital Domains
- Practice Map: Defines roles and responsibilities
- Operating Model: Framework for practice operations and value delivery
`;

const DQ_SYSTEM_INSTRUCTION = `
You are the official DigitalQatalyst (DQ) AI Assistant. You represent DigitalQatalyst, NOT Abu Dhabi Enterprise Journey Platform or any other organization.

CRITICAL: You work for DigitalQatalyst (DQ), a digital transformation consulting company. Never mention Abu Dhabi Enterprise Journey Platform or any other platform.

STRICT USAGE RESTRICTIONS:
You are ONLY allowed to discuss topics related to DigitalQatalyst's business, services, and digital transformation. You MUST NOT:
- Review, analyze, or provide feedback on code
- Help with programming, software development, or technical implementation
- Provide general business advice unrelated to digital transformation
- Discuss topics outside of DigitalQatalyst's scope
- Act as a general-purpose AI assistant
- Help with academic assignments or research not related to DQ
- Provide information about competitors or other consulting firms
- Assist with personal tasks or general knowledge questions

If a user asks about restricted topics, politely decline and redirect them to DigitalQatalyst-specific topics.

Your role is to:
1. Answer questions about DigitalQatalyst's services, methodology, and approach
2. Explain the DQ Golden Honeycomb of Competencies (GHC) framework
3. Help visitors understand how DQ can help with their digital transformation needs
4. Provide information about the Digital Business Platform (DBP) towers
5. Guide users toward appropriate next steps (consultation, assessment, etc.)

QUESTION ROUTING - Use the correct section to answer different question types:

1. DIGITAL TRANSFORMATION JOURNEY QUESTIONS (e.g., "How can my organization start its digital transformation?"):
   - Use SECTION 4: DT 2.0 Methodology
   - Explain the 3 core lifecycles: Design, Deploy, Manage
   - This is the transformation journey we do for ALL our clients

2. WHY DQ IS DIFFERENT QUESTIONS (e.g., "What makes DQ different from other consultants?"):
   - Our approach is ARCHITECTURE-LED and DATA-DRIVEN
   - Use SECTION 4: Focus on the Design Lifecycle's 4 stages: Envision, Target, Baseline, Blueprint
   - Emphasize that lifecycle management is driven by portfolio management
   - We leverage organizational data to drive transformation

3. DQ INTERNAL OPERATIONS/VISION/BELIEFS QUESTIONS:
   - Use SECTION 5: DQ Storybook
   - Explain the Golden Honeycomb of Competencies (GHC)
   - Cover the 7 core elements: Vision, House of Values, Persona, Agile TMS, Agile SoS, Agile Flows, Agile DTMF

4. PRODUCTS QUESTIONS:
   - Use SECTION 2: DQ Products
   - Cover TMaaS, DTO4T, DTMP, DTMA, DTMI, DTMB, DTMCC

5. FRAMEWORK/JUSTIFICATION QUESTIONS (e.g., "Why do you do what you do?"):
   - Use SECTION 1: D1-D6 Framework
   - Explain the progression from D1 (Digital Economy) to D6 (Digital Accelerators)

6. SERVICE AREAS QUESTIONS:
   - Use SECTION 3: DQ Service Areas
   - Cover the 11 domains organized by economic sectors

7. BROAD SERVICE OFFERINGS QUESTIONS:
   - Use SECTION 4: DT 2.0 Methodology
   - Our broad offerings are: Design Services, Deploy Services, Manage Services

RESPONSE FORMAT REQUIREMENTS:
- Write in plain, conversational text - NO markdown formatting
- Do NOT use hashtags (#), asterisks (**), or any markdown symbols
- Write naturally like you're speaking to someone in person
- Use simple paragraphs separated by line breaks
- When listing items, use simple dashes or numbers without special formatting
- Keep responses concise but informative
- Be friendly and approachable in tone

Key guidelines:
- Always identify yourself as the DigitalQatalyst AI Assistant
- Be conversational but professional
- Use the DQ knowledge base to provide accurate information
- When you don't know something specific, acknowledge it and suggest contacting DigitalQatalyst directly
- Always stay focused on DigitalQatalyst-related topics
- Encourage users to take the Digital Maturity Assessment or book a consultation when appropriate
- Use DQ terminology and concepts naturally in your responses
- Never reference Abu Dhabi Enterprise Journey Platform or other organizations

If asked about topics outside of DQ's scope, politely redirect the conversation back to how DigitalQatalyst can help with digital transformation.
`;

export const dqChatbotService = {
  /**
   * Check if the service is available
   */
  isAvailable(): boolean {
    return !!openai && !!apiKey && !!endpoint && !!deploymentName;
  },

  /**
   * Clean markdown formatting from AI responses
   */
  cleanMarkdownFormatting(text: string): string {
    return text
      // Remove markdown headers (### ## #)
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold formatting (**text** or __text__)
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      // Remove italic formatting (*text* or _text_)
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      // Remove bullet points and list formatting
      .replace(/^\s*[-*+]\s+/gm, '')
      .replace(/^\s*\d+\.\s+/gm, '')
      // Clean up extra whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  },

  /**
   * Check if a message contains restricted content
   */
  isRestrictedContent(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    
    // First, check if it's a legitimate DQ question that should NOT be restricted
    const legitimateDQKeywords = [
      'digital transformation', 'transformation journey', 'dq', 'digitalqatalyst',
      'digital business platform', 'dbp', 'digital cognitive organization', 'dco',
      'dt 2.0', 'methodology', 'service area', 'product', 'assessment',
      'maturity', 'consultation', 'framework', 'architecture', 'data-driven'
    ];
    
    // If it contains legitimate DQ keywords, don't restrict it
    if (legitimateDQKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return false;
    }
    
    // Code review and programming related keywords (more specific)
    const codeKeywords = [
      'code review', 'review my code', 'check my code', 'debug my',
      'fix my code', 'programming help', 'coding help',
      'javascript code', 'python code', 'java code', 'react code',
      'html code', 'css code', 'sql query', 'database query',
      'function implementation', 'algorithm help',
      'syntax error', 'compile error', 'deployment issue',
      'git help', 'github help', 'stack overflow',
      'software development help', 'coding problem'
    ];
    
    // General non-DQ topics (more specific)
    const generalKeywords = [
      'homework help', 'assignment help', 'essay writing', 'research paper help',
      'weather forecast', 'news today', 'sports scores', 'entertainment news',
      'recipe for', 'health advice', 'medical advice', 'legal advice',
      'financial advice', 'investment advice', 'personal relationship advice',
      'dating advice', 'travel recommendations', 'shopping recommendations',
      'competitor analysis', 'mckinsey services', 'deloitte services', 'accenture services'
    ];
    
    const allRestrictedKeywords = [...codeKeywords, ...generalKeywords];
    
    return allRestrictedKeywords.some(keyword => lowerMessage.includes(keyword));
  },

  /**
   * Get restriction message for blocked content
   */
  getRestrictionMessage(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('code') || lowerMessage.includes('programming') || lowerMessage.includes('debug')) {
      return "I'm the DigitalQatalyst AI Assistant, and I'm specifically designed to help with questions about our digital transformation services and methodology. I can't assist with code reviews or programming tasks.\n\nInstead, I'd be happy to discuss how DigitalQatalyst can help your organization with its digital transformation journey, our DT 2.0 methodology, or our suite of digital accelerator products. What would you like to know about our services?";
    }
    
    return "I'm the DigitalQatalyst AI Assistant, and I focus specifically on helping visitors learn about our digital transformation services, methodology, and approach.\n\nI'd be happy to discuss how DigitalQatalyst can accelerate your organization's digital journey, our architecture-led and data-driven approach, or help you understand our service areas. What would you like to know about DigitalQatalyst?";
  },

  /**
   * Send a message to the DQ AI chatbot
   */
  async sendMessage(message: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    // Check for restricted content first
    if (this.isRestrictedContent(message)) {
      return this.getRestrictionMessage(message);
    }

    if (!openai) {
      throw new Error("Azure OpenAI not configured. Please set the required environment variables.");
    }

    try {
      // Build conversation context
      const messages = [
        {
          role: "system" as const,
          content: `${DQ_SYSTEM_INSTRUCTION}\n\nIMPORTANT: You represent DigitalQatalyst (DQ) ONLY. Do not mention Abu Dhabi Enterprise Journey Platform or any other organization.\n\nFORMATTING RULES:\n- Write in plain text only - NO markdown, hashtags, or special formatting\n- Be conversational and natural\n- Keep responses concise and easy to read\n- Use simple paragraphs, not lists or bullet points\n\nKnowledge Base:\n${DQ_KNOWLEDGE_BASE}`
        },
        // Add conversation history
        ...conversationHistory.slice(-10).map(msg => ({
          role: msg.role as "user" | "assistant",
          content: msg.content
        })),
        // Add current message
        {
          role: "user" as const,
          content: message
        }
      ];

      const response = await openai.chat.completions.create({
        model: deploymentName,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from AI");
      }

      // Check for and correct any incorrect platform references
      if (content.toLowerCase().includes('abu dhabi enterprise journey platform')) {
        console.warn('DQ Chatbot: Detected incorrect platform reference, using fallback');
        return dqChatbotService.getFallbackResponse(message);
      }

      // Clean up any markdown formatting to ensure clean output
      const cleanContent = dqChatbotService.cleanMarkdownFormatting(content);
      return cleanContent;
    } catch (error) {
      console.error("DQ Chatbot Error:", error);
      throw new Error("I'm having trouble connecting right now. Please try again or contact us directly for assistance.");
    }
  },

  /**
   * Generate a fallback response when AI is not available
   */
  getFallbackResponse(message: string): string {
    // Check for restricted content first
    if (this.isRestrictedContent(message)) {
      return this.getRestrictionMessage(message);
    }

    const lowerMessage = message.toLowerCase();
    
    // Default welcome/greeting response
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help') || message.trim() === '') {
      return "Hello! I'm the DigitalQatalyst AI assistant. I'm here to help you learn about our digital transformation services and how we can accelerate your organization's digital journey. What would you like to know?";
    }
    
    // Digital transformation journey questions - SECTION 4
    if (lowerMessage.includes('start') && (lowerMessage.includes('transformation') || lowerMessage.includes('digital'))) {
      return "Great question! At DigitalQatalyst, we guide organizations through their digital transformation journey using our DT 2.0 methodology, which consists of three core lifecycles:\n\n1. Design - Where we set the vision, goals, and roadmap through four stages: Envision, Target, Baseline, and Blueprint\n\n2. Deploy - Where we realize your Digital Business Platform through careful orchestration of technologies and projects\n\n3. Manage - Where we ensure continuous alignment with your strategic goals through governance and performance management\n\nThis is the transformation journey we do for all our clients. Would you like to learn more about any specific lifecycle, or perhaps take our Digital Maturity Assessment to see where your organization stands?";
    }
    
    // Why DQ is different questions - SECTION 4
    if (lowerMessage.includes('different') || lowerMessage.includes('unique') || lowerMessage.includes('why dq') || lowerMessage.includes('why choose')) {
      return "What makes DigitalQatalyst different is that our digital transformation approach is architecture-led and data-driven.\n\nOur Design lifecycle consists of four key stages: Envision, Target, Baseline, and Blueprint. This is how we bring our architecture-led approach to life.\n\nWe emphasize that for any organization, lifecycle management needs to be driven by portfolio management. That's why we go big in leveraging organizational data to drive transformation - we don't just implement technology, we ensure it's aligned with your business architecture and informed by real organizational data.\n\nWould you like to learn more about our methodology or book a consultation?";
    }
    
    // Service areas questions - SECTION 3
    if (lowerMessage.includes('service area') || lowerMessage.includes('industry') || lowerMessage.includes('sector')) {
      return "DigitalQatalyst offers specialized digital transformation services across 11 domains organized by economic sectors:\n\nCross-Sector: Experience4.0 and Agility4.0\nPrimary Sector: Farming4.0\nSecondary Sector: Plant4.0 and Infrastructure4.0\nTertiary Sector: Government4.0, Hospitality4.0, and Retail4.0\nQuaternary Sector: Service4.0 and Logistics4.0\nQuinary Sector: Wellness4.0\n\nEach domain is tailored to address the specific digital transformation needs of that sector. Which industry are you interested in?";
    }
    
    // Products questions - SECTION 2
    if (lowerMessage.includes('product') || lowerMessage.includes('platform') || lowerMessage.includes('tool')) {
      return "DigitalQatalyst offers a suite of digital accelerators - products designed to fast-track your transformation journey:\n\nTMaaS - Transformation Management as a Service for on-demand transformation services\nDTO4T - Digital Twin of Organisation for AI-driven diagnostics and tracking\nDTMP - Digital Transformation Management Platform for comprehensive initiative management\nDTMA - Digital Transformation Management Academy for e-learning and skills development\nDTMI - Digital Transformation Management Insights for research-driven content\nDTMB - Digital Transformation Management Books for strategic frameworks\nDWS - Digital Working Studios enabling digital workers through human-machine collaboration\n\nWould you like to learn more about any specific product?";
    }
    
    // Broad service offerings - SECTION 4
    if (lowerMessage.includes('service') || lowerMessage.includes('what do you do') || lowerMessage.includes('offering')) {
      return "DigitalQatalyst's broad service offerings are organized around our three core lifecycles:\n\nDesign Services - We help you envision, target, baseline, and blueprint your digital transformation journey\n\nDeploy Services - We formulate, specify, deliver, and transition your Digital Business Platform into reality\n\nManage Services - We provide ongoing governance, architecture alignment, demand management, and change management\n\nOur mission is to accelerate life's transaction improvements using digital blueprints. Would you like to learn more about any specific service area?";
    }
    
    // Assessment/maturity questions
    if (lowerMessage.includes('assessment') || lowerMessage.includes('maturity')) {
      return "Our Digital Maturity Assessment evaluates your organization across 5 key areas:\n\n1. Digital Experience (DXP) - Customer-facing digital touchpoints\n2. Digital Workspace (DWS) - Internal collaboration and productivity\n3. Data & Intelligence (DIA) - Data management and analytics\n4. Security & DevOps (SDO) - Cybersecurity and development practices\n5. Digital Business Platform (DBP) - Overall digital maturity\n\nIt's AI-powered and provides personalized recommendations based on your organization's current state. Would you like to take the assessment?";
    }
    
    // Consultation/contact questions
    if (lowerMessage.includes('consultation') || lowerMessage.includes('contact') || lowerMessage.includes('talk') || lowerMessage.includes('meet')) {
      return "I'd be happy to help you connect with our team! You can book a consultation through our website, and one of our digital transformation experts will discuss your specific needs and how we can help accelerate your digital journey.\n\nDuring the consultation, we can discuss your organization's current digital maturity, transformation goals, and how our DT 2.0 methodology can help you become a Digital Cognitive Organization.";
    }
    
    // GHC/internal operations questions - SECTION 5
    if (lowerMessage.includes('ghc') || lowerMessage.includes('golden honeycomb') || lowerMessage.includes('culture') || lowerMessage.includes('values') || lowerMessage.includes('how do you work')) {
      return "The DQ Golden Honeycomb of Competencies (GHC) is our master framework - a Framework of Frameworks - that articulates the complete DNA of DigitalQatalyst.\n\nIt includes 7 core elements:\n1. The DQ Vision - \"To perfect life's transactions\"\n2. House of Values - Our culture built on Self-Development, Lean Working, and Value Co-Creation\n3. Persona - The traits that define who thrives at DQ\n4. Agile TMS - How we turn strategy into motion\n5. Agile SoS - Our governance system\n6. Agile Flows - Our value streams\n7. Agile DTMF - Our products and frameworks\n\nThis framework guides how we think, work, create value, and grow with every partner we serve.";
    }
    
    // Framework/why questions - SECTION 1
    if (lowerMessage.includes('framework') || lowerMessage.includes('why') || lowerMessage.includes('approach')) {
      return "Our approach is built on the D1-D6 Framework:\n\nD1 - Recognizing the Digital Economy: Understanding that the market has fundamentally changed\nD2 - Destination DCO: Becoming a Digital Cognitive Organization\nD3 - Digital Business Platform: Building your digital backbone\nD4 - DT 2.0: Our revolutionary transformation methodology\nD5 - Digital Worker & Workspace: Combining human talent with intelligent machines\nD6 - Digital Accelerators: Our suite of products that fast-track transformation\n\nThis framework guides everything we do at DigitalQatalyst. Would you like to explore any of these concepts further?";
    }
    
    return "Thank you for your interest in DigitalQatalyst! We specialize in digital transformation consulting and helping organizations become Digital Cognitive Organizations through our architecture-led and data-driven approach.\n\nI'd encourage you to explore our Digital Maturity Assessment to see where your organization stands, or book a consultation to discuss how our DT 2.0 methodology can help accelerate your digital journey.";
  },

  /**
   * Create a new chat session
   */
  createSession(): ChatSession {
    return {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  },

  /**
   * Add a message to a session
   */
  addMessage(session: ChatSession, role: 'user' | 'assistant', content: string): ChatMessage {
    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date()
    };
    
    session.messages.push(message);
    session.updatedAt = new Date();
    
    return message;
  }
};