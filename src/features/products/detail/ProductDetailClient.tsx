"use client";

import { notFound } from "next/navigation";
import { Loader } from "lucide-react";
import { usePublishedProduct } from "@/features/products/hooks/useProducts";
import { ProductDetailPage } from "@/features/products/detail/ProductDetailPage";

export function ProductDetailClient({ productId }: { productId: string }) {
  const { data, isLoading } = usePublishedProduct(productId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!data?.product || !data?.detail) return notFound();

  return <ProductDetailPage product={data.product} detail={data.detail} />;
}
