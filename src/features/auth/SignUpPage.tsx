"use client";

import { useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function signUp() {
    setLoading(true);
    setError(null);
    const origin = globalThis.location?.origin ?? "";
    const { error: signUpError } = await supabaseBrowser.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: origin ? `${origin}/login` : undefined,
      },
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg flex-1 flex flex-col justify-center">
        <Card className="py-0 gap-0">
          <CardHeader className="px-6 py-4 border-b border-border bg-muted/30">
            <h1 className="text-xl font-semibold text-foreground">Check your email</h1>
            <p className="text-sm text-muted-foreground">
              If email confirmation is enabled, use the link we sent. Then sign in.
            </p>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your account defaults to the <span className="font-medium text-foreground">user</span>{" "}
              role. An administrator can promote you to <span className="font-medium text-foreground">admin</span>{" "}
              in Admin → Profiles if you need dashboard access.
            </p>
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center")}
            >
              Back to sign in
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg flex-1 flex flex-col justify-center">
      <Card className="py-0 gap-0">
        <CardHeader className="px-6 py-4 border-b border-border bg-muted/30">
          <h1 className="text-xl font-semibold text-foreground">Create account</h1>
          <p className="text-sm text-muted-foreground">
            You will get the default <span className="font-medium text-foreground">user</span> role.
            Admin access is granted in Admin → Profiles.
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
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
              autoComplete="new-password"
              minLength={6}
            />
          </div>
          <Button onClick={signUp} disabled={loading || !email || password.length < 6} className="w-full">
            Create account
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
