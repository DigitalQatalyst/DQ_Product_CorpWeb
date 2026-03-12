import { useNavigate } from "react-router-dom";
import { DollarSign, Brain, Layers, Zap, Users, Rocket } from "lucide-react";

const insights = [
  {
    id: 1,
    number: "1",
    title: "Digital Economy 4.0",
    description:
      "Data-driven decisions unlocking revenue streams.",
    category: "Digital Economy 4.0",
    link: "/marketplace/dtmi?dimension=Digital%20Economy%204.0",
    icon: DollarSign,
    ctaText: "Explore Insights",
  },
  {
    id: 2,
    number: "2",
    title: "Digital Cognitive Org.",
    description:
      "AI and automation driving smarter decisions.",
    category: "Digital Cognitive Organisation",
    link: "/marketplace/dtmi?dimension=Digital%20Cognitive%20Organisation",
    icon: Brain,
    ctaText: "Discover More",
  },
  {
    id: 3,
    number: "3",
    title: "Digital Business Platform",
    description:
      "Unified platform integrating key functions.",
    category: "Digital Business Platform",
    link: "/marketplace/dtmi?dimension=Digital%20Business%20Platform",
    icon: Layers,
    ctaText: "Read Full Insight",
  },
  {
    id: 4,
    number: "4",
    title: "Digital Transformation 2.0",
    description:
      "Strategic technologies meeting customer needs.",
    category: "Digital Transformation",
    link: "/marketplace/dtmi?dimension=Digital%20Transformation%202.0",
    icon: Zap,
    ctaText: "Start Your Journey",
  },
  {
    id: 5,
    number: "5",
    title: "Digital Worker & Space",
    description:
      "Smart tools for productivity and collaboration.",
    category: "Digital Workspace",
    link: "/marketplace/dtmi?dimension=Digital%20Worker%20%26%20Workspace",
    icon: Users,
    ctaText: "Learn More",
  },
  {
    id: 6,
    number: "6",
    title: "Digital Accelerators",
    description:
      "Ready-to-use solutions driving growth.",
    category: "Digital Tools",
    link: "/marketplace/dtmi?dimension=Digital%20Accelerators",
    icon: Rocket,
    ctaText: "Unlock Potential",
  },
];

export function DigitalPerspectives() {
  const navigate = useNavigate();

  return (
    <section className="py-12 bg-brand-navy text-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Driving Digital Transformation with 6xD
          </h2>
          <p className="text-gray-300 max-w-4xl mx-auto">
            Six foundational dimensions guiding your organization toward digital
            maturity and continuous growth.
          </p>
        </div>

        {/* Compact Cards Grid - Not clickable */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-8">
          {insights.map((insight) => {
            const Icon = insight.icon;

            return (
              <div
                key={insight.id}
                className="relative"
              >
                {/* Card - No hover effects */}
                <div className="relative border border-white/20 rounded-md p-2 bg-white/5 h-full flex flex-col overflow-hidden min-h-[60px]">
                  {/* Icon and Title */}
                  <div className="relative z-10 flex items-center gap-1.5 mb-1">
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-brand-coral" />
                    </div>
                    <h4 className="font-semibold text-xs text-white leading-tight">
                      {insight.title}
                    </h4>
                  </div>

                  {/* Description - Always visible */}
                  <div className="relative z-10 flex-grow">
                    <p className="text-[10px] text-gray-300 leading-tight">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/marketplace/dtmi?category=d1-e40,d2-dco,d3-dbp,d4-dt20,d5-worker,d6-accelerators&expandCategory=digital-perspectives")}
            className="inline-flex items-center gap-2 bg-brand-coral text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300"
          >
            Browse 6xD Insights
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
