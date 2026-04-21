"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import {
  Briefcase,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  deleteJobPosting,
  listJobPostingsAdmin,
  type JobPostingStatus,
  type JobPostingType,
} from "@/features/careers/api";

const col = createColumnHelper<JobPostingType>();

function StatusBadge({ status }: { status: JobPostingStatus }) {
  return (
    <Badge
      variant={status === "open" ? "default" : "secondary"}
      className={
        status === "open"
          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
          : ""
      }
    >
      {status}
    </Badge>
  );
}

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc") return <ChevronUp size={14} />;
  if (sorted === "desc") return <ChevronDown size={14} />;
  return <ChevronsUpDown size={14} className="text-muted-foreground/50" />;
}

export function JobPostingsAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postings, setPostings] = useState<JobPostingType[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobPostingStatus | "all">("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [deleteTarget, setDeleteTarget] = useState<JobPostingType | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      setPostings(await listJobPostingsAdmin());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load job postings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return postings;
    return postings.filter((p) => p.status === statusFilter);
  }, [postings, statusFilter]);

  const stats = useMemo(() => {
    const open = postings.filter((p) => p.status === "open").length;
    return { total: postings.length, open, closed: postings.length - open };
  }, [postings]);

  const columns = useMemo(
    () => [
      col.accessor("title", {
        header: "Title",
        cell: (info) => (
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">
              {info.getValue()}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">ID: {info.row.original.id}</p>
          </div>
        ),
      }),
      col.accessor("department", { header: "Department" }),
      col.accessor("location", { header: "Location" }),
      col.accessor("type", {
        header: "Type",
        cell: (info) => (
          <Badge variant="outline" className="capitalize">
            {info.getValue()}
          </Badge>
        ),
      }),
      col.accessor("status", {
        header: "Status",
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      col.display({
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: (info) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() =>
                router.push(`/admin/job-postings/${info.row.original.id}/edit`)
              }
              aria-label="Edit"
            >
              <Pencil size={14} />
            </Button>
            <Button
              variant="destructive"
              size="icon-sm"
              onClick={() => setDeleteTarget(info.row.original)}
              aria-label="Delete"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        ),
      }),
    ],
    [router],
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteJobPosting(deleteTarget.id);
      setPostings((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <Button onClick={() => router.push("/admin/job-postings/new")}>
            <Plus size={16} /> New Posting
          </Button>
        </div>
      </div>

      {error && (
        <Card className="py-0 gap-0 border-destructive/30">
          <CardContent className="p-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total postings", value: stats.total, accent: "border-r-primary" },
          { label: "Open", value: stats.open, accent: "border-r-emerald-600" },
          { label: "Closed", value: stats.closed, accent: "border-r-muted-foreground" },
        ].map(({ label, value, accent }) => (
          <Card key={label} className={`py-0 gap-0 border-r-[3px] ${accent}`}>
            <CardContent className="p-4">
              <p className="text-2xl font-semibold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table card */}
      <Card className="py-0 gap-0">
        <CardHeader className="px-6 py-4 border-b border-border flex-row items-center gap-3 bg-muted/30">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search title, department, location…"
              className="pl-9"
            />
          </div>
          <Separator orientation="vertical" className="h-8 hidden md:block" />
          <div className="w-full md:w-44">
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter((v ?? "all") as JobPostingStatus | "all")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader className="animate-spin text-primary" size={28} />
            </div>
          ) : table.getRowModel().rows.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-sm font-medium text-foreground">No job postings found.</p>
              <p className="text-xs text-muted-foreground">
                Create a new posting or adjust your filters.
              </p>
              <Button onClick={() => router.push("/admin/job-postings/new")}>
                <Plus size={16} /> New Posting
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className={
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : header.id === "actions"
                              ? "text-right"
                              : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span className="inline-flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <SortIcon sorted={header.column.getIsSorted()} />
                          )}
                        </span>
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete posting?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleteTarget?.title}&rdquo; will be permanently removed. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader className="animate-spin" size={14} />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
