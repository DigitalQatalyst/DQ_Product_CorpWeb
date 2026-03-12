import React, { useMemo, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ProductCard } from "../components/ProductCard";
import { ProductFilterSidebar } from "../components/ProductFilterSidebar";
import { dqProducts } from "../utils/productData";
import { HomeIcon, ChevronRightIcon, FilterIcon, XIcon, SearchIcon } from "lucide-react";
import ModernDQChatbot from "../components/ModernDQChatbot";

export function ProductMarketplacePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    tag: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    return Array.from(new Set(dqProducts.map((product) => product.category))).sort();
  }, []);

  const tags = useMemo(() => {
    const allTags = dqProducts.flatMap((product) => product.tags);
    return Array.from(new Set(allTags)).sort();
  }, []);

  const filteredProducts = useMemo(() => {
    return dqProducts.filter((product) => {
      const categoryMatch = !filters.category || product.category === filters.category;
      const tagMatch = !filters.tag || product.tags.includes(filters.tag);
      const searchMatch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && tagMatch && searchMatch;
    });
  }, [filters, searchQuery]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType as keyof typeof prev] === value ? "" : value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      tag: "",
    });
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <a
                  href="/"
                  className="text-gray-600 hover:text-primary-600 inline-flex items-center"
                >
                  <HomeIcon size={16} className="mr-1" />
                  <span>Home</span>
                </a>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">Products</span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
              Explore Products
            </h1>
            <p className="text-gray-600 text-lg">
              Discover curated digital products and accelerators engineered for growth and success in the digital economy.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
            <div className="w-full">
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by product name, capability, or description"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 whitespace-nowrap">
                Showing {filteredProducts.length} of {dqProducts.length} products
              </span>
              {(filters.category || filters.tag || searchQuery) && (
                <button
                  onClick={() => {
                    resetFilters();
                    setSearchQuery("");
                  }}
                  className="text-primary font-medium hover:text-primary-600"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="xl:hidden sticky top-0 z-20 bg-gray-50 py-2 mb-4">
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
              {(filters.category || filters.tag) && (
                <button
                  onClick={resetFilters}
                  className="ml-2 text-primary-600 text-sm font-medium whitespace-nowrap px-3 py-2"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-6">
            <div
              className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-30 transition-opacity duration-300 xl:hidden ${
                showFilters ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              onClick={toggleFilters}
              aria-hidden={!showFilters}
            >
              <div
                id="filter-sidebar"
                className={`fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
                  showFilters ? "translate-x-0" : "-translate-x-full"
                }`}
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Product filters"
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
                    <ProductFilterSidebar
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      onResetFilters={resetFilters}
                      isResponsive
                      categories={categories}
                      tags={tags}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden xl:block xl:w-1/4">
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 sticky top-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  {(filters.category || filters.tag) && (
                    <button
                      onClick={resetFilters}
                      className="text-primary-600 text-sm font-medium"
                    >
                      Reset All
                    </button>
                  )}
                </div>
                <ProductFilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onResetFilters={resetFilters}
                  isResponsive={false}
                  categories={categories}
                  tags={tags}
                />
              </div>
            </div>

            <div className="xl:w-3/4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {filteredProducts.length === 0 && (
                  <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-300 p-8 text-center mt-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Try adjusting your search or filters to explore more offerings.
                    </p>
                    <button
                      onClick={() => {
                        resetFilters();
                        setSearchQuery("");
                      }}
                      className="text-primary font-medium hover:text-primary-600"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer isLoggedIn={false} />
      
      {/* DQ AI Chatbot */}
      <ModernDQChatbot />
    </div>
  );
}
