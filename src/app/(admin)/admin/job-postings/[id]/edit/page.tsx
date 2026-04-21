import type { Metadata } from "next";
import { JobPostingEditorPage } from "@/features/admin/careers/JobPostingEditorPage";

export const metadata: Metadata = { title: "Edit Job Posting | DQ Admin" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <JobPostingEditorPage id={Number(id)} />;
}
