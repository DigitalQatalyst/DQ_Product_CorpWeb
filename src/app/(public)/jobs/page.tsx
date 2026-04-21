import type { Metadata } from "next";
import { JobsListingPage } from "@/features/careers/components/JobsListingPage";

export const metadata: Metadata = {
  title: "Open Positions | DigitalQatalyst",
  description: "Explore career opportunities at DigitalQatalyst.",
};

export default function Page() {
  return <JobsListingPage />;
}
