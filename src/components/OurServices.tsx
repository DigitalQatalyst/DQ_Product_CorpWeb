import React from "react";
import { ArrowRight, Newspaper, Cloud } from "lucide-react";
import { FadeInUpOnScroll } from "./AnimationUtils";

const OurServices: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Services to transform, and future-proof your business
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Our services
              </h2>
            </div>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              No matter your size, industry, or sector, we know what you need to thrive as a Digital 
              Organisation. Stop wasting time and money on ineffective transformations. Unlock real 
              business impact and achieve sustainable growth With DQ's proven initiatives.
            </p>
            
            <p className="text-base text-gray-600 leading-relaxed">
              Explore our services and start your digital transformation journey with us!
            </p>
            
            <button className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              Explore All Services
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>

          {/* Right Service Cards */}
          <div className="space-y-6">
            {/* Design 4.0 Card */}
            <FadeInUpOnScroll delay={0.1}>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Newspaper className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Design 4.0</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      Organisations must become Digital Cognitive Organisations (DCOs). We design 
                      every aspect of your transformation.
                    </p>
                    <button className="inline-flex items-center text-primary hover:text-primary-600 font-semibold text-sm transition-colors">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-2">
                        <ArrowRight className="w-3 h-3 text-white" />
                      </div>
                      Explore More
                    </button>
                  </div>
                </div>
              </div>
            </FadeInUpOnScroll>

            {/* Deploy 4.0 Card */}
            <FadeInUpOnScroll delay={0.2}>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Cloud className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Deploy 4.0</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      We implement, operate, and support any digital or technology solutions. We 
                      accelerate your transition into a DCO.
                    </p>
                    <button className="inline-flex items-center text-primary hover:text-primary-600 font-semibold text-sm transition-colors">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-2">
                        <ArrowRight className="w-3 h-3 text-white" />
                      </div>
                      Explore More
                    </button>
                  </div>
                </div>
              </div>
            </FadeInUpOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurServices;