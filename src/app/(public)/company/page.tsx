import type { Metadata } from "next";
import { CompanyPage } from "@/features/company/CompanyPage";

export const metadata: Metadata = {
  title: "Company | DigitalQatalyst",
  description: "Since 2015, empowering organizations to become Digital Cognitive Organizations.",
};

export default function Page() {
  return <CompanyPage />;
}
