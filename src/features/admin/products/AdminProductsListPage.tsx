"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw, Loader } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useAdminProducts, usePatchProduct } from "@/features/products/hooks/useProductsAdmin";

export function AdminProductsListPage() {
  const router = useRouter();
  const { data: products = [], isLoading, error, refetch } = useAdminProducts();
  const patchMutation = usePatchProduct();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return products;
    return products.filter((p) =>
      p.id.toLowerCase().includes(query) ||
      p.name.toLowerCase().includes(query) ||
      p.code.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query),
    );
  }, [products, q]);

  function togglePublish(productId: string, next: boolean) {
    patchMutation.mutate({ id: productId, patch: { isPublished: next } });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">Manage marketplace products and product detail pages.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} /> Refresh
          </Button>
          <Button onClick={() => router.push("/admin/products/new")}>
            <Plus size={16} /> New product
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-destructive">{error instanceof Error ? error.message : "Failed to load"}</div>
      )}

      <Card className="py-0 gap-0">
        <CardHeader className="px-6 py-4 border-b border-border bg-muted/30 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by id, name, code, category"
              className="sm:max-w-sm"
            />
            <div className="text-xs text-muted-foreground">
              Showing {filtered.length} of {products.length}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-16"><Loader className="animate-spin text-primary" size={28} /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>CTA</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                      No products yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.id}</TableCell>
                      <TableCell className="max-w-[360px] truncate">{p.name}</TableCell>
                      <TableCell><Badge variant="secondary">{p.code}</Badge></TableCell>
                      <TableCell>{p.category}</TableCell>
                      <TableCell><Badge variant="outline">{p.ctaType}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={p.isPublished}
                            onCheckedChange={(next) => togglePublish(p.id, next)}
                            disabled={patchMutation.isPending}
                          />
                          <span className="text-xs text-muted-foreground">{p.isPublished ? "Yes" : "No"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/admin/products/${encodeURIComponent(p.id)}`)}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
