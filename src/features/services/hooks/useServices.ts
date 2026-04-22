import { useQuery } from "@tanstack/react-query";
import { listPublishedServices, getServiceById } from "../api/services";
export type { Service } from "../api/services";

export const SERVICES_KEY = ["services"] as const;

export function usePublishedServices() {
  return useQuery({ queryKey: SERVICES_KEY, queryFn: listPublishedServices });
}

export function useServiceById(id: string) {
  return useQuery({
    queryKey: [...SERVICES_KEY, id],
    queryFn: () => getServiceById(id),
    enabled: !!id,
  });
}
