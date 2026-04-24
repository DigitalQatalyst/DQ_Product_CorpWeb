import type { Metadata } from "next";
import { ServicesPage } from "@/features/services/page/ServicesPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services | DigitalQatalyst",
  description: "Accelerate your digital transformation with DQ's end-to-end services.",
};

export default async function Page() {
  return <ServicesPage />;
}
