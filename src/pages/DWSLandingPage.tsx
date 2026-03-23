import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { 
  ArrowRight, 
  MapPin, 
  Users, 
  Zap, 
  Globe, 
  Building2,
  Quote,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { FadeInUpOnScroll, StaggeredFadeIn } from "../components/AnimationUtils";

// Office Spaces Carousel Component
const OfficeSpacesCarousel: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const officeSpaces = [
    {
      id: 1,
      title: "Open Collaboration Areas",
      description: "Spacious areas designed for team meetings, brainstorming sessions, and collaborative work with integrated AI tools.",
      icon: <Building2 size={48} />,
      gradient: "from-primary-100 to-primary-200",
      iconColor: "text-primary-600",
      textColor: "text-primary-700",
      image: "/DWS images/DWS1.jpg"
    },
    {
      id: 2,
      title: "AI-Integrated Workstations",
      description: "Individual workspaces equipped with high-performance computers, AI software, and productivity tools.",
      icon: <Zap size={48} />,
      gradient: "from-blue-100 to-blue-200",
      iconColor: "text-blue-600",
      textColor: "text-blue-700",
      image: "/DWS images/DWS2.jpg"
    },
    {
      id: 3,
      title: "Smart Meeting Rooms",
      description: "Private meeting spaces with video conferencing, digital whiteboards, and presentation technology.",
      icon: <Users size={48} />,
      gradient: "from-green-100 to-green-200",
      iconColor: "text-green-600",
      textColor: "text-green-700",
      image: "/DWS images/DWS3.jpg"
    }
  ];

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % officeSpaces.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [officeSpaces.length]);

  // Update carousel position when currentSlide changes
  useEffect(() => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: currentSlide * slideWidth,
        behavior: 'smooth'
      });
    }
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % officeSpaces.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + officeSpaces.length) % officeSpaces.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative">
      {/* Main Carousel */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl">
        <div
          ref={carouselRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {officeSpaces.map((space) => (
            <div key={space.id} className="min-w-full">
              <div className="relative h-96 md:h-[500px] overflow-hidden">
                {/* Background Image */}
                <img
                  src={space.image}
                  alt={space.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to gradient if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const gradientDiv = parent.querySelector('.gradient-fallback');
                      if (gradientDiv) {
                        (gradientDiv as HTMLElement).style.display = 'flex';
                      }
                    }
                  }}
                />
                
                {/* Gradient Fallback (hidden by default) */}
                <div className={`gradient-fallback absolute inset-0 bg-gradient-to-br ${space.gradient} items-center justify-center hidden`}>
                  <div className="text-center">
                    <div className={`${space.iconColor} mx-auto mb-4`}>
                      {space.icon}
                    </div>
                    <p className={`${space.textColor} font-medium text-lg`}>
                      {space.title}
                    </p>
                  </div>
                </div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
                  <div className="p-8 md:p-12 text-white w-full">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                      {space.title}
                    </h3>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                      {space.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center mt-6 gap-2">
        {officeSpaces.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? "bg-primary w-8" 
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const DWSLandingPage: React.FC = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <Zap size={20} strokeWidth={1.5} />,
      title: "AI-Integrated Workstations",
      description: "High-performance setups with AI tools built-in for maximum productivity"
    },
    {
      icon: <Users size={20} strokeWidth={1.5} />,
      title: "Collaborative Spaces",
      description: "Designed for seamless human-machine collaboration and team innovation"
    },
    {
      icon: <Globe size={20} strokeWidth={1.5} />,
      title: "Global Network Access",
      description: "Connect with digital workers worldwide through our expanding studio network"
    },
    {
      icon: <Building2 size={20} strokeWidth={1.5} />,
      title: "Premium Infrastructure",
      description: "Enterprise-grade connectivity, security, and digital transformation tools"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-secondary-900 via-secondary-800 to-secondary-700 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/DWS images/DWS-BG.jpg"
              alt="Digital Working Studios"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to gradient if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-secondary-900/50"></div>
          </div>

          {/* Background Pattern (subtle overlay) */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-2xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <FadeInUpOnScroll>
                {/* Location Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-full text-sm font-semibold mb-6">
                  <MapPin size={16} className="mr-2" />
                  Now Open in Nairobi, Kenya
                </div>
                
                {/* Main Headline */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  DIGITAL WORKING STUDIOS
                </h1>
                
                {/* Sub-headline */}
                <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
                  More than a desk. An intelligent workspace that blends physical and digital tools 
                  to boost how you collaborate, produce, and innovate.
                </p>

                {/* CTA Button */}
                <button
                  onClick={() => navigate("/forms/tour-request")}
                  className="px-8 py-4 bg-primary hover:bg-primary-600 text-white font-bold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center mx-auto text-lg"
                >
                  BOOK A TOUR
                  <ArrowRight size={20} className="ml-2" />
                </button>
              </FadeInUpOnScroll>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <FadeInUpOnScroll>
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Left Column - Text Content */}
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                        Built by Digital Builders, for Digital Workers.
                      </h2>
                      <div className="w-16 h-1 bg-primary mb-6"></div>
                    </div>
                    
                    <p className="text-lg text-gray-700 leading-relaxed">
                      We didn't start by designing a coworking space. We started by building a world-class 
                      Digital Work System (DWS) for ourselves. The result is Digital Working Studios (DWS)—the 
                      physical home of that system.
                    </p>
                    
                    <p className="text-lg text-gray-600 leading-relaxed">
                      You're not just renting a desk; you're plugging into an environment designed by a 
                      digital transformation company, for people who want to work smarter.
                    </p>
                  </div>

                  {/* Right Column - Image */}
                  <div className="relative">
                    <div className="relative rounded-2xl overflow-hidden shadow-xl">
                      {/* Main image */}
                      <div className="aspect-[4/3]">
                        <img
                          src="/DWS images/Digitalworker.jpg"
                          alt="Digital Working Studios Overview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to gradient if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full bg-gradient-to-br from-secondary-100 via-primary-50 to-secondary-50 flex items-center justify-center">
                                  <div class="text-center p-8">
                                    <div class="w-16 h-16 mx-auto mb-4 text-primary opacity-60">
                                      <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    </div>
                                    <p class="text-secondary-700 font-medium text-lg">Digital Working Studios</p>
                                    <p class="text-gray-600 text-sm mt-2">Where Innovation Meets Productivity</p>
                                  </div>
                                </div>
                              `;
                            }
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary-100/50 rounded-full blur-3xl"></div>
                  </div>
                </div>
              </FadeInUpOnScroll>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gradient-to-r from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <FadeInUpOnScroll>
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                    Why Choose Digital Working Studios?
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Experience the future of work with our intelligently designed spaces and cutting-edge technology.
                  </p>
                </div>
              </FadeInUpOnScroll>

              <StaggeredFadeIn className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
                {benefits.map((benefit, index) => (
                  <div key={index} className="group relative">
                    {/* Card */}
                    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 h-full flex flex-col">
                      {/* Icon Container */}
                      <div className="relative mb-6">
                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto border border-primary-100 group-hover:border-primary-200 transition-all duration-300 group-hover:bg-primary-100">
                          <div className="text-primary group-hover:text-primary-600 transition-colors duration-300">
                            {React.cloneElement(benefit.icon as React.ReactElement, { 
                              size: 20,
                              strokeWidth: 1.5 
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-center flex-grow flex flex-col">
                        <h3 className="text-lg font-semibold text-secondary-900 mb-3 leading-tight">
                          {benefit.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                          {benefit.description}
                        </p>
                      </div>

                      {/* Subtle hover accent */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-25 to-primary-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </div>

                    {/* Minimalistic accent dot */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300"></div>
                  </div>
                ))}
              </StaggeredFadeIn>
            </div>
          </div>
        </section>

        {/* Office Spaces Showcase Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <FadeInUpOnScroll>
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                    Explore Our Workspace
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Step inside our intelligently designed spaces where innovation meets productivity.
                  </p>
                </div>
              </FadeInUpOnScroll>

              {/* Office Spaces Carousel */}
              <FadeInUpOnScroll delay={0.2}>
                <OfficeSpacesCarousel navigate={navigate} />
              </FadeInUpOnScroll>
            </div>
          </div>
        </section>

        {/* Location & Contact Section */}
        <section className="py-20 bg-gradient-to-r from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <FadeInUpOnScroll>
                <div className="mb-12">
                  <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
                    <Building2 size={16} className="mr-2" />
                    Babadogo, Nairobi
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
                    Ready to Transform Your Work Experience?
                  </h2>
                  
                  <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                    Join the digital transformation revolution. Book a tour of our Nairobi studio and discover 
                    how Digital Working Studios can accelerate your productivity and innovation.
                  </p>

                  <div className="flex justify-center">
                    <button
                      onClick={() => navigate("/forms/tour-request")}
                      className="px-8 py-4 bg-primary hover:bg-primary-600 text-white font-bold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center"
                    >
                      Book Studio Tour
                      <ArrowRight size={20} className="ml-2" />
                    </button>
                  </div>
                </div>
              </FadeInUpOnScroll>
            </div>
          </div>
        </section>

      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default DWSLandingPage;