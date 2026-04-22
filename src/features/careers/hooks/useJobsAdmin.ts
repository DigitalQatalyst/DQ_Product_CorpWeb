import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listJobPostingsAdmin,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
} from "../api/jobPostings";
import {
  listAdminApplications,
  updateAdminApplication,
  deleteAdminApplication,
  type ApplicationStatus,
} from "../api/adminApplications";
import {
  listAdminInterviews,
  scheduleAdminInterview,
} from "../api/adminInterviews";
import {
  listDepartments,
  createDepartment,
  deleteDepartment,
} from "../api/departments";
import type { JobPostingCreateInput, JobPostingUpdateInput } from "../api/types";

// ─── Job Postings ─────────────────────────────────────────────────────────────

export const JOB_POSTINGS_ADMIN_KEY = ["job-postings-admin"] as const;

export function useAdminJobPostings() {
  return useQuery({ queryKey: JOB_POSTINGS_ADMIN_KEY, queryFn: listJobPostingsAdmin });
}

export function useCreateJobPosting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: JobPostingCreateInput) => createJobPosting(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: JOB_POSTINGS_ADMIN_KEY }),
  });
}

export function useUpdateJobPosting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: JobPostingUpdateInput }) =>
      updateJobPosting(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: JOB_POSTINGS_ADMIN_KEY }),
  });
}

export function useDeleteJobPosting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteJobPosting(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: JOB_POSTINGS_ADMIN_KEY }),
  });
}

// ─── Applications ─────────────────────────────────────────────────────────────

export const APPLICATIONS_ADMIN_KEY = ["applications-admin"] as const;

export function useAdminApplications() {
  return useQuery({ queryKey: APPLICATIONS_ADMIN_KEY, queryFn: listAdminApplications });
}

export function useUpdateApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: {
        status: ApplicationStatus;
        rejectionReason?: string | null;
        internalNotes?: string | null;
        notifyMessage?: string | null;
      };
    }) => updateAdminApplication(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: APPLICATIONS_ADMIN_KEY }),
  });
}

export function useDeleteApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdminApplication(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: APPLICATIONS_ADMIN_KEY }),
  });
}

// ─── Interviews ───────────────────────────────────────────────────────────────

export const INTERVIEWS_ADMIN_KEY = ["interviews-admin"] as const;

export function useAdminInterviews() {
  return useQuery({ queryKey: INTERVIEWS_ADMIN_KEY, queryFn: listAdminInterviews });
}

export function useScheduleInterview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof scheduleAdminInterview>[0]) =>
      scheduleAdminInterview(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: INTERVIEWS_ADMIN_KEY }),
  });
}

// ─── Departments ──────────────────────────────────────────────────────────────

export const DEPARTMENTS_KEY = ["departments"] as const;

export function useDepartments() {
  return useQuery({ queryKey: DEPARTMENTS_KEY, queryFn: listDepartments });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createDepartment(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: DEPARTMENTS_KEY }),
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => deleteDepartment(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: DEPARTMENTS_KEY }),
  });
}
