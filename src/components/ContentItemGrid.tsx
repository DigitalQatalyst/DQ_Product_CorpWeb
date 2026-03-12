import React, { useState } from 'react';
import { ContentItemCard, ContentType } from './Cards/ContentItemCard';

// Sample data for demonstration
const sampleContentItems = [
  {
    id: '1',
    type: 'Article' as ContentType,
    title: 'The Future of Digital Cognitive Organizations (DCOs)',
    description: 'Download this comprehensive white paper to understand how artificial intelligence is shaping new...',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    source: 'Digital Business Platform',
    date: 'Apr 20, 2025',
  },
  {
    id: '2',
    type: 'Blog' as ContentType,
    title: 'The Future of Digital Cognitive Organizations (DCOs)',
    description: 'Download this comprehensive white paper to understand how artificial intelligence is shaping new...',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
    source: 'Digital Business Platform',
    date: 'Apr 20, 2025',
  },
  {
    id: '3',
    type: 'Case Study' as ContentType,
    title: 'The Future of Digital Cognitive Organizations (DCOs)',
    description: 'Download this comprehensive white paper to understand how artificial intelligence is shaping new...',
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800',
    source: 'Digital Business Platform',
    date: 'Apr 20, 2025',
  },
  {
    id: '4',
    type: 'Research Report' as ContentType,
    title: 'The Future of Digital Cognitive Organizations (DCOs)',
    description: 'Download this comprehensive white paper to understand how artificial intelligence is shaping new...',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    source: 'Digital Business Platform',
    date: 'Apr 20, 2025',
  },
  {
    id: '5',
    type: 'Expert Interview' as ContentType,
    title: 'The Future of Digital Cognitive Organizations (DCOs)',
    description: 'Download this comprehensive white paper to understand how artificial intelligence is shaping new...',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
    source: 'Digital Business Platform',
    date: 'Apr 20, 2025',
  },
  {
    id: '6',
    type: 'Prediction Analysis' as ContentType,
    title: 'The Future of Digital Cognitive Organizations (DCOs)',
    description: 'Download this comprehensive white paper to understand how artificial intelligence is shaping new...',
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800',
    source: 'Digital Business Platform',
    date: 'Apr 20, 2025',
  },
  {
    id: '7',
    type: 'Podcast' as ContentType,
    title: 'The Future of Digital Cognitive Organizations (DCOs)',
    description: 'Download this comprehensive white paper to understand how artificial intelligence is shaping new...',
    imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800',
    source: 'Digital Business Platform',
    date: 'Apr 20, 2025',
  },
  {
    id: '8',
    type: 'Video' as ContentType,
    title: 'The Future of Digital Cognitive Organizations (DCOs)',
    description: 'Download this comprehensive white paper to understand how artificial intelligence is shaping new...',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
    source: 'Digital Business Platform',
    date: 'Apr 20, 2025',
  },
  {
    id: '9',
    type: 'White Paper' as ContentType,
    title: 'The Future of Digital Cognitive Organizations (DCOs)',
    description: 'Download this comprehensive white paper to understand how artificial intelligence is shaping new...',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    source: 'Digital Business Platform',
    date: 'Apr 20, 2025',
  },
];

export const ContentItemGrid: React.FC = () => {
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());

  const handleToggleBookmark = (id: string) => {
    setBookmarkedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleCardClick = (item: typeof sampleContentItems[0]) => {
    console.log('Card clicked:', item);
    // Navigate to detail page or open modal
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        Knowledge Hub Content
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleContentItems.map((item) => (
          <ContentItemCard
            key={item.id}
            {...item}
            isBookmarked={bookmarkedItems.has(item.id)}
            onToggleBookmark={() => handleToggleBookmark(item.id)}
            onClick={() => handleCardClick(item)}
          />
        ))}
      </div>
    </div>
  );
};
