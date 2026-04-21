"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import type { AdminProduct } from "./admin-products.types";

type LoadState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready" };

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export function AdminProductsListPage() {
  const router = useRouter();
  const [state, setState] = useState<LoadState>({ kind: "idle" });
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return products;
    return products.filter((p) => {
      return (
        p.id.toLowerCase().includes(query) ||
        p.name.toLowerCase().includes(query) ||
        p.code.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    });
  }, [products, q]);

  async function load() {
    setState({ kind: "loading" });
    try {
      const data = await fetchJson<{ products: AdminProduct[] }>("/api/admin/products");
      setProducts(data.products);
      setState({ kind: "ready" });
    } catch (e) {
      setState({ kind: "error", message: e instanceof Error ? e.message : "Failed to load" });
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function togglePublish(productId: string, next: boolean) {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isPublished: next } : p)),
    );
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(productId)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ isPublished: next }),
      });
      if (!res.ok) throw new Error(`Publish update failed (${res.status})`);
    } catch {
      // revert on failure
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isPublished: !next } : p)),
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage marketplace products and product detail pages.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load}>
            <RefreshCw size={16} /> Refresh
          </Button>
          <Button onClick={() => router.push("/admin/products/new")}>
            <Plus size={16} /> New product
          </Button>
        </div>
      </div>

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
          {(() => {
            if (state.kind === "loading") {
              return <div className="p-6 text-sm text-muted-foreground">Loading…</div>;
            }
            if (state.kind === "error") {
              return <div className="p-6 text-sm text-destructive">{state.message}</div>;
            }
            return (
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
                      <TableCell>
                        <Badge variant="secondary">{p.code}</Badge>
                      </TableCell>
                      <TableCell>{p.category}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{p.ctaType}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={p.isPublished}
                            onCheckedChange={(next) => togglePublish(p.id, next)}
                          />
                          <span className="text-xs text-muted-foreground">
                            {p.isPublished ? "Yes" : "No"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/products/${encodeURIComponent(p.id)}`)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              </Table>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}

