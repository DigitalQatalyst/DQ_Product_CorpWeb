"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HomeIcon, ChevronRight, Filter, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { dqProducts } from "@/data/products";
import { ProductCard } from "./components/ProductCard";
import { FilterSidebar } from "./components/FilterSidebar";

type Filters = { category: string; tag: string };

export function ProductsMarketplacePage() {
  const [filters, setFilters] = useState<Filters>({ category: "", tag: "" });
  const [search, setSearch] = useState("");

  const categories = useMemo(
    () => Array.from(new Set(dqProducts.map((p) => p.category))).sort(),
    []
  );

  const filtered = useMemo(
    () =>
      dqProducts.filter((p) => {
        const q = search.toLowerCase();
        return (
          (!filters.category || p.category === filters.category) &&
          (!filters.tag || p.tags.includes(filters.tag)) &&
          (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
        );
      }),
    [filters, search]
  );

  const handleFilterChange = (type: keyof Filters, value: string) =>
    setFilters((prev) => ({ ...prev, [type]: prev[type] === value ? "" : value }));

  const hasActiveFilters = !!(filters.category || filters.tag || search);

  const clearAll = () => {
    setFilters({ category: "", tag: "" });
    setSearch("");
  };

  const sidebar = (
    <FilterSidebar
      filters={filters}
      categories={categories}
      onFilterChange={handleFilterChange}
    />
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/products" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
          <HomeIcon size={14} />
          Home
        </Link>
        <ChevronRight size={14} />
        <span className="text-foreground">Products</span>
      </nav>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Explore Products</h1>
        <p className="text-muted-foreground text-lg">
          Discover curated digital products and accelerators engineered for growth and success in
          the digital economy.
        </p>
      </div>

      {/* Search + count row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search by product name, capability, or description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground shrink-0">
          <span className="px-3 py-1 rounded-lg bg-muted text-foreground whitespace-nowrap">
            Showing {filtered.length} of {dqProducts.length} products
          </span>
          {hasActiveFilters && (
            <button onClick={clearAll} className="text-secondary font-medium hover:text-secondary/80 transition-colors">
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Mobile filter trigger */}
      <div className="xl:hidden mb-4">
        <Sheet>
          <SheetTrigger className="inline-flex items-center justify-center gap-2 w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors">
            <Filter size={16} />
            Filters
            {filters.category && (
              <span className="ml-auto bg-secondary text-secondary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                1
              </span>
            )}
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4">{sidebar}</div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main layout */}
      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden xl:block w-64 shrink-0">
          <Card className="sticky top-4">
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-foreground">Filters</h2>
                {filters.category && (
                  <button
                    onClick={() => setFilters((f) => ({ ...f, category: "" }))}
                    className="text-secondary text-sm font-medium hover:text-secondary/80 transition-colors"
                  >
                    Reset All
                  </button>
                )}
              </div>
              {sidebar}
            </CardContent>
          </Card>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          <Card>
            <CardContent className="p-6">
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filters to explore more offerings.
                  </p>
                  <button
                    onClick={clearAll}
                    className="text-primary font-medium hover:text-primary/80 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
