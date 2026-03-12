import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getMarketplaceConfig } from '../../utils/marketplaceConfig';

export interface MarketplaceItemProps {
  item: {
    id: string;
    title: string;
    description: string;
    provider: {
      name: string;
      logoUrl: string;
    };
    tags?: string[];
    category?: string;
    deliveryMode?: string;
    formUrl?: string; // Internal route for the form
    [key: string]: any;
  };
  marketplaceType: string;
}

export const MarketplaceCard: React.FC<MarketplaceItemProps> = ({
  item,
  marketplaceType
}) => {
  const navigate = useNavigate();
  const config = getMarketplaceConfig(marketplaceType);

  // Generate route based on marketplace type
  const getItemRoute = () => {
    return `${config.route}/${item.id}`;
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('View Details Clicked - Navigating to:', getItemRoute());
    navigate(getItemRoute());
  };

  // Navigate to the formUrl when the primary action is clicked
  const handlePrimaryAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Log item details for debugging
    console.log('Primary Action Clicked:', {
      itemId: item.id,
      itemTitle: item.title,
      formUrl: item.formUrl,
      marketplaceType,
    });
    // Apply external fallback if formUrl is null/falsy
    const effectiveUrl = item.formUrl || "https://www.tamm.abudhabi/en/login";
    // Handle external: open in new tab
    if (effectiveUrl.startsWith('http')) {
      window.open(effectiveUrl, '_blank', 'noopener,noreferrer');
      console.log('Opening external URL:', effectiveUrl);
      return;
    }
    // Internal route: normalize with /forms/ prefix if needed
    const targetUrl = effectiveUrl.startsWith('/forms/') ? effectiveUrl : `/forms/${effectiveUrl}`;
    console.log('Navigating to internal route:', targetUrl);
    navigate(targetUrl);
  };

  // Display tags if available, otherwise use category and deliveryMode
  const displayTags = item.tags || [item.category, item.deliveryMode].filter(Boolean);

  // Log item props on render to verify formUrl presence
  console.log('MarketplaceCard Rendered:', {
    itemId: item.id,
    itemTitle: item.title,
    formUrl: item.formUrl,
    marketplaceType,
  });

  return (
    <div
      className="flex flex-col min-h-[340px] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
    >
      {/* Card Header with fixed height for title and provider */}
      <div className="px-4 py-5 flex-grow flex flex-col">
        <div className="flex items-start mb-5">
          <div className="flex-grow min-h-[72px] flex flex-col justify-center">
            <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[48px] leading-snug">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 min-h-[20px] mt-1">
              {item.content_type || item.mediaType || (typeof item.provider === 'string' ? item.provider : item.provider.name)}
            </p>
          </div>
        </div>
        {/* Description with consistent height */}
        <div className="mb-5">
          <p className="text-sm text-gray-600 line-clamp-3 min-h-[60px] leading-relaxed">
            {item.description}
          </p>
        </div>
        {/* Tags and Actions in same row - fixed position */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-wrap gap-1 max-w-[70%]">
            {displayTags.map((tag, index) => <span key={index} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium truncate ${index === 0 ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                {tag}
              </span>)}
          </div>
        </div>
      </div>
      {/* Card Footer - with two buttons */}
      <div className="mt-auto border-t border-gray-100 p-4 pt-5">
        <div className="flex justify-between gap-2">
          <button
            onClick={handleViewDetails}
            className="px-4 py-2 text-sm font-medium text-primary bg-white border border-primary rounded-md hover:bg-primary-50 transition-colors whitespace-nowrap min-w-[120px] flex-1"
          >
            {config.secondaryCTA}
          </button>
          <button
            onClick={handlePrimaryAction}
            className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-600 rounded-md transition-colors whitespace-nowrap flex-1"
          >
            {config.primaryCTA}
          </button>
        </div>
      </div>
    </div>
  );
};