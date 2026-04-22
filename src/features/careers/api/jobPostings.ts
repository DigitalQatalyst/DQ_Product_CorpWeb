import type { JobPostingCreateInput, JobPostingType, JobPostingUpdateInput } from "./types";
import { parseJsonbStringArray } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromRow(row: any): JobPostingType {
  return {
    id: Number(row.id),
    title: row.title ?? "",
    department: row.department ?? "",
    location: row.location ?? "",
    type: row.type ?? "",
    level: row.level ?? "",
    description: row.description ?? "",
    requirements: parseJsonbStringArray(row.requirements),
    responsibilities: parseJsonbStringArray(row.responsibilities),
    skills: row.skills ?? null,
    openPositions: row.open_positions ?? null,
    postedDate: row.posted_date ?? row.created_at ?? null,
    status: row.status ?? "open",
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
  };
}

function apiUrl(path: string) {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    (typeof window === "undefined" ? "http://localhost:3000" : "");
  return `${base}${path}`;
}

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(apiUrl(path), init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function listPublishedJobPostings(): Promise<JobPostingType[]> {
  const data = await apiFetch("/api/jobs");
  return (data as unknown[]).map(fromRow);
}

export async function getJobPostingById(id: number): Promise<JobPostingType> {
  const data = await apiFetch(`/api/jobs/${id}`);
  return fromRow(data);
}

export async function listJobPostingsAdmin(): Promise<JobPostingType[]> {
  const data = await apiFetch("/api/admin/job-postings");
  return (data as unknown[]).map(fromRow);
}

export async function createJobPosting(input: JobPostingCreateInput): Promise<JobPostingType> {
  const data = await apiFetch("/api/admin/job-postings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return fromRow(data);
}

export async function updateJobPosting(
  id: number,
  input: JobPostingUpdateInput,
): Promise<JobPostingType> {
  const data = await apiFetch(`/api/admin/job-postings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return fromRow(data);
}

export async function deleteJobPosting(id: number): Promise<void> {
  await apiFetch(`/api/admin/job-postings/${id}`, { method: "DELETE" });
}
