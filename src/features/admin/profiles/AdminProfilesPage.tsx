"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, UserCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import type { AdminProfileRow } from "./admin-profiles.types";
import { isAdminProfileRole } from "@/lib/admin-role";

const ROLE_OPTIONS = ["user", "admin"] as const;

export function AdminProfilesPage() {
  const [profiles, setProfiles] = useState<AdminProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminProfileRow | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/profiles", {
        cache: "no-store",
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `Failed (${res.status})`);
      }
      const data = (await res.json()) as { profiles: AdminProfileRow[] };
      setProfiles(data.profiles ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load profiles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveEdit() {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/profiles/${encodeURIComponent(editing.id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          role: editing.role,
          first_name: editing.first_name,
          last_name: editing.last_name,
          email: editing.email,
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `Save failed (${res.status})`);
      }
      const data = (await res.json()) as { profile: AdminProfileRow };
      setProfiles((prev) => prev.map((p) => (p.id === data.profile.id ? data.profile : p)));
      setEditing(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Profiles</h1>
          <p className="text-sm text-muted-foreground mt-1">
            New sign-ups get the <Badge variant="secondary">user</Badge> role. Only{" "}
            <Badge variant="secondary">admin</Badge> can access this dashboard.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Separator />

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserCircle className="size-5 text-primary" />
            All profiles
          </CardTitle>
          <CardDescription>
            {loading ? "Loading…" : `${profiles.length} profile${profiles.length === 1 ? "" : "s"}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading profiles…</div>
          ) : profiles.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No profiles found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      {p.full_name ||
                        [p.first_name, p.last_name].filter(Boolean).join(" ") ||
                        "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.email ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={isAdminProfileRole(p.role) ? "default" : "outline"}>
                        {p.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => setEditing({ ...p })}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Sheet open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <SheetContent className="flex flex-col gap-0 sm:max-w-md">
          <SheetHeader className="space-y-1 pb-4 border-b border-border">
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>Update role and display fields. Changes save to Supabase.</SheetDescription>
          </SheetHeader>
          {editing && (
            <div className="flex-1 overflow-y-auto py-6 space-y-4 px-1">
              <div className="space-y-2">
                <Label htmlFor="profile-role">Role</Label>
                <Select
                  value={editing.role}
                  onValueChange={(v) =>
                    setEditing((e) => (e && v != null ? { ...e, role: v } : e))
                  }
                >
                  <SelectTrigger id="profile-role" className="w-full">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={editing.email ?? ""}
                  onChange={(ev) =>
                    setEditing((e) => (e ? { ...e, email: ev.target.value || null } : e))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="profile-fn">First name</Label>
                  <Input
                    id="profile-fn"
                    value={editing.first_name ?? ""}
                    onChange={(ev) =>
                      setEditing((e) => (e ? { ...e, first_name: ev.target.value || null } : e))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-ln">Last name</Label>
                  <Input
                    id="profile-ln"
                    value={editing.last_name ?? ""}
                    onChange={(ev) =>
                      setEditing((e) => (e ? { ...e, last_name: ev.target.value || null } : e))
                    }
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Full name is generated from first and last name in the database; edit those fields
                to change it.
              </p>
            </div>
          )}
          <SheetFooter className="border-t border-border pt-4 gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setEditing(null)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={() => void saveEdit()} disabled={saving || !editing}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
