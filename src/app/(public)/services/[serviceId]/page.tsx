import type { Metadata } from "next";
import { ServiceDetailPage, generateMetadata as genMeta } from "@/features/services/marketplace/components/ServiceDetailPage";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ serviceId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceId } = await params;
  return genMeta({ serviceId });
}

export default async function Page({ params }: Props) {
  const { serviceId } = await params;
  return <ServiceDetailPage serviceId={serviceId} />;
}
