import type { Metadata } from "next";
import { ServiceCategoriesAdminPage } from "@/features/admin/services/ServiceCategoriesAdminPage";

export const metadata: Metadata = { title: "Service Categories | DQ Admin" };

export default function Page() {
  return <ServiceCategoriesAdminPage />;
}
