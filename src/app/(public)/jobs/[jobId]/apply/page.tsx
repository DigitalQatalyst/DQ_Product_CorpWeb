import type { Metadata } from "next";
import { JobApplyPage } from "@/features/careers/components/JobApplyPage";

export const metadata: Metadata = {
  title: "Apply | DigitalQatalyst",
};

export default async function Page({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  return <JobApplyPage jobId={jobId} />;
}

