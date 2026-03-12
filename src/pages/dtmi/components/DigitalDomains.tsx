import { useNavigate } from "react-router-dom";
import {
  Smartphone,
  Sparkles,
  Megaphone,
  Bell,
  Users,
  Settings,
  Shield,
  Building2,
  Link2,
  Lock,
  Brain,
  Monitor,
} from "lucide-react";

interface Stream {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
}

interface Domain {
  id: string;
  title: string;
  streams: Stream[];
}

const domains: Domain[] = [
  {
    id: "front-end",
    title: "Digital Front-End",
    streams: [
      {
        id: "channels",
        name: "Digital Channels",
        description: "Where brands and users connect.",
        icon: Smartphone,
        color: "bg-brand-coral",
      },
      {
        id: "experience",
        name: "Digital Experience",
        description: "Enhancing engagement and satisfaction.",
        icon: Sparkles,
        color: "bg-brand-coral",
      },
      {
        id: "marketing",
        name: "Digital Marketing",
        description: "Effective digital brand presence strategies.",
        icon: Megaphone,
        color: "bg-brand-coral",
      },
      {
        id: "services",
        name: "Digital Services",
        description:
          "Customer-facing and backend digital offerings.",
        icon: Bell,
        color: "bg-brand-coral",
      },
    ],
  },
  {
    id: "core",
    title: "Digital Core",
    streams: [
      {
        id: "workspace",
        name: "Digital Workspace",
        description: "Collaboration and remote productivity.",
        icon: Users,
        color: "bg-brand-coral",
      },
      {
        id: "core-systems",
        name: "Digital Core",
        description:
          "Business backbone with all IT systems.",
        icon: Settings,
        color: "bg-brand-coral",
      },
      {
        id: "gprc",
        name: "Digital GPRC",
        description: "Governance, risk, and compliance.",
        icon: Shield,
        color: "bg-brand-coral",
      },
      {
        id: "back-office",
        name: "Digital Back-Office",
        description:
          "Supporting internal operations digitally.",
        icon: Building2,
        color: "bg-brand-coral",
      },
    ],
  },
  {
    id: "enablers",
    title: "Digital Enablers",
    streams: [
      {
        id: "interops",
        name: "Digital InterOps",
        description:
          "Seamless operations across platforms.",
        icon: Link2,
        color: "bg-brand-coral",
      },
      {
        id: "security",
        name: "Digital Security",
        description: "Safeguarding assets and customer data.",
        icon: Lock,
        color: "bg-brand-coral",
      },
      {
        id: "intelligence",
        name: "Digital Intelligence",
        description:
          "AI and analytics driving decisions.",
        icon: Brain,
        color: "bg-brand-coral",
      },
      {
        id: "it",
        name: "Digital IT",
        description:
          "Infrastructure powering business processes.",
        icon: Monitor,
        color: "bg-brand-coral",
      },
    ],
  },
];

export function DigitalDomains() {
  const navigate = useNavigate();

  return (
    <section className="py-12 bg-brand-navy text-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Digital Domains and Functional Streams
          </h2>
          <p className="text-gray-300 max-w-4xl mx-auto">
            Foundational digital domains and functional streams driving
            transformation and digital maturity across industries.
          </p>
        </div>

        {/* Domain Groups */}
        <div className="space-y-6">
          {domains.map((domain) => (
            <div key={domain.id}>
              {/* Domain Header */}
              <div className="mb-3">
                <h3 className="text-base font-bold text-white">
                  {domain.title}
                </h3>
              </div>

              {/* Stream Cards Grid - Not clickable */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2">
                {domain.streams.map((stream) => {
                  const Icon = stream.icon;

                  return (
                    <div
                      key={stream.id}
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
                            {stream.name}
                          </h4>
                        </div>

                        {/* Description - Always visible */}
                        <div className="relative z-10 flex-grow">
                          <p className="text-[10px] text-gray-300 leading-tight">
                            {stream.description}
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
            onClick={() => navigate("/marketplace/dtmi?domain=channels,experience,services,marketing,workspace,core-systems,gprc,back-office,interops,security,intelligence,it&expandCategory=digital-functional-streams-domains")}
            className="inline-flex items-center gap-2 bg-brand-coral text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300"
          >
            Explore Domains & Streams Insights
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
