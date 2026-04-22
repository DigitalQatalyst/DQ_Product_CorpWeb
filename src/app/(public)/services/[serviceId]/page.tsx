import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceById } from "@/features/services/hooks/useServices";
import { ServiceDetailPage } from "@/features/services/marketplace/components/ServiceDetailPage";

type Props = { params: Promise<{ serviceId: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceId } = await params;
  try {
    const svc = await getServiceById(serviceId);
    if (svc) return { title: `${svc.title} | DigitalQatalyst`, description: svc.description };
  } catch {}
  return { title: "Service Not Found | DigitalQatalyst" };
}

export default async function Page({ params }: Props) {
  const { serviceId } = await params;

  try {
    const svc = await getServiceById(serviceId);
    if (svc) return <ServiceDetailPage serviceId={serviceId} />;
  } catch {}

  notFound();
}
