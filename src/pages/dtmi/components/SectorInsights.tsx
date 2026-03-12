import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Zap,
  Shield,
  Briefcase,
  Brain,
  Users,
  Pickaxe,
  Sprout,
  Truck,
  Factory,
  Building2,
  ShoppingBag,
  Landmark,
  Hotel,
  Heart,
} from "lucide-react";

const sectorGroups = [
  {
    groupTitle: "Technology & Innovation-Driven",
    description:
      "Digital experiences, AI integration, and workplace transformation",
    sectors: [
      {
        name: "Experience 4.0",
        icon: Sparkles,
        description:
          "Digital technologies creating seamless customer journeys.",
        link: "/marketplace/dtmi?sector=Experience%204.0",
      },
      {
        name: "Agility 4.0",
        icon: Zap,
        description:
          "Adaptive strategies reshaping business operations.",
        link: "/marketplace/dtmi?sector=Agility%204.0",
      },
      {
        name: "Governance 4.0",
        icon: Shield,
        description:
          "Digital governance and risk management frameworks.",
        link: "/marketplace/dtmi?sector=Governance%204.0",
      },
      {
        name: "Backoffice 4.0",
        icon: Briefcase,
        description:
          "Automation transforming back-office efficiency.",
        link: "/marketplace/dtmi?sector=Backoffice%204.0",
      },
      {
        name: "Intelligence 4.0",
        icon: Brain,
        description:
          "AI and analytics driving intelligent decisions.",
        link: "/marketplace/dtmi?sector=Intelligence%204.0",
      },
      {
        name: "Workspace 4.0",
        icon: Users,
        description:
          "Digital workspaces and hybrid work models.",
        link: "/marketplace/dtmi?sector=Workspace%204.0",
      },
    ],
  },
  {
    groupTitle: "Industry-Specific Transformation",
    description: "Automation, IoT, and AI reshaping traditional industries",
    sectors: [
      {
        name: "Mining 4.0",
        icon: Pickaxe,
        description:
          "IoT and automation for safety and efficiency.",
        link: "/marketplace/dtmi?sector=Mining%204.0",
      },
      {
        name: "Farming 4.0",
        icon: Sprout,
        description:
          "Precision agriculture and sustainable production.",
        link: "/marketplace/dtmi?sector=Farming%204.0",
      },
      {
        name: "Logistics 4.0",
        icon: Truck,
        description:
          "Smart supply chains and real-time tracking.",
        link: "/marketplace/dtmi?sector=Logistics%204.0",
      },
      {
        name: "Plant 4.0",
        icon: Factory,
        description:
          "Smart manufacturing and predictive maintenance.",
        link: "/marketplace/dtmi?sector=Plant%204.0",
      },
      {
        name: "Infrastructure 4.0",
        icon: Building2,
        description:
          "Smart cities and intelligent infrastructure.",
        link: "/marketplace/dtmi?sector=Infrastructure%204.0",
      },
    ],
  },
  {
    groupTitle: "Service & Customer-Experience Driven",
    description: "Service transformation and customer-facing innovations",
    sectors: [
      {
        name: "Services 4.0",
        icon: Briefcase,
        description:
          "Digital platforms enhancing service delivery.",
        link: "/marketplace/dtmi?sector=Services%204.0",
      },
      {
        name: "Government 4.0",
        icon: Landmark,
        description:
          "E-governance and citizen-centric transformation.",
        link: "/marketplace/dtmi?sector=Government%204.0",
      },
      {
        name: "Retail 4.0",
        icon: ShoppingBag,
        description:
          "AI and IoT meeting modern consumer demands.",
        link: "/marketplace/dtmi?sector=Retail%204.0",
      },
      {
        name: "Hospitality 4.0",
        icon: Hotel,
        description:
          "Smart hotels and personalized guest experiences.",
        link: "/marketplace/dtmi?sector=Hospitality%204.0",
      },
      {
        name: "Wellness 4.0",
        icon: Heart,
        description:
          "Digital health and telemedicine innovations.",
        link: "/marketplace/dtmi?sector=Wellness%204.0",
      },
    ],
  },
];

export function SectorInsights() {
  const navigate = useNavigate();

  return (
    <section className="py-12 bg-brand-navy text-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Explore Insights Across Industries
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Discover how industries leverage digital transformation for superior
            experiences and advantage.
          </p>
        </div>

        {/* Sector Groups */}
        <div className="space-y-6">
          {sectorGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {/* Group Header */}
              <div className="mb-3">
                <h3 className="text-base font-bold text-white mb-0.5">
                  {group.groupTitle}
                </h3>
                <p className="text-gray-400 text-xs">{group.description}</p>
              </div>

              {/* Sector Cards Grid - Not clickable */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {group.sectors.map((sector, index) => {
                  const Icon = sector.icon;

                  return (
                    <div
                      key={index}
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
                            {sector.name}
                          </h4>
                        </div>

                        {/* Description - Always visible */}
                        <div className="relative z-10 flex-grow">
                          <p className="text-[10px] text-gray-300 leading-tight">
                            {sector.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/marketplace/dtmi?sector=experience40,agility40,farming40,plant40,infrastructure40,government40,hospitality40,retail40,service40,logistics40,wellness40&expandCategory=digital-sectors")}
            className="inline-flex items-center gap-2 bg-brand-coral text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300"
          >
            Explore Industry Insights
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
