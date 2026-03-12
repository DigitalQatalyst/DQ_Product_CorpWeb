import { useState, useMemo, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  FilterIcon,
  XIcon,
  ChevronDownIcon,
  HomeIcon,
  ChevronRightIcon,
  Search,
  Loader,
} from "lucide-react";
import { getPublicJobPostings } from "../services/jobPostingService";
import type { JobPosting } from "../services/jobPostingService";

type JobListing = {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  openPositions?: number;
  postedDate: string;
};

type JobFilters = {
  department: string[];
  location: string[];
  type: string[];
};

const initialFilters: JobFilters = {
  department: [],
  location: [],
  type: [],
};

type FilterOption = {
  id: string;
  label: string;
};

export default function JobListingsPage() {
  const [filters, setFilters] = useState<JobFilters>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openPositions, setOpenPositions] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<keyof JobFilters, boolean>>({
    department: false,
    location: false,
    type: false,
  });

  // Fetch job postings from database
  useEffect(() => {
    const fetchJobs = async () => {
      console.log('[JobListingsPage] Starting to fetch jobs...');
      setLoading(true);
      const result = await getPublicJobPostings();
      
      console.log('[JobListingsPage] Fetch result:', {
        hasError: !!result.error,
        error: result.error,
        dataCount: result.data?.length || 0
      });
      
      if (!result.error && result.data) {
        // Transform JobPosting to JobListing format
        const jobs: JobListing[] = result.data.map((job: JobPosting) => {
          console.log('[JobListingsPage] Processing job:', {
            id: job.id,
            title: job.title,
            reqType: typeof job.requirements,
            respType: typeof job.responsibilities
          });

          // Handle requirements - convert from jsonb to array if needed
          let requirements: string[] = [];
          if (job.requirements) {
            if (Array.isArray(job.requirements)) {
              requirements = job.requirements;
            } else if (typeof job.requirements === 'object' && (job.requirements as any).items) {
              requirements = (job.requirements as any).items;
            } else if (typeof job.requirements === 'string') {
              try {
                const parsed = JSON.parse(job.requirements);
                requirements = Array.isArray(parsed) ? parsed : (parsed.items || []);
              } catch {
                requirements = [];
              }
            }
          }

          // Handle responsibilities - convert from jsonb to array if needed
          let responsibilities: string[] = [];
          if (job.responsibilities) {
            if (Array.isArray(job.responsibilities)) {
              responsibilities = job.responsibilities;
            } else if (typeof job.responsibilities === 'object' && (job.responsibilities as any).items) {
              responsibilities = (job.responsibilities as any).items;
            } else if (typeof job.responsibilities === 'string') {
              try {
                const parsed = JSON.parse(job.responsibilities);
                responsibilities = Array.isArray(parsed) ? parsed : (parsed.items || []);
              } catch {
                responsibilities = [];
              }
            }
          }

          return {
            id: job.id,
            title: job.title,
            department: job.department,
            location: job.location,
            type: job.type,
            level: job.level,
            description: job.description,
            requirements,
            responsibilities,
            postedDate: job.posted_date || job.created_at,
          };
        });
        
        console.log('[JobListingsPage] Transformed jobs:', {
          count: jobs.length,
          jobs: jobs.map(j => ({ id: j.id, title: j.title }))
        });
        setOpenPositions(jobs);
      } else {
        console.error('[JobListingsPage] Error fetching jobs:', result.error);
      }
      
      setLoading(false);
    };

    fetchJobs();
  }, []);

  // Generate filter options from job data
  const departmentOptions: FilterOption[] = useMemo(() => {
    return Array.from(new Set(openPositions.map((job) => job.department)))
      .sort()
      .map((value) => ({ id: value, label: value }));
  }, [openPositions]);

  const locationOptions: FilterOption[] = useMemo(() => {
    return Array.from(new Set(openPositions.map((job) => job.location)))
      .sort()
      .map((value) => ({ id: value, label: value }));
  }, [openPositions]);

  const typeOptions: FilterOption[] = useMemo(() => {
    return Array.from(new Set(openPositions.map((job) => job.type)))
      .sort()
      .map((value) => ({ id: value, label: value }));
  }, [openPositions]);

  // Filter jobs based on selected filters and search query
  const filteredPositions = useMemo(() => {
    return openPositions.filter((job) => {
      // Filter by checkboxes
      const departmentMatch =
        filters.department.length === 0 || filters.department.includes(job.department);
      const locationMatch =
        filters.location.length === 0 || filters.location.includes(job.location);
      const typeMatch =
        filters.type.length === 0 || filters.type.includes(job.type);
      
      // Filter by search query
      const searchMatch = searchQuery === "" || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      return departmentMatch && locationMatch && typeMatch && searchMatch;
    });
  }, [filters, searchQuery]);

  const handleFilterChange = (
    filterType: keyof JobFilters,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setSearchQuery("");
  };

  const toggleGroup = (group: keyof JobFilters) => {
    setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const hasActiveFilters =
    filters.department.length > 0 ||
    filters.location.length > 0 ||
    filters.type.length > 0 ||
    searchQuery !== "";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow">
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center text-gray-600">
                  <HomeIcon size={16} className="mr-1" />
                  <a href="/careers" className="hover:text-primary">Careers</a>
                </li>
                <li aria-current="page">
                  <div className="flex items-center text-gray-500">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    <span className="ml-1 md:ml-2">Job Listings</span>
                  </div>
                </li>
              </ol>
            </nav>

            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                Open Positions
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Explore opportunities to make an impact with DigitalQatalyst. Filter by department, 
                location, and work type to find your perfect role.
              </p>
              
              {/* Search Bar */}
              <div className="w-full">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by job title or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <XIcon size={20} />
                    </button>
                  )}
                </div>
              </div>
            </header>

            {/* Mobile Filter Toggle */}
            <div className="xl:hidden bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
              <button
                onClick={() => setShowFilters((prev) => !prev)}
                className="w-full flex items-center justify-between px-4 py-3 text-gray-700 font-medium"
                aria-expanded={showFilters}
                aria-controls="mobile-job-filters"
              >
                <span className="inline-flex items-center gap-2">
                  <FilterIcon size={18} />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </span>
                <XIcon
                  size={18}
                  className={`transition-transform ${showFilters ? "rotate-45" : ""}`}
                />
              </button>
              {showFilters && (
                <div
                  id="mobile-job-filters"
                  className="px-4 pb-4 space-y-5 border-t border-gray-100"
                >
                  <FilterGroup
                    title="Department"
                    options={departmentOptions}
                    selected={filters.department}
                    collapsed={collapsedGroups.department}
                    isFirst
                    onToggleCollapse={() => toggleGroup("department")}
                    onSelect={(value) => handleFilterChange("department", value)}
                  />
                  <FilterGroup
                    title="Location"
                    options={locationOptions}
                    selected={filters.location}
                    collapsed={collapsedGroups.location}
                    onToggleCollapse={() => toggleGroup("location")}
                    onSelect={(value) => handleFilterChange("location", value)}
                  />
                  <FilterGroup
                    title="Work Type"
                    options={typeOptions}
                    selected={filters.type}
                    collapsed={collapsedGroups.type}
                    onToggleCollapse={() => toggleGroup("type")}
                    onSelect={(value) => handleFilterChange("type", value)}
                  />
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="text-sm font-semibold text-primary"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Two Column Layout */}
            <div className="flex flex-col xl:flex-row gap-6">
              {/* Sidebar Filters - Desktop */}
              <aside className="hidden xl:block xl:w-1/4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-6 sticky top-24">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="text-sm font-semibold text-primary"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <FilterGroup
                    title="Department"
                    options={departmentOptions}
                    selected={filters.department}
                    collapsed={collapsedGroups.department}
                    isFirst
                    onToggleCollapse={() => toggleGroup("department")}
                    onSelect={(value) => handleFilterChange("department", value)}
                  />
                  <FilterGroup
                    title="Location"
                    options={locationOptions}
                    selected={filters.location}
                    collapsed={collapsedGroups.location}
                    onToggleCollapse={() => toggleGroup("location")}
                    onSelect={(value) => handleFilterChange("location", value)}
                  />
                  <FilterGroup
                    title="Work Type"
                    options={typeOptions}
                    selected={filters.type}
                    collapsed={collapsedGroups.type}
                    onToggleCollapse={() => toggleGroup("type")}
                    onSelect={(value) => handleFilterChange("type", value)}
                  />
                </div>
              </aside>

              {/* Main Content Area */}
              <section className="xl:w-3/4">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader className="animate-spin text-primary" size={40} />
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 text-sm text-gray-600">
                      <span>
                        Showing {filteredPositions.length} of {openPositions.length} positions
                      </span>
                      {hasActiveFilters && (
                        <button
                          onClick={resetFilters}
                          className="text-primary font-semibold"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>

                {/* Job Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPositions.map((position) => (
                    <JobCard key={position.id} job={position} />
                  ))}
                </div>

                {/* Empty State */}
                {filteredPositions.length === 0 && (
                  <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center mt-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No positions found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters or clearing selections to explore all available positions.
                    </p>
                    <button onClick={resetFilters} className="text-primary font-semibold">
                      Reset Filters
                    </button>
                  </div>
                )}
                  </>
                )}
              </section>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Filter Group Component
function FilterGroup({
  title,
  options,
  selected,
  collapsed,
  onToggleCollapse,
  onSelect,
  isFirst = false,
}: {
  title: string;
  options: FilterOption[];
  selected: string[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSelect: (value: string) => void;
  isFirst?: boolean;
}) {
  const containerClasses = isFirst
    ? "pt-0"
    : "border-t border-gray-100 pt-4 mt-4";

  return (
    <div className={containerClasses}>
      <button
        onClick={onToggleCollapse}
        className="w-full flex items-center justify-between text-left text-gray-900 font-semibold"
      >
        <span>{title}</span>
        <ChevronDownIcon
          className={`h-4 w-4 text-gray-500 transition-transform ${
            collapsed ? "-rotate-90" : ""
          }`}
        />
      </button>
      {!collapsed && (
        <div className="mt-3 space-y-2">
          {options.map((option) => (
            <label key={option.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                checked={selected.includes(option.id)}
                onChange={() => onSelect(option.id)}
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// Job Card Component
function JobCard({ job }: { job: JobListing }) {
  return (
    <article className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      {/* Header - Fixed Height */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-3">
            <h3 className="text-xl font-semibold text-gray-900 leading-tight line-clamp-2 flex-1">
              {job.title}
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex-shrink-0">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Open
            </span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-1 whitespace-nowrap">
              <Briefcase size={14} className="flex-shrink-0" />
              <span className="truncate">{job.department}</span>
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <MapPin size={14} className="flex-shrink-0" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <Clock size={14} className="flex-shrink-0" />
              <span>{job.type}</span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
            job.level === "Senior" 
              ? "bg-purple-100 text-purple-700"
              : job.level === "Mid-Level"
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }`}>
            {job.level}
          </span>
        </div>
      </div>

      {/* Open Positions Badge */}
      {job.openPositions && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-primary/10 text-primary border border-primary/20">
            <Briefcase size={14} />
            {job.openPositions} {job.openPositions === 1 ? 'Position' : 'Positions'} Available
          </span>
        </div>
      )}

      {/* Description - Fixed Height with Line Clamp */}
      <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 mb-4 flex-grow">
        {job.description}
      </p>

      {/* Requirements Preview - Fixed Height */}
      <div className="text-sm mb-4 min-h-[3rem]">
        {job.requirements && job.requirements.length > 0 && (
          <>
            <span className="font-semibold text-gray-900">Key Requirements: </span>
            <span className="text-gray-600 line-clamp-2">
              {job.requirements[0]}
              {job.requirements.length > 1 && ` • ${job.requirements[1]}`}
            </span>
            {job.requirements.length > 2 && (
              <span className="text-gray-400 text-xs block mt-1">
                +{job.requirements.length - 2} more requirement{job.requirements.length - 2 !== 1 ? 's' : ''}
              </span>
            )}
          </>
        )}
      </div>

      {/* Footer - Always at Bottom */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
        <span className="text-xs text-gray-500">
          Posted {new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <a 
          href={`/jobs/${job.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-600 transition-colors"
        >
          View Job
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
