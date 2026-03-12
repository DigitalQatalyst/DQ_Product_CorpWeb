import React, { useEffect, useState, useRef } from 'react';
import { TabsSimple } from '../TabVariations';
import { resourcesData, eventsData, mentorshipData, specializedServicesData } from '../../services/womenEcosystemData';
import { ExternalLinkIcon, BookOpenIcon, UsersIcon, SettingsIcon, ChevronLeftIcon, ChevronRightIcon, CalendarIcon, UserCheckIcon, ClockIcon, MapPinIcon, DollarSignIcon } from 'lucide-react';
import { MediaCard, CommunityCard, ServiceCard } from '../DigitalQatalyst Library/Cards';
// Define the platform offerings categories
const platformCategories = [{
  id: 'communities',
  title: 'Communities'
}, {
  id: 'resources',
  title: 'Resources'
}, {
  id: 'services',
  title: 'Services'
}, {
  id: 'events',
  title: 'Events & Workshops'
}, {
  id: 'mentorship',
  title: 'Mentorship'
}];
// Icon mapping for categories
const categoryIcons = {
  Communities: UsersIcon,
  Resources: BookOpenIcon,
  Services: SettingsIcon,
  'Events & Workshops': CalendarIcon,
  Mentorship: UserCheckIcon
};
// Type mapping for MediaCard
const typeMapping: Record<string, string> = {
  Communities: 'case-study',
  Resources: 'toolkit',
  Services: 'tool',
  'Events & Workshops': 'event',
  Mentorship: 'tool'
};
const PlatformOfferings: React.FC = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    // Handle mouse movement for dynamic background
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  const tabSections = platformCategories.map(category => ({
    id: category.id,
    title: category.title
  }));
  const activeCategory = platformCategories[activeTabIndex].id;
  
  // Get filtered data based on active category
  const getFilteredData = () => {
    switch (activeCategory) {
      case 'communities':
        return resourcesData.filter(resource => resource.type.toLowerCase() === 'communities');
      case 'resources':
        return resourcesData.filter(resource => resource.type.toLowerCase() === 'resources');
      case 'services':
        return resourcesData.filter(resource => resource.type.toLowerCase() === 'services');
      case 'events':
        return eventsData;
      case 'mentorship':
        return mentorshipData;
      default:
        return [];
    }
  };
  
  const filteredData = getFilteredData();
  // Check scroll position to show/hide scroll buttons
  const checkScrollPosition = () => {
    if (!carouselRef.current) return;
    const {
      scrollLeft,
      scrollWidth,
      clientWidth
    } = carouselRef.current;
    setShowLeftScroll(scrollLeft > 20);
    setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 20);
  };
  // Handle scroll buttons
  const handleScroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = direction === 'left' ? -300 : 300;
    carouselRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScrollPosition);
      // Initial check
      checkScrollPosition();
      return () => carousel.removeEventListener('scroll', checkScrollPosition);
    }
  }, [filteredData]);
  // Reset scroll position when category changes
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = 0;
      checkScrollPosition();
    }
  }, [activeTabIndex]);
  // Calculate background position based on mouse movement
  const bgPositionX = 50 + (mousePosition.x - 0.5) * 10;
  const bgPositionY = 50 + (mousePosition.y - 0.5) * 10;
  // Enhanced descriptions for resources to make them more full
  const getEnhancedDescription = (resource: any) => {
    const baseDescription = resource.description;
    const organization = resource.organization;
    // Add more context based on resource type
    switch (resource.type.toLowerCase()) {
      case 'communities':
        return `${baseDescription} Connect with like-minded entrepreneurs and industry experts to share knowledge, experiences, and opportunities through ${organization}.`;
      case 'services':
        return `${baseDescription} This comprehensive service provided by ${organization} offers tailored solutions to help accelerate your business growth and overcome challenges.`;
      default:
        return `${organization} - ${baseDescription} Access valuable insights and practical tools designed to empower women entrepreneurs at every stage of their business journey.`;
    }
  };
  // Map resource to appropriate card component
  const renderResourceCard = (item: any) => {
    // Handle different data structures based on category
    if (activeCategory === 'events') {
      return (
        <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 text-primary">
              <CalendarIcon size={20} />
              <span className="text-sm font-medium">{item.type}</span>
            </div>
            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
              {item.price}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
          <p className="text-gray-600 text-sm mb-4 flex-grow">{item.description}</p>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ClockIcon size={16} />
              <span>{item.date} • {item.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPinIcon size={16} />
              <span>{item.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <UsersIcon size={16} />
              <span>{item.capacity} participants</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-auto">
            <span className="text-sm text-gray-500">By {item.organizer}</span>
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
              Register
            </button>
          </div>
        </div>
      );
    }
    
    if (activeCategory === 'mentorship') {
      return (
        <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
          <div className="flex items-start gap-4 mb-4">
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-full object-cover" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
              <p className="text-primary font-medium text-sm">{item.title}</p>
              <p className="text-gray-500 text-sm">{item.experience}</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4 flex-grow">{item.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {item.expertise.map((skill: string, index: number) => (
              <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
          <div className="space-y-2 mb-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <MapPinIcon size={16} />
              <span>{item.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <UsersIcon size={16} />
              <span>{item.availability}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Languages: {item.languages.join(', ')}</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-auto">
            <a href={item.linkedin} className="text-primary font-medium hover:text-primary-dark transition-colors text-sm">
              View Profile
            </a>
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
              Request Mentorship
            </button>
          </div>
        </div>
      );
    }
    
    // Handle original resource types
    const enhancedDescription = getEnhancedDescription(item);
    switch (item.type?.toLowerCase()) {
      case 'communities':
        return <CommunityCard key={item.id} item={{
          id: item.id,
          name: item.title,
          description: enhancedDescription,
          memberCount: Math.floor(Math.random() * 500) + 100,
          category: item.category,
          tags: [item.category, 'Networking', 'Collaboration'],
          imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
          activityLevel: 'high'
        }} onJoin={() => window.open(item.link, '_blank')} onViewDetails={() => window.open(item.link, '_blank')} />;
      case 'services':
        return <ServiceCard key={item.id} item={{
          id: item.id,
          title: item.title,
          provider: item.organization,
          description: enhancedDescription,
          tags: [item.category, 'Support', 'Business Growth'],
          providerLogoUrl: 'https://via.placeholder.com/150'
        }} onApply={() => window.open(item.link, '_blank')} onLearnMore={() => window.open(item.link, '_blank')} />;
      default:
        return (
          <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpenIcon className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.organization}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4 flex-grow">{enhancedDescription}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">{item.category}</span>
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Knowledge Resource</span>
            </div>
            <div className="flex justify-between items-center mt-auto">
              <a href={item.link} className="text-primary font-medium hover:text-primary-dark transition-colors text-sm">
                View Details
              </a>
              <button 
                onClick={() => window.open(item.link, '_blank')}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        );
    }
  };
  return <section className="py-16 md:py-24 relative overflow-hidden" style={{
    background: `linear-gradient(135deg, rgba(0, 48, 227, 0.03) 0%, rgba(0, 229, 209, 0.05) 50%, rgba(149, 75, 249, 0.03) 100%)`,
    backgroundPosition: `${bgPositionX}% ${bgPositionY}%`,
    transition: 'background-position 0.5s ease-out'
  }}>
      {/* Dynamic background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" style={{
        transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
        transition: 'transform 0.8s ease-out'
      }}></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-teal/10 blur-3xl" style={{
        transform: `translate(${-mousePosition.x * 20}px, ${-mousePosition.y * 20}px)`,
        transition: 'transform 0.8s ease-out'
      }}></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-purple/10 blur-3xl" style={{
        transform: `translate(${mousePosition.y * 15}px, ${-mousePosition.x * 15}px)`,
        transition: 'transform 0.8s ease-out'
      }}></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4 font-display">
            Discover What the Platform Offers
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Explore the communities you can join, the resources you can access,
            and the services you can apply for — all through the Enterprise
            Journey platform.
          </p>
        </div>
        {/* Custom styled tabs */}
        <div className="mb-10">
          <div className="flex justify-center mb-2">
            <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm border border-gray-100/50">
              {tabSections.map((section, index) => {
              const isActive = activeTabIndex === index;
              const CategoryIcon = categoryIcons[section.title as keyof typeof categoryIcons] || BookOpenIcon;
              return <button key={section.id} onClick={() => setActiveTabIndex(index)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 ${isActive ? 'bg-primary text-white shadow-md' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`} aria-selected={isActive} role="tab">
                    <CategoryIcon size={18} />
                    <span className="font-medium">{section.title}</span>
                  </button>;
            })}
            </div>
          </div>
        </div>
        {/* Horizontal scrollable cards with scroll buttons */}
        <div className="relative">
          {/* Scroll buttons */}
          <button onClick={() => handleScroll('left')} className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2.5 rounded-full shadow-md text-primary hover:bg-primary hover:text-white transition-all ${showLeftScroll ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-label="Scroll left">
            <ChevronLeftIcon size={24} />
          </button>
          <button onClick={() => handleScroll('right')} className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2.5 rounded-full shadow-md text-primary hover:bg-primary hover:text-white transition-all ${showRightScroll ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-label="Scroll right">
            <ChevronRightIcon size={24} />
          </button>
          {/* Left fade gradient */}
          <div className={`absolute left-0 top-0 bottom-0 w-16 z-[1] bg-gradient-to-r from-[rgba(249,250,252,0.9)] to-transparent pointer-events-none transition-opacity duration-300 ${showLeftScroll ? 'opacity-100' : 'opacity-0'}`}></div>
          {/* Right fade gradient */}
          <div className={`absolute right-0 top-0 bottom-0 w-16 z-[1] bg-gradient-to-l from-[rgba(249,250,252,0.9)] to-transparent pointer-events-none transition-opacity duration-300 ${showRightScroll ? 'opacity-100' : 'opacity-0'}`}></div>
          {/* Scrollable container with fixed width cards */}
          <div ref={carouselRef} className="flex gap-6 overflow-x-auto pb-8 px-4 snap-x snap-mandatory no-scrollbar" style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
            {filteredData.map(item => <div key={item.id} className="min-w-[320px] w-[320px] flex-shrink-0 snap-start h-[500px]">
                {renderResourceCard(item)}
              </div>)}
          </div>
        </div>
        <div className="mt-12 text-center">
          <a href="#platform-features" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all">
            Explore All Platform Features
            <ExternalLinkIcon size={18} />
          </a>
        </div>
      </div>
    </section>;
};
export default PlatformOfferings;