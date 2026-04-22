import type { Metadata } from "next";
import { AdminApplicationsPage } from "@/features/admin/careers/AdminApplicationsPage";

export const metadata: Metadata = { title: "Applications | DQ Admin" };

export default function Page() {
  return <AdminApplicationsPage />;
}

