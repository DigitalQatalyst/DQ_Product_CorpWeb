import type { Metadata } from "next";
import { listPublishedProducts } from "@/features/products/hooks/useProducts";
import { ProductsMarketplacePage } from "@/features/products/marketplace/ProductsMarketplacePage";

export const metadata: Metadata = {
  title: "Products Marketplace | DigitalQatalyst",
  description:
    "Discover curated digital products and accelerators engineered for growth and success in the digital economy.",
};

export default async function Page() {
  const products = await listPublishedProducts();
  return <ProductsMarketplacePage products={products} />;
}
