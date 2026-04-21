import type { Metadata } from "next";
import { JobPostingsAdminPage } from "@/features/admin/careers/JobPostingsAdminPage";

export const metadata: Metadata = { title: "Job Postings | DQ Admin" };

export default function Page() {
  return <JobPostingsAdminPage />;
}

