import { JobDetailPage } from "@/features/careers/components/JobDetailPage";

export default async function Page({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  return <JobDetailPage jobId={jobId} />;
}
