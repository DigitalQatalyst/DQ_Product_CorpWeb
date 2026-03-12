import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ContentItemCard, ContentType } from '../components/Cards/ContentItemCard';

// Sample content items showcasing all types
const contentItems = [
  {
    id: '1',
    type: 'Article' as ContentType,
    title: 'The Future of Digital Cognitive Organizations (DCOs)',
    description: 'Download this comprehensive white paper to understand how artificial intelligence is shaping new organizational structures and business models.',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    source: 'Digital Business Platform',
    date: 'Apr 20, 2025',
  },
  {
    id: '2',
    type: 'Blog' as ContentType,
    title: 'Building Resilient Digital Ecosystems',
    description: 'Explore strategies for creating sustainable and adaptable digital business platforms that can weather market changes.',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
    source: 'Digital Business Platform',
    date: 'Apr 18, 2025',
  },
  {
    id: '3',
    type: 'Case Study' as ContentType,
    title: 'Digital Transformation Success at Emirates Tech',
    description: 'Learn how Emirates Tech achieved 300% growth through strategic digital transformation initiatives and platform adoption.',
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800',
    source: 'Digital Business Platform',
    date: 'Apr 15, 2025',
  },
  {
    id: '4',
    type: 'Research Report' as ContentType,
    title: 'State of Digital Business in MENA 2025',
    description: 'Comprehensive analysis of digital business trends, adoption rates, and future predictions across the MENA region.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    source: 'Digital Business Platform',
    date: 'Apr 12, 2025',
  },
  {
    id: '5',
    type: 'Expert Interview' as ContentType,
    title: 'Interview with Dr. Sarah Ahmed on AI Ethics',
    description: 'Leading AI researcher discusses the ethical implications of artificial intelligence in business and society.',
    imageUrl: '/images/interview1_thumbnail.png',
    source: 'Digital Business Platform',
    date: 'Apr 10, 2025',
  },
  {
    id: '6',
    type: 'Prediction Analysis' as ContentType,
    title: '2025 Technology Trends: What to Expect',
    description: 'Data-driven predictions on emerging technologies and their impact on digital business platforms in the coming year.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    source: 'Digital Business Platform',
    date: 'Apr 8, 2025',
  },
  {
    id: '7',
    type: 'Podcast' as ContentType,
    title: 'The Digital Transformation Podcast: Episode 42',
    description: 'Join us as we discuss the latest trends in digital transformation with industry leaders and innovators.',
    imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800',
    source: 'Digital Business Platform',
    date: 'Apr 5, 2025',
  },
  {
    id: '8',
    type: 'Video' as ContentType,
    title: 'How to Build a Digital Business Platform',
    description: 'Step-by-step video guide on creating and scaling a successful digital business platform from scratch.',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
    source: 'Digital Business Platform',
    date: 'Apr 3, 2025',
  },
  {
    id: '9',
    type: 'White Paper' as ContentType,
    title: 'Enterprise Digital Strategy Framework',
    description: 'A comprehensive framework for developing and implementing enterprise-wide digital transformation strategies.',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    source: 'Digital Business Platform',
    date: 'Apr 1, 2025',
  },
];

export const ContentShowcase: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const handleCardClick = (item: typeof contentItems[0]) => {
    console.log('Card clicked:', item);
    // Navigate to detail page
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Knowledge Hub Content
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive collection of articles, research reports, case studies, 
              expert interviews, and multimedia content designed to help you succeed in the digital age.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentItems.map((item) => (
              <ContentItemCard
                key={item.id}
                {...item}
                isBookmarked={bookmarkedItems.has(item.id)}
                onToggleBookmark={() => handleToggleBookmark(item.id)}
                onClick={() => handleCardClick(item)}
              />
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Articles & Reports</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">100+</div>
              <div className="text-gray-600">Expert Interviews</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Video Tutorials</div>
            </div>
          </div>
        </div>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default ContentShowcase;
