import React, { useState, useRef } from 'react';
import { ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';
import { MediaCard } from '../Cards/MediaCard';
// Updated featured programs data with UAE-specific content
const featuredPrograms = [{
  id: 'program1',
  title: 'NAMA Growth Lab',
  provider: 'NAMA Women Advancement',
  emirate: 'Sharjah',
  description: 'Incubator program focused on women-led social enterprises addressing UAE community challenges.',
  image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1374&auto=format&fit=crop',
  ctaLabel: 'Learn More',
  ctaLink: '#apply',
  keyInitiatives: ['Social Enterprise Incubation', 'Seed Funding for Community Solutions', 'Mentorship from Industry Leaders']
}, {
  id: 'program2',
  title: 'Creative Entrepreneurs Network',
  provider: 'Dubai Culture',
  emirate: 'Dubai',
  description: 'Supporting women in creative industries through mentorship and global exposure.',
  image: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=1374&auto=format&fit=crop',
  ctaLabel: 'Learn More',
  ctaLink: '#apply',
  keyInitiatives: ['Creative Industry Workshops', 'International Exhibition Opportunities', 'Networking with Global Creatives']
}, {
  id: 'program3',
  title: 'SheTech Accelerator',
  provider: 'Hub71',
  emirate: 'Abu Dhabi',
  description: 'Empowering female-led startups in AI, fintech, and sustainability.',
  image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1470&auto=format&fit=crop',
  ctaLabel: 'Learn More',
  ctaLink: '#apply',
  keyInitiatives: ['Startup Acceleration Program', 'Tech Venture Investment', 'Global Market Access Support']
}, {
  id: 'program4',
  title: 'Female Founders Academy',
  provider: 'Khalifa Fund',
  emirate: 'Nationwide',
  description: 'Entrepreneurship readiness and scaling program for UAE women innovators.',
  image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1470&auto=format&fit=crop',
  ctaLabel: 'Learn More',
  ctaLink: '#apply',
  keyInitiatives: ['Business Plan Development', 'Leadership Training', 'Funding Preparation']
}, {
  id: 'program5',
  title: 'Women in FinTech Fellowship',
  provider: 'DIFC FinTech Hive',
  emirate: 'Dubai',
  description: 'Mentorship and funding program for women-led financial technology startups and scale-ups.',
  image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1470&auto=format&fit=crop',
  ctaLabel: 'Learn More',
  ctaLink: '#apply',
  keyInitiatives: ['FinTech Mentorship Program', 'Investor Networking Events', 'Regulatory Sandbox Access']
}, {
  id: 'program6',
  title: 'Agritech Innovation Program',
  provider: 'Al Ain University',
  emirate: 'Al Ain',
  description: 'Specialized program for women entrepreneurs developing sustainable agriculture solutions.',
  image: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?q=80&w=1470&auto=format&fit=crop',
  ctaLabel: 'Learn More',
  ctaLink: '#apply',
  keyInitiatives: ['Sustainable Farming Innovation', 'AgTech Research Grants', 'Food Security Solutions Development']
}];
const ProgramsInitiatives: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visiblePrograms, setVisiblePrograms] = useState(featuredPrograms.slice(0, 3));
  // Handle navigation
  const handleNext = () => {
    const nextIndex = Math.min(activeIndex + 1, featuredPrograms.length - 3);
    setActiveIndex(nextIndex);
    setVisiblePrograms(featuredPrograms.slice(nextIndex, nextIndex + 3));
  };
  const handlePrev = () => {
    const prevIndex = Math.max(activeIndex - 1, 0);
    setActiveIndex(prevIndex);
    setVisiblePrograms(featuredPrograms.slice(prevIndex, prevIndex + 3));
  };
  // Handle dot navigation
  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    setVisiblePrograms(featuredPrograms.slice(index, index + 3));
  };
  return <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4 font-display">
            Featured Women Entrepreneurship Programs
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Discover flagship programs and partnerships empowering women
            founders across the UAE.
          </p>
        </div>
        <div className="relative mt-8">
          {/* Navigation buttons */}
          <button onClick={handlePrev} className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 p-2.5 rounded-full shadow-md text-primary hover:bg-primary hover:text-white transition-all duration-300 ${activeIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`} aria-label="Previous programs" disabled={activeIndex === 0}>
            <ChevronLeftIcon size={24} />
          </button>
          <button onClick={handleNext} className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 p-2.5 rounded-full shadow-md text-primary hover:bg-primary hover:text-white transition-all duration-300 ${activeIndex >= featuredPrograms.length - 3 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`} aria-label="Next programs" disabled={activeIndex >= featuredPrograms.length - 3}>
            <ChevronRightIcon size={24} />
          </button>
          <div className="px-10" ref={carouselRef}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visiblePrograms.map(program => <div key={program.id} className="flex h-full">
                  <MediaCard type="report" title={program.title} description={`${program.provider} | ${program.emirate} - ${program.description}`} image={program.image} badges={program.keyInitiatives} cta={{
                label: program.ctaLabel,
                href: program.ctaLink
              }} secondaryCta={{
                label: 'View Details',
                href: `#details-${program.id}`,
                icon: <ChevronRightIcon size={16} />
              }} data-id={`program-card-${program.id}`} />
                </div>)}
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <div className="flex gap-1.5">
            {Array.from({
            length: Math.max(1, featuredPrograms.length - 2)
          }).map((_, index) => <button key={index} onClick={() => handleDotClick(index)} className={`w-2 h-2 rounded-full ${activeIndex === index ? 'bg-primary' : 'bg-gray-300'} transition-all duration-300`} aria-label={`Go to slide ${index + 1}`} />)}
          </div>
        </div>
      </div>
    </section>;
};
export default ProgramsInitiatives;