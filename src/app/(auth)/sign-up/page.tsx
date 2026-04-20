import type { Metadata } from "next";
import { SignUpPage } from "@/features/auth/SignUpPage";

export const metadata: Metadata = {
  title: "Create account | DigitalQatalyst",
  description: "Create an account. Admin access is granted by an administrator.",
};

export default function Page() {
  return <SignUpPage />;
}
