import type { Metadata } from "next";
import { ProductDetailPage } from "@/features/products/detail/ProductDetailPage";
import { notFound } from "next/navigation";
import { getPublishedProductWithDetails } from "@/features/products/api/products.queries";

type Props = { params: Promise<{ productId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;
  const { product } = await getPublishedProductWithDetails(productId);
  if (!product) return { title: "Product Not Found | DigitalQatalyst" };
  return {
    title: `${product.name} (${product.code}) | DigitalQatalyst`,
    description: product.description,
  };
}

export default async function Page({ params }: Readonly<Props>) {
  const { productId } = await params;
  const { product, detail } = await getPublishedProductWithDetails(productId);
  if (!product || !detail) notFound();
  return <ProductDetailPage product={product} detail={detail} ctaType={product.ctaType} />;
}
