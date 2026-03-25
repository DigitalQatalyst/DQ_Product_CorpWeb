import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Target,
  BrainCircuit,
  Loader2,
  Sparkles,
  FileText,
  Building2,
  Users,
  Globe,
  Cog,
  Database,
  Shield,
  ChevronLeft,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { FadeInUpOnScroll } from "./AnimationUtils";
import { openaiService, AssessmentResult } from "../services/openaiService";
import { submitAssessmentLead } from "../services/airtableService";

interface AssessmentFormData {
  organizationDescription: string;
  industry: string;
  companySize: string;
  customerChannels: string;
  internalProcesses: string;
  dataIntelligence: string;
  securityDevOps: string;
}

interface LeadCaptureData {
  name: string;
  company: string;
  email: string;
}

const DigitalMaturityAssessment: React.FC = () => {
  const navigate = useNavigate();
  const assessmentRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<AssessmentFormData>({
    organizationDescription: "",
    industry: "",
    companySize: "",
    customerChannels: "",
    internalProcesses: "",
    dataIntelligence: "",
    securityDevOps: "",
  });
  const [leadData, setLeadData] = useState<LeadCaptureData>({
    name: "",
    company: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [emailError, setEmailError] = useState<string>("");

  // Email validation function
  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    
    setEmailError("");
    return true;
  };

  // Progress tracking
  const getCurrentStep = () => {
    if (!isStarted) return 1;
    if (showLeadCapture) return 3;
    if (result) return 4;
    return 2;
  };

  // Auto-scroll when step changes (only on user actions, not initial mount)
  const scrollToAssessmentOnAction = () => {
    if (assessmentRef.current) {
      assessmentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleInputChange = (
    field: keyof AssessmentFormData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLeadInputChange = (
    field: keyof LeadCaptureData,
    value: string,
  ) => {
    setLeadData((prev) => ({ ...prev, [field]: value }));
  };

  const generateDescription = () => {
    return `Organization: ${formData.organizationDescription}
Industry: ${formData.industry}
Company Size: ${formData.companySize}
Customer Interaction Channels: ${formData.customerChannels}
Internal Processes & Operations: ${formData.internalProcesses}
Data & Intelligence: ${formData.dataIntelligence}
Security & DevOps: ${formData.securityDevOps}`;
  };

  const isFormValid = () => {
    return Object.values(formData).every((value) => value.trim() !== "");
  };

  const isLeadFormValid = () => {
    // Check if all fields are filled
    const allFieldsFilled = Object.values(leadData).every((value) => value.trim() !== "");
    if (!allFieldsFilled) return false;
    
    // Check email format without setting error (just validation check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(leadData.email);
  };

  const handleAssess = async () => {
    if (!isFormValid()) return;
    setIsLoading(true);
    try {
      let assessment: AssessmentResult;
      const description = generateDescription();

      if (openaiService.isAvailable()) {
        assessment = await openaiService.assessMaturity(description);
      } else {
        // Use sample assessment if API is not available
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
        assessment = openaiService.generateSampleAssessment();
      }

      setResult(assessment);
      setShowLeadCapture(true); // Show lead capture instead of results directly

      // Scroll to assessment section after state update
      setTimeout(() => scrollToAssessmentOnAction(), 100);
    } catch (error) {
      console.error("Assessment error:", error);
      // Fallback to sample assessment on error
      const assessment = openaiService.generateSampleAssessment();
      setResult(assessment);
      setShowLeadCapture(true);

      // Scroll to assessment section after state update
      setTimeout(() => scrollToAssessmentOnAction(), 100);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccessReport = async () => {
    // Validate email and show error if invalid
    if (!validateEmail(leadData.email)) {
      return;
    }
    
    if (!isLeadFormValid()) return;

    // Send the lead data to Airtable
    try {
      setIsLoading(true);
      console.log("Attempting to submit lead data:", leadData);
      await submitAssessmentLead(leadData);
      console.log("Lead captured successfully:", leadData);

      // Show the results
      setShowLeadCapture(false);

      // Scroll to assessment section after state update
      setTimeout(() => scrollToAssessmentOnAction(), 100);
    } catch (error) {
      console.error("Error capturing lead:", error);
      // Show an alert to the user about the error
      alert(
        "There was an issue submitting your information. Please try again or contact support if the problem persists.",
      );
      // Still show results even if lead capture fails
      setShowLeadCapture(false);

      // Scroll to assessment section after state update
      setTimeout(() => scrollToAssessmentOnAction(), 100);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setFormData({
      organizationDescription: "",
      industry: "",
      companySize: "",
      customerChannels: "",
      internalProcesses: "",
      dataIntelligence: "",
      securityDevOps: "",
    });
    setLeadData({
      name: "",
      company: "",
      email: "",
    });
    setResult(null);
    setIsStarted(false);
    setShowLeadCapture(false);
  };

  const handleBack = () => {
    const currentStep = getCurrentStep();
    if (currentStep === 2) {
      // From assessment form back to welcome
      setIsStarted(false);
    } else if (currentStep === 3) {
      // From lead capture back to assessment form - clear result to prevent skipping lead capture
      setShowLeadCapture(false);
      setResult(null); // Clear the result so user has to complete assessment again
    } else if (currentStep === 4) {
      // From results back to lead capture
      setShowLeadCapture(true);
    }

    // Scroll to assessment section after state update
    setTimeout(() => scrollToAssessmentOnAction(), 100);
  };

  const loadSampleData = () => {
    setFormData({
      organizationDescription:
        "We are a regional logistics and supply chain company with operations across the Middle East, specializing in last-mile delivery and warehousing solutions. Currently undergoing digital transformation to modernize our legacy infrastructure and improve operational efficiency. Our strategic focus is on implementing cloud-first architecture, automating manual processes, and enhancing customer experience through digital touchpoints.",
      industry: "Logistics 4.0",
      companySize: "1,001-5,000 employees",
      customerChannels:
        "Multi-channel approach including: legacy web portal (non-responsive, limited functionality), mobile app for basic tracking, call center for customer support, WhatsApp Business for order updates, physical service centers in major cities. Real-time tracking system has 4-hour data latency. Customer onboarding is mostly manual with paper-based documentation.",
      internalProcesses:
        "Mixed digital-manual operations: Warehouse teams use handheld scanners but rely on paper manifests for route planning. Corporate functions use Office 365 suite but lack integrated workflow automation. Approval processes are email-based with no centralized system. Fleet management uses GPS tracking but route optimization is manual. HR processes are partially digitized with legacy HRIS system.",
      dataIntelligence:
        "Data infrastructure consists of legacy ERP system (SAP ECC 6.0) with limited integration capabilities. Business intelligence relies heavily on manual Excel reporting and basic dashboards. No real-time analytics or predictive modeling for demand forecasting. Customer data scattered across multiple systems. Limited data governance framework with basic backup procedures but no comprehensive data strategy.",
      securityDevOps:
        "Traditional perimeter-based security with firewalls and VPN access. No Zero Trust architecture implementation. Development practices include basic CI/CD pipelines but with manual security reviews and testing. Infrastructure is hybrid on-premise/cloud with limited automation. Compliance frameworks include ISO 27001 but implementation is inconsistent across departments. Incident response procedures are documented but not regularly tested.",
    });
  };

  return (
    <div
      className="py-20"
      style={{
        background: "linear-gradient(to bottom right, #FEF7F5, #F6F8FF)",
      }}
    >
      <div className="container mx-auto px-4" ref={assessmentRef}>
        {/* Section Header - Always Visible */}
        <FadeInUpOnScroll className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            How Digitally Mature is Your Organization?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Our digital maturity assessment provides a comprehensive analysis of
            your current digital state and offers tailored recommendations to
            accelerate your transformation journey.
          </p>

          {/* Back Button */}
          {getCurrentStep() > 1 && (
            <div className="flex justify-start mb-6">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>
          )}
        </FadeInUpOnScroll>

        {/* Content Area */}
        {!isStarted ? (
          // Welcome Screen
          <FadeInUpOnScroll className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <BrainCircuit
                    size={32}
                    className="text-blue-600 mx-auto mb-3"
                  />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    AI-Powered Analysis
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Our trained AI evaluates your digital maturity against DBP
                    Towers
                  </p>
                </div>
                <div className="text-center p-6 bg-indigo-50 rounded-xl">
                  <Target size={32} className="text-indigo-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    DQ Framework
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Based on proven Digital Business Platform methodology
                  </p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-xl">
                  <Sparkles
                    size={32}
                    className="text-purple-600 mx-auto mb-3"
                  />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Strategic Insights
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Get actionable recommendations and roadmap
                  </p>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => {
                    setIsStarted(true);
                    setTimeout(() => scrollToAssessmentOnAction(), 100);
                  }}
                  className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Unlock Your Digital Maturity
                  <ArrowRight size={20} className="ml-2" />
                </button>
              </div>
            </div>
          </FadeInUpOnScroll>
        ) : showLeadCapture ? (
          // Lead Capture Screen
          <FadeInUpOnScroll className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Assessment Complete!
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Your digital maturity analysis is ready. Please provide your
                  details below to access your personalized DBP Tower assessment
                  report and strategic recommendations.
                </p>
              </div>

              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={leadData.name}
                    onChange={(e) =>
                      handleLeadInputChange("name", e.target.value)
                    }
                    placeholder="Enter your full name"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Company Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={leadData.company}
                    onChange={(e) =>
                      handleLeadInputChange("company", e.target.value)
                    }
                    placeholder="Enter your company name"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={leadData.email}
                    onChange={(e) => {
                      handleLeadInputChange("email", e.target.value);
                      // Clear error when user starts typing
                      if (emailError) setEmailError("");
                    }}
                    onBlur={(e) => {
                      // Validate on blur
                      if (e.target.value.trim()) {
                        validateEmail(e.target.value);
                      }
                    }}
                    placeholder="Enter your email address"
                    className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                      emailError
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-transparent'
                    }`}
                  />
                  {emailError && (
                    <p className="mt-1 text-sm text-red-600">{emailError}</p>
                  )}
                </div>

                {/* Privacy Notice */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    By providing your information, you agree to receive your
                    assessment report and occasional updates about digital
                    transformation insights from DigitalQatalyst. We respect
                    your privacy and will never share your information with
                    third parties.
                  </p>
                </div>

                {/* Access Report Button */}
                <button
                  onClick={handleAccessReport}
                  disabled={!isLeadFormValid() || isLoading}
                  className="w-full px-8 py-4 bg-primary hover:bg-primary-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      <span>Access My Report</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {!isLeadFormValid() && !isLoading && (
                  <p className="text-xs text-gray-500 text-center">
                    Please complete all required fields to access your report
                  </p>
                )}
              </div>
            </div>
          </FadeInUpOnScroll>
        ) : result ? (
          // Results Screen
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Chart Section - Takes 2 columns */}
              <div className="xl:col-span-2">
                <FadeInUpOnScroll>
                  <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 h-full">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <span
                          className="w-3 h-8 rounded-full mr-3"
                          style={{ backgroundColor: "#08206D" }}
                        ></span>
                        DBP Tower Maturity Profile
                      </h3>
                      <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                        AI-Generated Analysis
                      </div>
                    </div>

                    <div className="h-[400px] w-full mb-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart
                          cx="50%"
                          cy="50%"
                          outerRadius="70%"
                          data={result.scores}
                          margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
                        >
                          <PolarGrid stroke="#e5e7eb" />
                          <PolarAngleAxis
                            dataKey="subject"
                            tick={{
                              fill: "#4b5563",
                              fontSize: 12,
                              fontWeight: 500,
                            }}
                          />
                          <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={{ fill: "#9ca3af", fontSize: 10 }}
                          />
                          <Tooltip
                            contentStyle={{
                              borderRadius: "12px",
                              border: "none",
                              boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
                              backgroundColor: "white",
                            }}
                            itemStyle={{ fontSize: "13px", fontWeight: 600 }}
                          />
                          <Radar
                            name="Current Maturity"
                            dataKey="A"
                            stroke="#08206D"
                            fill="#08206D"
                            fillOpacity={0.3}
                            strokeWidth={2}
                          />
                          <Radar
                            name="Target (12mo)"
                            dataKey="B"
                            stroke="#10b981"
                            fill="#34d399"
                            fillOpacity={0.2}
                            strokeWidth={2}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex justify-center space-x-8 text-sm">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: "#08206D", opacity: 0.3 }}
                        ></div>
                        <span className="text-gray-700 font-medium">
                          Current Maturity
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-400 opacity-30 rounded-full"></div>
                        <span className="text-gray-700 font-medium">
                          Target (12 months)
                        </span>
                      </div>
                    </div>
                  </div>
                </FadeInUpOnScroll>
              </div>

              {/* Insights Sidebar */}
              <div className="space-y-6">
                {/* Executive Summary */}
                <FadeInUpOnScroll delay={0.2}>
                  <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Assessment Summary
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {result.summary}
                    </p>
                  </div>
                </FadeInUpOnScroll>

                {/* Key Metrics */}
                <FadeInUpOnScroll delay={0.3}>
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                      Key Metrics
                    </h4>
                    <div className="space-y-3">
                      {result.scores.map((score, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span className="text-xs text-gray-600 truncate">
                            {score.subject}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${score.A}%`,
                                  backgroundColor: "#08206D",
                                }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-gray-700 w-6">
                              {score.A}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeInUpOnScroll>
              </div>
            </div>

            {/* Strategic Pathways - Full Width */}
            <FadeInUpOnScroll delay={0.4} className="mt-8">
              <div className="bg-gradient-to-br from-secondary via-secondary-800 to-secondary-900 text-white p-8 rounded-2xl shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center mr-4">
                    <Sparkles className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Strategic Pathways</h3>
                    <p className="text-gray-200 text-sm">
                      Prioritized recommendations for your digital
                      transformation journey
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm text-gray-100 leading-relaxed">
                            {rec}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInUpOnScroll>

            {/* Action Buttons */}
            <FadeInUpOnScroll delay={0.6} className="mt-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleRestart}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    <span>Start New Assessment</span>
                  </button>
                  <button
                    onClick={() => navigate("/consultation")}
                    className="px-6 py-3 bg-primary hover:bg-primary-600 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <span>Get Expert Consultation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </FadeInUpOnScroll>
          </div>
        ) : (
          // Assessment Input Screen
          <FadeInUpOnScroll className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100">
                <BrainCircuit className="w-4 h-4" />
                <span>AI-Driven Analysis</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="text-center space-y-2 mb-8">
                <h3 className="text-xl font-semibold text-gray-800">
                  Tell Us About Your Organization
                </h3>
                <p className="text-gray-500 text-sm max-w-2xl mx-auto">
                  Complete the guided assessment below. Our AI will analyze your
                  responses across the DQ Digital Business Platform framework to
                  provide personalized insights.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Organization Description */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Building2 className="w-4 h-4 text-gray-600" />
                    <span>Organization Overview</span>
                  </label>
                  <textarea
                    value={formData.organizationDescription}
                    onChange={(e) =>
                      handleInputChange(
                        "organizationDescription",
                        e.target.value,
                      )
                    }
                    placeholder="Brief description of your organization, business model, and current digital transformation stage..."
                    className="w-full h-24 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  />
                </div>

                {/* Industry */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Target className="w-4 h-4 text-gray-600" />
                    <span>Industry & Sector</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.industry}
                      onChange={(e) =>
                        handleInputChange("industry", e.target.value)
                      }
                      className="w-full p-3 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                    >
                      <option value="">Select your industry...</option>
                      <option value="Experience 4.0">Experience 4.0</option>
                      <option value="Agility 4.0">Agility 4.0</option>
                      <option value="Farming 4.0">Farming 4.0</option>
                      <option value="Plant 4.0">Plant 4.0</option>
                      <option value="Infrastructure 4.0">
                        Infrastructure 4.0
                      </option>
                      <option value="Government 4.0">Government 4.0</option>
                      <option value="Hospitality 4.0">Hospitality 4.0</option>
                      <option value="Retail 4.0">Retail 4.0</option>
                      <option value="Service 4.0">Service 4.0</option>
                      <option value="Logistics 4.0">Logistics 4.0</option>
                      <option value="Wellness 4.0">Wellness 4.0</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Company Size */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span>Organization Size</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.companySize}
                      onChange={(e) =>
                        handleInputChange("companySize", e.target.value)
                      }
                      className="w-full p-3 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                    >
                      <option value="">Select company size...</option>
                      <option value="1-50 employees">
                        Startup (1-50 employees)
                      </option>
                      <option value="51-200 employees">
                        Small Business (51-200 employees)
                      </option>
                      <option value="201-1,000 employees">
                        Mid-Market (201-1,000 employees)
                      </option>
                      <option value="1,001-5,000 employees">
                        Large Enterprise (1,001-5,000 employees)
                      </option>
                      <option value="5,000+ employees">
                        Global Enterprise (5,000+ employees)
                      </option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Customer Channels */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <span>Customer Interaction Channels</span>
                  </label>
                  <textarea
                    value={formData.customerChannels}
                    onChange={(e) =>
                      handleInputChange("customerChannels", e.target.value)
                    }
                    placeholder="Describe how customers interact with your business (website, mobile app, physical locations, call centers, etc.)..."
                    className="w-full h-24 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  />
                </div>

                {/* Internal Processes */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Cog className="w-4 h-4 text-gray-600" />
                    <span>Internal Processes & Operations</span>
                  </label>
                  <textarea
                    value={formData.internalProcesses}
                    onChange={(e) =>
                      handleInputChange("internalProcesses", e.target.value)
                    }
                    placeholder="Describe your internal workflows, collaboration tools, automation level, and operational processes..."
                    className="w-full h-24 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  />
                </div>

                {/* Data & Intelligence */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Database className="w-4 h-4 text-gray-600" />
                    <span>Data & Intelligence Capabilities</span>
                  </label>
                  <textarea
                    value={formData.dataIntelligence}
                    onChange={(e) =>
                      handleInputChange("dataIntelligence", e.target.value)
                    }
                    placeholder="Describe your data infrastructure, analytics capabilities, reporting systems, and AI/ML initiatives..."
                    className="w-full h-24 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  />
                </div>
              </div>

              {/* Security & DevOps - Full Width */}
              <div className="space-y-3 mb-8">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Shield className="w-4 h-4 text-gray-600" />
                  <span>Security & DevOps</span>
                </label>
                <textarea
                  value={formData.securityDevOps}
                  onChange={(e) =>
                    handleInputChange("securityDevOps", e.target.value)
                  }
                  placeholder="Describe your security posture, development practices, CI/CD pipelines, infrastructure management, and compliance frameworks..."
                  className="w-full h-24 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                />
              </div>

              <div className="text-center">
                <button
                  onClick={handleAssess}
                  disabled={isLoading || !isFormValid()}
                  className="px-8 py-3 bg-primary hover:bg-primary-600 text-white rounded-xl font-medium transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mx-auto"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                  <span>
                    {isLoading ? "Analyzing DBP Towers..." : "Run Diagnostics"}
                  </span>
                </button>
                {!isFormValid() && (
                  <p className="text-xs text-gray-500 mt-2">
                    Please complete all fields to proceed with the assessment
                  </p>
                )}
              </div>
            </div>
          </FadeInUpOnScroll>
        )}
      </div>
    </div>
  );
};

export default DigitalMaturityAssessment;
