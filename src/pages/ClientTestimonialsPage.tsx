import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import { ArrowRight, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

export function ClientTestimonialsPage() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const testimonials = [
    {
      id: "abb",
      company: "ABB",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/ABB_logo.svg/2560px-ABB_logo.svg.png",
      industry: "Industrial Technology",
      location: "Global Operations | EMEA Focus",
      clientType: "Fortune 500 Enterprise",
      badge: "ABB | DBP Design Engagement",
      quote:
        "DigitalQatalyst brought a level of architectural clarity and execution discipline that significantly elevated our Digital Business Products growth agenda. Through their DBP Design engagement, they translated ambition into structured growth drivers, defined a coherent operating model, and provided a practical path from strategy to execution. This was not simply advisory work. It was structured design that positioned us for sustainable digital growth.",
      author: "Dr. Tariq Aslam",
      position: "VP Digital",
      companyName: "ABB EMEA",
      avatar:
        "https://ui-avatars.com/api/?name=Tariq+Aslam&background=030F35&color=fff&size=128&bold=true",
      challenge: {
        title: "The Challenge",
        description:
          "ABB was struggling with aligning their digital strategy across regions, leading to fragmented execution and slower growth in their Digital Business Products division.",
        painPoints: [
          "Fragmented digital strategy across global operations",
          "Lack of structured growth drivers",
          "Unclear operating model for digital initiatives",
          "Slow execution from strategy to implementation",
        ],
      },
      solution: {
        title: "Our Solution",
        approach:
          "We implemented a comprehensive Digital Business Platform (DBP) design engagement, creating a structured roadmap from strategy to execution.",
        services: [
          "DBP Design & Architecture",
          "Operating Model Definition",
          "Growth Strategy Framework",
          "Execution Roadmap Development",
        ],
        methodology: "Structured design approach with architectural clarity",
      },
      results: {
        title: "The Results",
        outcomes: [
          "3x acceleration in digital product development",
          "100% strategic alignment across regions",
          "Coherent operating model established",
          "Clear path from strategy to execution",
        ],
        impact:
          "ABB achieved sustainable digital growth with structured execution discipline and architectural clarity across their Digital Business Products division.",
      },
      highlights: [
        "Architectural clarity and execution discipline",
        "Structured growth drivers",
        "Coherent operating model",
        "Sustainable digital growth",
      ],
    },
    {
      id: "pg",
      company: "Procter & Gamble",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Procter_%26_Gamble_logo.svg/2560px-Procter_%26_Gamble_logo.svg.png",
      industry: "Consumer Goods",
      location: "United Kingdom",
      clientType: "Fortune 500 Enterprise",
      badge: "P&G | Digital Research Operations",
      quote:
        "DigitalQatalyst helped us rethink how research operations can function in a digitally enabled environment. With the structured insights and capability-building approach from DigitalQatalyst, we gained clearer visibility into digital worker tools and how they can practically enhance research performance. The result has been improved efficiency, stronger clarity on digital priorities, and a more future-ready research function.",
      author: "Cho Edwards",
      position: "Product Manager",
      companyName: "Procter & Gamble (UK)",
      avatar:
        "https://ui-avatars.com/api/?name=Cho+Edwards&background=030F35&color=fff&size=128&bold=true",
      challenge: {
        title: "The Challenge",
        description:
          "P&G needed to modernize their research operations to function effectively in a digitally enabled environment with better visibility into digital worker tools.",
        painPoints: [
          "Traditional research operations lacking digital integration",
          "Limited visibility into digital worker tools",
          "Unclear digital priorities for research function",
          "Need for capability building in digital tools",
        ],
      },
      solution: {
        title: "Our Solution",
        approach:
          "We provided structured insights and capability-building programs to transform research operations with digital worker tools.",
        services: [
          "Digital Research Operations Assessment",
          "Digital Worker Tools Evaluation",
          "Capability Building Programs",
          "Digital Priorities Framework",
        ],
        methodology:
          "Structured insights approach with hands-on capability building",
      },
      results: {
        title: "The Results",
        outcomes: [
          "45% improvement in research operational efficiency",
          "Clear visibility into digital worker tools",
          "Stronger clarity on digital priorities",
          "Future-ready research function established",
        ],
        impact:
          "P&G transformed their research operations with improved efficiency, clear digital priorities, and a future-ready approach to digital worker tools.",
      },
      highlights: [
        "Rethinking research operations",
        "Structured insights and capability-building",
        "Improved efficiency",
        "Future-ready research function",
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-secondary-900 via-secondary-800 to-secondary-700 text-white py-32 overflow-hidden">
          {/* Background image with overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(3, 15, 53, 0.85), rgba(3, 15, 53, 0.85)), url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple/20 mix-blend-multiply"></div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
                Trusted by Industry Leaders
                <span className="block text-white mt-2">
                  Driving Real Results
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                Discover how leading organizations partner with us to achieve
                breakthrough digital transformation results through proven
                methodologies and strategic excellence
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  What Our Clients Say
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Discover how our strategic approach and expertise have helped
                  organizations achieve breakthrough results
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div className="p-8">
                      {/* Header with Badge */}
                      <div className="flex flex-col items-start mb-6 gap-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {testimonial.company}
                          </h3>
                          <span className="text-sm text-gray-600">
                            {testimonial.industry}
                          </span>
                        </div>
                        <span className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-full shadow-sm">
                          {testimonial.badge}
                        </span>
                      </div>

                      {/* Testimonial Quote - Preview */}
                      <div className="mb-6">
                        <div className="text-5xl text-primary/20 mb-3 leading-none">
                          "
                        </div>
                        <blockquote
                          className={`text-lg text-gray-800 leading-relaxed font-light italic ${expandedId === testimonial.id ? "" : "line-clamp-4"}`}
                        >
                          {testimonial.quote}
                        </blockquote>
                      </div>

                      {/* Author Info */}
                      <div className="flex items-center gap-4 mb-6 pt-4 border-t border-gray-200">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.author}
                          className="w-12 h-12 rounded-full object-cover border border-gray-200"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const fallback = e.currentTarget
                              .nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                        <div className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center text-gray-600 text-sm font-medium hidden border border-gray-200">
                          {testimonial.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">
                            {testimonial.author}
                          </div>
                          <div className="text-gray-600 text-sm">
                            {testimonial.position}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {testimonial.companyName}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {expandedId === testimonial.id && (
                        <div className="mt-6 pt-6 border-t border-gray-200 space-y-6 animate-fadeIn">
                          {/* Client Overview */}
                          <div className="bg-gradient-to-br from-secondary-50 to-white rounded-xl p-6 border border-gray-200">
                            <h4 className="text-lg font-bold text-gray-900 mb-4">
                              Client Overview
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-semibold text-gray-700">
                                  Industry:
                                </span>
                                <span className="text-gray-600 ml-2">
                                  {testimonial.industry}
                                </span>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700">
                                  Location:
                                </span>
                                <span className="text-gray-600 ml-2">
                                  {testimonial.location}
                                </span>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700">
                                  Client Type:
                                </span>
                                <span className="text-gray-600 ml-2">
                                  {testimonial.clientType}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* The Challenge */}
                          <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <h4 className="text-lg font-bold text-gray-900 mb-3">
                              {testimonial.challenge.title}
                            </h4>
                            <p className="text-gray-700 mb-4 leading-relaxed">
                              {testimonial.challenge.description}
                            </p>
                            <div className="space-y-2">
                              <p className="font-semibold text-gray-700 text-sm mb-2">
                                Key Pain Points:
                              </p>
                              {testimonial.challenge.painPoints.map(
                                (point, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-2 text-gray-600 text-sm"
                                  >
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                    <span>{point}</span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>

                          {/* Our Solution */}
                          <div className="bg-gradient-to-br from-primary/5 to-white rounded-xl p-6 border border-primary/20">
                            <h4 className="text-lg font-bold text-gray-900 mb-3">
                              {testimonial.solution.title}
                            </h4>
                            <p className="text-gray-700 mb-4 leading-relaxed">
                              {testimonial.solution.approach}
                            </p>
                            <div className="mb-4">
                              <p className="font-semibold text-gray-700 text-sm mb-3">
                                Services Provided:
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {testimonial.solution.services.map(
                                  (service, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-2 text-gray-700 text-sm bg-white rounded-lg px-3 py-2"
                                    >
                                      <CheckCircle
                                        className="text-primary flex-shrink-0"
                                        size={16}
                                      />
                                      <span>{service}</span>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                              <p className="font-semibold text-gray-700 text-sm mb-1">
                                Methodology:
                              </p>
                              <p className="text-gray-600 text-sm">
                                {testimonial.solution.methodology}
                              </p>
                            </div>
                          </div>

                          {/* The Results */}
                          <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-200">
                            <h4 className="text-lg font-bold text-gray-900 mb-3">
                              {testimonial.results.title}
                            </h4>
                            <div className="space-y-3 mb-4">
                              {testimonial.results.outcomes.map(
                                (outcome, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-3 bg-white rounded-lg p-3"
                                  >
                                    <CheckCircle
                                      className="text-green-600 flex-shrink-0 mt-0.5"
                                      size={20}
                                    />
                                    <span className="text-gray-700">
                                      {outcome}
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                            <div className="bg-white rounded-lg p-4 border-l-4 border-green-600">
                              <p className="font-semibold text-gray-700 text-sm mb-2">
                                Overall Impact:
                              </p>
                              <p className="text-gray-700 leading-relaxed">
                                {testimonial.results.impact}
                              </p>
                            </div>
                          </div>

                          {/* CTA */}
                          <div className="bg-gradient-to-r from-secondary-900 to-secondary-800 rounded-xl p-6 text-white text-center">
                            <h4 className="text-xl font-bold mb-3">
                              Ready to Achieve Similar Results?
                            </h4>
                            <p className="text-white/90 mb-4">
                              Let's discuss how we can help transform your
                              organization
                            </p>
                            <button
                              onClick={() => navigate("/consultation")}
                              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg"
                            >
                              Get in Touch
                              <ArrowRight size={18} />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Read More Button */}
                      <button
                        onClick={() => toggleExpand(testimonial.id)}
                        className="mt-6 inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                      >
                        {expandedId === testimonial.id
                          ? "Show Less"
                          : "Read More"}
                        {expandedId === testimonial.id ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-700 text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-2xl"></div>
          </div>

          {/* Geometric Pattern Overlay */}
          <div className="absolute inset-0 opacity-5">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="grid-cta"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid-cta)" />
            </svg>
          </div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
                Ready for Your
                <span className="block text-white mt-2">
                  Digital Transformation?
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
                Join leading organizations achieving breakthrough results
                through proven methodologies and strategic excellence
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate("/consultation")}
                  className="px-10 py-5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all duration-300 shadow-2xl hover:shadow-primary/50 hover:scale-105 inline-flex items-center gap-3 text-lg"
                >
                  Get in Touch Today
                  <ArrowRight size={24} />
                </button>
                <button
                  onClick={() => navigate("/services")}
                  className="px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl transition-all duration-300 border-2 border-white/30 hover:border-white/50 inline-flex items-center gap-3 text-lg"
                >
                  Explore Our Services
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
