import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import {
  ArrowLeft,
  CheckCircle,
  Users,
  Target,
  Lightbulb,
  BarChart3,
  Rocket,
} from "lucide-react";

export function PGCaseStudy() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-brand-navy to-blue-900 text-white py-20">
          <div className="container mx-auto px-4 md:px-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft size={20} />
              Back
            </button>

            <div className="max-w-4xl">
              <div className="inline-block px-4 py-2 bg-brand-coral text-white text-sm font-semibold rounded-full mb-6">
                Case Study
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Procter & Gamble | Digital Research Operations
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Transforming research operations through digital worker tools
                and capability building for enhanced performance
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-3xl font-bold text-brand-coral mb-2">
                    45%
                  </div>
                  <div className="text-sm text-white/80">
                    Efficiency Improvement
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-3xl font-bold text-brand-coral mb-2">
                    8 Weeks
                  </div>
                  <div className="text-sm text-white/80">
                    Transformation Timeline
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-3xl font-bold text-brand-coral mb-2">
                    100+
                  </div>
                  <div className="text-sm text-white/80">
                    Researchers Enabled
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Client Testimonial */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                <div className="text-6xl text-brand-coral mb-6">"</div>
                <blockquote className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-8 italic">
                  DigitalQatalyst helped us rethink how research operations can
                  function in a digitally enabled environment. With the
                  structured insights and capability-building approach from
                  DigitalQatalyst, we gained clearer visibility into digital
                  worker tools and how they can practically enhance research
                  performance. The result has been improved efficiency, stronger
                  clarity on digital priorities, and a more future-ready
                  research function.
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-brand-navy rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    CE
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Cho Edwards</div>
                    <div className="text-gray-600">
                      Product Manager | Procter & Gamble (UK)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Challenge Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The Challenge
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Procter & Gamble's research operations team faced the
                  challenge of modernizing their research function to leverage
                  digital technologies effectively. The organization needed to:
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <Target
                      className="text-brand-coral mt-1 flex-shrink-0"
                      size={20}
                    />
                    <span>
                      Rethink traditional research operations for a digitally
                      enabled environment
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Target
                      className="text-brand-coral mt-1 flex-shrink-0"
                      size={20}
                    />
                    <span>
                      Gain visibility into digital worker tools and their
                      practical applications
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Target
                      className="text-brand-coral mt-1 flex-shrink-0"
                      size={20}
                    />
                    <span>
                      Build internal capabilities to leverage digital tools
                      effectively
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Target
                      className="text-brand-coral mt-1 flex-shrink-0"
                      size={20}
                    />
                    <span>
                      Establish clear digital priorities for research
                      performance enhancement
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Target
                      className="text-brand-coral mt-1 flex-shrink-0"
                      size={20}
                    />
                    <span>
                      Create a future-ready research function that drives
                      innovation
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Approach
              </h2>
              <p className="text-gray-700 leading-relaxed mb-8">
                DigitalQatalyst delivered a comprehensive digital research
                operations transformation through structured insights and
                capability building:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                    <Lightbulb className="text-brand-coral" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Structured Insights
                  </h3>
                  <p className="text-gray-700">
                    Provided comprehensive analysis of digital worker tools and
                    their applications in research operations, delivering
                    actionable insights for transformation.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="text-brand-coral" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Capability Building
                  </h3>
                  <p className="text-gray-700">
                    Developed internal capabilities through training and
                    hands-on enablement, ensuring the team could effectively
                    leverage digital tools.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="text-brand-coral" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Digital Worker Tools Assessment
                  </h3>
                  <p className="text-gray-700">
                    Evaluated and recommended digital worker tools that could
                    practically enhance research performance and operational
                    efficiency.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                    <Rocket className="text-brand-coral" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Digital Priorities Framework
                  </h3>
                  <p className="text-gray-700">
                    Established clear digital priorities and roadmap for
                    research operations, ensuring focused investment and
                    measurable outcomes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Initiatives Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Key Initiatives
              </h2>
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-brand-coral">
                  <h3 className="font-bold text-gray-900 mb-2">
                    Digital Worker Tools Implementation
                  </h3>
                  <p className="text-gray-700">
                    Deployed AI-powered research assistants, automated data
                    collection tools, and collaborative platforms that enhanced
                    researcher productivity and enabled real-time insights.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-brand-coral">
                  <h3 className="font-bold text-gray-900 mb-2">
                    Research Operations Redesign
                  </h3>
                  <p className="text-gray-700">
                    Reimagined research workflows to leverage digital
                    capabilities, eliminating manual processes and enabling
                    researchers to focus on high-value analysis and innovation.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-brand-coral">
                  <h3 className="font-bold text-gray-900 mb-2">
                    Capability Development Program
                  </h3>
                  <p className="text-gray-700">
                    Delivered comprehensive training and enablement programs
                    that built digital literacy and tool proficiency across the
                    research team.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-brand-coral">
                  <h3 className="font-bold text-gray-900 mb-2">
                    Performance Measurement Framework
                  </h3>
                  <p className="text-gray-700">
                    Established metrics and KPIs to track research efficiency,
                    quality, and innovation outcomes, ensuring continuous
                    improvement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The Impact
              </h2>
              <p className="text-gray-700 leading-relaxed mb-8">
                The digital research operations transformation delivered
                significant improvements across efficiency, clarity, and future
                readiness:
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 bg-green-50 rounded-lg p-6">
                  <CheckCircle
                    className="text-green-600 flex-shrink-0 mt-1"
                    size={24}
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Improved Operational Efficiency
                    </h3>
                    <p className="text-gray-700">
                      Achieved 45% improvement in research operational
                      efficiency through digital worker tools and optimized
                      workflows, enabling faster insights and decision-making.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-green-50 rounded-lg p-6">
                  <CheckCircle
                    className="text-green-600 flex-shrink-0 mt-1"
                    size={24}
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Stronger Digital Clarity
                    </h3>
                    <p className="text-gray-700">
                      Gained clear visibility into digital priorities and tool
                      applications, ensuring focused investments and strategic
                      alignment across research operations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-green-50 rounded-lg p-6">
                  <CheckCircle
                    className="text-green-600 flex-shrink-0 mt-1"
                    size={24}
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Enhanced Research Performance
                    </h3>
                    <p className="text-gray-700">
                      Elevated research quality and output through practical
                      application of digital worker tools, enabling deeper
                      insights and faster innovation cycles.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-green-50 rounded-lg p-6">
                  <CheckCircle
                    className="text-green-600 flex-shrink-0 mt-1"
                    size={24}
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Future-Ready Research Function
                    </h3>
                    <p className="text-gray-700">
                      Established a digitally enabled research function with
                      built-in capabilities for continuous evolution and
                      adaptation to emerging technologies.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-green-50 rounded-lg p-6">
                  <CheckCircle
                    className="text-green-600 flex-shrink-0 mt-1"
                    size={24}
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Empowered Research Team
                    </h3>
                    <p className="text-gray-700">
                      Built strong digital capabilities across 100+ researchers,
                      creating a culture of innovation and continuous learning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-brand-navy text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Transform Your Research Operations
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Discover how we can help you leverage digital worker tools and
                build capabilities for enhanced research performance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/request-demo")}
                  className="px-8 py-4 bg-brand-coral hover:bg-brand-coral/90 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Schedule a Consultation
                </button>
                <button
                  onClick={() => navigate("/client-testimonials")}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-300 border border-white/30"
                >
                  View More Case Studies
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
