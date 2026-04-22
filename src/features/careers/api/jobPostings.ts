import { supabaseBrowser } from "@/lib/supabaseBrowser";
import type {
  JobPostingCreateInput,
  JobPostingType,
  JobPostingUpdateInput,
} from "./types";
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

function toWritePayload(input: JobPostingCreateInput | JobPostingUpdateInput) {
  // Mirrors DB column names.
  return {
    title: input.title,
    department: input.department,
    location: input.location,
    type: input.type,
    level: input.level,
    description: input.description,
    requirements: input.requirements,
    responsibilities: input.responsibilities,
    skills: input.skills ?? null,
    open_positions: input.openPositions ?? null,
    posted_date: input.postedDate ?? null,
    status: input.status,
  };
}

export async function listJobPostingsAdmin() {
  const { data, error } = await supabaseBrowser
    .from("job_postings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function listPublishedJobPostings() {
  const { data, error } = await supabase
    .from("job_postings")
    .select("*")
    .eq("status", "open")
    .order("posted_date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function getJobPostingById(id: number) {
  const { data, error } = await supabaseBrowser
    .from("job_postings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return fromRow(data);
}

export async function createJobPosting(input: JobPostingCreateInput) {
  const { data, error } = await supabaseBrowser
    .from("job_postings")
    .insert(toWritePayload(input))
    .select("*")
    .single();

  if (error) throw error;
  return fromRow(data);
}

export async function updateJobPosting(id: number, input: JobPostingUpdateInput) {
  const { data, error } = await supabaseBrowser
    .from("job_postings")
    .update(toWritePayload(input))
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return fromRow(data);
}

export async function deleteJobPosting(id: number) {
  const { error } = await supabaseBrowser
    .from("job_postings")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

