import type { Metadata } from "next";
import { ServicesMarketplacePage } from "@/features/services/marketplace/ServicesMarketplacePage";

export const metadata: Metadata = {
  title: "Services Marketplace | DigitalQatalyst",
  description:
    "Browse our comprehensive catalogue of digital transformation services designed to help your business thrive in the digital era.",
};

export default function Page() {
  return <ServicesMarketplacePage />;
}
