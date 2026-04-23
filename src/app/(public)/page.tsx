import {
  HeroSection,
  TransformationStats,
  ProofAndTrust,
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
      <ServicesSection />
      <ClientLogos />
      <CallToAction />
    </>
  );
}
