import { ProductsHero } from "./components/ProductsHero";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { SixXDFramework } from "./components/SixXDFramework";
import { ProductOfferings } from "./components/ProductOfferings";
import { RequestDemoForm } from "./components/RequestDemoForm";

export function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <ProductsHero />
      <WhyChooseUs />
      <SixXDFramework />
      <ProductOfferings />
      <RequestDemoForm />
    </div>
  );
}
