import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PromoCard } from "../PromoCard";
import { MarketplaceCard } from "./MarketplaceCard";
import { ContentItemCard, ContentType } from "../Cards/ContentItemCard";
import { getFallbackItems } from "../../utils/fallbackData";
export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  provider: {
    name: string;
    logoUrl: string;
    description: string;
  };
  [key: string]: any; // For additional fields specific to each marketplace type
}
interface PromoCardData {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  gradientFrom: string;
  gradientTo: string;
}
interface MarketplaceGridProps {
  items: MarketplaceItem[];
  marketplaceType: string;
  bookmarkedItems: string[];
  onToggleBookmark: (itemId: string) => void;
  onAddToComparison: (item: MarketplaceItem) => void;
  promoCards?: PromoCardData[];
  // Optional: provide total and showing counts for external pagination
  totalCount?: number;
  showingCount?: number;
}
export const MarketplaceGrid: React.FC<MarketplaceGridProps> = ({
  items,
  marketplaceType,
  bookmarkedItems,
  onToggleBookmark,
  onAddToComparison,
  promoCards = [],
  totalCount,
  showingCount,
}) => {
  const navigate = useNavigate();
  // Use fallback items only if explicitly enabled via env
  const ENABLE_MOCKS = (import.meta as any).env?.VITE_ENABLE_MOCKS === 'true';
  const displayItems =
    items && items.length > 0
      ? items
      : ENABLE_MOCKS
        ? getFallbackItems(marketplaceType)
        : [];
  const totalItems = typeof totalCount === 'number' ? totalCount : displayItems.length;
  const showingItems = typeof showingCount === 'number' ? showingCount : displayItems.length;
  if (totalItems === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          No items found
        </h3>
        <p className="text-gray-500">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }
  // Insert promo cards after every 6 regular items
  const itemsWithPromos = displayItems.reduce(
    (acc, item, index) => {
      acc.push({
        type: "item",
        data: item,
      });
      // Insert a promo card after every 6 items
      if (
        (index + 1) % 6 === 0 &&
        promoCards.length > 0 &&
        promoCards[Math.floor(index / 6) % promoCards.length]
      ) {
        const promoIndex = Math.floor(index / 6) % promoCards.length;
        acc.push({
          type: "promo",
          data: promoCards[promoIndex],
        });
      }
      return acc;
    },
    [] as Array<{
      type: "item" | "promo";
      data: any;
    }>
  );
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        {/* Responsive header - concise on mobile */}
        <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">
          Available Items ({totalItems})
        </h2>
        <div className="text-sm text-gray-500 hidden sm:block">
          Showing {showingItems} of {totalItems} items
        </div>
        {/* Mobile-friendly header */}
        <h2 className="text-lg font-medium text-gray-800 sm:hidden">
          {totalItems} Items Available
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {itemsWithPromos.map((entry, idx) => {
          if (entry.type === "item") {
            const item = entry.data as MarketplaceItem;
            // Use ContentItemCard for dtmi marketplace type
            if (marketplaceType === "dtmi") {
              // Map media type to ContentType
              const getContentType = (mediaType?: string): ContentType => {
                const type = (mediaType || '').toLowerCase();
                if (type.includes('article') || type.includes('news')) return 'Article';
                if (type.includes('blog')) return 'Blog';
                if (type.includes('case study')) return 'Case Study';
                if (type.includes('prediction')) return 'Prediction Analysis';
                if (type.includes('interview')) return 'Expert Interview';
                if (type.includes('podcast')) return 'Podcast';
                if (type.includes('video')) return 'Video';
                if (type.includes('white paper')) return 'White Paper';
                if (type.includes('report')) return 'Research Report';
                return 'Article'; // default
              };

              // Format date
              const formatDate = (dateString?: string): string => {
                if (!dateString) return "";
                try {
                  const date = new Date(dateString);
                  if (isNaN(date.getTime())) return "";
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                } catch (error) {
                  return "";
                }
              };

              // Get category/source to display - show category or digital perspective
              const getDisplaySource = (item: any): string => {
                // Debug logging
                console.log('🔍 Item display source data:', {
                  id: item.id,
                  title: item.title?.substring(0, 30),
                  digital_perspective: item.digital_perspective,
                  categoryName: item.categoryName,
                  category: item.category,
                  provider: item.provider?.name
                });

                // Priority: digital_perspective > categoryName > category > provider name
                if (item.digital_perspective) {
                  // Map short codes (D1, D2, etc.) to full names
                  const perspectiveMap: Record<string, string> = {
                    'D1': 'Digital Economy 4.0',
                    'D2': 'Digital Cognitive Organisation',
                    'D3': 'Digital Business Platform',
                    'D4': 'Digital Transformation 2.0',
                    'D5': 'Digital Worker & Digital Workspace',
                    'D6': 'Digital Accelerators',
                  };
                  
                  // Check if it's a short code
                  if (perspectiveMap[item.digital_perspective]) {
                    return perspectiveMap[item.digital_perspective];
                  }
                  
                  // If it's already a full label, clean it up
                  let cleaned = item.digital_perspective.replace(/^D\d+\s*-\s*/i, '');
                  cleaned = cleaned.replace(/\s*\([^)]*\)\s*$/i, '');
                  return cleaned.trim();
                }
                if (item.categoryName) {
                  return item.categoryName;
                }
                if (item.category) {
                  return item.category;
                }
                return item.provider?.name || item.source || 'Digital Business Platform';
              };

              return (
                <ContentItemCard
                  key={`item-${item.id || idx}`}
                  id={item.id}
                  type={getContentType(item.mediaType)}
                  title={item.title}
                  description={item.description}
                  imageUrl={item.imageUrl || item.thumbnailUrl || 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800'}
                  source={getDisplaySource(item)}
                  date={formatDate(item.date || item.lastUpdated || item.published_at)}
                  isBookmarked={bookmarkedItems.includes(item.id)}
                  onToggleBookmark={() => onToggleBookmark(item.id)}
                  onClick={() => {
                    // Check if item is a prediction analysis type
                    if (item.mediaType && item.mediaType.toLowerCase().includes('prediction')) {
                      // Store item data in localStorage to pass to dynamic page
                      localStorage.setItem('marketplacePredictionState', JSON.stringify({
                        item: item,
                        timestamp: Date.now()
                      }));
                      // Navigate to dynamic prediction analysis page
                      navigate(`/marketplace/dtmi/prediction-analysis/${item.id}`);
                    }
                    // Check if item has a custom detailsUrl (for special pages like Prediction Analysis)
                    else if (item.detailsUrl) {
                      navigate(item.detailsUrl);
                    } else if (item.expertInterviewUrl) {
                      navigate(item.expertInterviewUrl);
                    } else if (item.blogUrl) {
                      navigate(item.blogUrl);
                    } else if (item.articleUrl) {
                      navigate(item.articleUrl);
                    } else if (item.newsUrl) {
                      navigate(item.newsUrl);
                    } else if (item.guideUrl) {
                      navigate(item.guideUrl);
                    } else if (item.researchReportUrl) {
                      navigate(item.researchReportUrl);
                    } else {
                      const lowerType = (item.mediaType || 'article').toLowerCase();
                      if (lowerType.includes('whitepaper') || lowerType.includes('white paper')) {
                        navigate(`/whitepaper/${item.slug || item.id}/view`);
                      } else if (lowerType.includes('report') || lowerType.includes('research')) {
                        navigate(`/research-report/${item.slug || item.id}`);
                      } else {
                        const typeSlug = lowerType.replace(/\s+/g, '-');
                        navigate(`/${typeSlug}/${item.id}`);
                      }
                    }
                  }}
                />
              );
            }
            // Use standard MarketplaceCard for other marketplace types
            return (
              <MarketplaceCard
                key={`item-${item.id || idx}`}
                item={item}
                marketplaceType={marketplaceType}
              />
            );
          } else if (entry.type === "promo") {
            const promo = entry.data as PromoCardData;
            return (
              <PromoCard
                key={`promo-${promo.id || idx}-${idx}`}
                title={promo.title}
                description={promo.description}
                icon={promo.icon}
                path={promo.path}
                gradientFrom={promo.gradientFrom || "from-blue-500"}
                gradientTo={promo.gradientTo || "to-purple-600"}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};
