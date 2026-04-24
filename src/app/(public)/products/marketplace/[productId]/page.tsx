import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedProductWithDetails } from "@/features/products/hooks/useProducts";
import { ProductDetailPage } from "@/features/products/detail/ProductDetailPage";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ productId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;
  const data = await getPublishedProductWithDetails(productId);
  if (!data?.product) return {};
  return {
    title: `${data.product.name} (${data.product.code}) | DigitalQatalyst`,
    description: data.product.description,
  };
}

export default async function Page({ params }: Readonly<Props>) {
  const { productId } = await params;
  const data = await getPublishedProductWithDetails(productId);
  if (!data?.product || !data?.detail) return notFound();
  return <ProductDetailPage product={data.product} detail={data.detail} />;
}
