import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { designDeployData } from "@/features/services/data/design-deploy.data";
import { serviceRegistry } from "@/features/services/data/service-detail.data";
import { serviceItems } from "@/features/services/marketplace/data/service.data";
import { ServiceCategoryPage } from "@/features/services/components/ServiceCategoryPage";
import { ServiceDetailPage } from "@/features/services/marketplace/components/ServiceDetailPage";

type Props = { params: Promise<{ serviceId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceId } = await params;
  const dd = designDeployData.find((s) => s.slug === serviceId);
  if (dd) return { title: `${dd.hero.title} | DigitalQatalyst`, description: dd.hero.subtitle };
  const ms = serviceItems.find((s) => s.id === serviceId);
  if (ms) return { title: `${ms.title} | DigitalQatalyst`, description: ms.description };
  const service = serviceRegistry[serviceId];
  if (service) return { title: `${service.title} | DigitalQatalyst`, description: service.subtitle };
  return { title: "Service Not Found | DigitalQatalyst" };
}

export function generateStaticParams() {
  return [
    ...designDeployData.map((s) => ({ serviceId: s.slug })),
    ...serviceItems.map((s) => ({ serviceId: s.id })),
    ...Object.keys(serviceRegistry).map((serviceId) => ({ serviceId })),
  ];
}

export default async function Page({ params }: Props) {
  const { serviceId } = await params;

  const dd = designDeployData.find((s) => s.slug === serviceId);
  if (dd) return <ServiceCategoryPage slug={serviceId} />;

  const ms = serviceItems.find((s) => s.id === serviceId);
  if (ms) return <ServiceDetailPage service={ms} />;

  const service = serviceRegistry[serviceId];
  if (service) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-foreground mb-4">{service.title}</h1>
      <p className="text-muted-foreground">{service.subtitle}</p>
    </div>
  );

  notFound();
}
