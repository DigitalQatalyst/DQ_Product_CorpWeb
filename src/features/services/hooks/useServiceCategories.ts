import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listServiceCategories,
  listPublishedServiceCategories,
  getServiceCategoryBySlug,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
  type ServiceCategoryInput,
} from "../api/serviceCategories";

export const SERVICE_CATEGORIES_KEY = ["service-categories"] as const;

export function useServiceCategories() {
  return useQuery({ queryKey: SERVICE_CATEGORIES_KEY, queryFn: listServiceCategories });
}

export function usePublishedServiceCategories() {
  return useQuery({
    queryKey: [...SERVICE_CATEGORIES_KEY, "published"],
    queryFn: listPublishedServiceCategories,
  });
}

export function useServiceCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: [...SERVICE_CATEGORIES_KEY, slug],
    queryFn: () => getServiceCategoryBySlug(slug),
    enabled: !!slug,
  });
}

export function useCreateServiceCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ServiceCategoryInput) => createServiceCategory(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: SERVICE_CATEGORIES_KEY }),
  });
}

export function useUpdateServiceCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ServiceCategoryInput> }) =>
      updateServiceCategory(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: SERVICE_CATEGORIES_KEY }),
  });
}

export function useDeleteServiceCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteServiceCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SERVICE_CATEGORIES_KEY }),
  });
}
