import React from 'react';

export interface SubMarketplaceTab {
  id: string;
  label: string;
  description?: string;
}

interface SubMarketplaceTabsProps {
  tabs: SubMarketplaceTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const SubMarketplaceTabs: React.FC<SubMarketplaceTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
