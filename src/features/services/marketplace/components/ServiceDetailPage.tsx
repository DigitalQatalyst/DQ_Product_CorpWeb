import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getServiceById } from "@/features/services/hooks/useServices";
import { ServiceDetailClient } from "./ServiceDetailClient";

type Props = { serviceId: string };

export async function generateMetadata({ serviceId }: Props): Promise<Metadata> {
  const service = await getServiceById(serviceId);
  if (!service) return {};
  return {
    title: `${service.title} | DigitalQatalyst`,
    description: service.description,
  };
}

export async function ServiceDetailPage({ serviceId }: Props) {
  const service = await getServiceById(serviceId);
  if (!service) return notFound();
  return <ServiceDetailClient service={service} />;
}
