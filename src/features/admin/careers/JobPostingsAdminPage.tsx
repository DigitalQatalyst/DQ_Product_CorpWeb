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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createJobPosting,
  deleteJobPosting,
  listDepartments,
  listJobPostingsAdmin,
  updateJobPosting,
  type Department,
  type JobPostingCreateInput,
  type JobPostingStatus,
  type JobPostingType,
} from "@/features/careers/api";
import {
  JobPostingEditorDialog,
  type JobPostingEditorMode,
} from "@/features/admin/careers/JobPostingEditorDialog";

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

export function JobPostingsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postings, setPostings] = useState<JobPostingType[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<JobPostingStatus | "all">("all");

  const [editorOpen, setEditorOpen] = useState(false);
  const [mode, setMode] = useState<JobPostingEditorMode>({ kind: "create" });

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
    setEditorOpen(true);
  }

  function openEdit(posting: JobPostingType) {
    setMode({ kind: "edit", posting });
    setEditorOpen(true);
  }

  async function onSave(draft: JobPostingCreateInput) {
    setError(null);
    setSaving(true);
    try {
      if (mode.kind === "create") {
        const created = await createJobPosting(draft);
        setPostings((prev) => [created, ...prev]);
      } else {
        const updated = await updateJobPosting(mode.posting.id, draft);
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

      <JobPostingEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        mode={mode}
        departments={departments}
        saving={saving}
        onSave={onSave}
      />
    </div>
  );
}

