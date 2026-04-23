"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createJobPosting,
  createDepartment,
  deleteDepartment,
  listDepartments,
  updateJobPosting,
} from "@/features/careers/hooks/useJobsAdmin";
import { getJobPostingById } from "@/features/careers/hooks/useJobs";
import type { Department, JobPostingCreateInput, JobPostingStatus, JobPostingType } from "@/features/careers/hooks/useJobs";

function arrayToLines(arr: string[] | undefined | null) {
  return (arr ?? []).join("\n");
}
function linesToArray(val: string): string[] {
  return val
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}
function emptyDraft(): JobPostingCreateInput {
  return {
    title: "",
    department: "",
    location: "",
    type: "",
    level: "",
    description: "",
    requirements: [],
    responsibilities: [],
    skills: { core: [], behavioral: [] },
    openPositions: null,
    status: "open",
  };
}
function toDraft(p: JobPostingType): JobPostingCreateInput {
  return {
    title: p.title,
    department: p.department,
    location: p.location,
    type: p.type,
    level: p.level,
    description: p.description,
    requirements: p.requirements ?? [],
    responsibilities: p.responsibilities ?? [],
    skills: p.skills ?? { core: [], behavioral: [] },
    openPositions: p.openPositions ?? null,
    status: p.status,
    postedDate: p.postedDate ?? null,
  };
}
function validate(draft: JobPostingCreateInput) {
  if (!draft.title.trim()) throw new Error("Title is required.");
  if (!draft.department.trim()) throw new Error("Department is required.");
  if (!draft.location.trim()) throw new Error("Location is required.");
  if (!draft.type.trim()) throw new Error("Employment type is required.");
}

interface Props {
  /** undefined = create mode; number = edit mode */
  id?: number;
}

export function JobPostingEditorPage({ id }: Props) {
  const router = useRouter();
  const isEdit = id !== undefined;

  const [draft, setDraft] = useState<JobPostingCreateInput>(emptyDraft());
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [addingDepartment, setAddingDepartment] = useState(false);
  const [deletingDepartmentId, setDeletingDepartmentId] = useState<Department["id"] | null>(null);

  useEffect(() => {
    listDepartments()
      .then(setDepartments)
      .catch(() => {});

    if (!isEdit) return;
    setLoading(true);
    getJobPostingById(id)
      .then((p) => setDraft(toDraft(p)))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load posting."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  async function handleSave() {
    setError(null);
    try {
      validate(draft);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Validation failed.");
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await updateJobPosting(id, draft);
      } else {
        await createJobPosting(draft);
      }
      router.push("/admin/job-postings");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  function set<K extends keyof JobPostingCreateInput>(key: K, value: JobPostingCreateInput[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function handleAddDepartment() {
    setError(null);
    setAddingDepartment(true);
    try {
      const created = await createDepartment(newDepartmentName);
      setDepartments((prev) =>
        [...prev, created].sort((a, b) => a.name.localeCompare(b.name)),
      );
      set("department", created.name);
      setNewDepartmentName("");
      setDepartmentDialogOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add department.");
    } finally {
      setAddingDepartment(false);
    }
  }

  async function handleDeleteDepartment(idToDelete: Department["id"]) {
    setError(null);
    setAddingDepartment(true);
    try {
      await deleteDepartment(idToDelete);
      setDepartments((prev) => prev.filter((d) => d.id !== idToDelete));
      if (draft.department && !departments.some((d) => d.id !== idToDelete && d.name === draft.department)) {
        set("department", "");
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to delete department (it may be in use by existing job postings).",
      );
    } finally {
      setAddingDepartment(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/job-postings")}>
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEdit ? "Edit Job Posting" : "New Job Posting"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEdit ? `Editing posting #${id}` : "Create a new open role."}
          </p>
        </div>
        {isEdit && (
          <Badge variant="outline" className="ml-auto capitalize">
            {draft.status}
          </Badge>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive border border-destructive/30 bg-destructive/5 rounded-md p-3">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader className="animate-spin text-primary" size={28} />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Posting details</CardTitle>
            <p className="text-xs text-muted-foreground">
              Responsibilities, requirements, and skills should be entered one per line.
            </p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2 space-y-1.5">
              <Label>Title</Label>
              <Input
                value={draft.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Senior Data Engineer"
              />
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <Label>Department</Label>
                <Dialog
                  open={departmentDialogOpen}
                  onOpenChange={setDepartmentDialogOpen}
                >
                  <DialogTrigger
                    render={
                      <Button variant="outline" size="icon-sm" />
                    }
                  >
                    <Plus />
                    <span className="sr-only">Add department</span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Departments</DialogTitle>
                      <DialogDescription>
                        Add or remove departments used for job postings.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>New department</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            value={newDepartmentName}
                            onChange={(e) => setNewDepartmentName(e.target.value)}
                            placeholder="e.g. People & Culture"
                          />
                          <Button
                            onClick={handleAddDepartment}
                            disabled={addingDepartment || !newDepartmentName.trim()}
                          >
                            {addingDepartment && <Loader className="animate-spin" size={16} />}
                            Add
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Existing departments</Label>
                        {departments.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No departments found.</p>
                        ) : (
                          <div className="divide-y divide-border rounded-md border border-border bg-background">
                            {departments.map((d) => (
                              <div key={String(d.id)} className="flex items-center justify-between gap-2 px-3 py-2">
                                <span className="text-sm text-foreground">{d.name}</span>
                                <AlertDialog
                                  open={deletingDepartmentId === d.id}
                                  onOpenChange={(o) => setDeletingDepartmentId(o ? d.id : null)}
                                >
                                  <AlertDialogTrigger
                                    render={<Button variant="destructive" size="icon-sm" />}
                                  >
                                    <Trash2 />
                                    <span className="sr-only">Delete department</span>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete department?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will remove <span className="font-medium text-foreground">{d.name}</span>.
                                        If it’s referenced by existing job postings, Supabase may block the delete.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel disabled={addingDepartment}>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        variant="destructive"
                                        disabled={addingDepartment}
                                        onClick={() => handleDeleteDepartment(d.id)}
                                      >
                                        {addingDepartment && <Loader className="animate-spin" size={16} />}
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <DialogFooter showCloseButton>
                      <span />
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <Select
                value={draft.department}
                onValueChange={(v) => v && set("department", v)}
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
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input
                value={draft.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="e.g. Dubai (Hybrid)"
              />
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <Label>Employment type</Label>
              <Input
                value={draft.type}
                onChange={(e) => set("type", e.target.value)}
                placeholder="e.g. Full-time"
              />
            </div>

            {/* Level */}
            <div className="space-y-1.5">
              <Label>Level</Label>
              <Input
                value={draft.level}
                onChange={(e) => set("level", e.target.value)}
                placeholder="e.g. Senior"
              />
            </div>

            {/* Open positions */}
            <div className="space-y-1.5">
              <Label>Open positions</Label>
              <Input
                type="number"
                min={0}
                value={draft.openPositions ?? ""}
                onChange={(e) =>
                  set("openPositions", e.target.value ? Number(e.target.value) : null)
                }
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={draft.status}
                onValueChange={(v) => v && set("status", v as JobPostingStatus)}
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

            {/* Description */}
            <div className="md:col-span-2 space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={draft.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Short overview shown on the listing and detail page."
                className="min-h-28"
              />
            </div>

            <Separator className="md:col-span-2" />

            {/* Responsibilities */}
            <div className="space-y-1.5">
              <Label>Responsibilities (one per line)</Label>
              <Textarea
                value={arrayToLines(draft.responsibilities)}
                onChange={(e) => set("responsibilities", linesToArray(e.target.value))}
                className="min-h-40"
              />
            </div>

            {/* Requirements */}
            <div className="space-y-1.5">
              <Label>Requirements (one per line)</Label>
              <Textarea
                value={arrayToLines(draft.requirements)}
                onChange={(e) => set("requirements", linesToArray(e.target.value))}
                className="min-h-40"
              />
            </div>

            {/* Skills core */}
            <div className="space-y-1.5">
              <Label>Core skills (one per line)</Label>
              <Textarea
                value={arrayToLines(draft.skills?.core)}
                onChange={(e) =>
                  set("skills", {
                    core: linesToArray(e.target.value),
                    behavioral: draft.skills?.behavioral ?? [],
                  })
                }
                className="min-h-32"
              />
            </div>

            {/* Skills behavioral */}
            <div className="space-y-1.5">
              <Label>Behavioral skills (one per line)</Label>
              <Textarea
                value={arrayToLines(draft.skills?.behavioral)}
                onChange={(e) =>
                  set("skills", {
                    core: draft.skills?.core ?? [],
                    behavioral: linesToArray(e.target.value),
                  })
                }
                className="min-h-32"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer actions */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/job-postings")}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving || loading}>
          {saving && <Loader className="animate-spin" size={16} />}
          {isEdit ? "Save changes" : "Create posting"}
        </Button>
      </div>
    </div>
  );
}
