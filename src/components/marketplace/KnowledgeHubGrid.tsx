import React, { useEffect, useMemo, useState } from 'react'
import { KnowledgeHubCard } from './KnowledgeHubCard'
import { useMediaSearch } from '../../hooks/UseMediaSearch'
interface KnowledgeHubGridProps {
  bookmarkedItems: string[]
  onToggleBookmark: (itemId: string) => void
  onAddToComparison?: (item: any) => void
  searchQuery?: string
  activeFilters?: string[]
  onFilterChange?: (filter: string) => void
  onClearFilters?: () => void
}
export const KnowledgeHubGrid: React.FC<KnowledgeHubGridProps> = ({
  bookmarkedItems,
  onToggleBookmark,
  onAddToComparison,
  searchQuery = '',
  activeFilters = [],
  onFilterChange,
  onClearFilters,
}) => {
  // Compute responsive columns (1, 2, 3) to show exactly 4 rows
  const [columns, setColumns] = useState<number>(1)
  useEffect(() => {
    const calcColumns = () => {
      if (typeof window === 'undefined') return
      const w = window.innerWidth || 0
      const cols = w >= 1024 ? 3 : w >= 640 ? 2 : 1
      setColumns(cols)
    }
    calcColumns()
    window.addEventListener('resize', calcColumns)
    return () => window.removeEventListener('resize', calcColumns)
  }, [])
  const rowsPerPage = 4
  const computedPageSize = columns * rowsPerPage
  // Use our custom hook for fetching and filtering media items
  const { items, isLoading, error, hasMore, loadMore, currentPage, pageSize: hookPageSize, total, goToPage } = useMediaSearch({
    q: searchQuery,
    filters: activeFilters,
    // Show exactly 4 rows per page based on responsive columns
    pageSize: computedPageSize,
  })
  // Get available filters based on all items
  const availableFilters = useMemo(() => {
    const mediaTypes = [...new Set(items.map((item) => item.mediaType))]
    const domains = [...new Set(items.flatMap((item) => item.tags || []))]
    return [...mediaTypes, ...domains].filter(Boolean)
  }, [items])
  // Handle filter click
  const handleFilterClick = (filter: string) => {
    if (onFilterChange) {
      onFilterChange(filter)
    }
  }
  // Numeric pagination (replaces infinite scroll)
  const totalPages = Math.max(1, Math.ceil((total || 0) / (hookPageSize || computedPageSize)))
  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">Error loading content: {error.message}</p>
          <button
            className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
            onClick={() => window.location.reload()}
          >
            Try refreshing the page
          </button>
        </div>
      )}
      {!error && items.length === 0 && !isLoading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No items found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or search criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {items.map((item) => (
            <div key={`item-${item.id}`} className="h-full">
              <KnowledgeHubCard
                item={item}
                isBookmarked={bookmarkedItems.includes(item.id)}
                onToggleBookmark={() => onToggleBookmark(item.id)}
                onAddToComparison={
                  onAddToComparison ? () => onAddToComparison(item) : undefined
                }
              />
            </div>
          ))}
        </div>
      )}
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {/* Pagination controls */}
      {items.length > 0 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1 || isLoading}
            className={`px-3 py-2 rounded-md border ${currentPage <= 1 || isLoading ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50'}`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}
            className={`px-3 py-2 rounded-md border ${currentPage >= totalPages || isLoading ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
export default KnowledgeHubGrid
