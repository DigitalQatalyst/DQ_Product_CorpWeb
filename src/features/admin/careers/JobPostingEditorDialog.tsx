"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  arrayToLines,
  linesToArray,
  type Department,
  type JobPostingCreateInput,
  type JobPostingStatus,
  type JobPostingType,
} from "@/features/careers/api";

export type JobPostingEditorMode =
  | { kind: "create" }
  | { kind: "edit"; posting: JobPostingType };

function toDraft(posting: JobPostingType): JobPostingCreateInput {
  return {
    title: posting.title,
    department: posting.department,
    location: posting.location,
    type: posting.type,
    level: posting.level,
    description: posting.description,
    responsibilities: posting.responsibilities ?? [],
    requirements: posting.requirements ?? [],
    skills: posting.skills ?? { core: [], behavioral: [] },
    openPositions: posting.openPositions ?? null,
    postedDate: posting.postedDate ?? null,
    status: posting.status,
  };
}

function emptyDraft(): JobPostingCreateInput {
  return {
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    level: "Mid",
    description: "",
    responsibilities: [],
    requirements: [],
    skills: { core: [], behavioral: [] },
    openPositions: 1,
    postedDate: new Date().toISOString(),
    status: "open",
  };
}

function normalizeDraft(draft: JobPostingCreateInput): JobPostingCreateInput {
  return {
    ...draft,
    department: draft.department.trim(),
    title: draft.title.trim(),
    location: draft.location.trim(),
    type: draft.type.trim(),
    level: draft.level.trim(),
    description: draft.description.trim(),
    requirements: draft.requirements ?? [],
    responsibilities: draft.responsibilities ?? [],
    skills: draft.skills ?? null,
    postedDate: draft.postedDate || null,
    openPositions: typeof draft.openPositions === "number" ? draft.openPositions : null,
    status: draft.status,
  };
}

function validateDraft(draft: JobPostingCreateInput) {
  if (!draft.title) throw new Error("Title is required.");
  if (!draft.department) throw new Error("Department is required.");
  if (!draft.location) throw new Error("Location is required.");
  if (!draft.type) throw new Error("Employment type is required.");
  if (!draft.level) throw new Error("Level is required.");
  if (!draft.description) throw new Error("Description is required.");
}

export function JobPostingEditorDialog({
  open,
  onOpenChange,
  mode,
  departments,
  saving,
  onSave,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: JobPostingEditorMode;
  departments: Department[];
  saving: boolean;
  onSave: (input: JobPostingCreateInput) => Promise<void>;
}>) {
  const [draft, setDraft] = useState<JobPostingCreateInput>(emptyDraft());
  const [localError, setLocalError] = useState<string | null>(null);

  const title = useMemo(
    () => (mode.kind === "create" ? "New Job Posting" : "Edit Job Posting"),
    [mode.kind],
  );

  useEffect(() => {
    setLocalError(null);
    if (!open) return;
    if (mode.kind === "create") setDraft(emptyDraft());
    else setDraft(toDraft(mode.posting));
  }, [open, mode]);

  async function handleSave() {
    setLocalError(null);
    try {
      const normalized = normalizeDraft(draft);
      validateDraft(normalized);
      await onSave(normalized);
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Failed to save job posting.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className="hidden" />
      <DialogContent className="sm:max-w-3xl max-h-[calc(100vh-4rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Fields like requirements and responsibilities should be entered one per line.
          </DialogDescription>
        </DialogHeader>

        {localError && (
          <p className="text-sm text-destructive border border-destructive/30 bg-destructive/5 rounded-md p-3">
            {localError}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-foreground">Title</label>
            <Input
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder="e.g. Senior Data Engineer"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Department</label>
            <Select
              value={draft.department}
              onValueChange={(v) => setDraft((d) => ({ ...d, department: v ?? "" }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {departments.length > 0 ? (
                    departments.map((d) => (
                      <SelectItem key={d.id} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value={draft.department || "General"}>
                      {draft.department || "General"}
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              If departments fail to load, you can still type below.
            </p>
            <Input
              value={draft.department}
              onChange={(e) => setDraft((d) => ({ ...d, department: e.target.value }))}
              placeholder="Department name"
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Location</label>
            <Input
              value={draft.location}
              onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
              placeholder="e.g. Dubai (Hybrid)"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Employment type</label>
            <Input
              value={draft.type}
              onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))}
              placeholder="e.g. Full-time"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Level</label>
            <Input
              value={draft.level}
              onChange={(e) => setDraft((d) => ({ ...d, level: e.target.value }))}
              placeholder="e.g. Senior"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Open positions</label>
            <Input
              type="number"
              value={draft.openPositions ?? ""}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  openPositions: e.target.value ? Number(e.target.value) : null,
                }))
              }
              min={0}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Status</label>
            <Select
              value={draft.status}
              onValueChange={(v) =>
                setDraft((d) => ({ ...d, status: v as JobPostingStatus }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <Textarea
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              placeholder="Short overview shown on the listing + detail page."
              className="min-h-28"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Responsibilities (one per line)
            </label>
            <Textarea
              value={arrayToLines(draft.responsibilities)}
              onChange={(e) =>
                setDraft((d) => ({ ...d, responsibilities: linesToArray(e.target.value) }))
              }
              className="min-h-40"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Requirements (one per line)
            </label>
            <Textarea
              value={arrayToLines(draft.requirements)}
              onChange={(e) =>
                setDraft((d) => ({ ...d, requirements: linesToArray(e.target.value) }))
              }
              className="min-h-40"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Skills (core, one per line)
            </label>
            <Textarea
              value={arrayToLines(draft.skills?.core ?? [])}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  skills: {
                    core: linesToArray(e.target.value),
                    behavioral: d.skills?.behavioral ?? [],
                  },
                }))
              }
              className="min-h-32"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Skills (behavioral, one per line)
            </label>
            <Textarea
              value={arrayToLines(draft.skills?.behavioral ?? [])}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  skills: {
                    core: d.skills?.core ?? [],
                    behavioral: linesToArray(e.target.value),
                  },
                }))
              }
              className="min-h-32"
            />
          </div>
        </div>

        <DialogFooter showCloseButton>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader className="animate-spin" /> : null}
            {mode.kind === "create" ? "Create" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

