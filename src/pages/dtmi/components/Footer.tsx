import React from "react";
import { ArrowRight, ArrowUp } from "lucide-react";
export function DtmiFooter() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <footer className="bg-brand-navy text-white relative">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Newsletter Section */}
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">
              Keep up with what's next in Digital Transformation
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Subscribe to the DQ Newsletter
            </p>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email <span className="text-brand-coral">*</span>
                </label>
                <div className="flex items-center bg-white/5 border border-white/15 rounded-full overflow-hidden focus-within:border-white/40 transition-colors">
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="flex-1 bg-transparent text-white placeholder-white/60 px-5 py-3 h-12 focus:outline-none text-base"
                  />
                  <button
                    type="submit"
                    className="h-12 px-5 bg-brand-coral text-white flex items-center justify-center hover:bg-brand-coral/90 transition-colors"
                    aria-label="Submit email"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </form>
          </div>
          {/* Navigation Links */}
          <div className="grid grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Services</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-brand-coral transition-colors"
                  >
                    Primary Sector
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-brand-coral transition-colors"
                  >
                    Secondary Sector
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-brand-coral transition-colors"
                  >
                    Tertiary Sector
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-brand-coral transition-colors"
                  >
                    Quaternary Sector
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-brand-coral transition-colors"
                  >
                    Quinary Sector
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Products</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-brand-coral transition-colors"
                  >
                    TMaaS
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-brand-coral transition-colors"
                  >
                    DTMP
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-brand-coral transition-colors"
                  >
                    DTO4T
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-brand-coral transition-colors"
                  >
                    DTMA
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-brand-coral transition-colors"
                  >
                    DTMB
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-brand-coral transition-colors"
                  >
                    DTMI
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">About</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-brand-coral transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-brand-coral transition-colors"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-white text-brand-navy p-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
        aria-label="Scroll to top"
      >
        <ArrowUp size={24} />
      </button>
      {/* Bottom Bar with Logo */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <img
            src="/DQ_Logo_White_%281%29.svg"
            alt="DigitalQatalyst"
            className="h-10"
          />
        </div>
      </div>
    </footer>
  );
}
