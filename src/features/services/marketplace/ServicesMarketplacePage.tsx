"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { HomeIcon, Search, X, Filter, BookmarkIcon, ScaleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { serviceItems, SERVICE_TABS, FILTER_CONFIG, type ServiceTabId } from "./data/service.data";

type ActiveFilters = Record<string, string[]>;

const TAB_CATEGORY_MAP: Record<ServiceTabId, string> = {
  "design-services": "Design Services",
  "deploy-services-saas": "Deploy Services (SaaS)",
  "deploy-services-onprem": "Deploy Services (On-Prem)",
};

const TAB_DESCRIPTION_MAP: Record<ServiceTabId, string> = {
  "design-services": "Strategic design and architecture services to envision and blueprint your digital transformation.",
  "deploy-services-saas": "Cloud-based deployment services for scalable and flexible digital solutions.",
  "deploy-services-onprem": "On-premise deployment services for secure and controlled digital infrastructure.",
};

function toSlug(v: string) {
  return v.toLowerCase().replace(/\s+/g, "-").replace(/[/()]/g, "").replace(/-+/g, "-");
}

function FilterSidebar({ filters, onFilterChange, onReset }: {
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
                    <Label htmlFor={`${group.id}-${opt.id}`} className="text-sm font-normal cursor-pointer">
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
      <button onClick={onReset} className="w-full mt-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
        Reset All Filters
      </button>
    </div>
  );
}

function ServiceCard({ service }: { service: (typeof serviceItems)[0] }) {
  return (
    <Card className="flex flex-col min-h-[340px] rounded-lg py-0 gap-0 hover:shadow-md transition-shadow">
      <CardContent className="flex-grow flex flex-col px-4 py-5">
        <div className="flex items-start mb-5">
          <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center shrink-0 mr-3 text-xs font-bold text-muted-foreground">
            DQ
          </div>
          <div className="flex-grow min-h-[72px] flex flex-col justify-center">
            <h3 className="font-bold text-foreground line-clamp-2 min-h-[48px] leading-snug">{service.title}</h3>
            <p className="text-sm text-muted-foreground min-h-[20px] mt-1">{service.provider}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 min-h-[60px] leading-relaxed mb-5">
          {service.description}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-wrap gap-1 max-w-[70%]">
            {service.tags.slice(0, 2).map((tag, i) => (
              <Badge key={tag} variant={i === 0 ? "default" : "secondary"} className="text-xs rounded-full">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex space-x-2 shrink-0">
            <button className="p-1.5 rounded-full bg-muted text-muted-foreground hover:bg-muted/80" aria-label="Bookmark">
              <BookmarkIcon size={16} />
            </button>
            <button className="p-1.5 rounded-full bg-muted text-muted-foreground hover:bg-muted/80" aria-label="Compare">
              <ScaleIcon size={16} />
            </button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-border px-4 py-4 gap-2">
        <Link
          href={`/services/${service.id}`}
          className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary/5 transition-colors flex-1 text-center"
        >
          View Details
        </Link>
        <Link
          href={`/services/${service.id}?action=true`}
          className="px-4 py-2 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/80 rounded-md transition-colors flex-1 text-center"
        >
          Request Service
        </Link>
      </CardFooter>
    </Card>
  );
}

export function ServicesMarketplacePage() {
  const [activeTab, setActiveTab] = useState<ServiceTabId>("design-services");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ActiveFilters>(() =>
    Object.fromEntries(FILTER_CONFIG.map((f) => [f.id, []]))
  );

  const handleFilterChange = useCallback((filterId: string, optionId: string) => {
    setFilters((prev) => {
      const current = prev[filterId] ?? [];
      return { ...prev, [filterId]: current.includes(optionId) ? current.filter((v) => v !== optionId) : [...current, optionId] };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(Object.fromEntries(FILTER_CONFIG.map((f) => [f.id, []])));
    setSearch("");
  }, []);

  const filtered = useMemo(() => {
    const cat = TAB_CATEGORY_MAP[activeTab];
    return serviceItems.filter((s) => {
      if (s.category !== cat) return false;
      const q = search.toLowerCase();
      if (q && !s.title.toLowerCase().includes(q) && !s.description.toLowerCase().includes(q) && !s.tags.some((t) => t.toLowerCase().includes(q))) return false;
      for (const [id, sel] of Object.entries(filters)) {
        if (!sel.length) continue;
        if (id === "serviceCategory" && !sel.includes(toSlug(s.serviceCategory))) return false;
        if (id === "serviceAvailability" && !sel.includes(toSlug(s.serviceAvailability))) return false;
        if (id === "serviceReadiness" && !sel.includes(toSlug(s.serviceReadiness))) return false;
      }
      return true;
    });
  }, [activeTab, search, filters]);

  const isComingSoon = activeTab !== "design-services";
  const hasActiveFilters = !!(search || Object.values(filters).some((v) => v.length > 0));
  const sidebar = <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onReset={resetFilters} />;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <div className="container mx-auto px-4 py-8 flex-grow">

        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />} className="inline-flex items-center gap-1">
                <HomeIcon size={16} />Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Services</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-3xl font-bold text-foreground mb-2">Services Marketplace</h1>
        <p className="text-muted-foreground mb-6">
          Browse our comprehensive catalogue of digital transformation services designed to help your business thrive in the digital era.
        </p>

        {/* Current Focus */}
        <Card className="mb-6 py-0 gap-0">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Current Focus</span>
                <h2 className="text-xl font-bold text-foreground mb-2">{TAB_CATEGORY_MAP[activeTab]}</h2>
                <p className="text-muted-foreground">{TAB_DESCRIPTION_MAP[activeTab]}</p>
              </div>
              <Badge variant="secondary" className="ml-4 whitespace-nowrap rounded-full">Overview</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="border-b border-border mb-6">
          <div className="flex space-x-8">
            {SERVICE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearch(""); }}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
          <Input
            placeholder="Search by title or description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-10"
          />
          {search && (
            <button className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setSearch("")}>
              <X size={18} className="text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Mobile filter */}
          <div className="xl:hidden sticky z-20 bg-muted/30 py-2" style={{ top: "46px" }}>
            <div className="flex justify-between items-center">
              <Sheet>
                <SheetTrigger className="flex items-center gap-2 bg-background px-4 py-2 rounded-lg shadow-sm border border-border text-foreground w-full justify-center text-sm">
                  <Filter size={18} />Show Filters
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                  <div className="mt-4">{sidebar}</div>
                </SheetContent>
              </Sheet>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="ml-2 text-primary text-sm font-medium whitespace-nowrap px-3 py-2">Reset</button>
              )}
            </div>
          </div>

          {/* Desktop sidebar */}
          <div className="hidden xl:block xl:w-1/4">
            <Card className="sticky top-24 max-h-[calc(100vh-7rem)] flex flex-col py-0 gap-0">
              <div className="flex justify-between items-center p-4 border-b border-border shrink-0">
                <h2 className="text-base font-semibold text-foreground">Filters</h2>
                {hasActiveFilters && (
                  <button onClick={resetFilters} className="text-primary text-sm font-medium">Reset All</button>
                )}
              </div>
              <div className="p-4 overflow-y-auto">{sidebar}</div>
            </Card>
          </div>

          {/* Grid */}
          <div className="xl:w-3/4">
            {isComingSoon ? (
              <div className="text-center py-16">
                <div className="bg-accent/10 rounded-xl p-12 max-w-lg mx-auto">
                  <div className="text-6xl mb-6">🚀</div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{TAB_CATEGORY_MAP[activeTab]} — Coming Soon</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    We&apos;re working on bringing you comprehensive deployment services. Stay tuned!
                  </p>
                </div>
              </div>
            ) : filtered.length > 0 ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-foreground hidden sm:block">Available Services ({filtered.length})</h2>
                  <p className="text-sm text-muted-foreground hidden sm:block">
                    Showing {filtered.length} of {serviceItems.filter((s) => s.category === TAB_CATEGORY_MAP[activeTab]).length} services
                  </p>
                  <h2 className="text-lg font-medium text-foreground sm:hidden">{filtered.length} Services Available</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {filtered.map((s) => <ServiceCard key={s.id} service={s} />)}
                </div>
              </div>
            ) : (
              <Card className="py-0 gap-0">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-medium text-foreground mb-2">No services found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search criteria</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
