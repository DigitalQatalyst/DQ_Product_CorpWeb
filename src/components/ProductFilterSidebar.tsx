import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProductFilterSidebarProps {
  filters: {
    category: string;
    tag: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
  onResetFilters: () => void;
  isResponsive?: boolean;
  categories: string[];
  tags: string[];
}

interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

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

export function ProductFilterSidebar({
  filters,
  onFilterChange,
  onResetFilters,
  isResponsive = false,
  categories = [],
  tags: _tags = [],
}: ProductFilterSidebarProps) {
  void _tags;
  const [openSections, setOpenSections] = useState({
    category: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  const textSizeClass = isResponsive ? "text-sm" : "text-sm";
  const spacingClass = isResponsive ? "space-y-1" : "space-y-2";

  return (
    <div className="space-y-2">
      <AccordionSection
        title="Category"
        isOpen={openSections.category}
        onToggle={() => toggleSection("category")}
      >
        <div className={spacingClass}>
          {categories.map((category) => (
            <div key={category} className="flex items-center">
              <input
                type="checkbox"
                id={`category-${category}`}
                checked={filters.category === category}
                onChange={() => onFilterChange("category", category)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label
                htmlFor={`category-${category}`}
                className={`ml-2 ${textSizeClass} text-gray-700`}
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </AccordionSection>
    </div>
  );
}
