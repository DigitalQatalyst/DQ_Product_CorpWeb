import { ProductDetailClient } from "@/features/products/detail/ProductDetailClient";

type Props = { params: Promise<{ productId: string }> };

export default async function Page({ params }: Readonly<Props>) {
  const { productId } = await params;
  return <ProductDetailClient productId={productId} />;
}
