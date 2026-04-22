"use client";

import * as React from "react";
import { toast } from "sonner";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { Briefcase, Loader, Pencil, Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useAllServices, useCreateService, useUpdateService, useDeleteService } from "@/features/services/hooks/useServicesAdmin";
import type { Service } from "@/features/services/api/services.admin";
import {
  ServicesAdminForm,
  serviceToFormValues,
  defaultFormValues,
  formValuesToInput,
  type ServiceFormValues,
} from "./ServicesAdminForm";

const col = createColumnHelper<Service>();

export function ServicesAdminPage() {
  const { data: services = [], isLoading, error } = useAllServices();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  const [showForm, setShowForm] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Service | null>(null);

  const isPending = createMutation.isPending || updateMutation.isPending;

  function openCreate() { setEditTarget(null); setShowForm(true); }
  function openEdit(s: Service) { setEditTarget(s); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditTarget(null); }

  async function handleSubmit(values: ServiceFormValues) {
    try {
      const input = formValuesToInput(values);
      if (editTarget) {
        await updateMutation.mutateAsync({ id: editTarget.id, input });
        toast.success("Service updated.");
      } else {
        await createMutation.mutateAsync({ ...input, sortOrder: input.sortOrder ?? 0 } as Service);
        toast.success("Service created.");
      }
      closeForm();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success("Service deleted.");
      setDeleteTarget(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete.");
    }
  }

  const columns = React.useMemo(() => [
    col.accessor("title", {
      header: "Title",
      cell: (info) => (
        <div>
          <p className="text-sm font-medium">{info.getValue()}</p>
          <p className="text-xs text-muted-foreground font-mono">{info.row.original.id}</p>
        </div>
      ),
    }),
    col.accessor("category", {
      header: "Category",
      cell: (info) => <p className="text-sm text-muted-foreground">{info.getValue()}</p>,
    }),
    col.accessor("serviceCategory", {
      header: "Service Category",
      cell: (info) => <p className="text-sm text-muted-foreground">{info.getValue()}</p>,
    }),
    col.accessor("duration", {
      header: "Duration",
      cell: (info) => <p className="text-sm">{info.getValue()}</p>,
    }),
    col.accessor("tags", {
      header: "Tags",
      cell: (info) => (
        <div className="flex flex-wrap gap-1">
          {info.getValue().slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>
          ))}
          {info.getValue().length > 2 && (
            <Badge variant="outline" className="text-xs">+{info.getValue().length - 2}</Badge>
          )}
        </div>
      ),
    }),
    col.accessor("isPublished", {
      header: "Status",
      cell: (info) => (
        <Badge
          variant={info.getValue() ? "default" : "secondary"}
          className={info.getValue() ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50" : ""}
        >
          {info.getValue() ? "Published" : "Draft"}
        </Badge>
      ),
    }),
    col.display({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: (info) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="icon-sm" onClick={() => openEdit(info.row.original)} aria-label="Edit">
            <Pencil size={14} />
          </Button>
          <Button variant="destructive" size="icon-sm" onClick={() => setDeleteTarget(info.row.original)} aria-label="Delete">
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    }),
  ], []);

  const table = useReactTable({ data: services, columns, getCoreRowModel: getCoreRowModel() });

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Button variant="ghost" size="icon-sm" onClick={closeForm}><X size={16} /></Button>
          <h1 className="text-xl font-bold">{editTarget ? `Edit: ${editTarget.title}` : "New Service"}</h1>
        </div>
        <ServicesAdminForm
          key={editTarget?.id ?? "new"}
          defaultValues={editTarget ? serviceToFormValues(editTarget) : defaultFormValues}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          isPending={isPending}
          isEdit={!!editTarget}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase size={20} /> Services
          </h1>
          <p className="text-sm text-muted-foreground">Manage marketplace services and their detail content.</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> New Service</Button>
      </div>

      {error && (
        <Card className="py-0 gap-0 border-destructive/30">
          <CardContent className="p-4 text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load."}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: services.length, accent: "border-r-primary" },
          { label: "Published", value: services.filter((s) => s.isPublished).length, accent: "border-r-emerald-600" },
          { label: "Draft", value: services.filter((s) => !s.isPublished).length, accent: "border-r-muted-foreground" },
        ].map(({ label, value, accent }) => (
          <Card key={label} className={`py-0 gap-0 border-r-[3px] ${accent}`}>
            <CardContent className="p-4">
              <p className="text-2xl font-semibold">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="py-0 gap-0">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader className="animate-spin text-primary" size={28} />
            </div>
          ) : table.getRowModel().rows.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-sm font-medium">No services yet.</p>
              <Button onClick={openCreate}><Plus size={16} /> New Service</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((h) => (
                      <TableHead key={h.id} className={h.id === "actions" ? "text-right" : ""}>
                        {flexRender(h.column.columnDef.header, h.getContext())}
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

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete service?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleteTarget?.title}&rdquo; will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader className="animate-spin" size={14} />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
