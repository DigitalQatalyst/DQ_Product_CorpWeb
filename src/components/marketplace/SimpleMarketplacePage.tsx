import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { FilterSidebar, FilterConfig } from "./FilterSidebar";
import { MarketplaceGrid } from "./MarketplaceGrid";
import { SearchBar } from "../SearchBar";
import { SubMarketplaceTabs, SubMarketplaceTab } from "./SubMarketplaceTabs";
import { FilterIcon, XIcon, HomeIcon, ChevronRightIcon } from "lucide-react";
import { getMarketplaceConfig } from "../../utils/marketplaceConfig";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { mockServiceData } from "@/data/mockServiceData";
// import { mockServiceData } from "../../data/mockServiceData"; // COMMENTED OUT - Now using Supabase data only

export interface SimpleMarketplacePageProps {
  marketplaceType: "non-financial";
  title: string;
  description: string;
}

export const SimpleMarketplacePage: React.FC<SimpleMarketplacePageProps> = ({
  marketplaceType,
}) => {
  // Get marketplace configuration
  const config = getMarketplaceConfig(marketplaceType);
  
  // State for items and filtering
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  
  // Filter sidebar visibility
  const [showFilters, setShowFilters] = useState(false);
  
  // Sub-marketplace tabs for service categories
  const [activeSubMarketplace, setActiveSubMarketplace] = useState<string>('design-services');
  
  const subMarketplaceTabs: SubMarketplaceTab[] = [
    { id: 'design-services', label: 'Design Services', description: 'Strategic design and architecture services' },
    { id: 'deploy-services-saas', label: 'Deploy Services (SaaS)', description: 'Cloud-based deployment services' },
    { id: 'deploy-services-onprem', label: 'Deploy Services (On-Prem)', description: 'On-premise deployment services' },
  ];
  
  // Filter configuration - matching the exact names from the screenshots
  const filterConfig: FilterConfig[] = [
    {
      id: 'serviceCategory',
      title: 'Service Category',
      options: [
        { id: 'digital-experience', name: 'Digital Experience' },
        { id: 'digital-core-dws', name: 'Digital Core / DWS' },
        { id: 'connected-intelligence', name: 'Connected Intelligence' }
      ]
    },
    {
      id: 'serviceAvailability',
      title: 'Service Availability',
      options: [
        { id: 'available', name: 'Available' },
        { id: 'coming-soon', name: 'Coming Soon' }
      ]
    },
    {
      id: 'serviceReadiness',
      title: 'Service Readiness',
      options: [
        { id: 'ready-to-order', name: 'Ready to Order' },
        { id: 'has-dependency', name: 'Has Dependency' }
      ]
    }
    // Economic Sector filter disabled as per requirement
    // {
    //   id: 'economicSector',
    //   title: 'Economic Sector',
    //   options: [
    //     { id: 'agility-40', name: 'Agility 4.0' },
    //     { id: 'experience-40', name: 'Experience 4.0' },
    //     { id: 'farming-40', name: 'Farming 4.0' },
    //     { id: 'government-40', name: 'Government 4.0' },
    //     { id: 'hospitality-40', name: 'Hospitality 4.0' },
    //     { id: 'infrastructure-40', name: 'Infrastructure 4.0' },
    //     { id: 'logistics-40', name: 'Logistics 4.0' },
    //     { id: 'plant-40', name: 'Plant 4.0' },
    //     { id: 'retail-40', name: 'Retail 4.0' },
    //     { id: 'service-40', name: 'Service 4.0' },
    //     { id: 'wellness-40', name: 'Wellness 4.0' }
    //   ]
    // }
  ];

  // Initialize filters
  useEffect(() => {
    const initialFilters: Record<string, string[]> = {};
    filterConfig.forEach((config) => {
      initialFilters[config.id] = [];
    });
    setFilters(initialFilters);
  }, []);

  // Load and filter items
  useEffect(() => {
    // COMMENTED OUT - Now using Supabase data only
    // Filter by active tab first
    let tabFilteredServices = mockServiceData;
    if (activeSubMarketplace === 'design-services') {
      tabFilteredServices = mockServiceData.filter(service => service.category === 'Design Services');
    } else if (activeSubMarketplace === 'deploy-services-saas') {
      tabFilteredServices = mockServiceData.filter(service => service.category === 'Deploy Services (SaaS)');
    } else if (activeSubMarketplace === 'deploy-services-onprem') {
      tabFilteredServices = mockServiceData.filter(service => service.category === 'Deploy Services (On-Prem)');
    }
    
    // Apply filters and search query
    const filtered = tabFilteredServices.filter((service: any) => {
      const matchesAllFacets = Object.keys(filters).every((facetCode) => {
        const selectedValues = filters[facetCode] || [];
        if (!selectedValues.length) return true;
        
        // Map filter codes to service properties
        if (facetCode === 'serviceCategory') {
          return selectedValues.some(value => {
            const serviceValue = service.serviceCategory.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-').replace(/&/g, '').replace(/-+/g, '-');
            return serviceValue === value;
          });
        } else if (facetCode === 'serviceAvailability') {
          return selectedValues.some(value => 
            service.serviceAvailability.toLowerCase().replace(/\s+/g, '-') === value
          );
        } else if (facetCode === 'serviceReadiness') {
          return selectedValues.some(value => 
            service.serviceReadiness.toLowerCase().replace(/\s+/g, '-') === value
          );
        } else if (facetCode === 'economicSector') {
          return selectedValues.some(value => 
            service.economicSector.toLowerCase().replace(/\s+/g, '-') === value
          );
        }
        return true;
      });

      const matchesSearch = searchQuery.trim() === '' || 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesAllFacets && matchesSearch;
    });

    setFilteredItems(filtered || []);
    
    // Empty state since we're not using mock data anymore
    // setFilteredItems([]);
  }, [activeSubMarketplace, filters, searchQuery]);

  // Handle sub-marketplace tab change and clear filters
  const handleSubMarketplaceChange = useCallback((tabId: string) => {
    setActiveSubMarketplace(tabId);
    // Clear search when switching tabs
    setSearchQuery('');
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((filterType: string, value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterType] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return {
        ...prev,
        [filterType]: newValues
      };
    });
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    const emptyFilters: Record<string, string[]> = {};
    filterConfig.forEach((config) => {
      emptyFilters[config.id] = [];
    });
    setFilters(emptyFilters);
    setSearchQuery("");
  }, []);

  // Toggle sidebar visibility (only on mobile)
  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
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
          <h1 className="text-3xl font-bold text-gray-800">
            {config.title}
          </h1>
        </div>
        <p className="text-gray-600 mb-6">{config.description}</p>
        
        {/* Current Focus section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Current Focus
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {activeSubMarketplace === 'design-services' ? 'Design Services' 
                 : activeSubMarketplace === 'deploy-services-saas' ? 'Deploy Services (SaaS)'
                 : 'Deploy Services (On-Prem)'}
              </h2>
              <p className="text-gray-600">
                {activeSubMarketplace === 'design-services' 
                  ? 'Strategic design and architecture services to envision and blueprint your digital transformation.'
                  : activeSubMarketplace === 'deploy-services-saas' 
                  ? 'Cloud-based deployment services for scalable and flexible digital solutions.'
                  : 'On-premise deployment services for secure and controlled digital infrastructure.'}
              </p>
            </div>
            <span className="ml-4 px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full whitespace-nowrap">
              Overview
            </span>
          </div>
        </div>
        
        {/* Sub-marketplace tabs */}
        <SubMarketplaceTabs
          tabs={subMarketplaceTabs}
          activeTab={activeSubMarketplace}
          onTabChange={handleSubMarketplaceChange}
        />
        
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="w-full">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
        </div>
        
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Mobile filter toggle */}
          <div className="xl:hidden sticky z-20 bg-gray-50 py-2 shadow-sm" style={{ top: "46px" }}>
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
              {Object.values(filters).some((f) => f.length > 0) && (
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
            style={{ top: 46, bottom: 0 }}
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
              style={{ top: 46, bottom: 0 }}
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
                  <FilterSidebar
                    filters={filters}
                    filterConfig={filterConfig}
                    onFilterChange={handleFilterChange}
                    onResetFilters={resetFilters}
                    isResponsive={true}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Filter sidebar - desktop */}
          <div className="hidden xl:block xl:w-1/4">
            <div className="bg-white rounded-lg shadow sticky top-24 max-h-[calc(100vh-7rem)] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-lg font-semibold">Filters</h2>
                {Object.values(filters).some((f) => f.length > 0) && (
                  <button
                    onClick={resetFilters}
                    className="text-blue-600 text-sm font-medium"
                  >
                    Reset All
                  </button>
                )}
              </div>
              <div className="p-4 overflow-y-auto scrollbar-hide">
                <FilterSidebar 
                  filters={filters} 
                  filterConfig={filterConfig} 
                  onFilterChange={handleFilterChange} 
                  onResetFilters={resetFilters} 
                  isResponsive={false} 
                />
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="xl:w-3/4">
            {filteredItems.length === 0 ? (
              <div className="text-center py-16">
                {activeSubMarketplace === 'deploy-services-saas' ? (
                  <div className="bg-blue-50 rounded-xl p-12 max-w-lg mx-auto">
                    <div className="text-6xl mb-6">🚀</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Deploy Services (SaaS) — Coming Soon
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      We're working on bringing you comprehensive deployment services. Stay tuned!
                    </p>
                  </div>
                ) : activeSubMarketplace === 'deploy-services-onprem' ? (
                  <div className="bg-blue-50 rounded-xl p-12 max-w-lg mx-auto">
                    <div className="text-6xl mb-6">🚀</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Deploy Services (On-Prem) — Coming Soon
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      We're working on bringing you comprehensive deployment services. Stay tuned!
                    </p>
                  </div>
                ) : (
                  <div className="text-gray-600 py-8">
                    No services available
                  </div>
                )}
              </div>
            ) : (
              <MarketplaceGrid
                items={filteredItems}
                marketplaceType={marketplaceType}
                bookmarkedItems={[]}
                onToggleBookmark={() => {}}
                onAddToComparison={() => {}}
                promoCards={[]}
                totalCount={undefined}
                showingCount={undefined}
              />
            )}
          </div>
        </div>
      </div>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default SimpleMarketplacePage;