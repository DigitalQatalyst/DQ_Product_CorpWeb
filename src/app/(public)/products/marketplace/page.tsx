import type { Metadata } from "next";
import { ProductsMarketplaceClient } from "@/features/products/marketplace/ProductsMarketplaceClient";

export const metadata: Metadata = {
  title: "Products Marketplace | DigitalQatalyst",
  description:
    "Discover curated digital products and accelerators engineered for growth and success in the digital economy.",
};

export default function Page() {
  return <ProductsMarketplaceClient />;
}
