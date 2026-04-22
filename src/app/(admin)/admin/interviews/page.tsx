import type { Metadata } from "next";
import { AdminInterviewsPage } from "@/features/admin/careers/AdminInterviewsPage";

export const metadata: Metadata = { title: "Interviews | DQ Admin" };

export default function Page() {
  return <AdminInterviewsPage />;
}

