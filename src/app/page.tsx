import {
  HeroSection,
  TransformationStats,
  ProofAndTrust,
  DigitalMaturityAssessment,
  ServicesSection,
  ClientLogos,
  CallToAction,
} from "@/features/landing";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TransformationStats />
      <ProofAndTrust />
      <DigitalMaturityAssessment />
      <ServicesSection />
      <ClientLogos />
      <CallToAction />
    </>
  );
}
