import { useQuery } from "@tanstack/react-query";
import { parseJsonbStringArray } from "@/features/careers/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type JobPostingStatus = "open" | "closed";

export type JobPostingType = {
  id: number; title: string; department: string; location: string;
  type: string; level: string; description: string;
  requirements: string[]; responsibilities: string[];
  skills?: { core: string[]; behavioral: string[] } | null;
  openPositions?: number | null; postedDate?: string | null;
  status: JobPostingStatus; createdAt?: string | null; updatedAt?: string | null;
};

export type JobPostingCreateInput = Omit<JobPostingType, "id" | "createdAt" | "updatedAt">;
export type JobPostingUpdateInput = Partial<JobPostingCreateInput>;

export type Department = { id: number | string; name: string };

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

function apiUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? (typeof window === "undefined" ? "http://localhost:3000" : "");
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

// ─── Fetch functions (used by server components + hooks) ─────────────────────

export async function listPublishedJobPostings(): Promise<JobPostingType[]> {
  const data = await apiFetch("/api/jobs");
  return (data as unknown[]).map(fromRow);
}

export async function getJobPostingById(id: number): Promise<JobPostingType> {
  const data = await apiFetch(`/api/jobs/${id}`);
  return fromRow(data);
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

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

// ─── Job Applications ─────────────────────────────────────────────────────────

export type JobApplicationCreateInput = {
  jobId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  currentLocation: string;
  yearsOfExperience: string;
  noticePeriod: string;
  expectedSalary?: string;
  coverLetter: string;
  resumeUrl: string;
  resumeFilename: string;
  additionalDocumentsUrl?: string;
  additionalDocumentsFilename?: string;
};

export async function createJobApplication(input: JobApplicationCreateInput): Promise<{ ok: true }> {
  const res = await fetch("/api/job-applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to submit application.");
  }
  return res.json();
}
