import { CompanyHero } from "./components/CompanyHero";
import { ImpactSection } from "./components/ImpactSection";
import { ValuesSection } from "./components/ValuesSection";
import { BeliefsSection } from "./components/BeliefsSection";
import { StorySection } from "./components/StorySection";
import { LeadershipSection } from "./components/LeadershipSection";
import { ClientLogos } from "@/features/landing/components/ClientLogos";
import { CallToAction } from "@/features/landing/components/CallToAction";

export function CompanyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <CompanyHero />
      <ImpactSection />
      <ClientLogos />
      <ValuesSection />
      <BeliefsSection />
      <StorySection />
      <LeadershipSection />
      <CallToAction />
    </div>
  );
}
