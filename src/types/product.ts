import type { ReactNode } from "react";

export interface ProductType {
  id: string;
  name: string;
  code: string;
  description: string;
  tags: string[];
  demoUrl: string;
  learnMoreUrl: string;
  category: string;
  icon?: ReactNode;
  imageUrl?: string;
}

export interface ProductCardProps {
  product: ProductType;
  onClick?: () => void;
}

export interface ProductGridProps {
  products: ProductType[];
}
