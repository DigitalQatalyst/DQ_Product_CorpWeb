import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { SectorData } from "@/features/services/data/sectors.data";

export function SectorContent({ sector }: { sector: SectorData }) {
  return (
    <>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-foreground mb-8">Key Technologies</h2>
          <div className="flex flex-wrap gap-3">
            {sector.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-sm px-5 py-2.5 rounded-md">{tech}</Badge>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-foreground mb-8">Key Benefits</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {sector.benefits.map((benefit) => {
              const [title, ...rest] = benefit.split(":");
              return (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {rest.length > 0 ? <><span className="font-semibold text-foreground">{title}:</span>{rest.join(":")}</> : benefit}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-foreground mb-8">Use Cases</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sector.useCases.map((uc, i) => {
              const [title, ...rest] = uc.split(":");
              return (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <Badge variant="outline" className="mb-3 text-xs">{String(i + 1).padStart(2, "0")}</Badge>
                    <h3 className="font-bold text-foreground mb-2 text-sm">{rest.length > 0 ? title : uc}</h3>
                    {rest.length > 0 && <p className="text-muted-foreground text-xs leading-relaxed">{rest.join(":")}</p>}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
