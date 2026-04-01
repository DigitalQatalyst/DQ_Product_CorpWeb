import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import {
  ArrowRight,
  TrendingUp,
  Users,
  Zap,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Target,
} from "lucide-react";
import { useState } from "react";

export function CaseStudiesPage() {
  const navigate = useNavigate();
  const [expandedStudy, setExpandedStudy] = useState<string | null>(null);

  const toggleStudy = (studyId: string) => {
    setExpandedStudy(expandedStudy === studyId ? null : studyId);
  };

  const caseStudies = [
    {
      id: "abb",
      title: "ABB | DBP Design Engagement",
      company: "ABB",
      industry: "Industrial Technology",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/ABB_logo.svg/2560px-ABB_logo.svg.png",
      description:
        "Transforming digital ambition into structured growth through architectural clarity and execution discipline.",
      testimonial: {
        quote:
          "Digital Qatalyst brought architectural clarity and execution discipline that significantly elevated our Digital Business Products growth agenda. They translated ambition into structured growth drivers, defined a coherent operating model, and provided a practical path from strategy to execution. This was not simply advisory work; it was structured design that positioned us for sustainable digital growth.",
        author: "Dr. Tariq Aslam",
        position: "VP Digital | ABB EMEA",
        avatar:
          "https://ui-avatars.com/api/?name=Tariq+Aslam&background=030F35&color=fff&size=128&bold=true",
      },
      metrics: [
        { label: "Growth Acceleration", value: "3x" },
        { label: "Implementation", value: "6 Months" },
        { label: "Strategic Alignment", value: "100%" },
      ],
      tags: ["Digital Transformation", "Operating Model", "Growth Strategy"],
      challenge: [
        "Translate high-level digital transformation ambitions into structured, actionable growth drivers",
        "Define a coherent operating model that aligned with their strategic vision",
        "Create a practical roadmap from strategy to execution",
        "Establish sustainable digital growth foundations",
      ],
      solution: [
        {
          title: "Architectural Clarity",
          description:
            "Designed a clear digital architecture that aligned technology capabilities with business objectives.",
        },
        {
          title: "Execution Discipline",
          description:
            "Established rigorous execution frameworks and governance structures for consistent delivery.",
        },
        {
          title: "Structured Growth Drivers",
          description:
            "Identified and structured key growth drivers with clear ownership, timelines, and success metrics.",
        },
        {
          title: "Operating Model Design",
          description:
            "Defined a coherent operating model integrating people, processes, and technology.",
        },
      ],
      impact: [
        "Successfully aligned digital initiatives with business strategy",
        "Reduced digital product development cycles",
        "Established scalable operating models and governance structures",
        "Built internal capabilities for consistent execution",
      ],
    },
    {
      id: "pg",
      title: "Procter & Gamble | Digital Research Operations",
      company: "Procter & Gamble",
      industry: "Consumer Goods",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Procter_%26_Gamble_logo.svg/2560px-Procter_%26_Gamble_logo.svg.png",
      description:
        "Transforming research operations through digital worker tools and capability building for enhanced performance.",
      testimonial: {
        quote:
          "Digital Qatalyst helped us rethink how research operations can function in a digitally enabled environment. With the structured insights and capability-building approach from Digital Qatalyst, we gained clearer visibility into digital worker tools and how they can practically enhance research performance. The result has been improved efficiency, stronger clarity on digital priorities, and a more future-ready research function.",
        author: "Cho Edwards",
        position: "Product Manager | Procter & Gamble (UK)",
        avatar:
          "https://ui-avatars.com/api/?name=Cho+Edwards&background=030F35&color=fff&size=128&bold=true",
      },
      metrics: [
        { label: "Efficiency Improvement", value: "45%" },
        { label: "Timeline", value: "8 Weeks" },
        { label: "Researchers Enabled", value: "100+" },
      ],
      tags: [
        "Digital Worker Tools",
        "Research Operations",
        "Capability Building",
      ],
      challenge: [
        "Rethink traditional research operations for a digitally enabled environment",
        "Gain visibility into digital worker tools and their practical applications",
        "Build internal capabilities to leverage digital tools effectively",
        "Establish clear digital priorities for research performance enhancement",
      ],
      solution: [
        {
          title: "Structured Insights",
          description:
            "Provided comprehensive analysis of digital worker tools and their applications in research operations.",
        },
        {
          title: "Capability Building",
          description:
            "Developed internal capabilities through training and hands-on enablement programs.",
        },
        {
          title: "Digital Worker Tools Assessment",
          description:
            "Evaluated and recommended tools that could practically enhance research performance.",
        },
        {
          title: "Digital Priorities Framework",
          description:
            "Established clear digital priorities and roadmap for research operations.",
        },
      ],
      impact: [
        "Achieved 45% improvement in research operational efficiency",
        "Gained clear visibility into digital priorities and tool applications",
        "Elevated research quality and output through digital tools",
        "Built strong digital capabilities across 100+ researchers",
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-brand-navy via-blue-900 to-brand-navy text-white py-28 overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "40px 40px",
              }}
            ></div>
          </div>

          {/* Gradient overlays for depth */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-coral/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block px-5 py-2 bg-brand-coral/20 backdrop-blur-sm border border-brand-coral/30 rounded-full mb-6 shadow-lg">
                <span className="text-brand-coral font-semibold text-sm tracking-wide">
                  CLIENT TESTIMONIALS
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Hear From Our
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-coral to-orange-400 mt-2">
                  Clients
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
                Real stories from organizations we've helped transform through
                strategic clarity, execution excellence, and sustainable growth
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-coral rounded-full animate-pulse"></div>
                  <span className="text-white/90 font-medium">
                    Fortune 500 Clients
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-coral rounded-full animate-pulse"></div>
                  <span className="text-white/90 font-medium">
                    Global Reach
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-coral rounded-full animate-pulse"></div>
                  <span className="text-white/90 font-medium">
                    Proven Methodologies
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Expertise Banner */}
        <section className="py-12 bg-gradient-to-r from-gray-50 to-white border-y border-gray-200">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left flex-1">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <div className="w-8 h-1 bg-brand-coral rounded-full"></div>
                    <span className="text-brand-coral font-semibold text-sm tracking-wide">
                      OUR TRACK RECORD
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Trusted by Industry Leaders
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Delivering transformative outcomes through strategic design
                    and execution discipline
                  </p>
                </div>
                <div className="flex items-center gap-8 bg-white rounded-xl shadow-lg px-8 py-6 border border-gray-100">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-brand-coral mb-1">
                      150+
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      Projects Delivered
                    </div>
                  </div>
                  <div className="w-px h-16 bg-gray-200"></div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-brand-coral mb-1">
                      98%
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      Client Satisfaction
                    </div>
                  </div>
                  <div className="w-px h-16 bg-gray-200"></div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-brand-coral mb-1">
                      50+
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      Global Clients
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 mb-4">
                  <div className="w-8 h-1 bg-brand-coral rounded-full"></div>
                  <span className="text-brand-coral font-semibold text-sm tracking-wide">
                    TESTIMONIALS
                  </span>
                  <div className="w-8 h-1 bg-brand-coral rounded-full"></div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  What Our Clients Say
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Discover how our strategic approach and expertise have helped
                  organizations achieve breakthrough results
                </p>
              </div>

              <div className="space-y-8">
                {caseStudies.map((study) => (
                  <div
                    key={study.id}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
                  >
                    {/* Summary Card */}
                    <div className="p-8 md:p-10 bg-gradient-to-br from-white via-gray-50 to-white">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-6">
                            {/* Company Logo */}
                            <div className="h-16 flex items-center bg-white px-6 py-3 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                              <img
                                src={study.logo}
                                alt={`${study.company} logo`}
                                className="h-full w-auto object-contain max-w-[120px]"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                            <span className="px-4 py-1.5 bg-brand-coral text-white text-xs font-bold rounded-full shadow-sm">
                              {study.industry}
                            </span>
                          </div>
                          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                            {study.title}
                          </h3>
                          <p className="text-gray-700 text-lg leading-relaxed mb-4">
                            {study.description}
                          </p>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-200">
                        {study.metrics.map((metric, index) => (
                          <div
                            key={index}
                            className="text-center bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                          >
                            <div className="text-4xl md:text-5xl font-bold text-brand-coral mb-2">
                              {metric.value}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {study.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Expand Button */}
                      <button
                        onClick={() => toggleStudy(study.id)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-coral text-white font-semibold rounded-lg hover:bg-brand-coral/90 hover:gap-3 transition-all shadow-md hover:shadow-lg"
                      >
                        {expandedStudy === study.id
                          ? "Show Less"
                          : "Read Full Case Study"}
                        {expandedStudy === study.id ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>
                    </div>

                    {/* Expanded Content */}
                    {expandedStudy === study.id && (
                      <div className="border-t border-gray-200 bg-gray-50">
                        {/* Testimonial */}
                        <div className="p-10 md:p-12 bg-gradient-to-br from-brand-navy to-blue-900 text-white">
                          <div className="max-w-4xl mx-auto">
                            <div className="text-7xl text-brand-coral mb-6 leading-none">
                              "
                            </div>
                            <blockquote className="text-xl md:text-2xl text-white/95 leading-relaxed mb-8 font-light">
                              {study.testimonial.quote}
                            </blockquote>
                            <div className="flex items-center gap-5 pt-6 border-t border-white/20">
                              <img
                                src={study.testimonial.avatar}
                                alt={study.testimonial.author}
                                className="w-20 h-20 rounded-full object-cover border-4 border-brand-coral shadow-lg"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                  const fallback = e.currentTarget
                                    .nextElementSibling as HTMLElement;
                                  if (fallback) fallback.style.display = "flex";
                                }}
                              />
                              <div className="w-20 h-20 bg-brand-coral rounded-full items-center justify-center text-white text-xl font-bold hidden border-4 border-white/20 shadow-lg">
                                {study.testimonial.author
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <div className="font-bold text-white text-lg">
                                  {study.testimonial.author}
                                </div>
                                <div className="text-white/80">
                                  {study.testimonial.position}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Challenge */}
                        <div className="p-10 md:p-12 bg-gray-50">
                          <div className="max-w-4xl mx-auto">
                            <div className="inline-flex items-center gap-2 mb-4">
                              <div className="w-8 h-1 bg-brand-coral rounded-full"></div>
                              <span className="text-brand-coral font-semibold text-sm tracking-wide">
                                THE CHALLENGE
                              </span>
                            </div>
                            <h4 className="text-3xl font-bold text-gray-900 mb-8">
                              Understanding the Complexity
                            </h4>
                            <ul className="space-y-4">
                              {study.challenge.map((item, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-4 text-gray-700 bg-white rounded-lg p-5 shadow-sm border border-gray-100"
                                >
                                  <Target
                                    className="text-brand-coral mt-1 flex-shrink-0"
                                    size={24}
                                  />
                                  <span className="text-lg">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Solution */}
                        <div className="p-10 md:p-12 bg-white">
                          <div className="max-w-4xl mx-auto">
                            <div className="inline-flex items-center gap-2 mb-4">
                              <div className="w-8 h-1 bg-brand-coral rounded-full"></div>
                              <span className="text-brand-coral font-semibold text-sm tracking-wide">
                                OUR APPROACH
                              </span>
                            </div>
                            <h4 className="text-3xl font-bold text-gray-900 mb-8">
                              Strategic Design & Execution Excellence
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {study.solution.map((item, index) => (
                                <div
                                  key={index}
                                  className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-7 border border-gray-200 hover:shadow-lg transition-shadow"
                                >
                                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                                    <div className="w-6 h-6 bg-brand-coral rounded"></div>
                                  </div>
                                  <h5 className="font-bold text-gray-900 mb-3 text-lg">
                                    {item.title}
                                  </h5>
                                  <p className="text-gray-700 leading-relaxed">
                                    {item.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Impact */}
                        <div className="p-10 md:p-12 bg-gradient-to-br from-green-50 to-emerald-50">
                          <div className="max-w-4xl mx-auto">
                            <div className="inline-flex items-center gap-2 mb-4">
                              <div className="w-8 h-1 bg-green-600 rounded-full"></div>
                              <span className="text-green-700 font-semibold text-sm tracking-wide">
                                THE IMPACT
                              </span>
                            </div>
                            <h4 className="text-3xl font-bold text-gray-900 mb-8">
                              Measurable Transformation
                            </h4>
                            <div className="space-y-4">
                              {study.impact.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-sm border border-green-100"
                                >
                                  <CheckCircle
                                    className="text-green-600 flex-shrink-0 mt-1"
                                    size={24}
                                  />
                                  <span className="text-gray-700 text-lg">
                                    {item}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Thought Leadership Section */}
        <section className="py-20 bg-gradient-to-br from-brand-navy to-blue-900 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-block px-5 py-2 bg-brand-coral/20 backdrop-blur-sm border border-brand-coral/30 rounded-full mb-6">
                  <span className="text-brand-coral font-semibold text-sm tracking-wide">
                    OUR METHODOLOGY
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  The DigitalQatalyst Difference
                </h2>
                <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                  We don't just advise—we architect, design, and execute digital
                  transformations that deliver sustainable competitive advantage
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="w-14 h-14 bg-brand-coral rounded-xl flex items-center justify-center mb-6">
                    <Target className="text-white" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Strategic Clarity</h3>
                  <p className="text-white/80 leading-relaxed">
                    We translate ambition into structured, actionable strategies
                    with clear ownership, timelines, and success metrics that
                    align with your business objectives.
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="w-14 h-14 bg-brand-coral rounded-xl flex items-center justify-center mb-6">
                    <CheckCircle className="text-white" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    Execution Excellence
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    Our rigorous frameworks and governance structures ensure
                    consistent delivery, turning strategic vision into
                    measurable business outcomes.
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="w-14 h-14 bg-brand-coral rounded-xl flex items-center justify-center mb-6">
                    <TrendingUp className="text-white" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    Sustainable Growth
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    We build internal capabilities and scalable operating models
                    that enable your organization to sustain momentum long after
                    our engagement.
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="w-14 h-14 bg-brand-coral rounded-xl flex items-center justify-center mb-6">
                    <Users className="text-white" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    Capability Building
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    Through hands-on enablement and structured training, we
                    elevate your team's digital capabilities to drive continuous
                    improvement and innovation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 mb-4">
                  <div className="w-8 h-1 bg-brand-coral rounded-full"></div>
                  <span className="text-brand-coral font-semibold text-sm tracking-wide">
                    OUR IMPACT
                  </span>
                  <div className="w-8 h-1 bg-brand-coral rounded-full"></div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Driving Excellence Across Industries
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Delivering measurable value through strategic insight and
                  execution mastery
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="w-20 h-20 bg-gradient-to-br from-brand-coral to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <TrendingUp className="text-white" size={36} />
                  </div>
                  <div className="text-5xl font-bold text-gray-900 mb-3">
                    150+
                  </div>
                  <div className="text-gray-600 font-medium text-lg">
                    Successful Transformations
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    Across multiple industries and geographies
                  </p>
                </div>
                <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="w-20 h-20 bg-gradient-to-br from-brand-coral to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Users className="text-white" size={36} />
                  </div>
                  <div className="text-5xl font-bold text-gray-900 mb-3">
                    50+
                  </div>
                  <div className="text-gray-600 font-medium text-lg">
                    Global Clients
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    Including Fortune 500 companies
                  </p>
                </div>
                <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="w-20 h-20 bg-gradient-to-br from-brand-coral to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Zap className="text-white" size={36} />
                  </div>
                  <div className="text-5xl font-bold text-gray-900 mb-3">
                    40%
                  </div>
                  <div className="text-gray-600 font-medium text-lg">
                    Average Efficiency Gain
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    Measured across client engagements
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 bg-gradient-to-br from-brand-navy via-blue-900 to-brand-navy text-white overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "40px 40px",
              }}
            ></div>
          </div>

          {/* Gradient overlays */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-coral/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block px-5 py-2 bg-brand-coral/20 backdrop-blur-sm border border-brand-coral/30 rounded-full mb-6">
                <span className="text-brand-coral font-semibold text-sm tracking-wide">
                  START YOUR TRANSFORMATION
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Ready to Become Our
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-coral to-orange-400 mt-2">
                  Next Success Story?
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
                Join leading organizations achieving breakthrough results
                through proven methodologies and strategic excellence
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate("/request-demo")}
                  className="px-10 py-5 bg-brand-coral hover:bg-brand-coral/90 text-white font-bold rounded-xl transition-all duration-300 shadow-2xl hover:shadow-brand-coral/50 hover:scale-105 inline-flex items-center gap-3 text-lg"
                >
                  Schedule a Consultation
                  <ArrowRight size={24} />
                </button>
                <button
                  onClick={() => navigate("/marketplace/dtmi")}
                  className="px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl transition-all duration-300 border-2 border-white/30 hover:border-white/50 inline-flex items-center gap-3 text-lg"
                >
                  Explore Our Insights
                </button>
              </div>
              <p className="text-white/70 text-sm mt-8">
                Join 50+ global organizations achieving breakthrough results
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
