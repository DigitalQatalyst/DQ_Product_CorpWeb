import { listPublishedServices } from "@/features/services/hooks/useServices";
import { ServicesMarketplaceClient } from "./ServicesMarketplaceClient";

export async function ServicesMarketplacePage() {
  const services = await listPublishedServices();
  return <ServicesMarketplaceClient allServices={services} />;
}
