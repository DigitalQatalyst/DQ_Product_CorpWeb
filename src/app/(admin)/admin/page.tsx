import type { Metadata } from "next";
import { AdminDashboard } from "@/features/admin/dashboard/AdminDashboard";

export const metadata: Metadata = { title: "Dashboard | DQ Admin" };

export default function Page() {
  return <AdminDashboard />;
}
