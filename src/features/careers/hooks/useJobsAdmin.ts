import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { JobPostingType, JobPostingCreateInput, JobPostingUpdateInput, Department } from "./useJobs";
import { parseJsonbStringArray } from "../utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApplicationStatus = "pending" | "reviewing" | "shortlisted" | "accepted" | "rejected";

export type AdminJobApplication = {
  id: string; job_id: number; job_posting_id: number | null; job_title: string;
  first_name: string; last_name: string; email: string; phone: string;
  linkedin_url: string | null; portfolio_url: string | null; current_location: string;
  years_of_experience: string; current_company: string | null; current_job_role: string | null;
  notice_period: string; expected_salary: string | null; cover_letter: string;
  resume_url: string; resume_filename: string;
  additional_documents_url: string | null; additional_documents_filename: string | null;
  application_status: ApplicationStatus | null; rejection_reason: string | null;
  internal_notes: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  status_history: any[] | null;
  applied_at: string | null; updated_at: string | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AdminInterview = { [key: string]: any };

// ─── Row mapper ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromRow(row: any): JobPostingType {
  return {
    id: Number(row.id), title: row.title ?? "", department: row.department ?? "",
    location: row.location ?? "", type: row.type ?? "", level: row.level ?? "",
    description: row.description ?? "",
    requirements: parseJsonbStringArray(row.requirements),
    responsibilities: parseJsonbStringArray(row.responsibilities),
    skills: row.skills ?? null, openPositions: row.open_positions ?? null,
    postedDate: row.posted_date ?? row.created_at ?? null,
    status: row.status ?? "open", createdAt: row.created_at ?? null, updatedAt: row.updated_at ?? null,
  };
}

// ─── API helpers ──────────────────────────────────────────────────────────────

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(path, { credentials: "include", ...init });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

// ─── Job Postings ─────────────────────────────────────────────────────────────

export async function listJobPostingsAdmin(): Promise<JobPostingType[]> {
  const data = await apiFetch("/api/admin/job-postings");
  return (data as unknown[]).map(fromRow);
}

export async function createJobPosting(input: JobPostingCreateInput): Promise<JobPostingType> {
  const data = await apiFetch("/api/admin/job-postings", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input),
  });
  return fromRow(data);
}

export async function updateJobPosting(id: number, input: JobPostingUpdateInput): Promise<JobPostingType> {
  const data = await apiFetch(`/api/admin/job-postings/${id}`, {
    method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input),
  });
  return fromRow(data);
}

export async function deleteJobPosting(id: number): Promise<void> {
  await apiFetch(`/api/admin/job-postings/${id}`, { method: "DELETE" });
}

// ─── Applications ─────────────────────────────────────────────────────────────

export async function listAdminApplications(): Promise<AdminJobApplication[]> {
  return apiFetch("/api/admin/applications");
}

export async function updateAdminApplication(id: string, input: { status: ApplicationStatus; rejectionReason?: string | null; internalNotes?: string | null; notifyMessage?: string | null }): Promise<void> {
  await apiFetch(`/api/admin/applications/${id}`, {
    method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input),
  });
}

export async function deleteAdminApplication(id: string): Promise<void> {
  await apiFetch(`/api/admin/applications/${id}`, { method: "DELETE" });
}

// ─── Interviews ───────────────────────────────────────────────────────────────

export async function listAdminInterviews(): Promise<AdminInterview[]> {
  return apiFetch("/api/admin/interviews");
}

export async function scheduleAdminInterview(input: { applicationId: string; scheduledStartIso: string; durationMinutes: number; interviewType: string; notes?: string }): Promise<{ meetUrl: string | null; calendarEventId: string | null; calendarHtmlLink: string | null }> {
  return apiFetch("/api/admin/interviews", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input),
  });
}

// ─── Departments ──────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asDepartment(row: any): Department | null {
  const id = row?.id;
  const name = row?.name ?? row?.department_name ?? row?.title ?? row?.label ?? row?.slug ?? null;
  if ((typeof id !== "number" && typeof id !== "string") || !name || typeof name !== "string") return null;
  return { id, name };
}

export async function listDepartments(): Promise<Department[]> {
  const data = await apiFetch("/api/admin/departments");
  const mapped = (data as unknown[]).map(asDepartment).filter(Boolean) as Department[];
  return mapped.sort((a, b) => a.name.localeCompare(b.name));
}

export async function createDepartment(name: string): Promise<Department> {
  const data = await apiFetch("/api/admin/departments", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }),
  });
  const dept = asDepartment(data);
  if (!dept) throw new Error("Failed to create department.");
  return dept;
}

export async function deleteDepartment(id: Department["id"]): Promise<void> {
  await apiFetch(`/api/admin/departments/${id}`, { method: "DELETE" });
}

// ─── Locations / Employment types / Levels ────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asNamedOption(row: any): Department | null {
  const id = row?.id;
  const name = row?.name ?? row?.title ?? row?.label ?? row?.slug ?? null;
  if ((typeof id !== "number" && typeof id !== "string") || !name || typeof name !== "string") return null;
  return { id, name };
}

export async function listJobLocations(): Promise<Department[]> {
  const data = await apiFetch("/api/admin/job-locations");
  const mapped = (data as unknown[]).map(asNamedOption).filter(Boolean) as Department[];
  return mapped.sort((a, b) => a.name.localeCompare(b.name));
}

export async function createJobLocation(name: string): Promise<Department> {
  const data = await apiFetch("/api/admin/job-locations", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }),
  });
  const opt = asNamedOption(data);
  if (!opt) throw new Error("Failed to create location.");
  return opt;
}

export async function deleteJobLocation(id: Department["id"]): Promise<void> {
  await apiFetch(`/api/admin/job-locations/${id}`, { method: "DELETE" });
}

export async function listEmploymentTypes(): Promise<Department[]> {
  const data = await apiFetch("/api/admin/employment-types");
  const mapped = (data as unknown[]).map(asNamedOption).filter(Boolean) as Department[];
  return mapped.sort((a, b) => a.name.localeCompare(b.name));
}

export async function createEmploymentType(name: string): Promise<Department> {
  const data = await apiFetch("/api/admin/employment-types", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }),
  });
  const opt = asNamedOption(data);
  if (!opt) throw new Error("Failed to create employment type.");
  return opt;
}

export async function deleteEmploymentType(id: Department["id"]): Promise<void> {
  await apiFetch(`/api/admin/employment-types/${id}`, { method: "DELETE" });
}

export async function listJobLevels(): Promise<Department[]> {
  const data = await apiFetch("/api/admin/job-levels");
  const mapped = (data as unknown[]).map(asNamedOption).filter(Boolean) as Department[];
  return mapped.sort((a, b) => a.name.localeCompare(b.name));
}

export async function createJobLevel(name: string): Promise<Department> {
  const data = await apiFetch("/api/admin/job-levels", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }),
  });
  const opt = asNamedOption(data);
  if (!opt) throw new Error("Failed to create job level.");
  return opt;
}

export async function deleteJobLevel(id: Department["id"]): Promise<void> {
  await apiFetch(`/api/admin/job-levels/${id}`, { method: "DELETE" });
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const JOB_POSTINGS_ADMIN_KEY = ["job-postings-admin"] as const;
export const APPLICATIONS_ADMIN_KEY = ["applications-admin"] as const;
export const INTERVIEWS_ADMIN_KEY = ["interviews-admin"] as const;
export const DEPARTMENTS_KEY = ["departments"] as const;
export const JOB_LOCATIONS_KEY = ["job-locations"] as const;
export const EMPLOYMENT_TYPES_KEY = ["employment-types"] as const;
export const JOB_LEVELS_KEY = ["job-levels"] as const;

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
    mutationFn: ({ id, input }: { id: number; input: JobPostingUpdateInput }) => updateJobPosting(id, input),
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

export function useAdminApplications() {
  return useQuery({ queryKey: APPLICATIONS_ADMIN_KEY, queryFn: listAdminApplications });
}

export function useUpdateApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: { status: ApplicationStatus; rejectionReason?: string | null; internalNotes?: string | null; notifyMessage?: string | null } }) =>
      updateAdminApplication(id, input),
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

export function useAdminInterviews() {
  return useQuery({ queryKey: INTERVIEWS_ADMIN_KEY, queryFn: listAdminInterviews });
}

export function useScheduleInterview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof scheduleAdminInterview>[0]) => scheduleAdminInterview(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: INTERVIEWS_ADMIN_KEY }),
  });
}

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

export function useJobLocations() {
  return useQuery({ queryKey: JOB_LOCATIONS_KEY, queryFn: listJobLocations });
}

export function useCreateJobLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createJobLocation(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: JOB_LOCATIONS_KEY }),
  });
}

export function useDeleteJobLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => deleteJobLocation(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: JOB_LOCATIONS_KEY }),
  });
}

export function useEmploymentTypes() {
  return useQuery({ queryKey: EMPLOYMENT_TYPES_KEY, queryFn: listEmploymentTypes });
}

export function useCreateEmploymentType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createEmploymentType(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: EMPLOYMENT_TYPES_KEY }),
  });
}

export function useDeleteEmploymentType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => deleteEmploymentType(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: EMPLOYMENT_TYPES_KEY }),
  });
}

export function useJobLevels() {
  return useQuery({ queryKey: JOB_LEVELS_KEY, queryFn: listJobLevels });
}

export function useCreateJobLevel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createJobLevel(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: JOB_LEVELS_KEY }),
  });
}

export function useDeleteJobLevel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => deleteJobLevel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: JOB_LEVELS_KEY }),
  });
}
