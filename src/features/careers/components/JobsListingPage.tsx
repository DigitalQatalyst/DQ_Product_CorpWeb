"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  Search,
  X,
  Filter,
  ChevronDown,
  Loader,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { JobListing } from "../data/careers.data";
import { listPublishedJobPostings } from "../api/jobPostings";

type Filters = { department: string[]; location: string[]; type: string[] };

function FilterGroups({
  jobs,
  filters,
  onChange,
  onReset,
}: {
  jobs: JobListing[];
  filters: Filters;
  onChange: (k: keyof Filters, v: string) => void;
  onReset: () => void;
}) {
  const groups: { key: keyof Filters; label: string; options: string[] }[] = [
    {
      key: "department",
      label: "Department",
      options: [...new Set(jobs.map((j) => j.department))].sort(),
    },
    {
      key: "location",
      label: "Location",
      options: [...new Set(jobs.map((j) => j.location))].sort(),
    },
    {
      key: "type",
      label: "Work Type",
      options: [...new Set(jobs.map((j) => j.type))].sort(),
    },
  ];
  return (
    <div className="space-y-1">
      {groups.map((g) => (
        <Collapsible key={g.key} defaultOpen>
          <div className="py-3 border-b border-border last:border-0">
            <CollapsibleTrigger className="flex w-full justify-between items-center text-sm font-semibold text-foreground mb-2">
              {g.label}{" "}
              <ChevronDown size={14} className="text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-2 mt-1">
                {g.options.map((opt) => (
                  <div key={opt} className="flex items-center gap-2">
                    <Checkbox
                      id={`${g.key}-${opt}`}
                      checked={filters[g.key].includes(opt)}
                      onCheckedChange={() => onChange(g.key, opt)}
                    />
                    <Label
                      htmlFor={`${g.key}-${opt}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {opt}
                    </Label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      ))}
      <button
        onClick={onReset}
        className="w-full mt-2 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
}

function JobCard({ job }: { job: JobListing }) {
  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col">
      <CardContent className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-semibold text-foreground leading-tight line-clamp-2 flex-1">
            {job.title}
          </h3>
          <Badge
            variant="outline"
            className="text-xs bg-accent/10 text-accent border-accent/20 shrink-0"
          >
            Open
          </Badge>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Briefcase size={13} />
            {job.department}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={13} />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {job.type}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4 flex-1">
          {job.description}
        </p>
        <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
          <span className="text-xs text-muted-foreground">
            {new Date(job.postedDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <Link
            href={`/jobs/${job.id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors"
          >
            View Job <ArrowRight size={14} />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function JobsListingPage() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>({
    department: [],
    location: [],
    type: [],
  });

  useEffect(() => {
    listPublishedJobPostings()
      .then((data) => setJobs(data))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const handleFilterChange = (key: keyof Filters, value: string) =>
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));

  const resetFilters = () => {
    setFilters({ department: [], location: [], type: [] });
    setSearch("");
  };

  const hasActive = !!(search || Object.values(filters).some((v) => v.length));

  const filtered = useMemo(
    () =>
      jobs.filter((j) => {
        const q = search.toLowerCase();
        if (
          q &&
          !j.title.toLowerCase().includes(q) &&
          !j.description.toLowerCase().includes(q)
        )
          return false;
        if (
          filters.department.length &&
          !filters.department.includes(j.department)
        )
          return false;
        if (filters.location.length && !filters.location.includes(j.location))
          return false;
        if (filters.type.length && !filters.type.includes(j.type)) return false;
        return true;
      }),
    [jobs, search, filters],
  );

  const sidebar = (
    <FilterGroups
      jobs={jobs}
      filters={filters}
      onChange={handleFilterChange}
      onReset={resetFilters}
    />
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/careers" />}>
                Careers
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Job Listings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Open Positions
        </h1>
        <p className="text-muted-foreground mb-6">
          Explore opportunities to make an impact with DigitalQatalyst.
        </p>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            size={18}
          />
          <Input
            placeholder="Search by job title or keyword..."
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
          {/* Mobile filter */}
          <div className="xl:hidden">
            <Sheet>
              <SheetTrigger className="flex items-center gap-2 bg-background px-4 py-2 rounded-lg border border-border text-foreground w-full justify-center text-sm">
                <Filter size={16} /> Filters
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-4">{sidebar}</div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop sidebar */}
          <aside className="hidden xl:block xl:w-1/4">
            <Card className="sticky top-24 py-0 gap-0">
              <div className="flex justify-between items-center p-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Filters</h2>
                {hasActive && (
                  <button
                    onClick={resetFilters}
                    className="text-secondary text-sm font-medium"
                  >
                    Reset All
                  </button>
                )}
              </div>
              <div className="p-4">{sidebar}</div>
            </Card>
          </aside>

          {/* Grid */}
          <div className="xl:w-3/4">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader className="animate-spin text-secondary" size={36} />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
                  <span>
                    Showing {filtered.length} of {jobs.length} positions
                  </span>
                  {hasActive && (
                    <button
                      onClick={resetFilters}
                      className="text-secondary font-medium"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
                {filtered.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filtered.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                ) : (
                  <Card className="py-0 gap-0">
                    <CardContent className="p-10 text-center">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        No positions found
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your filters or search query.
                      </p>
                      <button
                        onClick={resetFilters}
                        className="text-secondary font-semibold"
                      >
                        Reset Filters
                      </button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
