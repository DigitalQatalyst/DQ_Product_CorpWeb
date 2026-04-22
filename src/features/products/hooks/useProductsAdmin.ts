import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listAdminProducts,
  getAdminProductWithDetail,
  upsertAdminProduct,
  patchAdminProduct,
  uploadProductImage,
  type AdminProduct,
  type AdminProductDetail,
} from "@/features/products/api/products.admin";
import type { ProductCtaType } from "@/features/products/api/products.queries";

export const PRODUCTS_ADMIN_KEY = ["products-admin"] as const;

export function useAdminProducts() {
  return useQuery({ queryKey: PRODUCTS_ADMIN_KEY, queryFn: listAdminProducts });
}

export function useAdminProduct(id: string) {
  return useQuery({
    queryKey: [...PRODUCTS_ADMIN_KEY, id],
    queryFn: () => getAdminProductWithDetail(id),
    enabled: !!id,
  });
}

export function useUpsertProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      id: string;
      name: string;
      code: string;
      description: string;
      category: string;
      tags: string[];
      ctaType: ProductCtaType;
      isPublished: boolean;
      detail: AdminProductDetail;
    }) => upsertAdminProduct(input),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: PRODUCTS_ADMIN_KEY });
      qc.invalidateQueries({ queryKey: [...PRODUCTS_ADMIN_KEY, vars.id] });
    },
  });
}

export function usePatchProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<AdminProduct> }) =>
      patchAdminProduct(id, patch),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: PRODUCTS_ADMIN_KEY });
      qc.invalidateQueries({ queryKey: [...PRODUCTS_ADMIN_KEY, vars.id] });
    },
  });
}

export function useUploadProductImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => uploadProductImage(id, file),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [...PRODUCTS_ADMIN_KEY, vars.id] });
    },
  });
}
