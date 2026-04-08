import React, { useState } from 'react';
import { ExternalLink, ArrowRight, ChevronDown, ChevronUp, Linkedin, Instagram } from 'lucide-react';
import { isValidEmail } from '../../utils/emailValidation';

// Custom X (Twitter) icon component
const XIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
interface FooterProps {
  'data-id'?: string;
  isLoggedIn?: boolean;
}
interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
}
function AccordionSection({
  title,
  children
}: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  return <div className="border-b border-gray-600 last:border-b-0">
    <button onClick={() => setIsOpen(!isOpen)} className="w-full py-4 flex items-center justify-between text-left" aria-expanded={isOpen}>
      <h3 className="font-semibold text-base text-white">{title}</h3>
      {isOpen ? <ChevronUp size={20} className="text-gray-300" /> : <ChevronDown size={20} className="text-gray-300" />}
    </button>
    {isOpen && <div className="pb-4">{children}</div>}
  </div>;
}
export function Footer({
  'data-id': dataId,
  isLoggedIn = false
}: FooterProps) {
  // Email validation function
  const validateEmail = (email: string) => {
    return isValidEmail(email);
  };

  // State for email input and validation
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value === '') {
      setIsValid(true);
    } else {
      setIsValid(validateEmail(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail(email)) {
      try {
        // Import the newsletter subscription service
        const { submitNewsletterSubscription } = await import('../../services/airtableService');
        
        // Submit to Airtable (which will also trigger email)
        await submitNewsletterSubscription({
          email: email,
          source: 'Footer',
          userAgent: navigator.userAgent,
        });
        
        setIsSubmitted(true);
        setEmail('');
        // Reset submission status after 3 seconds
        setTimeout(() => setIsSubmitted(false), 3000);
      } catch (error) {
        console.error('Newsletter subscription error:', error);
        setIsValid(false);
      }
    } else {
      setIsValid(false);
    }
  };

  // Full DQ Footer
  return <footer data-id={dataId} className="bg-secondary-900 text-white w-full">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        {/* Logo */}
        <div className="mb-6">
          <img
            src="/logo/dq-logo-white.svg"
            alt="DigitalQatalyst"
            className="h-10 w-auto"
          />
          <p className="text-sm text-gray-300 mt-2">Perfecting Life Transactions</p>
        </div>
        {/* Newsletter - Mobile Full Width */}
        <div className="mb-8">
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            Stay updated with the latest digital transformation insights, solutions, and
            innovations from DigitalQatalyst.
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 ${!isValid ? 'border-2 border-red-500' : 'border border-gray-300 focus:ring-primary'
                  }`}
                aria-label="Email address for newsletter"
                aria-invalid={!isValid}
                aria-describedby={!isValid ? 'email-error' : undefined}
              />
              {!isValid && (
                <p id="email-error" className="mt-1 text-sm text-red-200">
                  Please enter a valid email address
                </p>
              )}
              {isSubmitted && (
                <p className="mt-1 text-sm text-green-200">
                  Thank you for subscribing!
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white px-4 py-3 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary transition-colors font-medium"
              aria-label="Subscribe to newsletter"
              disabled={!email.trim()}
            >
              Subscribe
            </button>
          </form>
        </div>
        {/* Accordion Sections */}
        <div className="mb-8">
          <AccordionSection title="Company">
            <ul className="space-y-3">
              <li>
                <a href="/about-us" className="text-gray-300 hover:text-primary transition-colors text-sm block">
                  About DigitalQatalyst
                </a>
              </li>
              <li>
                <a href="/products" className="text-gray-300 hover:text-primary transition-colors text-sm block">
                  Products
                </a>
              </li>
              <li>
                <a href="/careers" className="text-gray-300 hover:text-primary transition-colors text-sm block">
                  Careers
                </a>
              </li>
              <li>
                <a href="/terms-of-service" className="text-gray-300 hover:text-primary transition-colors text-sm block">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="text-gray-300 hover:text-primary transition-colors text-sm block">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </AccordionSection>
          <AccordionSection title="Services">
            <ul className="space-y-3">
              <li>
                <a href="/services" className="text-gray-300 hover:text-primary transition-colors text-sm block">
                  Primary Sector
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-300 hover:text-primary transition-colors text-sm block">
                  Secondary Sector
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-300 hover:text-primary transition-colors text-sm block">
                  Tertiary Sector
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-300 hover:text-primary transition-colors text-sm block">
                  Quaternary Sector
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-300 hover:text-primary transition-colors text-sm block">
                  Quinary Sector
                </a>
              </li>
            </ul>
          </AccordionSection>
          <AccordionSection title="Connect">
            <ul className="space-y-3">
              <li>
                <a href="https://www.linkedin.com/company/digitalqatalyst" className="text-gray-300 hover:text-primary transition-colors text-sm flex items-center gap-2" target="_blank" rel="noopener noreferrer">
                  <Linkedin size={16} />
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://x.com/DigitalQatalyst" className="text-gray-300 hover:text-primary transition-colors text-sm flex items-center gap-2" target="_blank" rel="noopener noreferrer">
                  <XIcon size={16} />
                  X
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/digitalqatalyst/" className="text-gray-300 hover:text-primary transition-colors text-sm flex items-center gap-2" target="_blank" rel="noopener noreferrer">
                  <Instagram size={16} />
                  Instagram
                </a>
              </li>
              <li>
                <a href="/consultation" className="text-gray-300 hover:text-primary transition-colors text-sm flex items-center gap-2">
                  <ExternalLink size={14} />
                  Contact Us
                </a>
              </li>
            </ul>
          </AccordionSection>
        </div>
        {/* Copyright - Mobile */}
        <div className="border-t border-gray-600 pt-6 text-center">
          <p className="text-gray-300 text-xs">
            © 2026 DigitalQatalyst. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-1">Dubai, UAE</p>
        </div>
      </div>
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {/* Main Footer Content */}
        <div className="grid grid-cols-4 gap-12 mb-8">
          {/* Logo and Newsletter Section */}
          <div>
            <div className="mb-6">
              <img
                src="/logo/dq-logo-white.svg"
                alt="DigitalQatalyst"
                className="h-12 w-auto"
              />
              <p className="text-sm text-gray-300 mt-2">Perfecting Life Transactions</p>
            </div>
            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                Stay updated with the latest digital transformation insights, solutions,
                and innovations from DigitalQatalyst.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    className={`w-full px-4 py-3 pr-12 rounded-lg text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 ${!isValid ? 'border-2 border-red-500' : 'border border-gray-300 focus:ring-primary-500'
                      }`}
                    aria-label="Email address for newsletter"
                    aria-invalid={!isValid}
                    aria-describedby={!isValid ? 'desktop-email-error' : undefined}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-500 text-white p-2 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Subscribe to newsletter"
                    disabled={!email.trim() || !isValid}
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
                {!isValid && (
                  <p id="desktop-email-error" className="mt-1 text-sm text-red-200">
                    Please enter a valid email address
                  </p>
                )}
                {isSubmitted && (
                  <p className="mt-1 text-sm text-green-200">
                    Thank you for subscribing!
                  </p>
                )}
              </form>
            </div>
          </div>
          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Company</h3>
            <ul className="space-y-4">
              <li>
                <a href="/about-us" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  About DigitalQatalyst
                </a>
              </li>
              <li>
                <a href="/products" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Products
                </a>
              </li>
              <li>
                <a href="/careers" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Careers
                </a>
              </li>
              <li>
                <a href="/terms-of-service" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Services</h3>
            <ul className="space-y-4">
              <li>
                <a href="/services" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Primary Sector
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Secondary Sector
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Tertiary Sector
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Quaternary Sector
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Quinary Sector
                </a>
              </li>
            </ul>
          </div>
          {/* Connect */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Connect</h3>
            <ul className="space-y-4">
              <li>
                <a href="https://www.linkedin.com/company/digitalqatalyst" className="text-gray-300 hover:text-primary transition-colors text-sm flex items-center gap-2" target="_blank" rel="noopener noreferrer">
                  <Linkedin size={16} />
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://x.com/DigitalQatalyst" className="text-gray-300 hover:text-primary transition-colors text-sm flex items-center gap-2" target="_blank" rel="noopener noreferrer">
                  <XIcon size={16} />
                  X
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/digitalqatalyst/" className="text-gray-300 hover:text-primary transition-colors text-sm flex items-center gap-2" target="_blank" rel="noopener noreferrer">
                  <Instagram size={16} />
                  Instagram
                </a>
              </li>
              <li>
                <a href="/consultation" className="text-gray-300 hover:text-primary transition-colors text-sm flex items-center gap-2">
                  <ExternalLink size={14} />
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* Copyright - Desktop */}
        <div className="border-t border-gray-600 pt-6 flex items-center justify-between">
          <p className="text-gray-300 text-sm">
            © 2026 DigitalQatalyst. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm">Dubai, UAE</p>
        </div>
      </div>
    </div>
  </footer>;
}