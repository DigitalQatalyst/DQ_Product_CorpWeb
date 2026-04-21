import type { Metadata } from "next";
import { JobPostingEditorPage } from "@/features/admin/careers/JobPostingEditorPage";

export const metadata: Metadata = { title: "New Job Posting | DQ Admin" };

export default function Page() {
  return <JobPostingEditorPage />;
}
