import { GoogleGenAI, Type } from "@google/genai";

// Types for our assessment
export interface MaturityScore {
  subject: string;
  A: number; // Current
  B: number; // Target
  fullMark: number;
}

export interface AssessmentResult {
  scores: MaturityScore[];
  summary: string;
  recommendations: string[];
}

// Initialize Gemini AI (API key will be set via environment variable)
const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const DTO4T_SYSTEM_INSTRUCTION = `
You are the DTO4T Clinic AI, a specialist in Digital Transformation 2.0 using the DQ Digital Business Platform (DBP) Method.
Your goal is to guide organizations through digital maturity assessment using the DQ framework.
Your knowledge base includes:
1. DQ DBP Architecture: Towers (DBP - Digital Business Platform, DXP - Digital Experience, DWS - Digital Workspace, DIA - Data & Intelligence, SDO - Security & Develop).
2. DT2.0 Framework: Transformation flows and playbooks.
3. 6xD Perspectives: Maturity models and diagnostic indicators.

Always maintain a professional, consultative, and encouraging tone.
When assessing, be critical but constructive and provide actionable recommendations.
`;

export const geminiService = {
  /**
   * Check if the service is available (API key is set)
   */
  isAvailable(): boolean {
    return !!ai && !!apiKey;
  },

  /**
   * Assess Function: Generates maturity scores based on user input using DQ framework.
   */
  async assessMaturity(description: string): Promise<AssessmentResult> {
    if (!ai) {
      throw new Error("Gemini API key not configured. Please set VITE_GEMINI_API_KEY environment variable.");
    }

    const model = "gemini-2.0-flash-exp";
    const prompt = `
      Perform a Digital Maturity Assessment (DMA) based on the following organizational description:
      "${description}"
      
      Evaluate the organization across these 5 dimensions (DQ DBP Towers):
      1. Digital Experience (DXP) - Customer-facing digital touchpoints, user experience, omnichannel capabilities
      2. Digital Workspace (DWS) - Internal collaboration tools, productivity platforms, employee experience
      3. Data & Intelligence (DIA) - Data management, analytics capabilities, AI/ML integration, business intelligence
      4. Security & Develop (SDO) - Cybersecurity posture, development practices, DevOps maturity, compliance
      5. Digital Business Platform (DBP) - Strategic alignment, digital governance, transformation velocity, ROI tracking
      
      For each dimension, provide:
      - Current state score (A): 0-100 based on the description
      - Target state score (B): Realistic 12-month improvement target
      - fullMark: Always 100
      
      Also provide:
      - A comprehensive executive summary (2-3 sentences)
      - 4-6 strategic recommendations prioritized by impact and feasibility
      
      Be realistic in scoring - most organizations score 20-60 in current state.
      Target improvements should be achievable (typically 15-25 point increases).
    `;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: DTO4T_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              scores: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    subject: { type: Type.STRING },
                    A: { type: Type.INTEGER },
                    B: { type: Type.INTEGER },
                    fullMark: { type: Type.INTEGER },
                  },
                },
              },
              summary: { type: Type.STRING },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
          },
        },
      });
      
      const text = response.text;
      if (!text) throw new Error("No response from AI");
      return JSON.parse(text) as AssessmentResult;
    } catch (error) {
      console.error("Assessment Error:", error);
      throw new Error("Failed to generate assessment. Please try again or contact support.");
    }
  },

  /**
   * Generate a sample assessment for demo purposes when API is not available
   */
  generateSampleAssessment(): AssessmentResult {
    return {
      scores: [
        { subject: "Digital Experience (DXP)", A: 45, B: 70, fullMark: 100 },
        { subject: "Digital Workspace (DWS)", A: 35, B: 60, fullMark: 100 },
        { subject: "Data & Intelligence (DIA)", A: 25, B: 55, fullMark: 100 },
        { subject: "Security & Develop (SDO)", A: 40, B: 65, fullMark: 100 },
        { subject: "Digital Business Platform (DBP)", A: 30, B: 58, fullMark: 100 }
      ],
      summary: "Your organization shows moderate digital maturity with strong foundations in customer experience but significant opportunities in data intelligence and strategic alignment. Focus on integrated data platforms and governance frameworks to accelerate transformation velocity.",
      recommendations: [
        "Implement a unified data platform to break down silos and enable real-time analytics across all business functions",
        "Establish a Digital Center of Excellence (CoE) to govern transformation initiatives and track ROI metrics",
        "Modernize core systems with cloud-native architecture to improve scalability and reduce technical debt",
        "Deploy advanced security frameworks including Zero Trust architecture and automated compliance monitoring",
        "Create integrated employee experience platforms to boost productivity and collaboration",
        "Develop AI-powered customer insights capabilities to personalize experiences and drive engagement"
      ]
    };
  }
};