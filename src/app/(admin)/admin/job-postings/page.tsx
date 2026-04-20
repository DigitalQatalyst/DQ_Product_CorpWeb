import type { Metadata } from "next";
import { JobPostingsAdminPage } from "@/features/careers/admin/JobPostingsAdminPage";

export const metadata: Metadata = { title: "Job Postings | DQ Admin" };

export default function Page() {
  return <JobPostingsAdminPage />;
}

