import type { Metadata } from "next";
import { CareersPage } from "@/features/careers/CareersPage";

export const metadata: Metadata = {
  title: "Careers | DigitalQatalyst",
  description: "Shape the future of digital transformation. Join our team of innovators building Digital Cognitive Organizations.",
};

export default function Page() {
  return <CareersPage />;
}
