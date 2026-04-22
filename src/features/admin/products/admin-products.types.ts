import type { ProductCtaType, ProductDetail } from "@/features/products/hooks/useProductsAdmin";

export type AdminProduct = {
  id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  tags: string[];
  imagePath: string | null;
  imageUrl?: string;
  ctaType: ProductCtaType;
  isPublished: boolean;
};

export type AdminProductWithDetail = {
  product: AdminProduct;
  detail: ProductDetail;
};

