export type JobPostingStatus = "open" | "closed";

export type JobPostingType = {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills?: { core: string[]; behavioral: string[] } | null;
  openPositions?: number | null;
  postedDate?: string | null;
  status: JobPostingStatus;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type JobPostingCreateInput = Omit<
  JobPostingType,
  "id" | "createdAt" | "updatedAt"
>;

export type JobPostingUpdateInput = Partial<JobPostingCreateInput>;

export type Department = {
  id: number | string;
  name: string;
};

