"use client";

import { useState, useRef } from "react";
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
import Link from "next/link";

// ── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  organizationDescription: string;
  industry: string;
  companySize: string;
  customerChannels: string;
  internalProcesses: string;
  dataIntelligence: string;
  securityDevOps: string;
}
interface LeadData {
  name: string;
  company: string;
  email: string;
}
interface AssessmentResult {
  summary: string;
  scores: { subject: string; A: number; B: number }[];
  recommendations: string[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const inputCls =
  "w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#030F35] focus:border-[#030F35] transition-all duration-200 text-sm";
const labelCls =
  "flex items-center space-x-2 text-sm font-medium text-gray-700";
const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
  backgroundPosition: "right 0.5rem center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "1.5em 1.5em",
  paddingRight: "2.5rem",
};

function generateSampleAssessment(): AssessmentResult {
  return {
    summary:
      "Your organization shows moderate digital maturity with strong foundations in customer channels but opportunities to improve data intelligence and security practices. A structured transformation roadmap focusing on automation and data-driven decision making will accelerate your journey.",
    scores: [
      { subject: "Customer Channels", A: 65, B: 85 },
      { subject: "Internal Processes", A: 50, B: 75 },
      { subject: "Data Intelligence", A: 40, B: 80 },
      { subject: "Security & DevOps", A: 55, B: 78 },
      { subject: "Digital Strategy", A: 60, B: 90 },
      { subject: "Innovation Culture", A: 45, B: 70 },
    ],
    recommendations: [
      "Implement a unified data platform to consolidate scattered data sources and enable real-time analytics.",
      "Adopt Zero Trust security architecture to modernize your perimeter-based security model.",
      "Automate manual approval workflows using low-code platforms to reduce operational friction.",
      "Establish a digital centre of excellence to drive innovation culture across departments.",
      "Migrate legacy ERP to cloud-native architecture to unlock integration capabilities.",
      "Deploy AI-powered demand forecasting to replace manual route optimization processes.",
    ],
  };
}

// ── Main Component ────────────────────────────────────────────────────────────
export function DigitalMaturityAssessment() {
  const ref = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormData>({
    organizationDescription: "",
    industry: "",
    companySize: "",
    customerChannels: "",
    internalProcesses: "",
    dataIntelligence: "",
    securityDevOps: "",
  });
  const [lead, setLead] = useState<LeadData>({
    name: "",
    company: "",
    email: "",
  });
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [emailError, setEmailError] = useState("");

  const scroll = () =>
    setTimeout(
      () => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      100,
    );

  const step = !isStarted ? 1 : showLeadCapture ? 3 : result ? 4 : 2;

  const setF =
    (k: keyof FormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));
  const setL =
    (k: keyof LeadData) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setLead((p) => ({ ...p, [k]: e.target.value }));

  const formValid = Object.values(form).every((v) => v.trim());
  const leadValid =
    Object.values(lead).every((v) => v.trim()) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email);

  const handleAssess = async () => {
    if (!formValid) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setResult(generateSampleAssessment());
    setShowLeadCapture(true);
    setIsLoading(false);
    scroll();
  };

  const handleAccessReport = async () => {
    if (!leadValid) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setShowLeadCapture(false);
    setIsLoading(false);
    scroll();
  };

  const handleBack = () => {
    if (step === 2) setIsStarted(false);
    else if (step === 3) {
      setShowLeadCapture(false);
      setResult(null);
    } else if (step === 4) setShowLeadCapture(true);
    scroll();
  };

  const handleRestart = () => {
    setForm({
      organizationDescription: "",
      industry: "",
      companySize: "",
      customerChannels: "",
      internalProcesses: "",
      dataIntelligence: "",
      securityDevOps: "",
    });
    setLead({ name: "", company: "", email: "" });
    setResult(null);
    setIsStarted(false);
    setShowLeadCapture(false);
  };

  return (
    <div
      className="py-20"
      style={{
        background: "linear-gradient(to bottom right, #FEF7F5, #F6F8FF)",
      }}
    >
      <div className="container mx-auto px-4" ref={ref}>
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            How Digitally Mature is Your Organization?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Our digital maturity assessment provides a comprehensive analysis of
            your current digital state and offers tailored recommendations to
            accelerate your transformation journey.
          </p>
          {step > 1 && (
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
        </div>

        {/* ── Step 1: Welcome ── */}
        {!isStarted && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    icon: BrainCircuit,
                    title: "AI-Powered Analysis",
                    desc: "Our trained AI evaluates your digital maturity against DBP Towers",
                  },
                  {
                    icon: Target,
                    title: "DQ Framework",
                    desc: "Based on proven Digital Business Platform methodology",
                  },
                  {
                    icon: Sparkles,
                    title: "Strategic Insights",
                    desc: "Get actionable recommendations and roadmap",
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Icon
                        size={32}
                        strokeWidth={1.5}
                        className="text-[#030F35]"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {title}
                    </h3>
                    <p className="text-gray-600 text-sm">{desc}</p>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <button
                  onClick={() => {
                    setIsStarted(true);
                    scroll();
                  }}
                  className="inline-flex items-center px-8 py-4 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary/80 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Unlock Your Digital Maturity{" "}
                  <ArrowRight size={20} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Assessment Form ── */}
        {isStarted && !showLeadCapture && !result && (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center space-x-2 bg-[#030F35]/10 text-[#030F35] px-4 py-2 rounded-lg text-sm font-medium border border-[#030F35]/20 w-fit mb-6">
              <BrainCircuit className="w-4 h-4" />
              <span>AI-Driven Analysis</span>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="text-center space-y-2 mb-8">
                <h3 className="text-xl font-semibold text-gray-800">
                  Tell Us About Your Organization
                </h3>
                <p className="text-gray-500 text-sm max-w-2xl mx-auto">
                  Complete the guided assessment below. Our AI will analyze your
                  responses across the DQ Digital Business Platform framework.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="space-y-3">
                  <label className={labelCls}>
                    <Building2 className="w-4 h-4 text-gray-600" />
                    <span>Organization Overview</span>
                  </label>
                  <textarea
                    value={form.organizationDescription}
                    onChange={setF("organizationDescription")}
                    placeholder="Brief description of your organization, business model, and current digital transformation stage..."
                    className={inputCls}
                    rows={4}
                  />
                </div>
                <div className="space-y-3">
                  <label className={labelCls}>
                    <Target className="w-4 h-4 text-gray-600" />
                    <span>Industry & Sector</span>
                  </label>
                  <select
                    value={form.industry}
                    onChange={setF("industry")}
                    className={`${inputCls} appearance-none bg-white`}
                    style={selectStyle}
                  >
                    <option value="">Select your industry...</option>
                    {[
                      "Experience 4.0",
                      "Agility 4.0",
                      "Farming 4.0",
                      "Plant 4.0",
                      "Infrastructure 4.0",
                      "Government 4.0",
                      "Hospitality 4.0",
                      "Retail 4.0",
                      "Services 4.0",
                      "Logistics 4.0",
                      "Wellness 4.0",
                      "Other",
                    ].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className={labelCls}>
                    <Users className="w-4 h-4 text-gray-600" />
                    <span>Organization Size</span>
                  </label>
                  <select
                    value={form.companySize}
                    onChange={setF("companySize")}
                    className={`${inputCls} appearance-none bg-white`}
                    style={selectStyle}
                  >
                    <option value="">Select company size...</option>
                    {[
                      "1-50 employees",
                      "51-200 employees",
                      "201-500 employees",
                      "501-1,000 employees",
                      "1,001-5,000 employees",
                      "5,001-10,000 employees",
                      "10,000+ employees",
                    ].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className={labelCls}>
                    <Globe className="w-4 h-4 text-gray-600" />
                    <span>Customer Interaction Channels</span>
                  </label>
                  <textarea
                    value={form.customerChannels}
                    onChange={setF("customerChannels")}
                    placeholder="Describe how customers interact with your business (web, mobile, in-person, etc.)..."
                    className={inputCls}
                    rows={4}
                  />
                </div>
                <div className="space-y-3">
                  <label className={labelCls}>
                    <Cog className="w-4 h-4 text-gray-600" />
                    <span>Internal Processes & Operations</span>
                  </label>
                  <textarea
                    value={form.internalProcesses}
                    onChange={setF("internalProcesses")}
                    placeholder="Describe your internal workflows, automation level, and operational tools..."
                    className={inputCls}
                    rows={4}
                  />
                </div>
                <div className="space-y-3">
                  <label className={labelCls}>
                    <Database className="w-4 h-4 text-gray-600" />
                    <span>Data & Intelligence</span>
                  </label>
                  <textarea
                    value={form.dataIntelligence}
                    onChange={setF("dataIntelligence")}
                    placeholder="Describe your data infrastructure, analytics capabilities, and AI/ML usage..."
                    className={inputCls}
                    rows={4}
                  />
                </div>
                <div className="space-y-3 lg:col-span-2">
                  <label className={labelCls}>
                    <Shield className="w-4 h-4 text-gray-600" />
                    <span>Security & DevOps</span>
                  </label>
                  <textarea
                    value={form.securityDevOps}
                    onChange={setF("securityDevOps")}
                    placeholder="Describe your security posture, DevOps practices, and compliance frameworks..."
                    className={inputCls}
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleAssess}
                  disabled={!formValid || isLoading}
                  className="px-8 py-4 bg-secondary hover:bg-secondary/80 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="w-5 h-5" />
                      <span>Assess My Digital Maturity</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Lead Capture ── */}
        {showLeadCapture && (
          <div className="max-w-2xl mx-auto">
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
                  report.
                </p>
              </div>
              <div className="space-y-6">
                {(["name", "company", "email"] as (keyof LeadData)[]).map(
                  (k) => (
                    <div key={k}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {k === "email"
                          ? "Email Address"
                          : k === "name"
                            ? "Full Name"
                            : "Company"}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type={k === "email" ? "email" : "text"}
                        value={lead[k]}
                        onChange={setL(k)}
                        onBlur={
                          k === "email"
                            ? (e) => {
                                if (
                                  e.target.value &&
                                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                    e.target.value,
                                  )
                                )
                                  setEmailError(
                                    "Please enter a valid email address",
                                  );
                                else setEmailError("");
                              }
                            : undefined
                        }
                        placeholder={
                          k === "name"
                            ? "Enter your full name"
                            : k === "company"
                              ? "Enter your company name"
                              : "Enter your email address"
                        }
                        className={`${inputCls} ${k === "email" && emailError ? "border-red-500" : ""}`}
                      />
                      {k === "email" && emailError && (
                        <p className="mt-1 text-sm text-red-600">
                          {emailError}
                        </p>
                      )}
                    </div>
                  ),
                )}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    By providing your information, you agree to receive your
                    assessment report and occasional updates from
                    DigitalQatalyst. We respect your privacy.
                  </p>
                </div>
                <button
                  onClick={handleAccessReport}
                  disabled={!leadValid || isLoading}
                  className="w-full px-8 py-4 bg-secondary hover:bg-secondary/80 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
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
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Results ── */}
        {result && !showLeadCapture && (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Radar Chart */}
              <div className="xl:col-span-2">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <span
                        className="w-3 h-8 rounded-full mr-3"
                        style={{ backgroundColor: "#08206D" }}
                      />
                      DBP Tower Maturity Profile
                    </h3>
                    <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                      AI-Generated Analysis
                    </div>
                  </div>
                  <div className="h-100 w-full mb-6">
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
                      />
                      <span className="text-gray-700 font-medium">
                        Current Maturity
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-400 opacity-30 rounded-full" />
                      <span className="text-gray-700 font-medium">
                        Target (12 months)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
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
                <div className="bg-linear-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                    Key Metrics
                  </h4>
                  <div className="space-y-3">
                    {result.scores.map((score) => (
                      <div
                        key={score.subject}
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
              </div>
            </div>

            {/* Strategic Pathways */}
            <div className="mt-8">
              <div
                className="text-white p-8 rounded-2xl shadow-xl"
                style={{
                  background:
                    "linear-gradient(to bottom right, #030F35, #1F2F5C, #2E4580)",
                }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center mr-4">
                    <Sparkles className="w-5 h-5 text-[#030F35]" />
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
                  {result.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="shrink-0 w-8 h-8 bg-[#FF6B4D] rounded-lg flex items-center justify-center text-sm font-bold text-white">
                          {i + 1}
                        </div>
                        <p className="text-sm text-gray-100 leading-relaxed">
                          {rec}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleRestart}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    <span>Start New Assessment</span>
                  </button>
                  <Link
                    href="/consultation"
                    className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <span>Get Expert Consultation</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
