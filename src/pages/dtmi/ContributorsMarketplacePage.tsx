import { useMemo, useState, useEffect } from "react";
import {
  ChevronRightIcon,
  FilterIcon,
  HomeIcon,
  XIcon,
  ChevronDownIcon,
  ArrowRight,
  Users,
  Star,
  Sparkles,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import {
  contributorProfiles,
  ContributorProfile,
} from "../../data/dtmiContributors";

type ContributorFilters = {
  type: string[];
  tag: string[];
  worksRange: string[];
};

const initialFilters: ContributorFilters = {
  type: [],
  tag: [],
  worksRange: [],
};

const WORKS_BUCKETS = [
  { id: "0-5", label: "0–5 works", matches: (count: number) => count <= 5 },
  { id: "6-10", label: "6–10 works", matches: (count: number) => count >= 6 && count <= 10 },
  { id: "11+", label: "11+ works", matches: (count: number) => count >= 11 },
];

const CONTRIBUTOR_CATEGORIES = [
  {
    id: "research-leadership",
    name: "Research Leadership",
    description: "Strategic research direction and methodological oversight for DTMI's cognitive transformation initiatives.",
    contributorCount: 2,
    icon: "🎯",
    expertise: "Strategic Research, Cognitive Analysis, Transformation Leadership",
  },
  {
    id: "human-intelligence-analysts",
    name: "Human Intelligence Analysts", 
    description: "Expert analysts specializing in digital transformation domains and cognitive organizational frameworks.",
    contributorCount: 5,
    icon: "🧠",
    expertise: "Domain Analysis, Platform Architecture, Digital Strategy",
  },
  {
    id: "ai-research-agents",
    name: "AI Research Agents",
    description: "Specialized AI agents conducting autonomous research across the 6xD framework and digital transformation domains.",
    contributorCount: 7,
    icon: "🤖",
    expertise: "AI Research, Autonomous Analysis, Framework Specialization",
  },
  {
    id: "editorial-publication-team",
    name: "Editorial Publication Team",
    description: "Content curation, editorial oversight, and publication management for DTMI research outputs.",
    contributorCount: 3,
    icon: "✍️",
    expertise: "Editorial Leadership, Content Strategy, Publication Management",
  },
];

const CONTRIBUTOR_ADVERTS = [
  {
    id: "join-research-leadership",
    title: "Join Our Research Leadership Team",
    description: "Lead groundbreaking research in digital cognitive organizations and shape the future of enterprise transformation.",
    callToAction: "Apply Now",
    category: "Research Leadership",
    benefits: ["Lead strategic research initiatives", "Shape DTMI methodology", "Global recognition"],
    applicationUrl: "/dtmi/apply/research-leadership",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "become-hi-analyst",
    title: "Become a Human Intelligence Analyst",
    description: "Apply your expertise in digital transformation domains and contribute to cutting-edge cognitive analysis.",
    callToAction: "Join Us",
    category: "Human Intelligence Analysts",
    benefits: ["Work on diverse domains", "Collaborate with experts", "Publish research"],
    applicationUrl: "/dtmi/apply/human-intelligence-analyst",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    id: "editorial-opportunities",
    title: "Editorial & Publication Opportunities",
    description: "Shape how DTMI research reaches the world through content strategy and editorial excellence.",
    callToAction: "Get Started",
    category: "Editorial Publication Team",
    benefits: ["Content strategy leadership", "Editorial oversight", "Publication management"],
    applicationUrl: "/dtmi/apply/editorial-team",
    gradient: "from-green-500 to-teal-600",
  },
];

type FilterOption = {
  id: string;
  label: string;
};

export function ContributorsMarketplacePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');
  const viewAll = searchParams.get('view') === 'all';
  
  const [filters, setFilters] = useState<ContributorFilters>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<keyof ContributorFilters, boolean>>({
    type: false,
    tag: false,
    worksRange: false,
  });

  // Update filters when category parameter changes
  useEffect(() => {
    if (selectedCategory) {
      const categoryName = CONTRIBUTOR_CATEGORIES.find(cat => cat.id === selectedCategory)?.name;
      if (categoryName) {
        setFilters(prev => ({
          ...prev,
          type: [categoryName]
        }));
      }
    } else if (viewAll) {
      setFilters(initialFilters);
    } else {
      setFilters(initialFilters);
    }
  }, [selectedCategory, viewAll]);

  const typeOptions: FilterOption[] = useMemo(() => {
    // Define the new contributor type categories
    const standardTypes: FilterOption[] = [
      { id: "Research Leadership", label: "Research Leadership" },
      { id: "Human Intelligence Analysts", label: "Human Intelligence Analysts" },
      { id: "AI Research Agents", label: "AI Research Agents" },
      { id: "Editorial Publication Team", label: "Editorial Publication Team" },
    ];
    
    // Get any existing types from contributor profiles that aren't in the standard list
    // Exclude "Content Author" and "Registered Author" from filters
    const excludedTypes = ["Content Author", "Registered Author"];
    const existingTypes = Array.from(
      new Set(contributorProfiles.map((profile) => profile.type))
    )
      .filter(type => !standardTypes.find(std => std.id === type) && !excludedTypes.includes(type))
      .sort()
      .map((value) => ({ id: value, label: value }));
    
    // Combine standard types with any existing ones
    return [...standardTypes, ...existingTypes];
  }, []);
  
  const tagOptions: FilterOption[] = useMemo(() => {
    return Array.from(
      new Set(contributorProfiles.flatMap((profile) => profile.tags))
    )
      .sort()
      .map((value) => ({ id: value, label: value }));
  }, []);
  
  const worksOptions: FilterOption[] = WORKS_BUCKETS.map(({ id, label }) => ({
    id,
    label,
  }));

  const filteredContributors = useMemo(() => {
    return contributorProfiles.filter((profile) => {
      const typeMatch =
        filters.type.length === 0 || filters.type.includes(profile.type);
      const tagMatch =
        filters.tag.length === 0 ||
        filters.tag.some((tag) => profile.tags.includes(tag));
      const worksMatch =
        filters.worksRange.length === 0 ||
        filters.worksRange.some((bucketId) => {
          const bucket = WORKS_BUCKETS.find((b) => b.id === bucketId);
          return bucket ? bucket.matches(profile.works) : true;
        });
      return typeMatch && tagMatch && worksMatch;
    });
  }, [filters]);

  // Function to insert advert cards into contributor grid
  const contributorsWithAdverts = useMemo(() => {
    const contributors = [...filteredContributors];
    const adverts = [...CONTRIBUTOR_ADVERTS];
    const result: Array<{ type: 'contributor' | 'advert', data: any }> = [];
    
    // Add contributors and insert first advert as the 3rd item (index 2)
    contributors.forEach((contributor, index) => {
      result.push({ type: 'contributor', data: contributor });
      
      // Insert first advert as the 3rd item (after 2 contributors)
      if (index === 1 && adverts.length > 0) {
        result.push({ type: 'advert', data: adverts[0] });
      }
      // Insert additional adverts every 8 items after the first one
      else if (index > 1 && (index - 1) % 8 === 0 && adverts.length > 0) {
        const advertIndex = Math.floor((index - 1) / 8) % adverts.length;
        const nextAdvert = adverts[advertIndex === 0 ? 1 : advertIndex] || adverts[0];
        result.push({ type: 'advert', data: nextAdvert });
      }
    });
    
    return result;
  }, [filteredContributors]);

  const handleFilterChange = (
    filterType: keyof ContributorFilters,
    value: string
  ) => {
    const newFilters = {
      ...filters,
      [filterType]: filters[filterType].includes(value)
        ? filters[filterType].filter((item) => item !== value)
        : [...filters[filterType], value],
    };
    
    setFilters(newFilters);
    
    // Update URL parameters based on filter changes
    if (filterType === 'type') {
      if (newFilters.type.length === 0) {
        // No type filters selected - switch to "All Contributors" view
        setSearchParams({ view: 'all' });
      } else if (newFilters.type.length === 1) {
        // Single type filter - check if it matches a category
        const categoryMatch = CONTRIBUTOR_CATEGORIES.find(cat => cat.name === newFilters.type[0]);
        if (categoryMatch) {
          setSearchParams({ category: categoryMatch.id });
        } else {
          setSearchParams({ view: 'all' });
        }
      } else {
        // Multiple type filters - switch to "All Contributors" view
        setSearchParams({ view: 'all' });
      }
    }
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    // When resetting filters, switch to "All Contributors" view if we're currently in a category
    if (selectedCategory) {
      setSearchParams({ view: 'all' });
    } else {
      setSearchParams({});
    }
  };

  const toggleGroup = (group: keyof ContributorFilters) => {
    setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const hasActiveFilters =
    filters.type.length > 0 ||
    filters.tag.length > 0 ||
    filters.worksRange.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link
                  to="/dtmi"
                  className="inline-flex items-center text-gray-600 hover:text-brand-coral transition-colors"
                >
                  <HomeIcon size={16} className="mr-1" />
                  DTMI
                </Link>
              </li>
              <li>
                <div className="flex items-center text-gray-500">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <Link
                    to="/dtmi/contributors"
                    className="ml-1 md:ml-2 text-gray-600 hover:text-brand-coral transition-colors"
                  >
                    Contributors Marketplace
                  </Link>
                </div>
              </li>
              {(selectedCategory || viewAll) && (
                <li aria-current="page">
                  <div className="flex items-center text-gray-500">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    <span className="ml-1 md:ml-2">
                      {selectedCategory && filters.type.length > 0 && filters.type.includes(CONTRIBUTOR_CATEGORIES.find(cat => cat.id === selectedCategory)?.name || '')
                        ? CONTRIBUTOR_CATEGORIES.find(cat => cat.id === selectedCategory)?.name
                        : "All Contributors"
                      }
                    </span>
                  </div>
                </li>
              )}
            </ol>
          </nav>

          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Explore DTMI Contributors
            </h1>
            <p className="text-gray-600">
              Browse the collective intelligence powering DTMI, filter by contributor type, discover topical tags, and dive into their biographies, areas of expertise, and portfolio of published works.
            </p>
          </header>

          {(selectedCategory || viewAll) && (
            <div className="xl:hidden bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
              <button
                onClick={() => setShowFilters((prev) => !prev)}
                className="w-full flex items-center justify-between px-4 py-3 text-gray-700 font-medium"
                aria-expanded={showFilters}
                aria-controls="mobile-contributor-filters"
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
                  id="mobile-contributor-filters"
                  className="px-4 pb-4 space-y-5 border-t border-gray-100"
                >
                  <FilterGroup
                    title="Contributor Type"
                    options={typeOptions}
                    selected={filters.type}
                    collapsed={collapsedGroups.type}
                    isFirst
                    onToggleCollapse={() => toggleGroup("type")}
                    onSelect={(value) => handleFilterChange("type", value)}
                  />
                  <FilterGroup
                    title="Tags"
                    options={tagOptions}
                    selected={filters.tag}
                    collapsed={collapsedGroups.tag}
                    onToggleCollapse={() => toggleGroup("tag")}
                    onSelect={(value) => handleFilterChange("tag", value)}
                  />
                  <FilterGroup
                    title="Contribution Volume"
                    options={worksOptions}
                    selected={filters.worksRange}
                    collapsed={collapsedGroups.worksRange}
                    onToggleCollapse={() => toggleGroup("worksRange")}
                    onSelect={(value) => handleFilterChange("worksRange", value)}
                  />
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="text-sm font-semibold text-blue-600"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col xl:flex-row gap-6">
            {(selectedCategory || viewAll) && (
              <aside className="hidden xl:block xl:w-1/4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-6 sticky top-24">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="text-sm font-semibold text-blue-600"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <FilterGroup
                    title="Contributor Type"
                    options={typeOptions}
                    selected={filters.type}
                    collapsed={collapsedGroups.type}
                    isFirst
                    onToggleCollapse={() => toggleGroup("type")}
                    onSelect={(value) => handleFilterChange("type", value)}
                  />
                  <FilterGroup
                    title="Tags"
                    options={tagOptions}
                    selected={filters.tag}
                    collapsed={collapsedGroups.tag}
                    onToggleCollapse={() => toggleGroup("tag")}
                    onSelect={(value) => handleFilterChange("tag", value)}
                  />
                  <FilterGroup
                    title="Contribution Volume"
                    options={worksOptions}
                    selected={filters.worksRange}
                    collapsed={collapsedGroups.worksRange}
                    onToggleCollapse={() => toggleGroup("worksRange")}
                    onSelect={(value) => handleFilterChange("worksRange", value)}
                  />
                </div>
              </aside>
            )}

            <section className={(selectedCategory || viewAll) ? "xl:w-3/4" : "w-full"}>
              {!selectedCategory && !viewAll ? (
                // Show category cards when no category is selected
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <span className="text-sm text-gray-600">
                      Explore {CONTRIBUTOR_CATEGORIES.length} contributor categories
                    </span>
                    <Link
                      to="/dtmi/contributors?view=all"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-brand-coral text-white rounded-lg hover:bg-brand-coral-dark transition-colors font-medium"
                    >
                      View All Contributors
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {CONTRIBUTOR_CATEGORIES.map((category) => (
                      <CategoryCard key={category.id} category={category} />
                    ))}
                  </div>
                </>
              ) : (
                // Show filtered contributors when a category is selected
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 text-sm text-gray-600">
                    <span>
                      Showing {filteredContributors.length} of {contributorProfiles.length}{" "}
                      contributors
                    </span>
                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="text-blue-600 font-semibold"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {contributorsWithAdverts.map((item, index) => 
                      item.type === 'contributor' ? (
                        <ContributorCard key={`contributor-${item.data.id}`} contributor={item.data} />
                      ) : (
                        <AdvertCard key={`advert-${item.data.id}-${index}`} advert={item.data} />
                      )
                    )}
                  </div>

                  {filteredContributors.length === 0 && (
                    <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center mt-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No contributors found
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Try adjusting your filters or clearing selections to explore the full
                        marketplace.
                      </p>
                      <button onClick={resetFilters} className="text-blue-600 font-semibold">
                        Reset Filters
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

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
            <label key={option.id} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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

function AdvertCard({ advert }: { advert: typeof CONTRIBUTOR_ADVERTS[0] }) {
  return (
    <Link
      to={advert.applicationUrl}
      className="block"
    >
      <article className={`bg-gradient-to-br ${advert.gradient} rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200 flex flex-col gap-4 h-full text-white relative overflow-hidden`}>
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <Sparkles className="w-full h-full" />
        </div>
        
        <div className="flex items-start justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white leading-tight">
                {advert.title}
              </h3>
              <p className="text-sm text-white/80">Join DTMI</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-white/60">Opportunity</p>
            <p className="text-lg font-semibold text-white">Open</p>
          </div>
        </div>

        <p className="text-sm text-white/90 relative z-10">{advert.description}</p>

        <div className="text-sm text-white/90 flex gap-2 relative z-10">
          <span className="font-semibold text-white">Benefits:</span>
          <span>{advert.benefits.join(" • ")}</span>
        </div>

        <div className="mb-2 flex flex-wrap gap-2 relative z-10">
          <span className="inline-flex items-center text-xs font-semibold tracking-wide text-white/90 uppercase">
            <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30">
              Join {advert.category}
            </span>
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-white/20 pt-4 mt-auto relative z-10">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30 hover:bg-white/30 transition-colors">
            {advert.callToAction}
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </article>
    </Link>
  );
}

function CategoryCard({ category }: { category: typeof CONTRIBUTOR_CATEGORIES[0] }) {
  return (
    <Link
      to={`/dtmi/contributors?category=${category.id}`}
      className="block"
    >
      <article className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col gap-4 h-full">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-2xl border border-gray-100">
              {category.icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 leading-tight">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">DigitalQatalyst</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-gray-400">Contributors</p>
            <p className="text-lg font-semibold text-gray-900">{category.contributorCount}</p>
          </div>
        </div>

        <p className="text-sm text-gray-700">{category.description}</p>

        <div className="text-sm text-gray-600 flex gap-2">
          <span className="font-semibold text-gray-900">Expertise:</span>
          <span>{category.expertise}</span>
        </div>

        <div className="mb-2 flex flex-wrap gap-2">
          <span className="inline-flex items-center text-xs font-semibold tracking-wide text-purple-700 uppercase">
            <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full">
              Category
            </span>
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-coral">
            Explore Contributors
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </article>
    </Link>
  );
}

function ContributorCard({ contributor }: { contributor: ContributorProfile }) {
  const avatarUrl =
    contributor.avatar ||
    `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(
      contributor.name
    )}`;

  return (
    <article className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <img
            src={avatarUrl}
            alt={contributor.name}
            className="w-14 h-14 rounded-full object-cover border border-gray-100 bg-gray-100"
            loading="lazy"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 leading-tight">
              {contributor.name}
            </h3>
            <p className="text-sm text-gray-500">{contributor.affiliation}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-gray-400">Works</p>
          <p className="text-lg font-semibold text-gray-900">{contributor.works}</p>
        </div>
      </div>

      <p className="text-sm text-gray-700">{contributor.bio}</p>

      <div className="text-sm text-gray-600 flex gap-2">
        <span className="font-semibold text-gray-900">Expertise:</span>
        <span>{contributor.expertise}</span>
      </div>

      <div className="mb-2 flex flex-wrap gap-2">
        <span className="inline-flex items-center text-xs font-semibold tracking-wide text-blue-700 uppercase">
          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
            {contributor.type.replace(/s$/, '')}
          </span>
        </span>
        <span className="inline-flex items-center text-xs font-semibold tracking-wide text-green-700">
          <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full">
            {contributor.subCategory}
          </span>
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <Link
          to={contributor.profileUrl || "/dtmi/contributors"}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-coral hover:text-brand-coral-dark"
        >
          Read Contributor Bio
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

export default ContributorsMarketplacePage;