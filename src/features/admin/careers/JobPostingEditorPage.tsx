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
  createEmploymentType,
  createJobLevel,
  createJobLocation,
  deleteEmploymentType,
  deleteJobLevel,
  deleteJobLocation,
  listEmploymentTypes,
  listJobLevels,
  listJobLocations,
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
  const [locations, setLocations] = useState<Department[]>([]);
  const [employmentTypes, setEmploymentTypes] = useState<Department[]>([]);
  const [jobLevels, setJobLevels] = useState<Department[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [addingDepartment, setAddingDepartment] = useState(false);
  const [deletingDepartmentId, setDeletingDepartmentId] = useState<Department["id"] | null>(null);

  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [addingLocation, setAddingLocation] = useState(false);
  const [deletingLocationId, setDeletingLocationId] = useState<Department["id"] | null>(null);

  const [employmentTypeDialogOpen, setEmploymentTypeDialogOpen] = useState(false);
  const [newEmploymentTypeName, setNewEmploymentTypeName] = useState("");
  const [addingEmploymentType, setAddingEmploymentType] = useState(false);
  const [deletingEmploymentTypeId, setDeletingEmploymentTypeId] = useState<Department["id"] | null>(null);

  const [jobLevelDialogOpen, setJobLevelDialogOpen] = useState(false);
  const [newJobLevelName, setNewJobLevelName] = useState("");
  const [addingJobLevel, setAddingJobLevel] = useState(false);
  const [deletingJobLevelId, setDeletingJobLevelId] = useState<Department["id"] | null>(null);

  useEffect(() => {
    listDepartments()
      .then(setDepartments)
      .catch(() => {});
    listJobLocations()
      .then(setLocations)
      .catch(() => {});
    listEmploymentTypes()
      .then(setEmploymentTypes)
      .catch(() => {});
    listJobLevels()
      .then(setJobLevels)
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

  async function handleAddLocation() {
    setError(null);
    setAddingLocation(true);
    try {
      const created = await createJobLocation(newLocationName);
      setLocations((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      set("location", created.name);
      setNewLocationName("");
      setLocationDialogOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add location.");
    } finally {
      setAddingLocation(false);
    }
  }

  async function handleDeleteLocation(idToDelete: Department["id"]) {
    setError(null);
    setAddingLocation(true);
    try {
      await deleteJobLocation(idToDelete);
      setLocations((prev) => prev.filter((d) => d.id !== idToDelete));
      if (draft.location && !locations.some((d) => d.id !== idToDelete && d.name === draft.location)) {
        set("location", "");
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to delete location (it may be in use by existing job postings).",
      );
    } finally {
      setAddingLocation(false);
    }
  }

  async function handleAddEmploymentType() {
    setError(null);
    setAddingEmploymentType(true);
    try {
      const created = await createEmploymentType(newEmploymentTypeName);
      setEmploymentTypes((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      set("type", created.name);
      setNewEmploymentTypeName("");
      setEmploymentTypeDialogOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add employment type.");
    } finally {
      setAddingEmploymentType(false);
    }
  }

  async function handleDeleteEmploymentType(idToDelete: Department["id"]) {
    setError(null);
    setAddingEmploymentType(true);
    try {
      await deleteEmploymentType(idToDelete);
      setEmploymentTypes((prev) => prev.filter((d) => d.id !== idToDelete));
      if (draft.type && !employmentTypes.some((d) => d.id !== idToDelete && d.name === draft.type)) {
        set("type", "");
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to delete employment type (it may be in use by existing job postings).",
      );
    } finally {
      setAddingEmploymentType(false);
    }
  }

  async function handleAddJobLevel() {
    setError(null);
    setAddingJobLevel(true);
    try {
      const created = await createJobLevel(newJobLevelName);
      setJobLevels((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      set("level", created.name);
      setNewJobLevelName("");
      setJobLevelDialogOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add level.");
    } finally {
      setAddingJobLevel(false);
    }
  }

  async function handleDeleteJobLevel(idToDelete: Department["id"]) {
    setError(null);
    setAddingJobLevel(true);
    try {
      await deleteJobLevel(idToDelete);
      setJobLevels((prev) => prev.filter((d) => d.id !== idToDelete));
      if (draft.level && !jobLevels.some((d) => d.id !== idToDelete && d.name === draft.level)) {
        set("level", "");
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to delete level (it may be in use by existing job postings).",
      );
    } finally {
      setAddingJobLevel(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
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
              <div className="flex items-center justify-between gap-2">
                <Label>Location</Label>
                <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
                  <DialogTrigger render={<Button variant="outline" size="icon-sm" />}>
                    <Plus />
                    <span className="sr-only">Add location</span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Locations</DialogTitle>
                      <DialogDescription>Add or remove locations used for job postings.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>New location</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            value={newLocationName}
                            onChange={(e) => setNewLocationName(e.target.value)}
                            placeholder="e.g. Dubai (Hybrid)"
                          />
                          <Button
                            onClick={handleAddLocation}
                            disabled={addingLocation || !newLocationName.trim()}
                          >
                            {addingLocation && <Loader className="animate-spin" size={16} />}
                            Add
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Existing locations</Label>
                        {locations.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No locations found.</p>
                        ) : (
                          <div className="divide-y divide-border rounded-md border border-border bg-background">
                            {locations.map((l) => (
                              <div key={String(l.id)} className="flex items-center justify-between gap-2 px-3 py-2">
                                <span className="text-sm text-foreground">{l.name}</span>
                                <AlertDialog
                                  open={deletingLocationId === l.id}
                                  onOpenChange={(o) => setDeletingLocationId(o ? l.id : null)}
                                >
                                  <AlertDialogTrigger render={<Button variant="destructive" size="icon-sm" />}>
                                    <Trash2 />
                                    <span className="sr-only">Delete location</span>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete location?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will remove <span className="font-medium text-foreground">{l.name}</span>.
                                        If it’s referenced by existing job postings, Supabase may block the delete.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel disabled={addingLocation}>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        variant="destructive"
                                        disabled={addingLocation}
                                        onClick={() => handleDeleteLocation(l.id)}
                                      >
                                        {addingLocation && <Loader className="animate-spin" size={16} />}
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
              <Select value={draft.location} onValueChange={(v) => set("location", v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="" disabled className="hidden">
                      Select a location
                    </SelectItem>
                    {locations.length > 0 ? (
                      locations.map((l) => (
                        <SelectItem key={l.id} value={l.name}>
                          {l.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value={draft.location || "Remote"}>{draft.location || "Remote"}</SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <Label>Employment type</Label>
                <Dialog open={employmentTypeDialogOpen} onOpenChange={setEmploymentTypeDialogOpen}>
                  <DialogTrigger render={<Button variant="outline" size="icon-sm" />}>
                    <Plus />
                    <span className="sr-only">Add employment type</span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Employment types</DialogTitle>
                      <DialogDescription>Add or remove employment types used for job postings.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>New employment type</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            value={newEmploymentTypeName}
                            onChange={(e) => setNewEmploymentTypeName(e.target.value)}
                            placeholder="e.g. Full-time"
                          />
                          <Button
                            onClick={handleAddEmploymentType}
                            disabled={addingEmploymentType || !newEmploymentTypeName.trim()}
                          >
                            {addingEmploymentType && <Loader className="animate-spin" size={16} />}
                            Add
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Existing employment types</Label>
                        {employmentTypes.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No employment types found.</p>
                        ) : (
                          <div className="divide-y divide-border rounded-md border border-border bg-background">
                            {employmentTypes.map((t) => (
                              <div key={String(t.id)} className="flex items-center justify-between gap-2 px-3 py-2">
                                <span className="text-sm text-foreground">{t.name}</span>
                                <AlertDialog
                                  open={deletingEmploymentTypeId === t.id}
                                  onOpenChange={(o) => setDeletingEmploymentTypeId(o ? t.id : null)}
                                >
                                  <AlertDialogTrigger render={<Button variant="destructive" size="icon-sm" />}>
                                    <Trash2 />
                                    <span className="sr-only">Delete employment type</span>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete employment type?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will remove <span className="font-medium text-foreground">{t.name}</span>.
                                        If it’s referenced by existing job postings, Supabase may block the delete.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel disabled={addingEmploymentType}>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        variant="destructive"
                                        disabled={addingEmploymentType}
                                        onClick={() => handleDeleteEmploymentType(t.id)}
                                      >
                                        {addingEmploymentType && <Loader className="animate-spin" size={16} />}
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
              <Select value={draft.type} onValueChange={(v) => set("type", v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="" disabled className="hidden">
                      Select employment type
                    </SelectItem>
                    {employmentTypes.length > 0 ? (
                      employmentTypes.map((t) => (
                        <SelectItem key={t.id} value={t.name}>
                          {t.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value={draft.type || "Full-time"}>{draft.type || "Full-time"}</SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Level */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <Label>Level</Label>
                <Dialog open={jobLevelDialogOpen} onOpenChange={setJobLevelDialogOpen}>
                  <DialogTrigger render={<Button variant="outline" size="icon-sm" />}>
                    <Plus />
                    <span className="sr-only">Add level</span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Levels</DialogTitle>
                      <DialogDescription>Add or remove levels used for job postings.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>New level</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            value={newJobLevelName}
                            onChange={(e) => setNewJobLevelName(e.target.value)}
                            placeholder="e.g. Senior"
                          />
                          <Button onClick={handleAddJobLevel} disabled={addingJobLevel || !newJobLevelName.trim()}>
                            {addingJobLevel && <Loader className="animate-spin" size={16} />}
                            Add
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Existing levels</Label>
                        {jobLevels.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No levels found.</p>
                        ) : (
                          <div className="divide-y divide-border rounded-md border border-border bg-background">
                            {jobLevels.map((lv) => (
                              <div key={String(lv.id)} className="flex items-center justify-between gap-2 px-3 py-2">
                                <span className="text-sm text-foreground">{lv.name}</span>
                                <AlertDialog
                                  open={deletingJobLevelId === lv.id}
                                  onOpenChange={(o) => setDeletingJobLevelId(o ? lv.id : null)}
                                >
                                  <AlertDialogTrigger render={<Button variant="destructive" size="icon-sm" />}>
                                    <Trash2 />
                                    <span className="sr-only">Delete level</span>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete level?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will remove <span className="font-medium text-foreground">{lv.name}</span>.
                                        If it’s referenced by existing job postings, Supabase may block the delete.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel disabled={addingJobLevel}>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        variant="destructive"
                                        disabled={addingJobLevel}
                                        onClick={() => handleDeleteJobLevel(lv.id)}
                                      >
                                        {addingJobLevel && <Loader className="animate-spin" size={16} />}
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
              <Select value={draft.level} onValueChange={(v) => set("level", v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="" disabled className="hidden">
                      Select a level
                    </SelectItem>
                    {jobLevels.length > 0 ? (
                      jobLevels.map((lv) => (
                        <SelectItem key={lv.id} value={lv.name}>
                          {lv.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value={draft.level || "Mid"}>{draft.level || "Mid"}</SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
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
