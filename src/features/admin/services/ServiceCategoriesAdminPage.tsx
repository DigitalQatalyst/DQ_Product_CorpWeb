"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  useReactTable, getCoreRowModel, flexRender, createColumnHelper,
} from "@tanstack/react-table";
import { Layers, Pencil, Plus, Trash2, Loader, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  useServiceCategories, useCreateServiceCategory,
  useUpdateServiceCategory, useDeleteServiceCategory,
} from "@/features/services/hooks/useServiceCategories";
import type { ServiceCategory } from "@/features/services/hooks/useServiceCategories";
import {
  ServiceCategoryForm,
  categoryToFormValues,
  defaultFormValues,
  formValuesToInput,
  type CategoryFormValues,
} from "./ServiceCategoryForm";

const col = createColumnHelper<ServiceCategory>();

export function ServiceCategoriesAdminPage() {
  const { data: categories = [], isLoading, error } = useServiceCategories();
  const createMutation = useCreateServiceCategory();
  const updateMutation = useUpdateServiceCategory();
  const deleteMutation = useDeleteServiceCategory();

  const [showForm, setShowForm] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<ServiceCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ServiceCategory | null>(null);

  const isPending = createMutation.isPending || updateMutation.isPending;

  function openCreate() { setEditTarget(null); setShowForm(true); }
  function openEdit(cat: ServiceCategory) { setEditTarget(cat); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditTarget(null); }

  async function handleSubmit(values: CategoryFormValues) {
    try {
      if (editTarget) {
        await updateMutation.mutateAsync({ id: editTarget.id, input: formValuesToInput(values) });
        toast.success("Category updated.");
      } else {
        await createMutation.mutateAsync(formValuesToInput(values));
        toast.success("Category created.");
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
      toast.success("Category deleted.");
      setDeleteTarget(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete.");
    }
  }

  const columns = React.useMemo(() => [
    col.accessor("name", {
      header: "Name",
      cell: (info) => (
        <div>
          <p className="text-sm font-medium">{info.getValue()}</p>
          <p className="text-xs text-muted-foreground">{info.row.original.slug}</p>
        </div>
      ),
    }),
    col.accessor("description", {
      header: "Description",
      cell: (info) => <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">{info.getValue()}</p>,
    }),
    col.accessor("tags", {
      header: "Tags",
      cell: (info) => (
        <div className="flex flex-wrap gap-1">
          {info.getValue().map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>
          ))}
        </div>
      ),
    }),
    col.accessor("isPublished", {
      header: "Status",
      cell: (info) => (
        <Badge variant={info.getValue() ? "default" : "secondary"}
          className={info.getValue() ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50" : ""}>
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

  const table = useReactTable({ data: categories, columns, getCoreRowModel: getCoreRowModel() });

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Button variant="ghost" size="icon-sm" onClick={closeForm}><X size={16} /></Button>
          <h1 className="text-xl font-bold">{editTarget ? `Edit: ${editTarget.name}` : "New Service Category"}</h1>
        </div>
        <ServiceCategoryForm
          key={editTarget?.id ?? "new"}
          defaultValues={editTarget ? categoryToFormValues(editTarget) : defaultFormValues}
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
          <h1 className="text-2xl font-bold flex items-center gap-2"><Layers size={20} /> Service Categories</h1>
          <p className="text-sm text-muted-foreground">Manage top-level service categories and their page content.</p>
        </div>
        <Button onClick={openCreate}><Plus size={16} /> New Category</Button>
      </div>

      {error && (
        <Card className="py-0 gap-0 border-destructive/30">
          <CardContent className="p-4 text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load."}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Total", value: categories.length, accent: "border-r-primary" },
          { label: "Published", value: categories.filter((c) => c.isPublished).length, accent: "border-r-emerald-600" },
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
            <div className="flex justify-center py-16"><Loader className="animate-spin text-primary" size={28} /></div>
          ) : table.getRowModel().rows.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-sm font-medium">No categories yet.</p>
              <Button onClick={openCreate}><Plus size={16} /> New Category</Button>
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
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleteTarget?.name}&rdquo; will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteMutation.isPending && <Loader className="animate-spin" size={14} />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
