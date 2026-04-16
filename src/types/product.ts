import type { ElementType } from "react";

export interface ProductType {
  id: string;
  name: string;
  code: string;
  description: string;
  tags: string[];
  demoUrl: string;
  learnMoreUrl: string;
  category: string;
  icon?: ElementType;
  imageUrl?: string;
}
