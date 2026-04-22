import { useQuery } from "@tanstack/react-query";
import { listPublishedJobPostings, getJobPostingById } from "../api/jobPostings";

export const JOBS_KEY = ["jobs"] as const;

export function usePublishedJobs() {
  return useQuery({ queryKey: JOBS_KEY, queryFn: listPublishedJobPostings });
}

export function useJob(id: number) {
  return useQuery({
    queryKey: [...JOBS_KEY, id],
    queryFn: () => getJobPostingById(id),
    enabled: !!id,
  });
}
