"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const accessError = (() => {
    const code = searchParams.get("error");
    if (code === "not_admin") {
      return "This account is not authorized for the admin dashboard. An administrator can grant access by setting your role in Admin → Profiles.";
    }
    if (code === "admin_check_failed") {
      return "Could not verify admin access. Try again or contact support.";
    }
    return null;
  })();

  async function signIn() {
    setLoading(true);
    setError(null);
    const { error: signInError } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      setLoading(false);
      setError(signInError.message);
      return;
    }

    const { data: sessionData } = await supabaseBrowser.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) {
      setLoading(false);
      setError("Could not start a session. Try again.");
      return;
    }

    const me = await fetch("/api/admin/me", {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (me.status === 403 || me.status === 401) {
      await supabaseBrowser.auth.signOut();
      setLoading(false);
      setError(
        "This account is not authorized for the admin dashboard. An administrator can grant access by setting your role in Admin → Profiles.",
      );
      return;
    }
    if (!me.ok) {
      await supabaseBrowser.auth.signOut();
      setLoading(false);
      setError("Could not verify admin access. Try again later.");
      return;
    }

    setLoading(false);
    const next = searchParams.get("next");
    const safeNext =
      next && next.startsWith("/") && !next.startsWith("//") ? next : "/admin";
    router.replace(safeNext);
    router.refresh();
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg flex-1 flex flex-col justify-center">
      <Card className="py-0 gap-0">
        <CardHeader className="px-6 py-4 border-b border-border bg-muted/30">
          <h1 className="text-xl font-semibold text-foreground">Sign in</h1>
          <p className="text-sm text-muted-foreground">
            Admin access requires an account and an administrator-assigned role.
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {accessError && <div className="text-sm text-destructive">{accessError}</div>}
          {error && <div className="text-sm text-destructive">{error}</div>}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Email</div>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Password</div>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
            />
          </div>
          <Button onClick={signIn} disabled={loading || !email || !password} className="w-full">
            Sign in
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            No account?{" "}
            <Link href="/sign-up" className="text-primary font-medium hover:underline">
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
