import type { Metadata } from "next";
import { ServicesAdminPage } from "@/features/admin/services/ServicesAdminPage";

export const metadata: Metadata = { title: "Services | DQ Admin" };

export default function Page() {
  return <ServicesAdminPage />;
}
