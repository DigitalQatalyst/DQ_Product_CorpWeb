import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { SectorData } from "@/features/services/data/sectors.data";

export function SectorOverview({ sector }: { sector: SectorData }) {
  return (
    <>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">What is {sector.name}?</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">{sector.focus}</p>
          {sector.corePillars.length > 0 && (
            <>
              <p className="text-lg text-muted-foreground mb-6">At the core of {sector.name} are:</p>
              <div className="space-y-4">
                {sector.corePillars.map((pillar) => (
                  <div key={pillar.title} className="flex items-start gap-4 p-5 bg-muted/40 rounded-xl border border-border">
                    <CheckCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-foreground mb-1">{pillar.title}</h3>
                      <p className="text-muted-foreground text-sm">{pillar.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">Why {sector.name}?</h2>
          <p className="text-muted-foreground text-lg text-center max-w-3xl mx-auto mb-12">
            In today&apos;s rapidly evolving landscape, organizations that embrace digital transformation will thrive. {sector.name} helps businesses stay competitive and deliver real results.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
            {sector.whyReasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <Card key={reason.title} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5 flex items-start gap-3">
                    <Icon className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-foreground mb-1">{reason.title}</h3>
                      <p className="text-muted-foreground text-sm">{reason.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sector.stats.map((stat) => (
              <Card key={stat.label} className="text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="text-5xl font-bold text-primary mb-3 group-hover:scale-105 transition-transform">{stat.value}</div>
                  <p className="text-foreground font-semibold text-sm">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
