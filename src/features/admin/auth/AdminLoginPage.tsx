"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setLoading(true);
    setError(null);
    const { error: signInError } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg">
      <Card className="py-0 gap-0">
        <CardHeader className="px-6 py-4 border-b border-border bg-muted/30">
          <h1 className="text-xl font-semibold text-foreground">Admin Login</h1>
          <p className="text-sm text-muted-foreground">Sign in to manage products.</p>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {error && <div className="text-sm text-destructive">{error}</div>}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Email</div>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Password</div>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </div>
          <Button onClick={signIn} disabled={loading || !email || !password} className="w-full">
            Sign in
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

