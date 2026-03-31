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
  ChevronRight,
  CheckCircle,
  Clock,
  MessageSquare
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
                  Work smarter. Collaborate better. Grow faster.
                </h1>
                
                {/* Sub-headline */}
                <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-4xl mx-auto">
                  DWS is a modern digital working space designed for professionals and teams who need more than just a desk. From focused workdays to team collaboration and client meetings, DWS gives you the environment, flexibility, and smart support to move work forward.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate("/forms/tour-request")}
                    className="px-8 py-4 bg-primary hover:bg-primary-600 text-white font-bold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center text-lg"
                  >
                    Book a Tour
                    <ArrowRight size={20} className="ml-2" />
                  </button>
                  
                  <button
                    onClick={() => {
                      const spacesSection = document.getElementById('spaces-section');
                      if (spacesSection) {
                        spacesSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold rounded-lg transform transition-all duration-300 hover:scale-105 flex items-center justify-center text-lg"
                  >
                    Explore Spaces
                  </button>
                </div>
              </FadeInUpOnScroll>
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text */}
              <div>
                <FadeInUpOnScroll>
                  <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-8">
                    More than a workspace
                  </h2>
                  
                  <p className="text-xl text-gray-700 leading-relaxed mb-8">
                    DWS is built for the realities of modern work. It is where focus meets flexibility, 
                    collaboration meets professionalism, and everyday work turns into meaningful progress.
                  </p>

                  <div className="space-y-6">
                    {/* Feature 1 */}
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                          Professional Environment
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          Step into a space designed for serious work. From client meetings to focused deep work, 
                          DWS provides the professional atmosphere that elevates your business presence.
                        </p>
                      </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                          Flexible Solutions
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          Whether you need a dedicated desk for daily focus, a private office for your team, 
                          or meeting rooms for important presentations, DWS adapts to how you work best.
                        </p>
                      </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                          Smart Infrastructure
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          High-speed internet, modern technology, and thoughtfully designed spaces that reduce 
                          friction and keep you focused on what matters most - your work and growth.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-8">
                    <button
                      onClick={() => navigate("/forms/tour-request")}
                      className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Explore Spaces
                      <ArrowRight size={18} className="ml-2" />
                    </button>
                  </div>
                </FadeInUpOnScroll>
              </div>

              {/* Right Column - Images */}
              <div className="relative lg:ml-auto lg:w-full">
                <FadeInUpOnScroll>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Main Image */}
                    <div className="col-span-2">
                      <img
                        src="/DWS images/DWS1.jpg"
                        alt="Modern workspace collaboration"
                        className="w-full h-80 object-cover rounded-2xl shadow-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='16'%3EWorkspace Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    
                    {/* Secondary Images */}
                    <div>
                      <img
                        src="/DWS images/DWS2.jpg"
                        alt="Professional work environment"
                        className="w-full h-40 object-cover rounded-xl shadow-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%23e5e7eb'/%3E%3Ctext x='100' y='75' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='12'%3EWorkspace%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    
                    <div>
                      <img
                        src="/DWS images/DWS3.jpg"
                        alt="Collaborative meeting space"
                        className="w-full h-40 object-cover rounded-xl shadow-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%23e5e7eb'/%3E%3Ctext x='100' y='75' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='12'%3EMeeting%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  </div>
                </FadeInUpOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* Why DWS Section */}
        <section className="py-20 bg-gradient-to-r from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <FadeInUpOnScroll>
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
                    A workspace designed around outcomes
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    At DWS, every experience is built to support better work. Whether you need a space for focus, 
                    collaboration, or growth, DWS is designed to enhance your professional journey.
                  </p>
                </div>
              </FadeInUpOnScroll>

              <StaggeredFadeIn className="grid md:grid-cols-3 gap-8" staggerDelay={0.1}>
                {/* Growth */}
                <div className="text-center group">
                  <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-colors duration-300">
                    <Users size={32} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-4">Growth</h3>
                  <p className="text-gray-600 leading-relaxed">
                    A space that helps you connect faster, collaborate deeply, and scale with confidence.
                  </p>
                </div>

                {/* Workflow */}
                <div className="text-center group">
                  <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-colors duration-300">
                    <Zap size={32} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-4">Workflow</h3>
                  <p className="text-gray-600 leading-relaxed">
                    An environment designed to streamline how you meet, create, and get things done.
                  </p>
                </div>

                {/* Smart */}
                <div className="text-center group">
                  <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-colors duration-300">
                    <Globe size={32} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-4">Smart</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Work in an environment enhanced by simple, intelligent systems that reduce friction and keep you focused.
                  </p>
                </div>
              </StaggeredFadeIn>
            </div>
          </div>
        </section>

        {/* Space Offerings Section */}
        <section id="spaces-section" className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text */}
              <div>
                <FadeInUpOnScroll>
                  <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-8">
                    Spaces designed for every work style
                  </h2>
                  
                  <p className="text-xl text-gray-700 leading-relaxed mb-8">
                    Our workspace offers flexible options to support different ways of working, from individual focus to team collaboration.
                  </p>

                  <div className="space-y-6">
                    {/* Feature 1 */}
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                          Dedicated Desks
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          Personal workstations with storage and consistent setup for professionals who need a reliable, focused environment every day.
                        </p>
                      </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                          Private Offices
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          Fully enclosed spaces equipped for teams that require privacy, confidentiality, and room to collaborate without distractions.
                        </p>
                      </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                          Meeting Rooms
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          Professional meeting spaces available for presentations, client meetings, workshops, and collaborative sessions of all sizes.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-8">
                    <button
                      onClick={() => navigate("/forms/tour-request")}
                      className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Explore Spaces
                      <ArrowRight size={18} className="ml-2" />
                    </button>
                  </div>
                </FadeInUpOnScroll>
              </div>

              {/* Right Column - Video */}
              <div className="relative lg:ml-auto lg:w-full">
                <FadeInUpOnScroll>
                  <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gray-100">
                    <video
                      className="w-full h-auto min-h-[400px]"
                      controls
                      poster="/DWS images/DWS-BG.jpg"
                      preload="metadata"
                      playsInline
                    >
                      <source src="/DWS images/Landing page promo (DWS).mp4" type="video/mp4" />
                      
                      {/* Fallback content for unsupported browsers */}
                      <div className="flex items-center justify-center h-64 bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="text-center p-8">
                          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Building2 size={40} className="text-primary" />
                          </div>
                          <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                            DWS Spaces Video Tour
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Your browser doesn't support video playback.
                          </p>
                          <a 
                            href="/DWS images/Landing page promo (DWS).mp4" 
                            className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-600 text-white font-semibold rounded-lg transition-all duration-300"
                            download
                          >
                            Download Video
                            <ArrowRight size={18} className="ml-2" />
                          </a>
                        </div>
                      </div>
                    </video>
                  </div>
                </FadeInUpOnScroll>
              </div>
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
                      Book a Tour
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