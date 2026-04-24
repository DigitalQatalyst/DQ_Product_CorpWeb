import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
      <Header />
      <main className="flex-1 pt-[72px]">
        <HeroSection />
        <TransformationStats />
        <ProofAndTrust />
        <ServicesSection />
        <ClientLogos />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}