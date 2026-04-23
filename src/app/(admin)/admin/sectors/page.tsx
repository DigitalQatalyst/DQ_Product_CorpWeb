import type { Metadata } from "next";
import { SectorsAdminPage } from "@/features/admin/sectors/SectorsAdminPage";

export const metadata: Metadata = { title: "Sectors | DQ Admin" };

export default function Page() {
  return <SectorsAdminPage />;
}
