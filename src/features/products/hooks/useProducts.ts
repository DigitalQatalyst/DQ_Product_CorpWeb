import { useQuery } from "@tanstack/react-query";
import {
  listPublishedProducts,
  getPublishedProductWithDetails,
} from "@/features/products/api/products.queries";

export const PRODUCTS_KEY = ["products"] as const;

export function usePublishedProducts() {
  return useQuery({ queryKey: PRODUCTS_KEY, queryFn: listPublishedProducts });
}

export function usePublishedProduct(id: string) {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, id],
    queryFn: () => getPublishedProductWithDetails(id),
    enabled: !!id,
  });
}
