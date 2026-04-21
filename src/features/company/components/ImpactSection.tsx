import { Separator } from "@/components/ui/separator";
import { impactStats } from "../data/company.data";

export function ImpactSection() {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <p className="text-xs uppercase tracking-[0.4em] text-primary font-semibold mb-8">
          From Vision to Impact
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {impactStats.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl md:text-5xl font-bold text-foreground mb-3">
                {stat.value}
              </p>
              <Separator className="w-12 mb-3 bg-secondary h-1" />
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Since 2015, we&apos;ve been empowering organizations to become
              Digital Cognitive Organizations (DCOs)...
            </h2>
          </div>
          <div className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              Founded by Dr. Stephane Niango, DigitalQatalyst simplifies digital
              transformation for organizations globally. Our solutions are built
              for businesses looking to adapt, grow, and lead in a rapidly
              changing digital world.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We empower organizations to build the future of business by
              providing tools, frameworks, and expertise to thrive in the
              digital economy. Whether you&apos;re a growing startup or a global
              enterprise, we help you stay ahead.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
