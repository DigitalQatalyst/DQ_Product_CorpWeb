import React from "react";
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
  ChevronDown
} from "lucide-react";
import { 
  FadeInUpOnScroll, 
  StaggeredFadeIn, 
  AnimatedText 
} from "../components/AnimationUtils";

const DWSLandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section 
          className="relative w-full bg-gradient-to-r from-secondary-900 via-secondary-800 to-secondary-700 overflow-hidden"
          style={{ height: "100vh" }}
        >
          {/* Animated background image with zoom effect */}
          <div
            className="absolute inset-0 transition-transform duration-[3000ms] ease-out"
            style={{
              backgroundImage: "linear-gradient(rgba(3, 15, 53, 0.3), rgba(3, 15, 53, 0.3)), url('/DWS images/DWS-BG.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: "scale(1)",
            }}
            onError={(e) => {
              // Fallback to gradient if image fails to load
              const target = e.target as HTMLDivElement;
              target.style.backgroundImage = "linear-gradient(rgba(3, 15, 53, 0.8), rgba(3, 15, 53, 0.8))";
            }}
          />

          {/* Animated gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple/30 mix-blend-multiply"
            style={{
              animation: "pulse-gradient 8s ease-in-out infinite alternate",
            }}
          />

          {/* Background Pattern (subtle overlay) */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-2xl"></div>
          </div>

          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-8">
              <FadeInUpOnScroll>
                {/* Location Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-full text-sm font-semibold mb-6">
                  <MapPin size={16} className="mr-2" />
                  Now Open in Nairobi, Kenya
                </div>
                
                {/* Main Headline */}
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-snug">
                  <AnimatedText
                    text="Work smarter. Collaborate better. Grow faster."
                    gap="1rem"
                  />
                </h1>
                
                {/* Sub-headline */}
                <p className="font-body text-xl text-white/90 mb-8">
                  Modern workspaces for professionals who need more than just a desk. Focus, collaborate, and grow with smart support.
                </p>
              </FadeInUpOnScroll>

              {/* CTA Buttons with animations */}
              <StaggeredFadeIn
                staggerDelay={0.2}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <button
                  onClick={() => navigate("/forms/tour-request")}
                  className="px-8 py-4 bg-primary hover:bg-primary-600 text-white font-bold rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-center justify-center text-lg overflow-hidden group"
                >
                  <span className="relative z-10">Book Your Space</span>
                  <ArrowRight
                    size={20}
                    className="ml-2 relative z-10 group-hover:translate-x-1 transition-transform duration-300"
                  />
                  {/* Ripple effect on hover */}
                  <span className="absolute inset-0 overflow-hidden rounded-lg">
                    <span className="absolute inset-0 bg-white/20 transform scale-0 opacity-0 group-hover:scale-[2.5] group-hover:opacity-100 rounded-full transition-all duration-700 origin-center"></span>
                  </span>
                </button>
                
                <button
                  onClick={() => {
                    const spacesSection = document.getElementById('spaces-section');
                    if (spacesSection) {
                      spacesSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-8 py-4 bg-white text-secondary-900 hover:bg-gray-50 font-bold rounded-lg shadow-lg flex items-center justify-center text-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  Explore Spaces
                  <ArrowRight size={20} className="ml-2" />
                </button>
              </StaggeredFadeIn>
            </div>
          </div>

          {/* Scroll indicator with animation */}
          <div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
            onClick={() => {
              const nextSection = document.querySelector("main > section:nth-child(2)");
              nextSection?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            <ChevronDown size={24} className="text-white" />
            <span className="sr-only">Scroll down</span>
          </div>

          {/* Add keyframes for gradient animation */}
          <style jsx>{`
            @keyframes pulse-gradient {
              0% {
                opacity: 0.4;
              }
              50% {
                opacity: 0.6;
              }
              100% {
                opacity: 0.4;
              }
            }
          `}</style>
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
                    Where focus meets flexibility. Work smarter, not harder.
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
                          Professional spaces that elevate your business presence.
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
                          Dedicated desks, private offices, or meeting rooms - we adapt to how you work.
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
                          High-speed internet and modern tech that keeps you focused on growth.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-8">
                    <button
                      onClick={() => {
                        const spacesSection = document.getElementById('spaces-section');
                        if (spacesSection) {
                          spacesSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
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
                    Built for better work. Designed for your success.
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
                    Flexible options for every way you work.
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
                          Your personal workspace with storage and consistent setup.
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
                          Enclosed spaces for teams that need privacy and collaboration.
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
                          Professional spaces for presentations, client meetings, and workshops.
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
                      Book Your Space
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
                    Join the digital transformation revolution. Book your space at our Nairobi studio and discover 
                    how Digital Working Studios can accelerate your productivity and innovation.
                  </p>

                  <div className="flex justify-center">
                    <button
                      onClick={() => navigate("/forms/tour-request")}
                      className="px-8 py-4 bg-primary hover:bg-primary-600 text-white font-bold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center"
                    >
                      Book Your Space
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