"use client";

import { Loader } from "lucide-react";
import { usePublishedProducts } from "@/features/products/hooks/useProducts";
import { ProductsMarketplacePage } from "@/features/products/marketplace/ProductsMarketplacePage";

export function ProductsMarketplaceClient() {
  const { data: products = [], isLoading } = usePublishedProducts();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return <ProductsMarketplacePage products={products} />;
}
