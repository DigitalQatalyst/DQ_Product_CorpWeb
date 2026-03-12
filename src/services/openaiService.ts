import OpenAI from 'openai';

// Types for our assessment (keeping the same interface)
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

const DTO4T_SYSTEM_INSTRUCTION = `
You are the DTO4T Clinic AI, a specialist in Digital Transformation 2.0 using the DQ Digital Business Platform (DBP) Method.
Your goal is to provide accurate, honest digital maturity assessments using the DQ framework.

Your knowledge base includes:
1. DQ DBP Architecture: Towers (DBP - Digital Business Platform, DXP - Digital Experience, DWS - Digital Workspace, DIA - Data & Intelligence, SDO - Security & DevOps).
2. DT2.0 Framework: Transformation flows and playbooks.
3. 6xD Perspectives: Maturity models and diagnostic indicators.

ASSESSMENT PRINCIPLES:
- Be brutally honest in scoring - accuracy over politeness
- Score based ONLY on what is explicitly described
- Do not assume baseline capabilities unless mentioned
- A score of 0-5 is perfectly acceptable for organizations with no digital capabilities
- Provide constructive recommendations appropriate to their actual maturity level
- Maintain professional tone while being precise about gaps

SCORING ACCURACY:
- "No technology" = 0-5 points (not 10-20)
- "Just starting" = 0-10 points (not 15-25)
- "Basic systems" = 5-20 points
- "Some digital tools" = 15-35 points
- "Good digital foundation" = 30-55 points
- "Advanced capabilities" = 55-80 points
- "Industry leading" = 80-100 points

Always provide actionable, realistic recommendations that match their current maturity level.
`;

export const openaiService = {
  /**
   * Check if the service is available (all Azure OpenAI config is set)
   */
  isAvailable(): boolean {
    return !!openai && !!apiKey && !!endpoint && !!deploymentName;
  },

  /**
   * Assess Function: Generates maturity scores based on user input using DQ framework.
   */
  async assessMaturity(description: string): Promise<AssessmentResult> {
    if (!openai) {
      throw new Error("Azure OpenAI not configured. Please set VITE_AZURE_OPENAI_API_KEY, VITE_AZURE_OPENAI_ENDPOINT, and VITE_AZURE_OPENAI_DEPLOYMENT_NAME environment variables.");
    }

    const prompt = `
      Perform a Digital Maturity Assessment (DMA) based on the following organizational description:
      "${description}"
      
      Evaluate the organization across these 4 foundational dimensions (DQ DBP Towers):
      1. Digital Experience (DXP) - Customer-facing digital touchpoints, user experience, omnichannel capabilities
      2. Digital Workspace (DWS) - Internal collaboration tools, productivity platforms, employee experience
      3. Data & Intelligence (DIA) - Data management, analytics capabilities, AI/ML integration, business intelligence
      4. Security & DevOps (SDO) - Cybersecurity posture, development practices, DevOps maturity, compliance
      
      IMPORTANT: The 5th dimension "Digital Business Platform (DBP)" should be calculated as the AVERAGE of the above 4 towers.
      DBP represents overall digital maturity and can only be achieved when all foundational towers are mature.
      DBP Score = (DXP + DWS + DIA + SDO) / 4
      
      CRITICAL SCORING GUIDELINES:
      - Score 0-5: No digital capabilities, manual processes only, no technology infrastructure
      - Score 5-15: Basic technology (email, basic computers), minimal digital processes
      - Score 15-30: Some digital tools but disconnected, limited automation
      - Score 30-50: Moderate digital capabilities with some integration
      - Score 50-70: Advanced digital capabilities with good integration
      - Score 70-85: Highly mature digital operations with strategic alignment
      - Score 85-100: Industry-leading digital transformation with AI/automation
      
      SPECIFIC SCORING EXAMPLES:
      - "No technology" or "new organization" = 0-5 points
      - "Basic email and computers" = 5-15 points
      - "Legacy systems only" = 10-25 points
      - "Some modern tools but not integrated" = 20-40 points
      - "Good digital infrastructure" = 40-65 points
      - "Advanced digital capabilities" = 65-85 points
      - "Industry leader in digital" = 85-100 points
      
      BE PRECISE: If the description indicates no digital capabilities, score should be 0-5. If they mention "no technology yet" or "just starting", do not give baseline scores of 10-20.
      
      For the 4 foundational dimensions, provide:
      - Current state score (A): 0-100 based STRICTLY on the description provided
      - Target state score (B): Realistic 12-month improvement target (typically 15-30 point increase from current)
      - fullMark: Always 100
      
      For the DBP dimension:
      - Current state score (A): Calculate as the average of the 4 foundational towers
      - Target state score (B): Calculate as the average of the 4 foundational towers' target scores
      - fullMark: Always 100
      
      Also provide:
      - A comprehensive assessment summary (2-3 sentences) that reflects the actual maturity level
      - 4-6 strategic recommendations prioritized by impact and feasibility, appropriate for their current level
      
      IMPORTANT: Be brutally honest in scoring. A new organization with no technology should score 0-5 across all dimensions, not 10-20.

      Return the response as a JSON object with this exact structure:
      {
        "scores": [
          {
            "subject": "Digital Experience (DXP)",
            "A": 25,
            "B": 45,
            "fullMark": 100
          },
          {
            "subject": "Digital Workspace (DWS)",
            "A": 20,
            "B": 40,
            "fullMark": 100
          },
          {
            "subject": "Data & Intelligence (DIA)",
            "A": 15,
            "B": 35,
            "fullMark": 100
          },
          {
            "subject": "Security & DevOps (SDO)",
            "A": 30,
            "B": 50,
            "fullMark": 100
          },
          {
            "subject": "Digital Business Platform (DBP)",
            "A": 22,
            "B": 42,
            "fullMark": 100
          }
        ],
        "summary": "Your comprehensive assessment summary here...",
        "recommendations": [
          "First recommendation...",
          "Second recommendation...",
          // ... more recommendations
        ]
      }
    `;

    try {
      const response = await openai.chat.completions.create({
        model: deploymentName, // Using your Azure deployment
        messages: [
          {
            role: "system",
            content: DTO4T_SYSTEM_INSTRUCTION
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 2000
      });
      
      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error("No response from OpenAI");
      
      const result = JSON.parse(content) as AssessmentResult;
      
      // Ensure DBP is calculated as average of the 4 foundational towers
      const foundationalTowers = result.scores.filter(score => 
        score.subject !== "Digital Business Platform (DBP)"
      );
      
      if (foundationalTowers.length === 4) {
        const dbpCurrentAvg = Math.round(foundationalTowers.reduce((sum, tower) => sum + tower.A, 0) / foundationalTowers.length);
        const dbpTargetAvg = Math.round(foundationalTowers.reduce((sum, tower) => sum + tower.B, 0) / foundationalTowers.length);
        
        // Update or add DBP score
        const dbpIndex = result.scores.findIndex(score => score.subject === "Digital Business Platform (DBP)");
        if (dbpIndex !== -1) {
          result.scores[dbpIndex].A = dbpCurrentAvg;
          result.scores[dbpIndex].B = dbpTargetAvg;
        } else {
          result.scores.push({
            subject: "Digital Business Platform (DBP)",
            A: dbpCurrentAvg,
            B: dbpTargetAvg,
            fullMark: 100
          });
        }
      }
      
      return result;
    } catch (error) {
      console.error("Azure OpenAI Assessment Error:", error);
      throw new Error("Failed to generate assessment. Please try again or contact support.");
    }
  },

  /**
   * Generate a sample assessment for demo purposes when API is not available
   */
  generateSampleAssessment(): AssessmentResult {
    // Define the 4 foundational towers
    const foundationalTowers = [
      { subject: "Digital Experience (DXP)", A: 45, B: 70, fullMark: 100 },
      { subject: "Digital Workspace (DWS)", A: 35, B: 60, fullMark: 100 },
      { subject: "Data & Intelligence (DIA)", A: 25, B: 55, fullMark: 100 },
      { subject: "Security & DevOps (SDO)", A: 40, B: 65, fullMark: 100 }
    ];
    
    // Calculate DBP as average of the 4 foundational towers
    const dbpCurrentAvg = Math.round(foundationalTowers.reduce((sum, tower) => sum + tower.A, 0) / foundationalTowers.length);
    const dbpTargetAvg = Math.round(foundationalTowers.reduce((sum, tower) => sum + tower.B, 0) / foundationalTowers.length);
    
    const dbpTower = { subject: "Digital Business Platform (DBP)", A: dbpCurrentAvg, B: dbpTargetAvg, fullMark: 100 };
    
    return {
      scores: [...foundationalTowers, dbpTower],
      summary: "Your organization shows moderate digital maturity with strong foundations in customer experience but significant opportunities in data intelligence and strategic alignment. The DBP score reflects the average maturity across all foundational towers, indicating balanced but incremental digital transformation progress.",
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