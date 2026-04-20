"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  CircleCheck,
  CircleX,
  Loader,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
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
  createJobPosting,
  deleteJobPosting,
  linesToArray,
  listDepartments,
  listJobPostingsAdmin,
  updateJobPosting,
  type Department,
  type JobPostingCreateInput,
  type JobPostingStatus,
  type JobPostingType,
} from "@/features/careers/api";

type EditorMode =
  | { kind: "create" }
  | { kind: "edit"; posting: JobPostingType };

function statusBadge(status: JobPostingStatus) {
  const cls =
    status === "open"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : "bg-muted text-muted-foreground border-border";
  return (
    <span
      className={`px-2 py-1 rounded-lg text-xs font-medium capitalize border shrink-0 ${cls}`}
    >
      {status}
    </span>
  );
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

export function JobPostingsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postings, setPostings] = useState<JobPostingType[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<JobPostingStatus | "all">("all");

  const [editorOpen, setEditorOpen] = useState(false);
  const [mode, setMode] = useState<EditorMode>({ kind: "create" });
  const [draft, setDraft] = useState<JobPostingCreateInput>(emptyDraft());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return postings.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q)
      );
    });
  }, [postings, query, status]);

  const stats = useMemo(() => {
    const open = postings.filter((p) => p.status === "open").length;
    const closed = postings.filter((p) => p.status === "closed").length;
    return { total: postings.length, open, closed };
  }, [postings]);

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const [rows, deptRows] = await Promise.all([
        listJobPostingsAdmin(),
        listDepartments().catch(() => []),
      ]);
      setPostings(rows);
      setDepartments(deptRows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load job postings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function openCreate() {
    setMode({ kind: "create" });
    setDraft(emptyDraft());
    setEditorOpen(true);
  }

  function openEdit(posting: JobPostingType) {
    setMode({ kind: "edit", posting });
    setDraft({
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
    });
    setEditorOpen(true);
  }

  async function onSave() {
    setError(null);
    setSaving(true);
    try {
      const normalized: JobPostingCreateInput = {
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
        openPositions:
          typeof draft.openPositions === "number" ? draft.openPositions : null,
        status: draft.status,
      };

      if (!normalized.title) throw new Error("Title is required.");
      if (!normalized.department) throw new Error("Department is required.");
      if (!normalized.location) throw new Error("Location is required.");
      if (!normalized.type) throw new Error("Employment type is required.");
      if (!normalized.level) throw new Error("Level is required.");
      if (!normalized.description) throw new Error("Description is required.");

      if (mode.kind === "create") {
        const created = await createJobPosting(normalized);
        setPostings((prev) => [created, ...prev]);
      } else {
        const updated = await updateJobPosting(mode.posting.id, normalized);
        setPostings((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p)),
        );
      }

      setEditorOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save job posting.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(posting: JobPostingType) {
    setError(null);
    const ok = window.confirm(`Delete "${posting.title}"? This cannot be undone.`);
    if (!ok) return;

    try {
      await deleteJobPosting(posting.id);
      setPostings((prev) => prev.filter((p) => p.id !== posting.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete job posting.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Briefcase size={20} /> Job Postings
          </h1>
          <p className="text-sm text-muted-foreground">
            Create, publish, and manage open roles shown on the Careers site.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}>
            Refresh
          </Button>
          <Button onClick={openCreate}>
            <Plus /> New Posting
          </Button>
        </div>
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
            <p className="text-xs text-muted-foreground mt-1">Total postings</p>
          </CardContent>
        </Card>
        <Card className="py-0 gap-0 border-r-[3px] border-r-emerald-600">
          <CardContent className="p-4">
            <p className="text-2xl font-semibold text-foreground">{stats.open}</p>
            <p className="text-xs text-muted-foreground mt-1">Open</p>
          </CardContent>
        </Card>
        <Card className="py-0 gap-0 border-r-[3px] border-r-muted-foreground">
          <CardContent className="p-4">
            <p className="text-2xl font-semibold text-foreground">{stats.closed}</p>
            <p className="text-xs text-muted-foreground mt-1">Closed</p>
          </CardContent>
        </Card>
      </div>

      <Card className="py-0 gap-0">
        <CardHeader className="px-6 py-4 border-b border-border flex-row items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3 w-full">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, department, location, type..."
                className="pl-9"
              />
            </div>
            <Separator orientation="vertical" className="h-8 hidden md:block" />
            <div className="w-full md:w-48">
              <Select
                value={status}
                onValueChange={(v) => setStatus(((v ?? "all") as any) ?? "all")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
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
            <div className="py-16 text-center">
              <p className="text-sm font-medium text-foreground">
                No job postings found.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Create a new posting or adjust your filters.
              </p>
              <div className="mt-4">
                <Button onClick={openCreate}>
                  <Plus /> New Posting
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium whitespace-normal">
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">
                          {p.status === "open" ? (
                            <CircleCheck className="text-emerald-600" size={16} />
                          ) : (
                            <CircleX className="text-muted-foreground" size={16} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-foreground leading-snug line-clamp-2">
                            {p.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            ID: {p.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-normal">{p.department}</TableCell>
                    <TableCell className="whitespace-normal">{p.location}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {p.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{statusBadge(p.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => openEdit(p)}
                          aria-label="Edit"
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon-sm"
                          onClick={() => onDelete(p)}
                          aria-label="Delete"
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogTrigger className="hidden" />
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {mode.kind === "create" ? "New Job Posting" : "Edit Job Posting"}
            </DialogTitle>
            <DialogDescription>
              Fields like requirements and responsibilities should be entered one per line.
            </DialogDescription>
          </DialogHeader>

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
                onValueChange={(v) =>
                  setDraft((d) => ({ ...d, department: v ?? "" }))
                }
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
                onChange={(e) =>
                  setDraft((d) => ({ ...d, department: e.target.value }))
                }
                placeholder="Department name"
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Location</label>
              <Input
                value={draft.location}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, location: e.target.value }))
                }
                placeholder="e.g. Dubai (Hybrid)"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Employment type
              </label>
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
                onChange={(e) =>
                  setDraft((d) => ({ ...d, level: e.target.value }))
                }
                placeholder="e.g. Senior"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Open positions
              </label>
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
              <label className="text-sm font-medium text-foreground">
                Description
              </label>
              <Textarea
                value={draft.description}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, description: e.target.value }))
                }
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
                  setDraft((d) => ({
                    ...d,
                    responsibilities: linesToArray(e.target.value),
                  }))
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
                  setDraft((d) => ({
                    ...d,
                    requirements: linesToArray(e.target.value),
                  }))
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
            <Button onClick={onSave} disabled={saving}>
              {saving ? <Loader className="animate-spin" /> : null}
              {mode.kind === "create" ? "Create" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

