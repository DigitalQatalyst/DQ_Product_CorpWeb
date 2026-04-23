import { ServiceDetailPage } from "@/features/services/marketplace/components/ServiceDetailPage";

type Props = { params: Promise<{ serviceId: string }> };

export default async function Page({ params }: Props) {
  const { serviceId } = await params;
  return <ServiceDetailPage serviceId={serviceId} />;
}
