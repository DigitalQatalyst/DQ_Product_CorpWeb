import type { Metadata } from "next";
import { dqProducts } from "@/data/products";
import { ProductDetailPage } from "@/features/products/detail/ProductDetailPage";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ productId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;
  const product = dqProducts.find((p) => p.id === productId);
  if (!product) return { title: "Product Not Found | DigitalQatalyst" };
  return {
    title: `${product.name} (${product.code}) | DigitalQatalyst`,
    description: product.description,
  };
}

export function generateStaticParams() {
  return dqProducts.map((p) => ({ productId: p.id }));
}

export default async function Page({ params }: Props) {
  const { productId } = await params;
  const exists = dqProducts.some((p) => p.id === productId);
  if (!exists) notFound();
  return <ProductDetailPage productId={productId} />;
}
