import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import {
  ArrowLeft,
  CheckCircle,
  TrendingUp,
  Users,
  Target,
  Zap,
} from "lucide-react";

export function ABBCaseStudy() {
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
                ABB | DBP Design Engagement
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Transforming digital ambition into structured growth through
                architectural clarity and execution discipline
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-3xl font-bold text-brand-coral mb-2">
                    3x
                  </div>
                  <div className="text-sm text-white/80">
                    Growth Acceleration
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-3xl font-bold text-brand-coral mb-2">
                    6 Months
                  </div>
                  <div className="text-sm text-white/80">
                    Implementation Timeline
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-3xl font-bold text-brand-coral mb-2">
                    100%
                  </div>
                  <div className="text-sm text-white/80">
                    Strategic Alignment
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
                  Digital Qatalyst brought architectural clarity and execution
                  discipline that significantly elevated our Digital Business
                  Products growth agenda. They translated ambition into
                  structured growth drivers, defined a coherent operating model,
                  and provided a practical path from strategy to execution. This
                  was not simply advisory work; it was structured design that
                  positioned us for sustainable digital growth.
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-brand-navy rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    TA
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      Dr. Tariq Aslam
                    </div>
                    <div className="text-gray-600">VP Digital | ABB EMEA</div>
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
                  ABB, a global leader in industrial technology, faced the
                  challenge of transforming their digital ambitions into
                  concrete, executable strategies for their Digital Business
                  Products (DBP) division. The organization needed to:
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <Target
                      className="text-brand-coral mt-1 flex-shrink-0"
                      size={20}
                    />
                    <span>
                      Translate high-level digital transformation ambitions into
                      structured, actionable growth drivers
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Target
                      className="text-brand-coral mt-1 flex-shrink-0"
                      size={20}
                    />
                    <span>
                      Define a coherent operating model that aligned with their
                      strategic vision
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Target
                      className="text-brand-coral mt-1 flex-shrink-0"
                      size={20}
                    />
                    <span>
                      Create a practical roadmap from strategy to execution
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Target
                      className="text-brand-coral mt-1 flex-shrink-0"
                      size={20}
                    />
                    <span>
                      Establish sustainable digital growth foundations
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
                DigitalQatalyst delivered a comprehensive DBP Design Engagement
                that went beyond traditional advisory services, providing
                structured design and execution frameworks:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="text-brand-coral" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Architectural Clarity
                  </h3>
                  <p className="text-gray-700">
                    Designed a clear digital architecture that aligned
                    technology capabilities with business objectives, ensuring
                    every component served strategic growth goals.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle className="text-brand-coral" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Execution Discipline
                  </h3>
                  <p className="text-gray-700">
                    Established rigorous execution frameworks and governance
                    structures to ensure consistent delivery and measurable
                    progress toward digital transformation goals.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="text-brand-coral" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Structured Growth Drivers
                  </h3>
                  <p className="text-gray-700">
                    Identified and structured key growth drivers, translating
                    ambition into concrete initiatives with clear ownership,
                    timelines, and success metrics.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-brand-coral/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="text-brand-coral" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Operating Model Design
                  </h3>
                  <p className="text-gray-700">
                    Defined a coherent operating model that integrated people,
                    processes, and technology to support sustainable digital
                    business growth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The Impact
              </h2>
              <p className="text-gray-700 leading-relaxed mb-8">
                The engagement delivered transformative results that positioned
                ABB's Digital Business Products division for sustainable growth:
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 bg-green-50 rounded-lg p-6">
                  <CheckCircle
                    className="text-green-600 flex-shrink-0 mt-1"
                    size={24}
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Strategic Alignment Achieved
                    </h3>
                    <p className="text-gray-700">
                      Successfully aligned digital initiatives with business
                      strategy, ensuring every investment contributed to
                      measurable growth objectives.
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
                      Accelerated Time-to-Market
                    </h3>
                    <p className="text-gray-700">
                      Reduced digital product development cycles through
                      structured design processes and clear execution
                      frameworks.
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
                      Sustainable Growth Foundation
                    </h3>
                    <p className="text-gray-700">
                      Established scalable operating models and governance
                      structures that support long-term digital business
                      expansion.
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
                      Enhanced Execution Capability
                    </h3>
                    <p className="text-gray-700">
                      Built internal capabilities and discipline for consistent
                      execution, moving from strategy to implementation with
                      confidence.
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
                Ready to Transform Your Digital Ambitions?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Let's discuss how we can bring architectural clarity and
                execution discipline to your digital transformation journey.
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
