import React from 'react';
import { Play, ArrowRight } from 'lucide-react';

export type ContentType = 
  | 'Article'
  | 'Blog'
  | 'Case Study'
  | 'Prediction Analysis'
  | 'Expert Interview'
  | 'Podcast'
  | 'Video'
  | 'White Paper'
  | 'Research Report'
  | 'Event';

interface ContentItemCardProps {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  imageUrl: string;
  source: string;
  date: string;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onClick?: () => void;
}

// Color mapping for different content types
const contentTypeStyles: Record<ContentType, { bg: string; text: string }> = {
  'Article': { bg: 'bg-blue-50', text: 'text-blue-700' },
  'Blog': { bg: 'bg-green-50', text: 'text-green-700' },
  'Case Study': { bg: 'bg-purple-50', text: 'text-purple-700' },
  'Prediction Analysis': { bg: 'bg-orange-50', text: 'text-orange-700' },
  'Expert Interview': { bg: 'bg-red-50', text: 'text-red-700' },
  'Podcast': { bg: 'bg-primary-50', text: 'text-primary-700' },
  'Video': { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  'White Paper': { bg: 'bg-indigo-50', text: 'text-indigo-700' },
  'Research Report': { bg: 'bg-rose-50', text: 'text-rose-700' },
};

export const ContentItemCard: React.FC<ContentItemCardProps> = ({
  type,
  title,
  description,
  imageUrl,
  source,
  date,
  isBookmarked = false,
  onToggleBookmark,
  onClick,
}) => {
  const typeStyle = contentTypeStyles[type];
  const isMediaType = type === 'Video' || type === 'Podcast';

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Play Button Overlay for Videos and Podcasts */}
        {isMediaType && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
              <Play size={24} className="text-blue-600 fill-blue-600 ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Type Badge and Source */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${typeStyle.bg} ${typeStyle.text}`}
          >
            {type}
          </span>
          <span className="text-xs text-gray-500 truncate">{source}</span>
        </div>

        {/* Title - Always 2 lines */}
        <h3 className="font-bold text-gray-900 text-base line-clamp-2 leading-snug mb-3" style={{ minHeight: '2.75rem' }}>
          {title}
        </h3>

        {/* Description - Always 2 lines */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3" style={{ minHeight: '2.5rem' }}>
          {description}
        </p>

        {/* Date and Read More Link */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">{date}</p>
          <div className="inline-flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all">
            Read More
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
