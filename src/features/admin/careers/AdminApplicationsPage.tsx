"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  CircleX,
  FileText,
  Loader,
  Search,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApplicationStatus, AdminJobApplication } from "@/features/careers/api";
import { listAdminApplications, updateAdminApplication } from "@/features/careers/api";

function statusPill(status: ApplicationStatus | null) {
  const s = status ?? "pending";
  const cls =
    s === "accepted"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : s === "rejected"
        ? "bg-red-50 text-red-700 border-red-100"
        : s === "shortlisted"
          ? "bg-purple-50 text-purple-700 border-purple-100"
          : s === "reviewing"
            ? "bg-blue-50 text-blue-700 border-blue-100"
            : "bg-yellow-50 text-yellow-700 border-yellow-100";
  return (
    <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize border ${cls}`}>
      {s.replace("_", " ")}
    </span>
  );
}

export function AdminApplicationsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apps, setApps] = useState<AdminJobApplication[]>([]);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => apps.find((a) => a.id === selectedId) ?? null,
    [apps, selectedId],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps.filter((a) => {
      const s = (a.application_status ?? "pending") as ApplicationStatus;
      if (statusFilter !== "all" && s !== statusFilter) return false;
      if (!q) return true;
      const name = `${a.first_name} ${a.last_name}`.toLowerCase();
      return (
        name.includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.job_title.toLowerCase().includes(q)
      );
    });
  }, [apps, query, statusFilter]);

  const stats = useMemo(() => {
    const total = apps.length;
    const by: Record<string, number> = { pending: 0, reviewing: 0, shortlisted: 0, accepted: 0, rejected: 0 };
    for (const a of apps) by[(a.application_status ?? "pending") as string] = (by[(a.application_status ?? "pending") as string] ?? 0) + 1;
    return { total, by };
  }, [apps]);

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const rows = await listAdminApplications();
      setApps(rows);
      if (!selectedId && rows.length) setSelectedId(rows[0]!.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function setStatus(next: ApplicationStatus, opts?: { reason?: string; notify?: string }) {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      await updateAdminApplication(selected.id, {
        status: next,
        rejectionReason: opts?.reason ?? null,
        internalNotes: selected.internal_notes ?? null,
        notifyMessage: opts?.notify ?? null,
      });
      toast.success(`Application marked as ${next}.`);
      await refresh();
      setSelectedId(selected.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update application.");
      toast.error("Failed to update application.");
    } finally {
      setSaving(false);
    }
  }

  async function saveNotes(notes: string) {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      await updateAdminApplication(selected.id, {
        status: (selected.application_status ?? "pending") as ApplicationStatus,
        internalNotes: notes,
        rejectionReason: selected.rejection_reason ?? null,
        notifyMessage: null,
      });
      toast.success("Notes saved.");
      setApps((prev) => prev.map((a) => (a.id === selected.id ? { ...a, internal_notes: notes } : a)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save notes.");
      toast.error("Failed to save notes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText size={20} /> Applications
          </h1>
          <p className="text-sm text-muted-foreground">
            Review and progress candidates through your hiring pipeline.
          </p>
        </div>
        <Button variant="outline" onClick={refresh} disabled={loading || saving}>
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="py-0 gap-0 border-destructive/30">
          <CardContent className="p-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="py-0 gap-0 border-r-[3px] border-r-primary">
          <CardContent className="p-4">
            <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground mt-1">Total</p>
          </CardContent>
        </Card>
        <Card className="py-0 gap-0 border-r-[3px] border-r-emerald-600">
          <CardContent className="p-4">
            <p className="text-2xl font-semibold text-foreground">{stats.by.accepted ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Accepted</p>
          </CardContent>
        </Card>
        <Card className="py-0 gap-0 border-r-[3px] border-r-red-600">
          <CardContent className="p-4">
            <p className="text-2xl font-semibold text-foreground">{stats.by.rejected ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Rejected</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="py-0 gap-0 lg:col-span-2">
          <CardHeader className="px-6 py-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, email, role..."
                  className="pl-9"
                />
              </div>
              <div className="w-44">
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter((v ?? "all") as any)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader className="animate-spin text-primary" size={28} />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground italic py-14">
                No applications found.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {filtered.map((a) => {
                  const active = a.id === selectedId;
                  return (
                    <button
                      key={a.id}
                      onClick={() => setSelectedId(a.id)}
                      className={[
                        "w-full text-left px-6 py-4 hover:bg-muted/30 transition-colors",
                        active ? "bg-muted/40" : "",
                      ].join(" ")}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                          <User className="text-primary" size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {a.first_name} {a.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{a.email}</p>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {a.job_title}
                          </p>
                        </div>
                        <div className="shrink-0">{statusPill(a.application_status as any)}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="py-0 gap-0 lg:col-span-3">
          <CardHeader className="px-6 py-4 border-b border-border bg-muted/30">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-semibold text-foreground">Review</h2>
                <p className="text-sm text-muted-foreground">
                  {selected ? (
                    <>
                      <span className="font-medium text-foreground">
                        {selected.first_name} {selected.last_name}
                      </span>{" "}
                      • {selected.job_title}
                    </>
                  ) : (
                    "Select an application to view details."
                  )}
                </p>
              </div>
              {selected ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={saving}
                    onClick={() => setStatus("reviewing")}
                  >
                    Mark reviewing
                  </Button>
                  <Button
                    variant="outline"
                    disabled={saving}
                    onClick={() => setStatus("shortlisted")}
                  >
                    Next level
                  </Button>
                  <Button
                    disabled={saving}
                    onClick={() =>
                      setStatus("accepted", {
                        notify: "Thanks for applying. You have been accepted to the next stage. Our team will contact you shortly with the next steps.",
                      })
                    }
                  >
                    <CheckCircle /> Accept
                  </Button>
                </div>
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {!selected ? (
              <p className="text-sm text-muted-foreground">
                Choose an application from the list to review.
              </p>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  {statusPill(selected.application_status as any)}
                  <Badge variant="outline">
                    Applied{" "}
                    {selected.applied_at
                      ? new Date(selected.applied_at).toLocaleString()
                      : "—"}
                  </Badge>
                  <Badge variant="outline">{selected.current_location}</Badge>
                  <Badge variant="outline">{selected.years_of_experience} yrs</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Info label="Email" value={selected.email} />
                  <Info label="Phone" value={selected.phone} />
                  <Info label="LinkedIn" value={selected.linkedin_url ?? "—"} mono />
                  <Info label="Portfolio" value={selected.portfolio_url ?? "—"} mono />
                  <Info label="Current company" value={selected.current_company ?? "—"} />
                  <Info label="Current role" value={selected.current_job_role ?? "—"} />
                  <Info label="Notice period" value={selected.notice_period} />
                  <Info label="Expected salary" value={selected.expected_salary ?? "—"} />
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Cover letter</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {selected.cover_letter}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Info label="Resume URL" value={selected.resume_url} mono />
                  <Info label="Resume filename" value={selected.resume_filename} />
                  <Info
                    label="Additional docs URL"
                    value={selected.additional_documents_url ?? "—"}
                    mono
                  />
                  <Info
                    label="Additional docs filename"
                    value={selected.additional_documents_filename ?? "—"}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Internal notes
                    </label>
                    <Textarea
                      value={selected.internal_notes ?? ""}
                      onChange={(e) =>
                        setApps((prev) =>
                          prev.map((a) =>
                            a.id === selected.id
                              ? { ...a, internal_notes: e.target.value }
                              : a,
                          ),
                        )
                      }
                      placeholder="Private notes for HR (not sent to applicant)."
                      className="min-h-32"
                    />
                    <div className="mt-2 flex justify-end">
                      <Button
                        variant="outline"
                        disabled={saving}
                        onClick={() => saveNotes(selected.internal_notes ?? "")}
                      >
                        Save notes
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Reject applicant
                    </label>
                    <Textarea
                      value={selected.rejection_reason ?? ""}
                      onChange={(e) =>
                        setApps((prev) =>
                          prev.map((a) =>
                            a.id === selected.id
                              ? { ...a, rejection_reason: e.target.value }
                              : a,
                          ),
                        )
                      }
                      placeholder="Reason shown to the applicant."
                      className="min-h-32"
                    />
                    <div className="mt-2 flex justify-end">
                      <Button
                        variant="destructive"
                        disabled={saving}
                        onClick={() =>
                          setStatus("rejected", {
                            reason: selected.rejection_reason ?? undefined,
                            notify:
                              selected.rejection_reason ??
                              "Thank you for your interest. At this time, we’re proceeding with other candidates.",
                          })
                        }
                      >
                        <CircleX /> Reject
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Email sending is currently stubbed server-side; we store the message and log it.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  mono,
}: Readonly<{ label: string; value: string; mono?: boolean }>) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={["text-sm text-foreground mt-1 break-words", mono ? "font-mono text-xs" : ""].join(" ")}>
        {value}
      </p>
    </div>
  );
}

