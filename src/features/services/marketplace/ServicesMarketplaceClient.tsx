"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { HomeIcon, Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Service } from "@/features/services/hooks/useServices";

const SERVICE_TABS = [
  {
    id: "Design Services",
    label: "Design Services",
    description:
      "Strategic design and architecture services to envision and blueprint your digital transformation.",
  },
  {
    id: "Deploy Services (SaaS)",
    label: "Deploy Services (SaaS)",
    description:
      "Cloud-based deployment services for scalable and flexible digital solutions.",
  },
  {
    id: "Deploy Services (On-Prem)",
    label: "Deploy Services (On-Prem)",
    description:
      "On-premise deployment services for secure and controlled digital infrastructure.",
  },
] as const;

type TabId = (typeof SERVICE_TABS)[number]["id"];

const FILTER_CONFIG = [
  {
    id: "serviceCategory",
    title: "Service Category",
    options: [
      { id: "digital-experience", label: "Digital Experience" },
      { id: "digital-core-dws", label: "Digital Core / DWS" },
      { id: "connected-intelligence", label: "Connected Intelligence" },
    ],
  },
  {
    id: "serviceAvailability",
    title: "Service Availability",
    options: [
      { id: "available", label: "Available" },
      { id: "coming-soon", label: "Coming Soon" },
    ],
  },
  {
    id: "serviceReadiness",
    title: "Service Readiness",
    options: [
      { id: "ready-to-order", label: "Ready to Order" },
      { id: "has-dependency", label: "Has Dependency" },
    ],
  },
] as const;

type ActiveFilters = Record<string, string[]>;

function toSlug(v: string) {
  return v
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[/()]/g, "")
    .replace(/-+/g, "-");
}

function FilterSidebar({
  filters,
  onFilterChange,
  onReset,
}: {
  filters: ActiveFilters;
  onFilterChange: (id: string, optId: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-0">
      {FILTER_CONFIG.map((group) => (
        <Collapsible key={group.id} defaultOpen>
          <div className="py-3">
            <CollapsibleTrigger className="flex w-full justify-between items-center text-left text-sm font-medium text-foreground mb-2">
              {group.title}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-2 mt-1">
                {group.options.map((opt) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`${group.id}-${opt.id}`}
                      checked={(filters[group.id] ?? []).includes(opt.id)}
                      onCheckedChange={() => onFilterChange(group.id, opt.id)}
                    />
                    <Label
                      htmlFor={`${group.id}-${opt.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
            <Separator className="mt-3" />
          </div>
        </Collapsible>
      ))}
      <button
        onClick={onReset}
        className="w-full mt-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
      >
        Reset All Filters
      </button>
    </div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="flex flex-col min-h-85 rounded-lg py-0 gap-0 hover:shadow-md transition-shadow">
      <CardContent className="grow flex flex-col p-6">
        <div className="flex items-start mb-4">
          <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center shrink-0 mr-3 text-xs font-bold text-muted-foreground">
            DQ
          </div>
          <div className="grow flex flex-col">
            <h3 className="font-bold text-foreground line-clamp-2 leading-snug">
              {service.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {service.provider}
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 min-h-15 leading-relaxed mb-2">
          {service.description}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-wrap gap-1">
            {service.tags.slice(0, 2).map((tag, i) => (
              <Badge
                key={tag}
                variant={i === 0 ? "default" : "secondary"}
                className="text-xs rounded-full"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-border p-4 gap-2">
        <Link
          href={`/services/${service.id}`}
          className="px-4 py-2 text-sm font-medium text-secondary border border-secondary rounded-md hover:bg-secondary/5 transition-colors flex-1 text-center"
        >
          View Details
        </Link>
        <Link
          href={`/services/${service.id}?action=true`}
          className="px-4 py-2 text-sm font-bold text-secondary-foreground bg-secondary hover:bg-secondary/80 rounded-md transition-colors flex-1 text-center"
        >
          Request Service
        </Link>
      </CardFooter>
    </Card>
  );
}

export function ServicesMarketplaceClient({
  allServices,
}: {
  allServices: Service[];
}) {
  const [activeTab, setActiveTab] = useState<TabId>("Design Services");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ActiveFilters>(() =>
    Object.fromEntries(FILTER_CONFIG.map((f) => [f.id, []])),
  );

  const handleFilterChange = useCallback(
    (filterId: string, optionId: string) => {
      setFilters((prev) => {
        const current = prev[filterId] ?? [];
        return {
          ...prev,
          [filterId]: current.includes(optionId)
            ? current.filter((v) => v !== optionId)
            : [...current, optionId],
        };
      });
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters(Object.fromEntries(FILTER_CONFIG.map((f) => [f.id, []])));
    setSearch("");
  }, []);

  const filtered = useMemo(() => {
    return allServices.filter((s) => {
      if (s.category !== activeTab) return false;
      const q = search.toLowerCase();
      if (
        q &&
        !s.title.toLowerCase().includes(q) &&
        !s.description.toLowerCase().includes(q) &&
        !s.tags.some((t) => t.toLowerCase().includes(q))
      )
        return false;
      for (const [id, sel] of Object.entries(filters)) {
        if (!sel.length) continue;
        if (
          id === "serviceCategory" &&
          !sel.includes(toSlug(s.serviceCategory))
        )
          return false;
        if (
          id === "serviceAvailability" &&
          !sel.includes(toSlug(s.serviceAvailability))
        )
          return false;
        if (
          id === "serviceReadiness" &&
          !sel.includes(toSlug(s.serviceReadiness))
        )
          return false;
      }
      return true;
    });
  }, [allServices, activeTab, search, filters]);

  const activeTabData = SERVICE_TABS.find((t) => t.id === activeTab)!;
  const tabTotal = allServices.filter((s) => s.category === activeTab).length;
  const isComingSoon = tabTotal === 0;
  const hasActiveFilters = !!(
    search || Object.values(filters).some((v) => v.length > 0)
  );
  const sidebar = (
    <FilterSidebar
      filters={filters}
      onFilterChange={handleFilterChange}
      onReset={resetFilters}
    />
  );

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 py-8 grow">
        <div className="pl-4">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={<Link href="/" />}
                  className="inline-flex items-center gap-1"
                >
                  <HomeIcon size={16} />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Services</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            Services Marketplace
          </h1>
          <p className="text-muted-foreground mb-6">
            Browse our comprehensive catalogue of digital transformation
            services designed to help your business thrive in the digital era.
          </p>

          <Card className="mb-6 py-0 gap-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                    Current Focus
                  </span>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    {activeTabData.label}
                  </h2>
                  <p className="text-muted-foreground">
                    {activeTabData.description}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="ml-4 whitespace-nowrap rounded-full"
                >
                  Overview
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="border-b border-secondary mb-6">
            <div className="flex space-x-8">
              {SERVICE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearch("");
                  }}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-secondary text-secondary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              size={18}
            />
            <Input
              placeholder="Search by title or description"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-10"
            />
            {search && (
              <button
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setSearch("")}
              >
                <X
                  size={18}
                  className="text-muted-foreground hover:text-foreground"
                />
              </button>
            )}
          </div>

          <div className="flex flex-col xl:flex-row gap-6">
            <div
              className="xl:hidden sticky z-20 bg-muted/30 py-2"
              style={{ top: "46px" }}
            >
              <div className="flex justify-between items-center">
                <Sheet>
                  <SheetTrigger className="flex items-center gap-2 bg-background px-4 py-2 rounded-lg shadow-sm border border-border text-foreground w-full justify-center text-sm">
                    <Filter size={18} />
                    Show Filters
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">{sidebar}</div>
                  </SheetContent>
                </Sheet>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="ml-2 text-secondary text-sm font-medium whitespace-nowrap px-3 py-2"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            <div className="hidden xl:block xl:w-1/4">
              <Card className="sticky top-24 max-h-[calc(100vh-7rem)] flex flex-col py-0 gap-0">
                <div className="flex justify-between items-center p-4 border-b border-border shrink-0">
                  <h2 className="text-base font-semibold text-foreground">
                    Filters
                  </h2>
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="text-secondary text-sm font-medium"
                    >
                      Reset All
                    </button>
                  )}
                </div>
                <div className="p-4 overflow-y-auto">{sidebar}</div>
              </Card>
            </div>

            <div className="xl:w-3/4">
              {isComingSoon ? (
                <div className="text-center py-16">
                  <div className="bg-accent/10 rounded-xl p-12 max-w-lg mx-auto">
                    <div className="text-6xl mb-6">🚀</div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      {activeTabData.label} — Coming Soon
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      We&apos;re working on bringing you comprehensive
                      deployment services. Stay tuned!
                    </p>
                  </div>
                </div>
              ) : filtered.length > 0 ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-foreground hidden sm:block">
                      Available Services ({filtered.length})
                    </h2>
                    <p className="text-sm text-muted-foreground hidden sm:block">
                      Showing {filtered.length} of {tabTotal} services
                    </p>
                    <h2 className="text-lg font-medium text-foreground sm:hidden">
                      {filtered.length} Services Available
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {filtered.map((s) => (
                      <ServiceCard key={s.id} service={s} />
                    ))}
                  </div>
                </div>
              ) : (
                <Card className="py-0 gap-0">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-xl font-medium text-foreground mb-2">
                      No services found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters or search criteria
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
