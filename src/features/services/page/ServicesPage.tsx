import { ServiceHero } from "../components/ServiceHero";
import { ServiceCategoryCards } from "../components/ServiceCategoryCards";
import { ValueProps } from "../components/ValueProps";
import { SectorDomains } from "../components/SectorDomains";
import { MarketplaceBanner } from "../components/MarketplaceBanner";
import { valueProps } from "../data/why-work-with-us";

export function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <ServiceHero />

      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Implement Services
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              DT2.0 is DQ&apos;s approach to digital transformation, split into
              Design—creating blueprints for strategy—and Deploy—executing those
              plans for seamless, efficient implementation.
            </p>
          </div>
          <ServiceCategoryCards />
        </div>
      </section>

      <ValueProps items={valueProps} />
      <SectorDomains />
      <MarketplaceBanner />
    </div>
  );
}
