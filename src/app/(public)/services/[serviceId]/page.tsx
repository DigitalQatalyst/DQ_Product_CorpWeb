import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceCategoryBySlug } from "@/features/services/api/serviceCategories";
import { getServiceById } from "@/features/services/api/services";
import { ServiceCategoryPage } from "@/features/services/components/ServiceCategoryPage";
import { ServiceDetailPage } from "@/features/services/marketplace/components/ServiceDetailPage";

type Props = { params: Promise<{ serviceId: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceId } = await params;

  try {
    const cat = await getServiceCategoryBySlug(serviceId);
    if (cat) return { title: `${cat.name} | DigitalQatalyst`, description: cat.description };
  } catch {}

  try {
    const svc = await getServiceById(serviceId);
    if (svc) return { title: `${svc.title} | DigitalQatalyst`, description: svc.description };
  } catch {}

  return { title: "Service Not Found | DigitalQatalyst" };
}

export default async function Page({ params }: Props) {
  const { serviceId } = await params;

  // Check if it's a service category page (design-services, deploy-services, etc.)
  try {
    const cat = await getServiceCategoryBySlug(serviceId);
    if (cat) return <ServiceCategoryPage slug={serviceId} />;
  } catch {}

  // Check if it's a marketplace service detail page
  try {
    const svc = await getServiceById(serviceId);
    if (svc) return <ServiceDetailPage serviceId={serviceId} />;
  } catch {}

  notFound();
}
