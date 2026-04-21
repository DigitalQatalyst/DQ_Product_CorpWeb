import { FileText, TrendingUp, Users, DollarSign } from "lucide-react";
import type { SectorData } from "@/features/services/data/sectors.data";

const defaultBenefits = [
  {
    icon: FileText,
    title: "Operating Cost Reduction",
    description: "Streamline operations with automated workflows and AI-powered tools, reducing operational expenses for sustainable growth.",
  },
  {
    icon: TrendingUp,
    title: "Operational Excellence",
    description: "Enhance consistency and speed of service delivery through optimized processes, ensuring superior performance and customer satisfaction.",
  },
  {
    icon: Users,
    title: "Organisational Efficiency",
    description: "Improve cross-functional collaboration and data-driven decision-making, empowering teams to work more effectively across the organization.",
  },
  {
    icon: DollarSign,
    title: "Revenue Growth",
    description: "Boost customer retention and tap into new revenue streams by delivering exceptional experiences that drive loyalty.",
  },
];

export function SectorKeyBenefits({ sector }: { sector: SectorData }) {
  const benefits = sector.keyBenefits || defaultBenefits;

  return (
    <section className="py-10 bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
          Key Benefits
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="flex gap-4 p-6 bg-gray-50 rounded-lg"
              >
                <div className="flex-shrink-0">
                  <Icon className="w-6 h-6 text-secondary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2 text-lg">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
