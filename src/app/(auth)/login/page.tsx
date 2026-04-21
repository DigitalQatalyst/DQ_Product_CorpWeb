import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginPage } from "@/features/auth/LoginPage";

export const metadata: Metadata = {
  title: "Sign in | DigitalQatalyst",
  description: "Sign in to your account.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">Loading…</div>}>
      <LoginPage />
    </Suspense>
  );
}
