import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listAllServices,
  createService,
  updateService,
  deleteService,
  type ServiceInput,
} from "@/features/services/api/services.admin";

const KEY = ["services-admin"] as const;

export function useAllServices() {
  return useQuery({ queryKey: KEY, queryFn: listAllServices });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ServiceInput) => createService(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ServiceInput> }) =>
      updateService(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
