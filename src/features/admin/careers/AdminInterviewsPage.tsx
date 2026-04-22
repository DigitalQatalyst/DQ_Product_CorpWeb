"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, ExternalLink, Loader, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  listAdminApplications,
  listAdminInterviews,
  scheduleAdminInterview,
  type AdminJobApplication,
} from "@/features/careers/api";

type Draft = {
  applicationId: string;
  startLocal: string; // datetime-local
  durationMinutes: number;
  interviewType: string;
  notes: string;
};

function emptyDraft(): Draft {
  return {
    applicationId: "",
    startLocal: "",
    durationMinutes: 45,
    interviewType: "Google Meet",
    notes: "",
  };
}

export function AdminInterviewsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apps, setApps] = useState<AdminJobApplication[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft());

  const acceptedApps = useMemo(
    () => apps.filter((a) => (a.application_status ?? "pending") === "accepted"),
    [apps],
  );

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const [a, i] = await Promise.all([listAdminApplications(), listAdminInterviews()]);
      setApps(a);
      setInterviews(i);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load interviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  function openSchedule() {
    setDraft(emptyDraft());
    setOpen(true);
  }

  async function onSchedule() {
    setError(null);
    const appId = draft.applicationId;
    if (!appId) return setError("Select an accepted application.");
    if (!draft.startLocal) return setError("Pick a date/time.");

    const startIso = new Date(draft.startLocal).toISOString();

    setSaving(true);
    try {
      const res = await scheduleAdminInterview({
        applicationId: appId,
        scheduledStartIso: startIso,
        durationMinutes: Number(draft.durationMinutes) || 45,
        interviewType: draft.interviewType,
        notes: draft.notes.trim() || undefined,
      });

      if (res.meetUrl) toast.success("Interview scheduled with Google Meet.");
      else toast.success("Interview scheduled (Meet not configured).");

      setOpen(false);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to schedule interview.");
      toast.error("Failed to schedule interview.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Calendar size={20} /> Interviews
          </h1>
          <p className="text-sm text-muted-foreground">
            Schedule interviews for accepted applications. When Google is configured, this creates a calendar invite + Meet link.
          </p>
        </div>
        <Button onClick={openSchedule} disabled={loading}>
          <Plus /> Schedule
        </Button>
      </div>

      {error && (
        <Card className="py-0 gap-0 border-destructive/30">
          <CardContent className="p-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      <Card className="py-0 gap-0">
        <CardHeader className="px-6 py-4 border-b border-border bg-muted/30">
          <h2 className="font-semibold text-foreground">Scheduled interviews</h2>
          <p className="text-sm text-muted-foreground">
            Latest first.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader className="animate-spin text-primary" size={28} />
            </div>
          ) : interviews.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground italic py-14">
              No interviews scheduled yet.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {interviews.map((iv, idx) => (
                <div key={iv.id ?? idx} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {iv.candidate_name ?? "Candidate"} • {iv.interview_type ?? "Interview"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {iv.scheduled_date ? new Date(iv.scheduled_date).toLocaleString() : "—"}
                        {iv.status ? ` • ${iv.status}` : ""}
                      </p>
                    </div>
                    {iv.meet_url ? (
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={
                          <a href={iv.meet_url} target="_blank" rel="noreferrer noopener" />
                        }
                      >
                        Join Meet <ExternalLink />
                      </Button>
                    ) : null}
                  </div>
                  {iv.calendar_html_link ? (
                    <div className="mt-3">
                      <Button
                        variant="link"
                        size="sm"
                        nativeButton={false}
                        render={
                          <a href={iv.calendar_html_link} target="_blank" rel="noreferrer noopener" />
                        }
                      >
                        Open calendar event <ExternalLink />
                      </Button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="hidden" />
        <DialogContent className="sm:max-w-2xl max-h-[calc(100vh-4rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule interview</DialogTitle>
            <DialogDescription>
              Select an accepted application, pick a time, and we’ll create the invite. If Google isn’t configured yet, the interview is still saved.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Accepted application
              </label>
              <Select
                value={draft.applicationId}
                onValueChange={(v) => setDraft((d) => ({ ...d, applicationId: v ?? "" }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select applicant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {acceptedApps.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.first_name} {a.last_name} — {a.job_title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {acceptedApps.length === 0 ? (
                <p className="text-xs text-muted-foreground mt-1">
                  No accepted applications yet.
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Date & time
                </label>
                <Input
                  type="datetime-local"
                  value={draft.startLocal}
                  onChange={(e) => setDraft((d) => ({ ...d, startLocal: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Duration (minutes)
                </label>
                <Input
                  type="number"
                  min={15}
                  step={15}
                  value={draft.durationMinutes}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, durationMinutes: Number(e.target.value) || 45 }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-foreground">
                  Interview type
                </label>
                <Input
                  value={draft.interviewType}
                  onChange={(e) => setDraft((d) => ({ ...d, interviewType: e.target.value }))}
                  placeholder="Google Meet"
                />
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium text-foreground">
                Notes (optional)
              </label>
              <Textarea
                value={draft.notes}
                onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                placeholder="Agenda, interviewer names, prep links..."
                className="min-h-28"
              />
            </div>
          </div>

          <DialogFooter showCloseButton>
            <Button onClick={onSchedule} disabled={saving || acceptedApps.length === 0}>
              {saving ? <Loader className="animate-spin" /> : null}
              Schedule interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

