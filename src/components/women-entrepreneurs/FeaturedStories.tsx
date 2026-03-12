import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon } from 'lucide-react';
import { featuredStories, storyCategories } from '../services/womenEcosystemData';
const FeaturedStories: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);
  const filteredStories = activeCategory === 'all' ? featuredStories : featuredStories.filter(story => story.category.toLowerCase() === activeCategory.toLowerCase());
  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const {
        current
      } = carouselRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth / 1.5 : current.offsetWidth / 1.5;
      current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  // Check scroll position to show/hide fade gradients
  const checkScrollPosition = () => {
    if (!carouselRef.current) return;
    const {
      scrollLeft,
      scrollWidth,
      clientWidth
    } = carouselRef.current;
    setShowLeftFade(scrollLeft > 20);
    setShowRightFade(scrollLeft < scrollWidth - clientWidth - 20);
  };
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScrollPosition);
      // Initial check
      checkScrollPosition();
      return () => carousel.removeEventListener('scroll', checkScrollPosition);
    }
  }, [filteredStories]);
  // Reset scroll position when category changes
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = 0;
      checkScrollPosition();
    }
  }, [activeCategory]);
  return <section id="featured-stories" className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary font-display">
              Featured Entrepreneur Stories
            </h2>
            <p className="text-gray-600 mt-2">
              Inspiring journeys of women leaders transforming industries across
              the UAE
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll('left')} className={`p-2 rounded-full ${showLeftFade ? 'bg-primary/10 text-primary hover:bg-primary hover:text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} transition-colors`} aria-label="Scroll left" disabled={!showLeftFade}>
              <ChevronLeftIcon size={20} />
            </button>
            <button onClick={() => scroll('right')} className={`p-2 rounded-full ${showRightFade ? 'bg-primary/10 text-primary hover:bg-primary hover:text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} transition-colors`} aria-label="Scroll right" disabled={!showRightFade}>
              <ChevronRightIcon size={20} />
            </button>
          </div>
        </div>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
          {storyCategories.map(category => <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${activeCategory === category.id ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {category.title}
            </button>)}
        </div>
        <div className="relative">
          {/* Left fade gradient */}
          <div className={`absolute left-0 top-0 bottom-0 w-16 z-[5] bg-gradient-to-r from-white to-transparent pointer-events-none transition-opacity duration-300 ${showLeftFade ? 'opacity-100' : 'opacity-0'}`}></div>
          {/* Right fade gradient */}
          <div className={`absolute right-0 top-0 bottom-0 w-16 z-[5] bg-gradient-to-l from-white to-transparent pointer-events-none transition-opacity duration-300 ${showRightFade ? 'opacity-100' : 'opacity-0'}`}></div>
          <div ref={carouselRef} className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory no-scrollbar" style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }} onScroll={checkScrollPosition}>
            {filteredStories.map(story => <div key={story.id} className="min-w-[320px] max-w-[380px] flex-shrink-0 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 snap-start animate-fadeIn group">
                <div className="h-48 overflow-hidden">
                  <img src={story.image} alt={story.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">{story.name}</h3>
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      {story.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                    <MapPinIcon size={16} />
                    <span>{story.region}</span>
                    <span className="mx-1">•</span>
                    <span>{story.sector}</span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {story.story}
                  </p>
                  <a href={`#story-${story.id}`} className="text-primary font-medium hover:text-primary-dark transition-colors inline-flex items-center group">
                    Read full story
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>)}
          </div>
        </div>
        {/* <div className="mt-8 text-center">
          <a href="#all-stories" className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary hover:text-white text-primary px-6 py-3 rounded-lg font-medium transition-colors duration-300">
            View All Stories
            <ExternalLinkIcon size={18} />
          </a>
        </div> */}
      </div>
    </section>;
};
export default FeaturedStories;