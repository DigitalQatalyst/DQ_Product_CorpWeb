import type { SectorData } from "@/features/services/data/sectors.db";

const defaultFocusAreas = [
  {
    number: "01",
    title: "Channels4.0",
    description: "Optimizing customer touchpoints across digital channels (web, mobile, social, etc.) to ensure seamless and consistent messaging.",
  },
  {
    number: "02",
    title: "DXP4.0",
    description: "Delivering frictionless digital experiences with innovative resources, automated services, and continuous engagement.",
  },
  {
    number: "03",
    title: "XRM4.0",
    description: "Building data-driven relationships with clients, customers, partners, and suppliers to create a dynamic ecosystem.",
  },
  {
    number: "04",
    title: "MarCom4.0",
    description: "Implementing digital marketing strategies to enhance customer acquisition, retention, and conversion.",
  },
  {
    number: "05",
    title: "Customer Journey",
    description: "Analyze journeys to eliminate friction and enhance seamless, satisfying customer experiences.",
  },
  {
    number: "06",
    title: "Recommendations",
    description: "Enable machine learning to provide tailored suggestions based on customer preferences.",
  },
  {
    number: "07",
    title: "Voice Commerce",
    description: "Enable voice-based shopping and support for hands-free convenience and faster service.",
  },
  {
    number: "08",
    title: "Loyalty Programs",
    description: "Design gamified loyalty programs to boost engagement, retention, and brand advocacy.",
  },
];

export function SectorFocusAreas({ sector }: { sector: SectorData }) {
  const focusAreas = sector.focusAreasItems || defaultFocusAreas;

  return (
    <section className="py-10 bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
          Key Focus Areas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {focusAreas.map((area, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg border border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer group"
            >
              <p className="text-sm text-muted-foreground group-hover:text-white/70 mb-4">{area.number}</p>
              <h3 className="font-bold text-foreground group-hover:text-white mb-3 text-lg">
                {area.title}
              </h3>
              <p className="text-sm text-muted-foreground group-hover:text-white/90 leading-relaxed">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
