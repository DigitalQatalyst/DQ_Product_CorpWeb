import React, { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FilterSidebar, FilterConfig } from "./FilterSidebar";
import { MarketplaceGrid } from "./MarketplaceGrid";
import { SearchBar } from "../SearchBar";
import { SubMarketplaceTabs, SubMarketplaceTab } from "./SubMarketplaceTabs";
import {
  FilterIcon,
  XIcon,
  HomeIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { ErrorDisplay, CourseCardSkeleton } from "../SkeletonLoader";
import { getMarketplaceConfig } from "../../utils/marketplaceConfig";
import { MarketplaceComparison } from "./MarketplaceComparison";
import { Header } from "../Header";
import { Footer } from "../Footer";
import {
  getStoredCompareIds,
  setStoredCompareIds,
  addCompareId as storageAddCompareId,
  removeCompareId as storageRemoveCompareId,
  clearCompare as storageClearCompare,
} from "../../utils/comparisonStorage";
import { useQuery } from "@apollo/client/react";
import { useLocation } from "react-router-dom";
import {
  GET_PRODUCTS,
  GET_FACETS,
  GET_ALL_COURSES,
} from "../../services/marketplaceQueries.ts";
import {
  listPublicMedia,
  mapGridToCard,
} from "../../services/knowledgeHubGrid";

// Type for comparison items
interface ComparisonItem {
  id: string;
  title: string;
  [key: string]: any;
}

// Types for GET_FACETS query
interface FacetValue {
  id: string;
  name: string;
  code: string;
}

interface Facet {
  id: string;
  name: string;
  code: string;
  values: FacetValue[];
}

interface GetFacetsData {
  facets: {
    items: Facet[];
  };
}

// Types for GET_PRODUCTS query
interface Asset {
  name: string;
}

interface Logo {
  name: string;
  source: string;
}

interface RequiredDocument {
  id: string;
  customFields: any;
}

interface RelatedService {
  id: string;
}

interface ProductCustomFields {
  Logo?: Logo;
  CustomerType?: string;
  BusinessStage?: string;
  Nationality?: string;
  LegalStructure?: string;
  Industry?: string;
  Partner?: string;
  ProcessingTime?: string;
  RegistrationValidity?: string;
  Cost?: number;
  Steps?: string;
  KeyTermsOfService?: string;
  RequiredDocuments?: RequiredDocument[];
  EmpowermentandLeadership?: string;
  RelatedServices?: RelatedService[];
  formUrl?: string;
  logoUrl?: string;
}

interface ProductFacetValue {
  facet: {
    id: string;
    name: string;
    code: string;
  };
  id: string;
  name: string;
  code: string;
}

interface Product {
  id: string;
  assets: Asset[];
  name: string;
  slug: string;
  description: string;
  facetValues: ProductFacetValue[];
  customFields: ProductCustomFields;
}

interface GetProductsData {
  products: {
    items: Product[];
    totalItems: number;
  };
}

// Types for GET_ALL_COURSES query
interface Course {
  id: string;
  name: string;
  description: string;
  partner: string;
  rating: number;
  reviewCount: number;
  cost: number;
  duration: string;
  logoUrl: string;
  businessStage: string;
  pricingModel: string;
  serviceCategory: string;
}

interface GetCoursesData {
  courses: {
    items: Course[];
    totalItems: number;
  };
}

export interface MarketplacePageProps {
  marketplaceType: "courses" | "financial" | "non-financial" | "dtmi";
  title: string;
  description: string;
  promoCards?: any[];
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  marketplaceType,
  promoCards = [],
}) => {
  const navigate = useNavigate();

  const location = useLocation() as any;

  // Safely get config with error handling
  let config: ReturnType<typeof getMarketplaceConfig>;
  try {
    config = getMarketplaceConfig(marketplaceType);
  } catch (error) {
    console.error("Error loading marketplace config:", error);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Error Loading Page
          </h1>
          <p className="text-gray-600 mb-6">
            Unable to load the {marketplaceType} marketplace. Please try again
            later.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // State for items and filtering
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  console.log("items fetched", items);

  // Filter sidebar visibility - should be visible on desktop, hidden on mobile by default
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([]);

  // Avoid clobbering localStorage with empty state before hydration
  const [hasHydratedCompare, setHasHydratedCompare] = useState(false);
  const [compareItems, setCompareItems] = useState<ComparisonItem[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // State for filter options
  const [filterConfig, setFilterConfig] = useState<FilterConfig[]>([]);

  // Knowledge Hub specific filters
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [urlParamsInitialized, setUrlParamsInitialized] = useState(false);
  // Track if URL parameters have set specific collapsed states
  const [hasUrlCollapsedState, setHasUrlCollapsedState] = useState(false);

  // Sub-marketplace tabs for Knowledge Hub and Services
  const [activeSubMarketplace, setActiveSubMarketplace] = useState<string>(
    marketplaceType === "dtmi" ? "written" : "design-services",
  );

  const subMarketplaceTabs: SubMarketplaceTab[] =
    marketplaceType === "dtmi"
      ? [
          {
            id: "written",
            label: "Written",
            description: "Articles, blogs, reports, and written content",
          },
          {
            id: "multimedia",
            label: "Multimedia",
            description: "Videos, podcasts, and interactive content",
          },
        ]
      : [
          {
            id: "design-services",
            label: "Design Services",
            description: "Strategic design and architecture services",
          },
          {
            id: "deploy-services-saas",
            label: "Deploy Services (SaaS)",
            description: "Cloud-based deployment services",
          },
          {
            id: "deploy-services-onprem",
            label: "Deploy Services (On-Prem)",
            description: "On-premise deployment services",
          },
        ];

  // Handle sub-marketplace tab change and clear filters
  const handleSubMarketplaceChange = useCallback((tabId: string) => {
    setActiveSubMarketplace(tabId);
    // Clear all filters when switching tabs
    setActiveFilters([]);
    setSearchQuery("");
  }, []);

  // Collapsible filter categories state - default all collapsed except Category section visible with subcategories collapsed
  const [collapsedCategories, setCollapsedCategories] = useState<
    Record<string, boolean>
  >({
    "content-type": true, // Content Type collapsed
    format: true, // Format collapsed
    category: false, // Category section expanded (to show subcategories)
    "category-digital-perspectives": true, // Digital Perspectives subcategory collapsed
    "category-digital-functional-streams-domains": true, // Digital Functional Streams & Domains collapsed
    "category-digital-sectors": true, // Digital Sectors collapsed
    popularity: true, // Popularity collapsed
  });

  // Search state for each filter category
  const [filterSearchQueries, setFilterSearchQueries] = useState<Record<string, string>>({});

  // Handle filter search query change
  const handleFilterSearchChange = useCallback((categoryId: string, query: string) => {
    setFilterSearchQueries((prev) => ({
      ...prev,
      [categoryId]: query,
    }));
  }, []);

  // Filter options based on search query
  const getFilteredOptions = useCallback((options: any[], categoryId: string) => {
    const searchQuery = filterSearchQueries[categoryId]?.toLowerCase() || '';
    if (!searchQuery) return options;
    
    return options.filter((option) => {
      // Check if option name matches
      if (option.name.toLowerCase().includes(searchQuery)) return true;
      
      // Check if any child matches (for nested options)
      if (option.children && option.children.length > 0) {
        return option.children.some((child: any) => {
          if (child.name.toLowerCase().includes(searchQuery)) return true;
          // Check third level
          if (child.children && child.children.length > 0) {
            return child.children.some((subChild: any) => 
              subChild.name.toLowerCase().includes(searchQuery)
            );
          }
          return false;
        });
      }
      
      return false;
    });
  }, [filterSearchQueries]);

  // Track scroll position for scroll indicator
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const handleFilterScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 10;
    setShowScrollIndicator(!isAtBottom && target.scrollHeight > target.clientHeight);
  }, []);

  // Check initial scroll state
  useEffect(() => {
    const filterContainer = document.querySelector('.custom-scrollbar');
    if (filterContainer) {
      const hasScroll = filterContainer.scrollHeight > filterContainer.clientHeight;
      setShowScrollIndicator(hasScroll);
    }
  }, [filterConfig, collapsedCategories]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Track header height so sticky elements sit directly under it
  const [headerHeight, setHeaderHeight] = useState<number>(46);
  // Knowledge Hub keyset pagination + caching state
  const [khCursor, setKhCursor] = useState<string | null>(null);
  const [khHasMore, setKhHasMore] = useState<boolean>(true);
  const [khFetching, setKhFetching] = useState<boolean>(false);
  const [khPages, setKhPages] = useState<
    Array<{ items: any[]; after: string | null; nextCursor: string | null }>
  >([]);
  const [khTotalCount, setKhTotalCount] = useState<number>(0);

  // Responsive pagination: exactly 4 rows per page for Knowledge Hub
  const [columns, setColumns] = useState<number>(1);
  const rowsPerPage = 4;
  const computedPageSize = columns * rowsPerPage;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const khCacheRef = useRef<
    Record<
      string,
      { items: any[]; cursor: string | null; ts: number; totalCount: number }
    >
  >({});
  const [khPageSize, setKhPageSize] = useState<number>(0);

  // Apollo queries for products, facets, and courses
  // Skip GraphQL entirely for DTMI — it uses Supabase + local data
  const skipGraph = marketplaceType === "dtmi";

  const { data: productData, error: productError } = useQuery<GetProductsData>(
    GET_PRODUCTS,
    {
      skip: skipGraph || marketplaceType === "courses",
      errorPolicy: "all", // Continue rendering even if there's an error
    },
  );

  const { data: courseData, error: courseError } = useQuery<GetCoursesData>(
    GET_ALL_COURSES,
    {
      skip: marketplaceType !== "courses",
      errorPolicy: "all",
    },
  );

  const { data: facetData, error: facetError } = useQuery<GetFacetsData>(
    GET_FACETS,
    {
      skip: skipGraph,
      errorPolicy: "all",
    },
  );

  // Handle GraphQL errors
  useEffect(() => {
    if (productError) {
      console.error("GraphQL product query error:", productError);
      setError(`Failed to load products: ${productError.message}`);
    }
    if (courseError) {
      console.error("GraphQL courses query error:", courseError);
      setError(`Failed to load courses: ${courseError.message}`);
    }
    if (facetError) {
      console.error("GraphQL facets query error:", facetError);
      console.warn("Facets query failed, using fallback filter configuration");
    }
  }, [productError, courseError, facetError]);

  // Measure header height for correct sticky offset on mobile
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector("header") as HTMLElement | null;
      setHeaderHeight(header?.offsetHeight || 46);
    };
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  // Initialize filters from URL parameters on mount
  useEffect(() => {
    if (urlParamsInitialized || marketplaceType !== "dtmi") return;

    const searchParams = new URLSearchParams(location.search);
    const contentType = searchParams.get("contentType");
    const category = searchParams.get("category");
    const sector = searchParams.get("sector");
    const stream = searchParams.get("stream");
    const domain = searchParams.get("domain");
    const dimension = searchParams.get("dimension");
    const format = searchParams.get("format");
    const popularity = searchParams.get("popularity");
    const expandCategory = searchParams.get("expandCategory");

    console.log("🔍 [MarketplacePage] URL Parameters:", {
      contentType,
      category,
      sector,
      stream,
      domain,
      dimension,
      format,
      popularity,
      expandCategory,
    });

    const filtersToApply: string[] = [];

    // Handle contentType parameter
    if (contentType) {
      const contentTypes = contentType.split(",").map((t) => t.trim());
      contentTypes.forEach((type) => {
        // Map URL parameter values to filter names
        const typeMapping: Record<string, string> = {
          articles: "Articles",
          blogs: "Blogs",
          whitepapers: "Whitepapers",
          "prediction-analysis": "Prediction Analysis",
          "research-reports": "Research Reports",
          "expert-interviews": "Expert Interviews",
          "case-studies": "Case Studies",
          videos: "Videos",
          podcasts: "Podcasts",
        };
        const mappedType = typeMapping[type.toLowerCase()];
        if (mappedType) {
          filtersToApply.push(mappedType);
        }
      });
    }

    // Handle category parameter (general category filtering and digital perspectives)
    if (category) {
      console.log("📂 [MarketplacePage] Category filter:", category);
      // Handle comma-separated categories
      const categories = category.split(",").map((c) => c.trim());
      
      // Check if these are digital perspective filter IDs
      const perspectiveMapping: Record<string, string> = {
        "d1-e40": "D1 - Digital Economy 4.0 (E4.0)",
        "d2-dco": "D2 - Digital Cognitive Organisation (DCO)",
        "d3-dbp": "D3 - Digital Business Platform (DBP)",
        "d4-dt20": "D4 - Digital Transformation 2.0 (DT2.0)",
        "d5-worker": "D5 - Digital Worker & Digital Workspace",
        "d6-accelerators": "D6 - Digital Accelerators (Tools)",
      };
      
      let hasDigitalPerspectiveFilters = false;
      
      categories.forEach((cat) => {
        if (perspectiveMapping[cat]) {
          // This is a digital perspective filter ID
          filtersToApply.push(perspectiveMapping[cat]);
          hasDigitalPerspectiveFilters = true;
        } else {
          // This is a regular category, set as search query
          setSearchQuery(decodeURIComponent(cat));
        }
      });
      
      // If digital perspective filters are applied, automatically expand category filter section
      if (hasDigitalPerspectiveFilters) {
        console.log("🎯 [MarketplacePage] Digital perspective filters detected, expanding category filter section");
        setCollapsedCategories((prev) => ({
          ...prev,
          "content-type": true, // Keep Content Type collapsed
          format: true, // Keep Format collapsed
          category: false, // Expand category filter (false = expanded for FilterSidebar)
          "category-digital-perspectives": false, // Expand Digital Perspectives subcategory
          "category-digital-functional-streams-domains": true, // Keep Digital Functional Streams & Domains collapsed
          "category-digital-sectors": true, // Keep Digital Sectors collapsed
          popularity: true, // Keep Popularity collapsed
        }));
        
        // Also show filter sidebar on desktop when 6xD filters are applied
        setShowFilters(true);
      }
    }
    
    // Handle expandCategory parameter to expand specific category sections
    if (expandCategory) {
      console.log("📂 [MarketplacePage] Expanding category:", expandCategory);
      if (expandCategory === "digital-perspectives") {
        setCollapsedCategories((prev) => ({
          ...prev,
          "content-type": true, // Keep Content Type collapsed
          format: true, // Keep Format collapsed
          category: false, // Expand main category filter
          "category-digital-perspectives": false, // Expand Digital Perspectives subcategory
          "category-digital-functional-streams-domains": true, // Keep Digital Functional Streams & Domains collapsed
          "category-digital-sectors": true, // Keep Digital Sectors collapsed
          popularity: true, // Keep Popularity collapsed
        }));
        setShowFilters(true);
        setHasUrlCollapsedState(true); // Mark that URL has set collapsed state
        
        // Scroll to Category section after a short delay to ensure DOM is ready
        setTimeout(() => {
          const categorySection = document.querySelector('[data-filter-section="category"]');
          if (categorySection) {
            categorySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            console.log("✅ [MarketplacePage] Scrolled to Category section");
          }
        }, 500);
      } else if (expandCategory === "digital-sectors") {
        setCollapsedCategories((prev) => ({
          ...prev,
          "content-type": true, // Keep Content Type collapsed
          format: true, // Keep Format collapsed
          category: false, // Expand main category filter
          "category-digital-perspectives": true, // Keep Digital Perspectives collapsed
          "category-digital-functional-streams-domains": true, // Keep Digital Functional Streams & Domains collapsed
          "category-digital-sectors": false, // Expand Digital Sectors subcategory
          popularity: true, // Keep Popularity collapsed
        }));
        setShowFilters(true);
        setHasUrlCollapsedState(true); // Mark that URL has set collapsed state
        
        // Scroll to Digital Sectors subsection with multiple attempts to ensure DOM is ready
        const attemptScroll = (attempts = 0) => {
          if (attempts > 10) {
            console.warn("⚠️ [MarketplacePage] Failed to find Digital Sectors subsection after 10 attempts");
            return;
          }
          
          const digitalSectorsSubsection = document.querySelector('[data-filter-subsection="category-digital-sectors"]');
          const filterContainer = document.querySelector('.custom-scrollbar');
          
          if (digitalSectorsSubsection && filterContainer) {
            // Calculate the position of the subsection relative to the filter container
            const subsectionTop = digitalSectorsSubsection.getBoundingClientRect().top;
            const containerTop = filterContainer.getBoundingClientRect().top;
            const scrollPosition = filterContainer.scrollTop + (subsectionTop - containerTop);
            
            filterContainer.scrollTo({ top: scrollPosition, behavior: 'smooth' });
            console.log("✅ [MarketplacePage] Scrolled to Digital Sectors subsection", { scrollPosition });
          } else {
            console.log(`🔄 [MarketplacePage] Attempt ${attempts + 1}: Waiting for Digital Sectors subsection to render...`);
            setTimeout(() => attemptScroll(attempts + 1), 200);
          }
        };
        
        setTimeout(() => attemptScroll(), 500);
      } else if (expandCategory === "digital-functional-streams-domains") {
        setCollapsedCategories((prev) => ({
          ...prev,
          "content-type": true, // Keep Content Type collapsed
          format: true, // Keep Format collapsed
          category: false, // Expand main category filter
          "category-digital-perspectives": true, // Keep Digital Perspectives collapsed
          "category-digital-functional-streams-domains": false, // Expand Digital Functional Streams & Domains subcategory
          "category-digital-sectors": true, // Keep Digital Sectors collapsed
          popularity: true, // Keep Popularity collapsed
        }));
        setShowFilters(true);
        setHasUrlCollapsedState(true); // Mark that URL has set collapsed state
        
        // Scroll to Category section after a short delay to ensure DOM is ready
        setTimeout(() => {
          const categorySection = document.querySelector('[data-filter-section="category"]');
          if (categorySection) {
            categorySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            console.log("✅ [MarketplacePage] Scrolled to Category section");
          }
        }, 500);
      }
    }

    // Handle sector parameter (for sector-specific filtering)
    if (sector) {
      console.log("🏢 [MarketplacePage] Sector filter:", sector);
      // Handle comma-separated sectors
      const sectors = sector.split(",").map((s) => s.trim());
      
      // Check if these are digital sector filter IDs
      const sectorMapping: Record<string, string> = {
        "experience40": "Cross-Sector Domain (Experience 4.0)",
        "agility40": "Cross-Sector Domain (Agility 4.0)",
        "farming40": "Primary Sector (Farming 4.0)",
        "plant40": "Secondary Sector (Plant 4.0)",
        "infrastructure40": "Secondary Sector (Infrastructure 4.0)",
        "government40": "Tertiary Sector (Government 4.0)",
        "hospitality40": "Tertiary Sector (Hospitality 4.0)",
        "retail40": "Tertiary Sector (Retail 4.0)",
        "service40": "Quaternary Sector (Service4.0)",
        "logistics40": "Quaternary Sector (Logistics4.0)",
        "wellness40": "Quinary Sector (Wellness4.0)",
      };
      
      let hasDigitalSectorFilters = false;
      
      sectors.forEach((sec) => {
        if (sectorMapping[sec]) {
          // This is a digital sector filter ID
          filtersToApply.push(sectorMapping[sec]);
          hasDigitalSectorFilters = true;
        } else {
          // This is a regular sector search, set as search query
          setSearchQuery(decodeURIComponent(sec));
        }
      });
      
      // If digital sector filters are applied, automatically expand category filter section
      // and collapse other subcategories to make Digital Sectors more visible
      if (hasDigitalSectorFilters) {
        console.log("🎯 [MarketplacePage] Digital sector filters detected, expanding category filter section");
        setCollapsedCategories((prev) => ({
          ...prev,
          "content-type": true, // Keep Content Type collapsed
          format: true, // Keep Format collapsed
          category: false, // Expand category filter
          "category-digital-perspectives": true, // Collapse Digital Perspectives
          "category-digital-functional-streams-domains": true, // Collapse Digital Functional Streams & Domains
          "category-digital-sectors": false, // Expand Digital Sectors subcategory
          popularity: true, // Keep Popularity collapsed
        }));
        
        // Also show filter sidebar on desktop when sector filters are applied
        setShowFilters(true);
      }
    }

    // Handle domain parameter (for digital domain filtering)
    if (domain) {
      console.log("🌐 [MarketplacePage] Domain filter:", domain);
      // Handle comma-separated domains
      const domains = domain.split(",").map((d) => d.trim());
      
      // Check if these are digital domain filter IDs
      const domainMapping: Record<string, string> = {
        "channels": "Digital Channels",
        "experience": "Digital Experience",
        "services": "Digital Services",
        "marketing": "Digital Marketing",
        "workspace": "Digital Workspace",
        "core-systems": "Digital Core",
        "gprc": "Digital GPRC",
        "back-office": "Digital Back-Office",
        "interops": "Digital InterOps",
        "security": "Digital Security",
        "intelligence": "Digital Intelligence",
        "it": "Digital IT",
      };
      
      let hasDigitalDomainFilters = false;
      
      domains.forEach((dom) => {
        if (domainMapping[dom]) {
          // This is a digital domain filter ID
          filtersToApply.push(domainMapping[dom]);
          hasDigitalDomainFilters = true;
        } else {
          // This is a regular domain search, set as search query
          setSearchQuery(decodeURIComponent(dom));
        }
      });
      
      // If digital domain filters are applied, automatically expand category filter section
      if (hasDigitalDomainFilters) {
        console.log("🎯 [MarketplacePage] Digital domain filters detected, expanding category filter section");
        setCollapsedCategories((prev) => ({
          ...prev,
          "content-type": true, // Keep Content Type collapsed
          format: true, // Keep Format collapsed
          category: false, // Expand category filter
          "category-digital-perspectives": true, // Keep Digital Perspectives collapsed
          "category-digital-functional-streams-domains": false, // Expand Digital Functional Streams & Domains subcategory
          "category-digital-sectors": true, // Keep Digital Sectors collapsed
          popularity: true, // Keep Popularity collapsed
        }));
        
        // Also show filter sidebar on desktop when domain filters are applied
        setShowFilters(true);
      }
    }

    // Handle stream parameter (for digital stream filtering)
    if (stream) {
      console.log("🌊 [MarketplacePage] Stream filter:", stream);
      // Handle comma-separated streams
      const streams = stream.split(",").map((s) => s.trim());
      
      // Check if these are digital stream filter IDs
      const streamMapping: Record<string, string> = {
        "frontend": "Digital Front-End",
        "core": "Digital Core",
        "enablers": "Digital Enablers",
      };
      
      let hasDigitalStreamFilters = false;
      
      streams.forEach((str) => {
        if (streamMapping[str]) {
          // This is a digital stream filter ID
          filtersToApply.push(streamMapping[str]);
          hasDigitalStreamFilters = true;
        } else {
          // This is a regular stream search, set as search query
          setSearchQuery(decodeURIComponent(str));
        }
      });
      
      // If digital stream filters are applied, automatically expand category filter section
      if (hasDigitalStreamFilters) {
        console.log("🎯 [MarketplacePage] Digital stream filters detected, expanding category filter section");
        setCollapsedCategories((prev) => ({
          ...prev,
          "content-type": true, // Keep Content Type collapsed
          format: true, // Keep Format collapsed
          category: false, // Expand category filter
          "category-digital-perspectives": true, // Keep Digital Perspectives collapsed
          "category-digital-functional-streams-domains": false, // Expand Digital Functional Streams & Domains subcategory
          "category-digital-sectors": true, // Keep Digital Sectors collapsed
          popularity: true, // Keep Popularity collapsed
        }));
        
        // Also show filter sidebar on desktop when stream filters are applied
        setShowFilters(true);
      }
    }

    // Handle dimension parameter (for 6XD dimension filtering)
    if (dimension) {
      console.log("📊 [MarketplacePage] Dimension filter:", dimension);
      setSearchQuery(decodeURIComponent(dimension));
    }

    // Handle format parameter
    if (format) {
      const formats = format.split(",").map((f) => f.trim());
      formats.forEach((fmt) => {
        const formatMapping: Record<string, string> = {
          written: "Written",
          video: "Video",
          audio: "Audio",
          interactive: "Interactive",
        };
        const mappedFormat = formatMapping[fmt.toLowerCase()];
        if (mappedFormat) {
          filtersToApply.push(mappedFormat);
        }
      });
    }

    // Handle popularity parameter
    if (popularity) {
      const popularityMapping: Record<string, string> = {
        trending: "Trending",
        "most-viewed": "Most Viewed",
        recent: "Recent",
      };
      const mappedPopularity = popularityMapping[popularity.toLowerCase()];
      if (mappedPopularity) {
        filtersToApply.push(mappedPopularity);
      }
    }

    if (filtersToApply.length > 0) {
      console.log(
        "✅ [MarketplacePage] Applying filters from URL:",
        filtersToApply,
      );
      setActiveFilters(filtersToApply);
    }

    setUrlParamsInitialized(true);
  }, [location.search, marketplaceType, urlParamsInitialized]);

  // Detect responsive columns; set a stable KH page size once (4 rows * cols)
  useEffect(() => {
    const calcColumns = () => {
      const w = typeof window !== "undefined" ? window.innerWidth : 0;
      const cols = w >= 1024 ? 3 : w >= 640 ? 2 : 1;
      setColumns(cols);
      if (!khPageSize) {
        setKhPageSize(cols * rowsPerPage);
      }
    };
    calcColumns();
    window.addEventListener("resize", calcColumns);
    return () => window.removeEventListener("resize", calcColumns);
  }, [khPageSize]);

  // Debounce search input for Knowledge Hub
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Helper function to extract marketplace filter values from activeFilters
  const extractMarketplaceFilters = (filters: string[]) => {
    const digitalPerspectivesMap: Record<string, string> = {
      "D1 - Digital Economy 4.0 (E4.0)": "D1",
      "D2 - Digital Cognitive Organisation (DCO)": "D2",
      "D3 - Digital Business Platform (DBP)": "D3",
      "D4 - Digital Transformation 2.0 (DT2.0)": "D4",
      "D5 - Digital Worker & Digital Workspace": "D5",
      "D6 - Digital Accelerators (Tools)": "D6",
    };

    const streamsMap: Record<string, string> = {
      "Digital Front-End": "Digital Front-End",
      "Digital Front-end": "Digital Front-End",
      "Digital Core": "Digital Core",
      "Digital Enablers": "Digital Enablers",
    };

    const domainsList = [
      "Digital Channels",
      "Digital Experience",
      "Digital Services",
      "Digital Marketing",
      "Digital Workspace",
      "Digital Core",
      "Digital GPRC",
      "Digital Back-Office",
      "Digital InterOps",
      "Digital Security",
      "Digital Intelligence",
      "Digital IT",
    ];

    const sectorsList = [
      "Cross-Sector Domain (Experience 4.0)",
      "Cross-Sector Domain (Agility 4.0)",
      "Primary Sector (Farming 4.0)",
      "Secondary Sector (Plant 4.0)",
      "Secondary Sector (Infrastructure 4.0)",
      "Tertiary Sector (Government 4.0)",
      "Tertiary Sector (Hospitality 4.0)",
      "Tertiary Sector (Retail 4.0)",
      "Quaternary Sector (Service4.0)",
      "Quaternary Sector (Logistics4.0)",
      "Quinary Sector (Wellness4.0)",
    ];

    const contentTypesList = [
      "Articles",
      "Blogs",
      "Whitepapers",
      "Prediction Analysis",
      "Research Reports",
      "Expert Interviews",
      "Case Studies",
      "Videos",
      "Podcasts",
    ];

    const formatsMap: Record<string, string> = {
      "Quick Reads": "Quick Reads",
      "In-Depth Reports": "In-Depth Reports",
      "Interactive Tools": "Interactive Tools",
      "Downloadable Templates": "Downloadable Templates",
      "Live Events": "Live Events",
      "Recorded Media": "Recorded Media",
    };

    const popularityMap: Record<string, string> = {
      Latest: "Latest",
      Trending: "Trending",
      "Most Downloaded": "Most Downloaded",
      "Editor's Pick": "Editor's Pick",
    };

    const digital_perspective: string[] = [];
    const digital_stream: string[] = [];
    const digital_domain: string[] = [];
    const digital_sector: string[] = [];
    const format: string[] = [];
    const popularity: string[] = [];
    const content_type: string[] = [];

    const addUnique = (target: string[], value?: string | null) => {
      if (!value) return;
      if (!target.includes(value)) target.push(value);
    };

    filters.forEach((filter) => {
      if (digitalPerspectivesMap[filter]) {
        addUnique(digital_perspective, digitalPerspectivesMap[filter]);
      } else if (streamsMap[filter]) {
        addUnique(digital_stream, streamsMap[filter]);
      } else if (domainsList.includes(filter)) {
        addUnique(digital_domain, filter);
      } else if (sectorsList.includes(filter)) {
        addUnique(digital_sector, filter);
      } else if (contentTypesList.includes(filter)) {
        addUnique(content_type, filter);
      } else if (formatsMap[filter]) {
        addUnique(format, formatsMap[filter]);
      } else if (popularityMap[filter]) {
        addUnique(popularity, popularityMap[filter]);
      }
    });

    // Only include filters that have values (return null for empty arrays)
    return {
      digital_perspective: digital_perspective.length > 0 ? digital_perspective[0] : null,
      digital_stream: digital_stream.length > 0 ? digital_stream[0] : null,
      digital_domain: digital_domain.length > 0 ? digital_domain[0] : null,
      digital_sector: digital_sector.length > 0 ? digital_sector[0] : null,
      format: format.length > 0 ? format[0] : null,
      popularity: popularity.length > 0 ? popularity[0] : null,
      content_type: content_type.length > 0 ? content_type[0] : null,
    };
  };

  // DTMI: initial load (keyset pagination), with simple memory cache
  const loadKHInitial = useCallback(async () => {
    if (marketplaceType !== "dtmi") return;
    setKhFetching(true);
    setError(null);
    setKhCursor(null);
    setKhHasMore(true);
    try {
      const pageLimit = Math.max(1, khPageSize || computedPageSize);
      const cacheKey = `q:${debouncedSearch}|filters:${activeFilters.join(",")}|sub:${activeSubMarketplace}|limit:${pageLimit}`;
      const cached = khCacheRef.current[cacheKey];
      const now = Date.now();
      if (cached && now - cached.ts < 30_000) {
        setItems(cached.items);
        setFilteredItems(cached.items);
        setKhCursor(cached.cursor);
        setKhHasMore(Boolean(cached.cursor));
        setKhTotalCount(cached.totalCount);
        // Also set khPages when using cache
        setKhPages([
          { items: cached.items, after: null, nextCursor: cached.cursor },
        ]);
        setCurrentPage(1);
        setKhFetching(false);
        return;
      }
      // Convert content type filters to mediaType values for legacy filtering
      let contentTypeParam = null;
      const marketplaceFilters = extractMarketplaceFilters(activeFilters);
      const hasContentTypeFilters =
        marketplaceFilters.content_type &&
        marketplaceFilters.content_type.length > 0;

      if (activeFilters.length > 0 && !hasContentTypeFilters) {
        const contentTypeMapping: Record<string, string> = {
          Articles: "Article",
          Blogs: "Blog",
          Whitepapers: "Whitepaper",
          "Prediction Analysis": "Prediction Analysis",
          "Research Reports": "Report",
          "Expert Interviews": "Expert Interview",
          "Case Studies": "Case Study",
          Videos: "Video",
          Podcasts: "Podcast",
        };

        const mappedTypes = activeFilters
          .map((filter) => contentTypeMapping[filter])
          .filter(Boolean) as string[];

        const uniqueTypes = [...new Set(mappedTypes)];
        contentTypeParam =
          uniqueTypes.length > 0 ? uniqueTypes.join(",") : null;
        console.log("🔄 [MarketplacePage] Mapped filters:", {
          activeFilters,
          mappedTypes: uniqueTypes,
          contentTypeParam,
        });
      }

      const {
        items: gridItems,
        nextCursor,
        totalCount,
      } = await listPublicMedia({
        limit: pageLimit,
        after: null,
        q: debouncedSearch || null,
        tag: contentTypeParam, // Use mapped content types instead of raw filter names
        subMarketplace: activeSubMarketplace as "written" | "multimedia" | null,
        ...marketplaceFilters, // Pass extracted marketplace filter values
      });
      const mapped = gridItems.map(mapGridToCard);
      setKhPages([{ items: mapped, after: null, nextCursor }]);
      setItems(mapped);
      setFilteredItems(mapped);
      setCurrentPage(1);
      setKhCursor(nextCursor);
      setKhHasMore(Boolean(nextCursor));
      setKhTotalCount(totalCount);
      khCacheRef.current[cacheKey] = {
        items: mapped,
        cursor: nextCursor,
        ts: now,
        totalCount,
      };
    } catch (e) {
      console.warn("Knowledge Hub initial fetch failed", e);
    } finally {
      setKhFetching(false);
    }
  }, [
    marketplaceType,
    debouncedSearch,
    khPageSize,
    computedPageSize,
    activeFilters,
    activeSubMarketplace,
  ]);

  // Removed auto-prefetch sentinel to avoid flicker and dupe fetches

  // Reset page when filters/search/page size change (DTMI only)
  // Note: Do NOT include filteredItems.length as it changes during pagination and would reset the page
  useEffect(() => {
    if (marketplaceType === "dtmi") {
      setCurrentPage(1);
    }
  }, [
    marketplaceType,
    computedPageSize,
    searchQuery,
    JSON.stringify(activeFilters),
  ]);

  // For dtmi we show one page at a time; others untouched.
  const paginatedItems = filteredItems;

  // Navigate DTMI pages with keyset backing (Prev/Next)
  const goToKHPage = useCallback(
    async (page: number) => {
      if (marketplaceType !== "dtmi") return;
      const target = Math.max(1, Math.floor(page || 1));
      // If page is already loaded, just swap
      if (target <= khPages.length) {
        const p = khPages[target - 1];
        setItems(p.items);
        setFilteredItems(p.items);
        setCurrentPage(target);
        setKhHasMore(Boolean(p.nextCursor) || target < khPages.length);
        setKhCursor(p.nextCursor);
        return;
      }
      // Only allow advancing exactly one page at a time
      if (target !== khPages.length + 1) return;
      const last = khPages[khPages.length - 1];
      if (!last || !last.nextCursor || khFetching) return;

      // Update current page immediately to show the change in UI
      setCurrentPage(target);
      setKhFetching(true);
      try {
        const pageLimit = Math.max(1, khPageSize || computedPageSize);

        // Convert content type filters to mediaType values for legacy filtering
        let contentTypeParam = null;
        const marketplaceFilters = extractMarketplaceFilters(activeFilters);
        const hasContentTypeFilters =
          marketplaceFilters.content_type &&
          marketplaceFilters.content_type.length > 0;

        if (activeFilters.length > 0 && !hasContentTypeFilters) {
          const contentTypeMapping: Record<string, string> = {
            Articles: "Article",
            Blogs: "Blog",
            Whitepapers: "Whitepaper",
            "Prediction Analysis": "Prediction Analysis",
            "Research Reports": "Report",
            "Expert Interviews": "Expert Interview",
            "Case Studies": "Case Study",
            Videos: "Video",
            Podcasts: "Podcast",
          };

          const mappedTypes = activeFilters
            .map((filter) => contentTypeMapping[filter])
            .filter(Boolean) as string[];

          contentTypeParam =
            mappedTypes.length > 0 ? mappedTypes.join(",") : null;
        }

        const { items: gridItems, nextCursor } = await listPublicMedia({
          limit: pageLimit,
          after: last.nextCursor,
          q: debouncedSearch || null,
          tag: contentTypeParam, // Use mapped content types instead of raw filter names
          subMarketplace: activeSubMarketplace as
            | "written"
            | "multimedia"
            | null,
          ...marketplaceFilters, // Pass extracted marketplace filter values
        });
        const mapped = gridItems.map(mapGridToCard);
        setKhPages((prev) => [
          ...prev,
          { items: mapped, after: last.nextCursor, nextCursor },
        ]);
        setItems(mapped);
        setFilteredItems(mapped);
        setKhCursor(nextCursor);
        setKhHasMore(Boolean(nextCursor));
      } catch (e) {
        console.warn("Knowledge Hub next page failed", e);
        // Revert current page on error
        setCurrentPage(target - 1);
      } finally {
        setKhFetching(false);
      }
    },
    [
      marketplaceType,
      khPages,
      khFetching,
      khPageSize,
      computedPageSize,
      debouncedSearch,
      activeFilters,
      activeSubMarketplace,
    ],
  );

  // Load filter configurations based on marketplace type
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        if (marketplaceType === "dtmi") {
          // Use static config for DTMI filters based on active sub-marketplace
          const filterOptions: FilterConfig[] =
            activeSubMarketplace === "written"
              ? config.writtenFilterCategories || config.filterCategories
              : config.multimediaFilterCategories || config.filterCategories;

          console.log("DTMI Filter Debug:", {
            activeSubMarketplace,
            hasWrittenFilters: !!config.writtenFilterCategories,
            hasMultimediaFilters: !!config.multimediaFilterCategories,
            writtenFiltersCount: config.writtenFilterCategories?.length,
            multimediaFiltersCount: config.multimediaFilterCategories?.length,
            legacyFiltersCount: config.filterCategories?.length,
            selectedFilters: filterOptions.length,
          });

          setFilterConfig(filterOptions);

          // Initialize empty filters based on the configuration
          const initialFilters: Record<string, string[]> = {};
          filterOptions.forEach((fc) => {
            initialFilters[fc.id] = [];
          });
          setFilters(initialFilters);
          return;
        }

        if (facetData?.facets?.items) {
          // Choose facet codes based on marketplace type
          let facetCodes: string[] = [];
          if (marketplaceType === "financial") {
            facetCodes = [
              "service-category",
              "business-stage",
              "provided-by",
              "pricing-model",
            ];
          } else if (marketplaceType === "non-financial") {
            facetCodes = [
              "sector-tag-2",
              "business-stage",
              "provided-by",
              "pricing-model",
            ];
          } else if (marketplaceType === "courses") {
            facetCodes = [
              "service-category",
              "business-stage",
              "provided-by",
              "pricing-model",
            ];
          } else {
            facetCodes = [
              "service-category",
              "business-stage",
              "provided-by",
              "pricing-model",
            ];
          }

          // Define the desired order for business-stage filter options
          const businessStageOrder = [
            "Ideation",
            "Launch",
            "Growth",
            "Expansion",
            "Optimisation",
            "Transformation",
          ];

          const filterOptions: FilterConfig[] = facetData.facets.items
            .filter((facet) => facet && facetCodes.includes(facet.code))
            .map((facet) => {
              if (!facet || !facet.values) return null;

              let options = facet.values
                .filter((value) => value && value.code && value.name)
                .map((value) => ({
                  id: value.code,
                  name: value.name,
                }));

              // Sort business-stage options according to the specified order
              if (facet.code === "business-stage") {
                options = options.sort((a, b) => {
                  const indexA = businessStageOrder.indexOf(a.name);
                  const indexB = businessStageOrder.indexOf(b.name);
                  // If both are in the order list, sort by the specified order
                  if (indexA !== -1 && indexB !== -1) {
                    return indexA - indexB;
                  }
                  // If only A is in the order list, prioritize A
                  if (indexA !== -1) return -1;
                  // If only B is in the order list, prioritize B
                  if (indexB !== -1) return 1;
                  // If neither is in the order list, sort alphabetically
                  return a.name.localeCompare(b.name);
                });
              }

              return {
                id: facet.code,
                title: facet.name,
                options,
              };
            })
            .filter((config): config is FilterConfig => config !== null);

          console.log("filterOptions:", filterOptions);
          setFilterConfig(filterOptions);

          // Initialize empty filters based on the configuration
          const initialFilters: Record<string, string[]> = {};
          filterOptions.forEach((config) => {
            initialFilters[config.id] = [];
          });
          setFilters(initialFilters);
        }
      } catch (err) {
        console.error("Error fetching filter options:", err);
        // Use fallback filter config from marketplace config
        setFilterConfig(config.filterCategories);
        // Initialize empty filters based on the configuration
        const initialFilters: Record<string, string[]> = {};
        config.filterCategories.forEach((config) => {
          initialFilters[config.id] = [];
        });
        setFilters(initialFilters);
      }
    };
    loadFilterOptions();
  }, [facetData, marketplaceType, config, activeSubMarketplace]);

  // Initialize filter categories - keep all collapsed initially except Category section
  // BUT preserve any URL parameter-driven expansions
  useEffect(() => {
    if (filterConfig.length > 0 && !hasUrlCollapsedState) {
      const initialCollapsed: Record<string, boolean> = {};
      filterConfig.forEach((category) => {
        // Collapse all sections except 'category' which should be expanded to show subcategories
        if (category.id === 'category') {
          initialCollapsed[category.id] = false; // Category section expanded
          
          // Iterate through category options and collapse all nested subcategories
          if (category.options) {
            category.options.forEach((option) => {
              if (option.children && option.children.length > 0) {
                // Collapse each subcategory (e.g., category-digital-perspectives)
                initialCollapsed[`${category.id}-${option.id}`] = true;
                
                // Also collapse any third-level nested items
                option.children.forEach((child) => {
                  if (child.children && child.children.length > 0) {
                    initialCollapsed[`${category.id}-${option.id}-${child.id}`] = true;
                  }
                });
              }
            });
          }
        } else {
          initialCollapsed[category.id] = true; // All other sections collapsed
        }
      });
      setCollapsedCategories(initialCollapsed);
    }
  }, [filterConfig, hasUrlCollapsedState]);

  // Fetch items based on marketplace type, filters, and search query
  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      setError(null);

      try {
        // Handle DTMI (lean view + keyset)
        if (marketplaceType === "dtmi") {
          // Wait until we compute a stable page size to avoid double-fetch 4 vs 12
          if (!khPageSize && typeof window !== "undefined") {
            return; // columns effect will set khPageSize, which retriggers this effect
          }
          await loadKHInitial();
          setLoading(false);
          return;
        }

        // Handle Courses
        if (marketplaceType === "courses" && courseData?.courses?.items) {
          const mappedItems = courseData.courses.items.map((course) => {
            const rawCost = (course as any)?.cost;
            const parsedCost =
              typeof rawCost === "number"
                ? rawCost
                : parseFloat(String(rawCost ?? ""));
            const normalizedCost =
              !isNaN(parsedCost) && parsedCost >= 1 ? parsedCost : 3200;

            const facetValues = [
              { code: "service-category", name: course.serviceCategory },
              { code: "business-stage", name: course.businessStage },
              { code: "provided-by", name: course.partner },
              { code: "pricing-model", name: course.pricingModel },
            ].filter((fv) => fv.name);

            return {
              id: course.id,
              title: course.name,
              slug: `courses/${course.id}`,
              description: course.description || "No description available",
              facetValues,
              provider: {
                name: course.partner || "Unknown Partner",
                logoUrl: course.logoUrl || "/default_logo.png",
                description: "No provider description available",
              },
              formUrl: null,
              Cost: normalizedCost,
              price: normalizedCost,
              BusinessStage: course.businessStage,
              rating: course.rating,
              reviewCount: course.reviewCount,
              duration: course.duration,
              pricingModel: course.pricingModel,
              serviceCategory: course.serviceCategory,
            };
          });

          // Apply filters + search
          const filtered = mappedItems.filter((item: any) => {
            const matchesAllFacets = Object.keys(filters).every((facetCode) => {
              const selectedValues = filters[facetCode] || [];
              if (!selectedValues.length) return true;
              return selectedValues.some(
                (selectedValue) =>
                  item.facetValues.some(
                    (facetValue: any) =>
                      facetValue.code === facetCode &&
                      facetValue.name === selectedValue,
                  ) ||
                  (facetCode === "pricing-model" &&
                    selectedValue === "one-time-fee" &&
                    item.Cost &&
                    item.Cost > 0) ||
                  (facetCode === "business-stage" &&
                    item.BusinessStage &&
                    selectedValue === item.BusinessStage),
              );
            });

            const matchesSearch =
              searchQuery.trim() === "" ||
              item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.facetValues.some((facetValue: any) =>
                facetValue.name
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()),
              );

            return matchesAllFacets && matchesSearch;
          });

          setItems(mappedItems);
          setFilteredItems(filtered);
          setLoading(false);
          return;
        }

        // Handle DQ Services (Non-Financial) - Use mock data
        // COMMENTED OUT - Now using Supabase data only
        // if (marketplaceType === "non-financial") {
        //   // Import and use mock service data
        //   const { mockServiceData } =
        //     await import("../../data/mockServiceData");

        //   // Filter by active tab first
        //   let tabFilteredServices = mockServiceData;
        //   if (activeSubMarketplace === "design-services") {
        //     tabFilteredServices = mockServiceData.filter(
        //       (service) => service.category === "Design Services",
        //     );
        //   } else if (activeSubMarketplace === "deploy-services-saas") {
        //     tabFilteredServices = mockServiceData.filter(
        //       (service) => service.category === "Deploy Services (SaaS)",
        //     );
        //   } else if (activeSubMarketplace === "deploy-services-onprem") {
        //     tabFilteredServices = mockServiceData.filter(
        //       (service) => service.category === "Deploy Services (On-Prem)",
        //     );
        //   }

        //   // Apply filters and search query
        //   const filtered = tabFilteredServices.filter((service: any) => {
        //     const matchesAllFacets = Object.keys(filters).every((facetCode) => {
        //       const selectedValues = filters[facetCode] || [];
        //       if (!selectedValues.length) return true;

        //       // Map filter codes to service properties
        //       if (facetCode === "serviceCategory") {
        //         return selectedValues.some(
        //           (value) =>
        //             service.serviceCategory
        //               .toLowerCase()
        //               .replace(/\s+/g, "-")
        //               .replace(/&/g, "") === value,
        //         );
        //       } else if (facetCode === "serviceAvailability") {
        //         return selectedValues.some(
        //           (value) =>
        //             service.serviceAvailability
        //               .toLowerCase()
        //               .replace(/\s+/g, "-") === value,
        //         );
        //       } else if (facetCode === "serviceReadiness") {
        //         return selectedValues.some(
        //           (value) =>
        //             service.serviceReadiness
        //               .toLowerCase()
        //               .replace(/\s+/g, "-") === value,
        //         );
        //       } else if (facetCode === "economicSector") {
        //         return selectedValues.some(
        //           (value) =>
        //             service.economicSector
        //               .toLowerCase()
        //               .replace(/\s+/g, "-") === value,
        //         );
        //       }
        //       return true;
        //     });

        //     const matchesSearch =
        //       searchQuery.trim() === "" ||
        //       service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        //       service.description
        //         .toLowerCase()
        //         .includes(searchQuery.toLowerCase()) ||
        //       service.tags.some((tag: string) =>
        //         tag.toLowerCase().includes(searchQuery.toLowerCase()),
        //       );

        //     return matchesAllFacets && matchesSearch;
        //   });

        //   setItems(tabFilteredServices);
        //   setFilteredItems(filtered);
        //   setLoading(false);
        //   return;
        // }

        // Handle Products (Financial)
        if (productData?.products?.items) {
          let filteredServices = productData.products.items;

          if (marketplaceType === "financial") {
            filteredServices = productData.products.items.filter(
              (product) =>
                product?.facetValues?.some((fv) => fv?.id === "66") &&
                !product?.facetValues?.some((fv) => fv?.id === "67"),
            );
          }

          const fallbackLogos = ["/mzn_logo.png"];

          // Map product data to match expected MarketplaceItem structure
          const mappedItems = filteredServices
            .filter((product) => product)
            .map((product) => {
              const randomFallbackLogo =
                fallbackLogos[Math.floor(Math.random() * fallbackLogos.length)];

              const rawFormUrl = product.customFields?.formUrl;
              const finalFormUrl =
                rawFormUrl || "https://www.tamm.abudhabi/en/login";

              if (product.id === "133" || !rawFormUrl) {
                console.log(
                  `Product "${product.name}" (ID: ${product.id}): Raw formUrl =`,
                  rawFormUrl,
                  "| Final =",
                  finalFormUrl,
                );
              }

              return {
                id: product.id,
                title: product.name,
                slug: product.slug,
                description:
                  product.description ||
                  "Through this service, you can easily reallocate your approved loan funds to different areas of your business to support changing needs and enhance growth.",
                facetValues: product.facetValues,
                tags: [
                  product.customFields.BusinessStage,
                  product.customFields.BusinessStage,
                ].filter(Boolean),
                provider: {
                  name:
                    product.customFields?.Partner ||
                    product.customFields?.Industry ||
                    "Khalifa Fund",
                  logoUrl:
                    product.customFields?.logoUrl ||
                    product.customFields?.Logo?.source ||
                    randomFallbackLogo,
                  description: "No provider description available",
                },
                formUrl: finalFormUrl,
                ...product.customFields,
              };
            });

          // Apply filters and search query
          const filtered = mappedItems.filter((product: any) => {
            const matchesAllFacets = Object.keys(filters).every((facetCode) => {
              const selectedValues = filters[facetCode] || [];
              if (!selectedValues.length) return true;
              return selectedValues.some(
                (selectedValue) =>
                  product.facetValues.some(
                    (facetValue: any) => facetValue.code === selectedValue,
                  ) ||
                  (facetCode === "pricing-model" &&
                    selectedValue === "one-time-fee" &&
                    product.Cost &&
                    product.Cost > 0) ||
                  (facetCode === "business-stage" &&
                    product.BusinessStage &&
                    selectedValue === product.BusinessStage),
              );
            });

            const matchesSearch =
              searchQuery.trim() === "" ||
              product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.facetValues.some((facetValue: any) =>
                facetValue.name
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()),
              );

            return matchesAllFacets && matchesSearch;
          });

          // Prioritize ID 133
          const prioritized = filtered.sort((a, b) => {
            if (a.id === "133") return -1;
            if (b.id === "133") return 1;
            return 0;
          });

          console.log("filters:", filters);
          console.log("filteredItems:", prioritized);

          setItems(mappedItems);
          setFilteredItems(prioritized);
          setLoading(false);
        }
      } catch (err) {
        console.error(`Error processing ${marketplaceType} items:`, err);
        setError(`Failed to load ${marketplaceType}`);
        setItems([]);
        setFilteredItems([]);
        setLoading(false);
      }
    };

    loadItems();
  }, [
    productData,
    courseData,
    filters,
    debouncedSearch,
    marketplaceType,
    activeFilters,
    filterConfig,
    loadKHInitial,
    activeSubMarketplace,
  ]);

  // Immediately hydrate compare from navigation state when arriving from details page
  useEffect(() => {
    const pending = location?.state?.addToCompare;
    if (pending) {
      // Add if not present and under cap
      if (
        !compareItems.some((c) => c.id === pending.id) &&
        compareItems.length < 3
      ) {
        setCompareItems((prev) => [...prev, pending]);
        storageAddCompareId(marketplaceType, pending.id);
      }
      // Clear the navigation state to avoid duplicate adds on back/refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.state, location?.pathname, marketplaceType, compareItems]);

  // Hydrate compareItems from localStorage when items are available (merge, don't clear)
  useEffect(() => {
    if (!items || items.length === 0) return; // wait until items are loaded
    // Build a map for quick lookup
    const byId: Record<string, any> = {};
    items.forEach((it) => {
      byId[it.id] = it;
    });
    const storedIds = getStoredCompareIds(marketplaceType);
    if (!storedIds.length) return; // nothing stored; don't alter current state

    // Start with current selections
    const merged: ComparisonItem[] = [...compareItems];
    for (const id of storedIds) {
      if (merged.length >= 3) break;
      if (!merged.some((c) => c.id === id)) {
        const found = byId[id];
        if (found) merged.push(found);
      }
    }
    const currentIds = compareItems.map((i) => i.id).join(",");
    const nextIds = merged.map((i) => i.id).join(",");
    if (currentIds !== nextIds) {
      setCompareItems(merged.slice(0, 3));
    }
    setHasHydratedCompare(true);
  }, [items, marketplaceType, compareItems]);

  // Keep storage in sync with current compareItems
  useEffect(() => {
    // Don't sync to storage until we've attempted hydration to avoid wiping existing selections
    if (!hasHydratedCompare) return;
    const ids = compareItems.map((i) => i.id);
    setStoredCompareIds(marketplaceType, ids);
  }, [compareItems, marketplaceType, hasHydratedCompare]);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (filterType: string, value: string) => {
      setFilters((prev) => {
        const currentValues = prev[filterType] || [];
        const newValues = currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value];
        return {
          ...prev,
          [filterType]: newValues,
        };
      });
    },
    [],
  );

  // Reset all filters
  const resetFilters = useCallback(() => {
    const emptyFilters: Record<string, string[]> = {};
    filterConfig.forEach((config) => {
      emptyFilters[config.id] = [];
    });
    setFilters(emptyFilters);
    setSearchQuery("");
    setActiveFilters([]);
  }, [filterConfig]);

  // Toggle sidebar visibility (only on mobile)
  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  // Clear all comparison selections
  const handleClearComparison = useCallback(() => {
    setCompareItems([]);
    storageClearCompare(marketplaceType);
    setShowComparison(false);
  }, [marketplaceType]);

  // Toggle bookmark for an item
  const toggleBookmark = useCallback((itemId: string) => {
    setBookmarkedItems((prev) => {
      return prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId];
    });
  }, []);

  // Add an item to comparison
  const handleAddToComparison = useCallback(
    (item: any) => {
      if (
        compareItems.length < 3 &&
        !compareItems.some((c) => c.id === item.id)
      ) {
        setCompareItems((prev) => [...prev, item]);
        storageAddCompareId(marketplaceType, item.id);
      }
    },
    [compareItems, marketplaceType],
  );

  // Remove an item from comparison
  const handleRemoveFromComparison = useCallback(
    (itemId: string) => {
      setCompareItems((prev) => prev.filter((item) => item.id !== itemId));
      storageRemoveCompareId(marketplaceType, itemId);
    },
    [marketplaceType],
  );

  // Retry loading items after an error
  const retryFetch = useCallback(() => {
    setError(null);
    setLoading(true);
  }, []);

  // Handle Knowledge Hub specific filter changes
  const handleKnowledgeHubFilterChange = useCallback((filter: string) => {
    setActiveFilters((prev) => {
      const newFilters = prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter];
      return newFilters;
    });
  }, []);

  // Toggle collapse state for a filter category
  const toggleCategoryCollapse = useCallback((categoryId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  }, []);

  // Apply client-side filtering for all DTMI filters (marketplace database fields)
  useEffect(() => {
    if (marketplaceType !== "dtmi") return;

    console.log("🔍 [DTMI Filter] Running filter effect:", {
      itemsCount: items.length,
      filters: filters,
      hasFilters: Object.keys(filters).some((key) => filters[key]?.length > 0),
    });

    // If no filters are applied at all, just use all items
    const hasAnyFilters = Object.keys(filters).some(
      (key) => filters[key]?.length > 0,
    );
    if (!hasAnyFilters) {
      console.log(
        "✅ [DTMI Filter] No filters applied, showing all items:",
        items.length,
      );
      setFilteredItems(items);
      return;
    }

    let filtered = [...items];

    // MAPPING FUNCTIONS: Convert filter IDs to database values
    // These map the UI filter IDs to the actual values stored in Supabase

    // Map digital perspective filter IDs to database values
    const perspectiveMapping: Record<string, string> = {
      "d1-e40": "D1",
      "d2-dco": "D2",
      "d3-dbp": "D3",
      "d4-dt20": "D4",
      "d5-worker": "D5",
      "d6-accelerators": "D6",
    };

    // Map digital stream/domain filter IDs to database values
    const streamMapping: Record<string, string> = {
      frontend: "Digital Front-End",
      core: "Digital Core",
      enablers: "Digital Enablers",
    };

    const domainMapping: Record<string, string> = {
      channels: "Digital Channels",
      experience: "Digital Experience",
      services: "Digital Services",
      marketing: "Digital Marketing",
      workspace: "Digital Workspace",
      "core-systems": "Digital Core",
      gprc: "Digital GPRC",
      backoffice: "Digital Back-Office",
      interops: "Digital InterOps",
      security: "Digital Security",
      intelligence: "Digital Intelligence",
      it: "Digital IT",
    };

    // Map digital sector filter IDs to database values
    const sectorMapping: Record<string, string> = {
      experience40: "Cross-Sector Domain (Experience 4.0)",
      agility40: "Cross-Sector Domain (Agility 4.0)",
      farming40: "Primary Sector (Farming 4.0)",
      plant40: "Secondary Sector (Plant 4.0)",
      infrastructure40: "Secondary Sector (Infrastructure 4.0)",
      government40: "Tertiary Sector (Government 4.0)",
      hospitality40: "Tertiary Sector (Hospitality 4.0)",
      retail40: "Tertiary Sector (Retail 4.0)",
      service40: "Quaternary Sector (Service4.0)",
      logistics40: "Quaternary Sector (Logistics4.0)",
      wellness40: "Quinary Sector (Wellness4.0)",
    };

    // Map content type filter IDs to database values
    const contentTypeMapping: Record<string, string> = {
      article: "Articles",
      blog: "Blogs",
      whitepaper: "Whitepapers",
      report: "Research Reports",
      casestudy: "Case Studies",
      interview: "Expert Interviews",
      prediction: "Prediction Analysis",
      video: "Videos",
      podcast: "Podcasts",
    };

    // Map format filter IDs to database values
    const formatMapping: Record<string, string> = {
      quickreads: "Quick Reads",
      indepth: "In-Depth Reports",
      interactive: "Interactive Tools",
      templates: "Downloadable Templates",
      recorded: "Recorded Media",
      live: "Live Events",
    };

    // Map popularity filter IDs to database values
    const popularityMapping: Record<string, string> = {
      latest: "Latest",
      trending: "Trending",
      downloaded: "Most Downloaded",
      editors: "Editor's Pick",
    };

    // Apply Content Type filter (from content_type database field)
    if (filters.contentType && filters.contentType.length > 0) {
      filtered = filtered.filter((item) => {
        const itemContentType = item.content_type || "";
        const selectedTypes = filters.contentType.map(
          (id) => contentTypeMapping[id] || id,
        );
        return selectedTypes.includes(itemContentType);
      });
      console.log(
        `🔍 [DTMI Filter] After contentType filter: ${filtered.length} items`,
      );
    }

    // Apply Digital Perspective filter (from digital_perspective database field)
    if (filters.category && filters.category.length > 0) {
      const perspectiveFilters = filters.category.filter(
        (id) => id in perspectiveMapping,
      );
      const streamFilters = filters.category.filter(
        (id) => id in streamMapping,
      );
      const domainFilters = filters.category.filter(
        (id) => id in domainMapping,
      );
      const sectorFilters = filters.category.filter(
        (id) => id in sectorMapping,
      );

      if (perspectiveFilters.length > 0) {
        filtered = filtered.filter((item) => {
          const itemPerspective = item.digital_perspective || "";
          const selectedPerspectives = perspectiveFilters.map(
            (id) => perspectiveMapping[id],
          );
          return selectedPerspectives.includes(itemPerspective);
        });
        console.log(
          `🔍 [DTMI Filter] After perspective filter: ${filtered.length} items`,
        );
      }

      if (streamFilters.length > 0) {
        filtered = filtered.filter((item) => {
          const itemStream = item.digital_stream || "";
          const selectedStreams = streamFilters.map((id) => streamMapping[id]);
          return selectedStreams.includes(itemStream);
        });
        console.log(
          `🔍 [DTMI Filter] After stream filter: ${filtered.length} items`,
        );
      }

      if (domainFilters.length > 0) {
        filtered = filtered.filter((item) => {
          const itemDomain = item.digital_domain || "";
          const selectedDomains = domainFilters.map((id) => domainMapping[id]);
          return selectedDomains.includes(itemDomain);
        });
        console.log(
          `🔍 [DTMI Filter] After domain filter: ${filtered.length} items`,
        );
      }

      if (sectorFilters.length > 0) {
        filtered = filtered.filter((item) => {
          const itemSector = item.digital_sector || "";
          const selectedSectors = sectorFilters.map((id) => sectorMapping[id]);
          return selectedSectors.includes(itemSector);
        });
        console.log(
          `🔍 [DTMI Filter] After sector filter: ${filtered.length} items`,
        );
      }
    }

    // Apply Format filter (from format database field)
    if (filters.format && filters.format.length > 0) {
      filtered = filtered.filter((item) => {
        const itemFormat = item.format || "";
        const selectedFormats = filters.format.map(
          (id) => formatMapping[id] || id,
        );
        return selectedFormats.includes(itemFormat);
      });
      console.log(
        `🔍 [DTMI Filter] After format filter: ${filtered.length} items`,
      );
    }

    // Apply Popularity filter (from popularity database field)
    if (filters.popularity && filters.popularity.length > 0) {
      filtered = filtered.filter((item) => {
        const itemPopularity = item.popularity || "";
        const selectedPopularities = filters.popularity.map(
          (id) => popularityMapping[id] || id,
        );
        return selectedPopularities.includes(itemPopularity);
      });
      console.log(
        `🔍 [DTMI Filter] After popularity filter: ${filtered.length} items`,
      );
    }

    console.log(`✅ [DTMI Filter] Final filtered items: ${filtered.length}`);
    setFilteredItems(filtered);
  }, [marketplaceType, items, filters]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Breadcrumbs */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 inline-flex items-center"
              >
                <HomeIcon size={16} className="mr-1" />
                <span>Home</span>
              </Link>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2">
                  {config.itemNamePlural}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-800">{config.title}</h1>
        </div>
        <p className="text-gray-600 mb-6">{config.description}</p>

        {/* Current Focus section for DTMI and Services */}
        {(marketplaceType === "dtmi" ||
          marketplaceType === "non-financial") && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Current Focus
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {marketplaceType === "dtmi"
                    ? activeSubMarketplace === "written"
                      ? "Written Content"
                      : "Multimedia Content"
                    : activeSubMarketplace === "design-services"
                      ? "Design Services"
                      : activeSubMarketplace === "deploy-services-saas"
                        ? "Deploy Services (SaaS)"
                        : "Deploy Services (On-Prem)"}
                </h2>
                <p className="text-gray-600">
                  {marketplaceType === "dtmi"
                    ? activeSubMarketplace === "written"
                      ? "Explore insightful written content designed to inform, educate, and inspire."
                      : "Discover expert discussions, deep dives, and case studies in a more dynamic format that you can watch or listen to on the go."
                    : activeSubMarketplace === "design-services"
                      ? "Strategic design and architecture services to envision and blueprint your digital transformation."
                      : activeSubMarketplace === "deploy-services-saas"
                        ? "Cloud-based deployment services for scalable and flexible digital solutions."
                        : "On-premise deployment services for secure and controlled digital infrastructure."}
                </p>
              </div>
              <span className="ml-4 px-6 py-1 text-sm font-medium text-white bg-primary rounded-full whitespace-nowrap">
                Tab overview
              </span>
            </div>
          </div>
        )}

        {/* Sub-marketplace tabs for DTMI and Services */}
        {(marketplaceType === "dtmi" ||
          marketplaceType === "non-financial") && (
          <SubMarketplaceTabs
            tabs={subMarketplaceTabs}
            activeTab={activeSubMarketplace}
            onTabChange={handleSubMarketplaceChange}
          />
        )}

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="w-full">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </div>

        {/* Comparison bar */}
        {compareItems.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-blue-800">
                {config.itemName} Comparison ({compareItems.length}/3)
              </h3>
              <div>
                <button
                  onClick={() => setShowComparison(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium mr-4"
                >
                  Compare Selected
                </button>
                <button
                  onClick={handleClearComparison}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Clear All
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {compareItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-full px-3 py-1 flex items-center gap-2 text-sm border border-gray-200"
                >
                  <span className="truncate max-w-[150px]">{item.title}</span>
                  <button
                    onClick={() => handleRemoveFromComparison(item.id)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label={`Remove ${item.title} from comparison`}
                  >
                    <XIcon size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Mobile filter toggle */}
          <div
            className="xl:hidden sticky z-20 bg-gray-50 py-2 shadow-sm"
            style={{ top: "46px" }}
          >
            <div className="flex justify-between items-center">
              <button
                onClick={toggleFilters}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-gray-700 w-full justify-center"
                aria-expanded={showFilters}
                aria-controls="filter-sidebar"
              >
                <FilterIcon size={18} />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
              {(Object.values(filters).some((f) => f.length > 0) ||
                activeFilters.length > 0) && (
                <button
                  onClick={resetFilters}
                  className="ml-2 text-blue-600 text-sm font-medium whitespace-nowrap px-3 py-2"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Filter sidebar - mobile/tablet */}
          <div
            className={`fixed inset-x-0 bg-gray-800 bg-opacity-75 z-30 transition-opacity duration-300 xl:hidden ${
              showFilters ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={toggleFilters}
            aria-hidden={!showFilters}
            style={{ top: headerHeight, bottom: 0 }}
          >
            <div
              id="filter-sidebar"
              className={`fixed left-0 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
                showFilters ? "translate-x-0" : "-translate-x-full"
              }`}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              style={{ top: headerHeight, bottom: 0 }}
            >
              <div className="h-full overflow-y-auto">
                <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={toggleFilters}
                    className="p-1 rounded-full hover:bg-gray-100"
                    aria-label="Close filters"
                  >
                    <XIcon size={20} />
                  </button>
                </div>
                <div className="p-4">
                  {marketplaceType === "dtmi" ? (
                    <div className="space-y-4">
                      {filterConfig.map((category) => (
                        <div
                          key={category.id}
                          className="border-b border-gray-100 pb-3"
                        >
                          <h3 className="font-medium text-gray-900 mb-2">
                            {category.title}
                          </h3>
                          <div className="space-y-2">
                            {category.options.map((option) => (
                              <div key={option.id}>
                                {/* Check if this option has children (nested) */}
                                {option.children &&
                                option.children.length > 0 ? (
                                  <div className="mb-2">
                                    <button
                                      onClick={() =>
                                        toggleCategoryCollapse(
                                          `mobile-${category.id}-${option.id}`,
                                        )
                                      }
                                      className="w-full flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded text-left"
                                    >
                                      <span
                                        className="text-sm font-bold"
                                        style={{ color: "#72768f" }}
                                      >
                                        {option.name}
                                      </span>
                                      {collapsedCategories[
                                        `mobile-${category.id}-${option.id}`
                                      ] ? (
                                        <ChevronDownIcon
                                          size={16}
                                          className="text-gray-400"
                                        />
                                      ) : (
                                        <ChevronUpIcon
                                          size={16}
                                          className="text-gray-400"
                                        />
                                      )}
                                    </button>
                                    {!collapsedCategories[
                                      `mobile-${category.id}-${option.id}`
                                    ] && (
                                      <div className="ml-4 mt-1 space-y-1">
                                        {option.children.map((child) => (
                                          <div key={child.id}>
                                            {/* Check if child has sub-children (3rd level) */}
                                            {child.children &&
                                            child.children.length > 0 ? (
                                              <div className="mb-1">
                                                <button
                                                  onClick={() =>
                                                    toggleCategoryCollapse(
                                                      `mobile-${category.id}-${option.id}-${child.id}`,
                                                    )
                                                  }
                                                  className="w-full flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded text-left"
                                                >
                                                  <span className="text-xs text-gray-700">
                                                    {child.name}
                                                  </span>
                                                  {collapsedCategories[
                                                    `mobile-${category.id}-${option.id}-${child.id}`
                                                  ] ? (
                                                    <ChevronDownIcon
                                                      size={14}
                                                      className="text-gray-400"
                                                    />
                                                  ) : (
                                                    <ChevronUpIcon
                                                      size={14}
                                                      className="text-gray-400"
                                                    />
                                                  )}
                                                </button>
                                                {!collapsedCategories[
                                                  `mobile-${category.id}-${option.id}-${child.id}`
                                                ] && (
                                                  <div className="ml-4 mt-1 space-y-1">
                                                    {child.children.map(
                                                      (subChild) => (
                                                        <div
                                                          key={subChild.id}
                                                          className="flex items-center"
                                                        >
                                                          <input
                                                            type="checkbox"
                                                            id={`mobile-${category.id}-${option.id}-${child.id}-${subChild.id}`}
                                                            checked={activeFilters.includes(
                                                              subChild.name,
                                                            )}
                                                            onChange={() =>
                                                              handleKnowledgeHubFilterChange(
                                                                subChild.name,
                                                              )
                                                            }
                                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                          />
                                                          <label
                                                            htmlFor={`mobile-${category.id}-${option.id}-${child.id}-${subChild.id}`}
                                                            className="ml-2 text-xs text-gray-600 cursor-pointer"
                                                          >
                                                            {subChild.name}
                                                          </label>
                                                        </div>
                                                      ),
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            ) : (
                                              <div className="flex items-center">
                                                <input
                                                  type="checkbox"
                                                  id={`mobile-${category.id}-${option.id}-${child.id}`}
                                                  checked={activeFilters.includes(
                                                    child.name,
                                                  )}
                                                  onChange={() =>
                                                    handleKnowledgeHubFilterChange(
                                                      child.name,
                                                    )
                                                  }
                                                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label
                                                  htmlFor={`mobile-${category.id}-${option.id}-${child.id}`}
                                                  className="ml-2 text-xs text-gray-600 cursor-pointer"
                                                >
                                                  {child.name}
                                                </label>
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      id={`mobile-${category.id}-${option.id}`}
                                      checked={activeFilters.includes(
                                        option.name,
                                      )}
                                      onChange={() =>
                                        handleKnowledgeHubFilterChange(
                                          option.name,
                                        )
                                      }
                                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label
                                      htmlFor={`mobile-${category.id}-${option.id}`}
                                      className="ml-2 text-xs text-gray-700"
                                    >
                                      {option.name}
                                    </label>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <FilterSidebar
                      filters={filters}
                      filterConfig={filterConfig}
                      onFilterChange={handleFilterChange}
                      onResetFilters={resetFilters}
                      isResponsive={true}
                      openSections={collapsedCategories}
                      onToggleSection={toggleCategoryCollapse}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Filter sidebar - desktop - always visible */}
          <div className="hidden xl:block xl:w-1/4">
            <div className="bg-white rounded-lg shadow sticky top-24 max-h-[calc(100vh-7rem)] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0 bg-white z-10">
                <h2 className="text-lg font-semibold">Filters</h2>
                {(Object.values(filters).some((f) => f.length > 0) ||
                  activeFilters.length > 0) && (
                  <button
                    onClick={resetFilters}
                    className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                  >
                    Reset All
                  </button>
                )}
              </div>
              <div className="p-4 overflow-y-auto flex-1 custom-scrollbar relative" style={{ maxHeight: 'calc(100vh - 12rem)' }} onScroll={handleFilterScroll}>
                {marketplaceType === "dtmi" ? (
                  <div className="space-y-2">
                    {filterConfig.map((category) => {
                      const isCollapsed = collapsedCategories[category.id];
                      const hasActiveFilters = category.options.some((opt) =>
                        activeFilters.includes(opt.name),
                      );
                      const filteredOptions = getFilteredOptions(category.options, category.id);
                      
                      return (
                        <div
                          key={category.id}
                          className="border-b border-gray-100 pb-2"
                          data-filter-section={category.id}
                        >
                          {category.id === 'category' ? (
                            // Category section - always expanded, no toggle button
                            <div className="filter-category-sticky">
                              <div className="w-full flex items-center justify-between py-2">
                                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                                  {category.title}
                                  {hasActiveFilters && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                      {
                                        category.options.filter((opt) =>
                                          activeFilters.includes(opt.name),
                                        ).length
                                      }
                                    </span>
                                  )}
                                </h3>
                              </div>
                              {/* Search box for Category filter */}
                              {category.options.length > 5 && (
                                <div className="mb-2">
                                  <input
                                    type="text"
                                    placeholder="Search categories..."
                                    value={filterSearchQueries[category.id] || ''}
                                    onChange={(e) => handleFilterSearchChange(category.id, e.target.value)}
                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            // Other sections - collapsible with toggle button
                            <div className="filter-category-sticky">
                              <button
                                onClick={() => toggleCategoryCollapse(category.id)}
                                className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded transition-colors"
                                aria-expanded={!isCollapsed}
                              >
                                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                                  {category.title}
                                  {hasActiveFilters && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                      {
                                        category.options.filter((opt) =>
                                          activeFilters.includes(opt.name),
                                        ).length
                                      }
                                    </span>
                                  )}
                                </h3>
                                {isCollapsed ? (
                                  <ChevronDownIcon
                                    size={18}
                                    className="text-gray-500"
                                  />
                                ) : (
                                  <ChevronUpIcon
                                    size={18}
                                    className="text-gray-500"
                                  />
                                )}
                              </button>
                              {/* Search box for expanded filter categories */}
                              {!isCollapsed && category.options.length > 5 && (
                                <div className="mb-2">
                                  <input
                                    type="text"
                                    placeholder={`Search ${category.title.toLowerCase()}...`}
                                    value={filterSearchQueries[category.id] || ''}
                                    onChange={(e) => handleFilterSearchChange(category.id, e.target.value)}
                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                          {!isCollapsed && (
                            <div className={`space-y-2 mt-2 ml-1 transition-all duration-300 ease-in-out ${isCollapsed ? 'filter-expand-exit-active' : 'filter-expand-enter-active'}`}>
                              {filteredOptions.length === 0 ? (
                                <div className="text-sm text-gray-500 py-2">No matching options</div>
                              ) : (
                                filteredOptions.map((option) => (
                                <div key={option.id}>
                                  {/* Check if this option has children (nested) */}
                                  {option.children &&
                                  option.children.length > 0 ? (
                                    <div className="mb-2" data-filter-subsection={`${category.id}-${option.id}`}>
                                      <button
                                        onClick={() =>
                                          toggleCategoryCollapse(
                                            `${category.id}-${option.id}`,
                                          )
                                        }
                                        className="w-full flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded text-left"
                                      >
                                        <span
                                          className="text-sm font-bold"
                                          style={{ color: "#72768f" }}
                                        >
                                          {option.name}
                                        </span>
                                        {collapsedCategories[
                                          `${category.id}-${option.id}`
                                        ] ? (
                                          <ChevronDownIcon
                                            size={16}
                                            className="text-gray-400"
                                          />
                                        ) : (
                                          <ChevronUpIcon
                                            size={16}
                                            className="text-gray-400"
                                          />
                                        )}
                                      </button>
                                      {!collapsedCategories[
                                        `${category.id}-${option.id}`
                                      ] && (
                                        <div className="ml-4 mt-1 space-y-1">
                                          {option.children.map((child) => (
                                            <div key={child.id}>
                                              {/* Check if child has sub-children (3rd level) */}
                                              {child.children &&
                                              child.children.length > 0 ? (
                                                <div className="mb-1">
                                                  <button
                                                    onClick={() =>
                                                      toggleCategoryCollapse(
                                                        `${category.id}-${option.id}-${child.id}`,
                                                      )
                                                    }
                                                    className="w-full flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded text-left"
                                                  >
                                                    <span className="text-sm text-gray-700">
                                                      {child.name}
                                                    </span>
                                                    {collapsedCategories[
                                                      `${category.id}-${option.id}-${child.id}`
                                                    ] ? (
                                                      <ChevronDownIcon
                                                        size={14}
                                                        className="text-gray-400"
                                                      />
                                                    ) : (
                                                      <ChevronUpIcon
                                                        size={14}
                                                        className="text-gray-400"
                                                      />
                                                    )}
                                                  </button>
                                                  {!collapsedCategories[
                                                    `${category.id}-${option.id}-${child.id}`
                                                  ] && (
                                                    <div className="ml-4 mt-1 space-y-1">
                                                      {child.children.map(
                                                        (subChild) => (
                                                          <div
                                                            key={subChild.id}
                                                            className="flex items-center"
                                                          >
                                                            <input
                                                              type="checkbox"
                                                              id={`desktop-${category.id}-${option.id}-${child.id}-${subChild.id}`}
                                                              checked={activeFilters.includes(
                                                                subChild.name,
                                                              )}
                                                              onChange={() =>
                                                                handleKnowledgeHubFilterChange(
                                                                  subChild.name,
                                                                )
                                                              }
                                                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <label
                                                              htmlFor={`desktop-${category.id}-${option.id}-${child.id}-${subChild.id}`}
                                                              className="ml-2 text-xs text-gray-600 cursor-pointer"
                                                            >
                                                              {subChild.name}
                                                            </label>
                                                          </div>
                                                        ),
                                                      )}
                                                    </div>
                                                  )}
                                                </div>
                                              ) : (
                                                <div className="flex items-center">
                                                  <input
                                                    type="checkbox"
                                                    id={`desktop-${category.id}-${option.id}-${child.id}`}
                                                    checked={activeFilters.includes(
                                                      child.name,
                                                    )}
                                                    onChange={() =>
                                                      handleKnowledgeHubFilterChange(
                                                        child.name,
                                                      )
                                                    }
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                  />
                                                  <label
                                                    htmlFor={`desktop-${category.id}-${option.id}-${child.id}`}
                                                    className="ml-2 text-sm text-gray-600 cursor-pointer"
                                                  >
                                                    {child.name}
                                                  </label>
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="flex items-center">
                                      <input
                                        type="checkbox"
                                        id={`desktop-${category.id}-${option.id}`}
                                        checked={activeFilters.includes(
                                          option.name,
                                        )}
                                        onChange={() =>
                                          handleKnowledgeHubFilterChange(
                                            option.name,
                                          )
                                        }
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                      />
                                      <label
                                        htmlFor={`desktop-${category.id}-${option.id}`}
                                        className="ml-2 text-sm text-gray-700 cursor-pointer"
                                      >
                                        {option.name}
                                      </label>
                                    </div>
                                  )}
                                </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <FilterSidebar
                    filters={filters}
                    filterConfig={filterConfig}
                    onFilterChange={handleFilterChange}
                    onResetFilters={resetFilters}
                    isResponsive={false}
                    openSections={collapsedCategories}
                    onToggleSection={toggleCategoryCollapse}
                  />
                )}
              </div>
              {/* Scroll indicator */}
              {showScrollIndicator && (
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none flex items-end justify-center pb-2">
                  <ChevronDownIcon size={20} className="text-gray-400 animate-bounce" />
                </div>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="xl:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {[...Array(6)].map((_, idx) => (
                  <CourseCardSkeleton key={idx} />
                ))}
              </div>
            ) : error && !items.length ? (
              // Only show error if we have no items and there's an error
              <ErrorDisplay
                message={
                  error ||
                  (!skipGraph &&
                    (facetError?.message || productError?.message)) ||
                  courseError?.message ||
                  `Failed to load ${marketplaceType}`
                }
                onRetry={retryFetch}
              />
            ) : filteredItems.length === 0 ? (
              <div className="text-center text-gray-600 py-8">
                No content available
              </div>
            ) : (
              <div ref={gridContainerRef}>
                <MarketplaceGrid
                  items={paginatedItems}
                  marketplaceType={marketplaceType}
                  bookmarkedItems={bookmarkedItems}
                  onToggleBookmark={toggleBookmark}
                  onAddToComparison={handleAddToComparison}
                  promoCards={promoCards}
                  totalCount={
                    marketplaceType === "dtmi" ? khTotalCount : undefined
                  }
                  showingCount={
                    marketplaceType === "dtmi"
                      ? paginatedItems.length
                      : undefined
                  }
                />
                {marketplaceType === "dtmi" && (
                  <div className="flex items-center justify-center gap-3 mt-8">
                    <button
                      onClick={() => goToKHPage(currentPage - 1)}
                      disabled={currentPage <= 1 || khFetching}
                      className={`px-3 py-2 rounded-md border ${currentPage <= 1 || khFetching ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-gray-700 bg-white hover:bg-gray-50"}`}
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage}
                    </span>
                    <button
                      onClick={() => goToKHPage(currentPage + 1)}
                      disabled={
                        (!khHasMore && currentPage >= (khPages?.length || 1)) ||
                        khFetching
                      }
                      className={`px-3 py-2 rounded-md border ${(!khHasMore && currentPage >= (khPages?.length || 1)) || khFetching ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-gray-700 bg-white hover:bg-gray-50"}`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Comparison modal */}
        {showComparison && (
          <MarketplaceComparison
            items={compareItems}
            onClose={() => setShowComparison(false)}
            onRemoveItem={handleRemoveFromComparison}
            marketplaceType={marketplaceType}
          />
        )}
      </div>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default MarketplacePage;
