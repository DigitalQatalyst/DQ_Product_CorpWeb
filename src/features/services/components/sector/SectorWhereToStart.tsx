import type { SectorData } from "@/features/services/data/sectors.data";

const defaultStartItems = [
  {
    title: "Omnichannel Support",
    description: "Integrate chat, social media, email, and voice for consistent, responsive customer support.",
  },
  {
    title: "Personalized Marketing",
    description: "Use AI and data to craft hyper-personalized campaigns that drive engagement and loyalty.",
  },
  {
    title: "Customer Analytics",
    description: "Enable real-time analytics to predict behavior and optimize customer interactions effectively.",
  },
  {
    title: "Self-Service Portals",
    description: "Empower your customers to resolve queries and manage accounts independently.",
  },
  {
    title: "Augmented Reality",
    description: "Enhance experiences with AR for immersive visuals in retail and real estate sectors.",
  },
  {
    title: "Chatbots and VA",
    description: "Deploy AI chatbots for 24/7 support, ensuring instant responses and reducing wait times.",
  },
  {
    title: "Customer Journey",
    description: "Analyze journeys to eliminate friction and enhance seamless, satisfying customer experiences.",
  },
  {
    title: "Recommendations",
    description: "Enable machine learning to provide tailored suggestions based on customer preferences.",
  },
  {
    title: "Voice Commerce",
    description: "Enable voice-based shopping and support for hands-free convenience and faster service.",
  },
  {
    title: "Loyalty Programs",
    description: "Design gamified loyalty programs to boost engagement, retention, and brand advocacy.",
  },
];

export function SectorWhereToStart({ sector }: { sector: SectorData }) {
  const startItems = sector.whereToStartItems || defaultStartItems;

  return (
    <section className="py-10 bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
          Where to Start
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startItems.map((item, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg border border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer group"
            >
              <h3 className="font-bold text-foreground group-hover:text-white mb-3 text-base">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground group-hover:text-white/90 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
