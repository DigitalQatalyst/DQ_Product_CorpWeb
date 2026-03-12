import { Target, BookOpen, Rocket, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function WhyDtmiMatters() {
  const navigate = useNavigate();
  const benefits = [
    {
      icon: Target,
      title: "Informed Decisions",
      description:
        "Leverage expert research to make confident, data-driven decisions that guide your strategic direction.",
    },
    {
      icon: BookOpen,
      title: "Practical Strategies",
      description:
        "Access proven strategies through real-world case studies that showcase successful digital transformation.",
    },
    {
      icon: Rocket,
      title: "Future-Proof Solutions",
      description:
        "Unlock insights on emerging technologies and frameworks to keep your business adaptable and scalable.",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why DTMI Matters
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            DTMI bridges the gap between emerging technologies and real-world
            applications, empowering businesses with strategic insights for
            informed, future-proof decisions.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 flex flex-col h-full group"
              >
                <div className="flex items-center justify-center w-12 h-12 mb-6">
                  <Icon
                    size={24}
                    className="text-gray-700 transition-all duration-300 group-hover:text-brand-coral group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-coral transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed flex-grow">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => {
              const element = document.getElementById("newsletter-signup");
              element?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3 bg-brand-coral hover:bg-brand-coral/90 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl inline-flex items-center justify-center"
          >
            <Bell size={18} className="mr-2" />
            Stay Updated
          </button>
        </div>
      </div>
    </section>
  );
}
