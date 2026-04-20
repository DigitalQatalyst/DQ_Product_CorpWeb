import type { Metadata } from "next";
import { AdminLoginPage } from "@/features/admin/auth/AdminLoginPage";

export const metadata: Metadata = { title: "Admin Login | DigitalQatalyst" };

export default function Page() {
  return <AdminLoginPage />;
}

