import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface FilterOption {
  id: string;
  name: string;
  children?: FilterOption[]; // Support for nested options
}

export interface FilterConfig {
  id: string;
  title: string;
  options: FilterOption[];
  isNested?: boolean; // Flag to indicate if this category has nested structure
}

interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export interface FilterSidebarProps {
  filters: Record<string, string[]>;
  filterConfig: FilterConfig[];
  onFilterChange: (filterType: string, value: string) => void;
  onResetFilters: () => void;
  isResponsive?: boolean;
  openSections?: Record<string, boolean>; // External control of open sections
  onToggleSection?: (section: string) => void; // External toggle handler
}

// Mapping of Media Types to their relevant Format options (uses filter labels)
const MEDIA_TYPE_FORMAT_MAPPING: Record<string, string[]> = {
  'News': ['Quick Reads'],
  'Reports': ['In-Depth Reports', 'Downloadable Templates'],
  'Toolkits & Templates': ['Interactive Tools', 'Downloadable Templates'],
  'Guides': ['Quick Reads', 'In-Depth Reports'],
  'Events': ['Live Events'],
  'Videos': ['Recorded Media'],
  'Podcasts': ['Recorded Media']
};

const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div className="border-b border-gray-100 py-3">
      <button
        className="flex w-full justify-between items-center text-left font-medium text-gray-900 mb-2"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        {title}
        {isOpen ? (
          <ChevronUp size={16} className="text-gray-500" />
        ) : (
          <ChevronDown size={16} className="text-gray-500" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  filterConfig,
  onFilterChange,
  onResetFilters,
  isResponsive = false,
  openSections: externalOpenSections,
  onToggleSection: externalToggleSection,
}) => {
  const [internalOpenSections, setInternalOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(filterConfig.map((config) => [config.id, config.id !== 'economicSector']))
  );

  // Use external sections if provided, otherwise use internal state
  const openSections = externalOpenSections || internalOpenSections;

  const toggleSection = (section: string) => {
    if (externalToggleSection) {
      externalToggleSection(section);
    } else {
      setInternalOpenSections((prev) => ({
        ...prev,
        [section]: !prev[section],
      }));
    }
  };

  // Auto-open sections that have active filters (only for internal state)
  useEffect(() => {
    if (externalOpenSections) return; // Don't auto-open if externally controlled
    
    const sectionsWithActiveFilters: Record<string, boolean> = {};
    
    filterConfig.forEach(config => {
      const hasActiveFilter = filters[config.id] && filters[config.id].length > 0;
      // Open section if it has active filters, otherwise keep default state
      sectionsWithActiveFilters[config.id] = hasActiveFilter ? true : internalOpenSections[config.id];
    });
    
    setInternalOpenSections(sectionsWithActiveFilters);
  }, [filters, filterConfig]);
  const textSizeClass = isResponsive ? 'text-xs' : 'text-sm';
  const spacingClass = isResponsive ? 'space-y-1' : 'space-y-2';

  // Filter the format options based on selected media types
  const filteredFilterConfig = useMemo(() => {
    const selectedMediaTypes = filters['mediaType'] || [];

    return filterConfig.map(config => {
      // Only filter the Format category if any Media Type is selected
      if (config.id === 'format' && selectedMediaTypes.length > 0) {
        const allowedFormats = selectedMediaTypes
          .flatMap(mediaType => MEDIA_TYPE_FORMAT_MAPPING[mediaType] || [])
          .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
        return {
          ...config,
          options: config.options.filter(option => allowedFormats.includes(option.name))
        };
      }
      return config;
    });
  }, [filterConfig, filters]);

  return (
    <div className="space-y-2">
      {filteredFilterConfig.map(config => (
        <AccordionSection key={config.id} title={config.title} isOpen={openSections[config.id] || false} onToggle={() => toggleSection(config.id)}>
          <div className={spacingClass}>
            {config.options.map((option) => (
              <div key={option.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${config.id}-${option.id}`}
                  checked={(filters[config.id] || []).includes(option.id)}
                  onChange={() => onFilterChange(config.id, option.id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor={`${config.id}-${option.id}`}
                  className={`ml-2 ${textSizeClass} text-gray-700`}
                >
                  {option.name}
                </label>
              </div>
            ))}
          </div>
        </AccordionSection>
      ))}
      
      {/* Reset filters button */}
      <button
        onClick={onResetFilters}
        className="w-full mt-4 px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
      >
        Reset All Filters
      </button>
    </div>
  );
};