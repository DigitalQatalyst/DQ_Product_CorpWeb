"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

const InstagramIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

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

const LinkedinIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

function AccordionSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-600 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-4 flex items-center justify-between text-left"
        aria-expanded={open}
      >
        <h3 className="font-semibold text-base text-white">{title}</h3>
        {open ? (
          <ChevronUp size={20} className="text-gray-300" />
        ) : (
          <ChevronDown size={20} className="text-gray-300" />
        )}
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

function NewsletterInput({
  full = false,
  email,
  setEmail,
  isValid,
  setIsValid,
  submitted,
  handleSubmit,
}: {
  full?: boolean;
  email: string;
  setEmail: (v: string) => void;
  isValid: boolean;
  setIsValid: (v: boolean) => void;
  submitted: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}) {
  return (
    <form onSubmit={handleSubmit} className={full ? "space-y-3" : ""}>
      {full ? (
        <>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsValid(true);
              }}
              placeholder="Enter your email"
              className={`w-full px-4 py-3 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 ${!isValid ? "border-2 border-red-500" : "border border-gray-300 focus:ring-[#FF6B4D]"}`}
            />
            {!isValid && (
              <p className="mt-1 text-sm text-red-200">
                Please enter a valid email address
              </p>
            )}
            {submitted && (
              <p className="mt-1 text-sm text-green-200">
                Thank you for subscribing!
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={!email.trim()}
            className="w-full bg-[#FF6B4D] text-white px-4 py-3 rounded-md hover:bg-[#E63D1A] transition-colors font-medium disabled:opacity-50"
          >
            Subscribe
          </button>
        </>
      ) : (
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setIsValid(true);
            }}
            placeholder="Enter your email"
            className={`w-full px-4 py-3 pr-12 rounded-lg text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 ${!isValid ? "border-2 border-red-500" : "border border-gray-300 focus:ring-[#FF6B4D]"}`}
          />
          <button
            type="submit"
            disabled={!email.trim() || !isValid}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#FF6B4D] text-white p-2 rounded-md hover:bg-[#E63D1A] transition-colors disabled:opacity-50"
          >
            <ArrowRight size={18} />
          </button>
          {!isValid && (
            <p className="mt-1 text-sm text-red-200">
              Please enter a valid email address
            </p>
          )}
          {submitted && (
            <p className="mt-1 text-sm text-green-200">
              Thank you for subscribing!
            </p>
          )}
        </div>
      )}
    </form>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const validate = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(email)) {
      setIsValid(false);
      return;
    }
    // TODO: wire to server action
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  const companyLinks = [
    { label: "About DigitalQatalyst", href: "/company" },
    { label: "Products", href: "/products" },
    { label: "Careers", href: "/careers" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ];

  const serviceLinks = [
    "Primary Sector",
    "Secondary Sector",
    "Tertiary Sector",
    "Quaternary Sector",
    "Quinary Sector",
  ];

  const connectLinks = [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/digitalqatalyst",
      icon: <LinkedinIcon size={16} />,
      external: true,
    },
    {
      label: "X",
      href: "https://x.com/DigitalQatalyst",
      icon: <XIcon size={16} />,
      external: true,
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/digitalqatalyst/",
      icon: <InstagramIcon size={16} />,
      external: true,
    },
    {
      label: "Contact Us",
      href: "/consultation",
      icon: <ExternalLink size={14} />,
      external: false,
    },
  ];

  return (
    <footer className="bg-[#030F35] text-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* ── Mobile ── */}
        <div className="block lg:hidden">
          <div className="mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo/dq-logo-white.svg"
              alt="DigitalQatalyst"
              className="h-10 w-auto"
            />
            <p className="text-sm text-gray-300 mt-2">
              Perfecting Life Transactions
            </p>
          </div>
          <div className="mb-8">
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              Stay updated with the latest digital transformation insights from
              DigitalQatalyst.
            </p>
            <NewsletterInput
              full
              email={email}
              setEmail={setEmail}
              isValid={isValid}
              setIsValid={setIsValid}
              submitted={submitted}
              handleSubmit={handleSubmit}
            />
          </div>
          <div className="mb-8">
            <AccordionSection title="Company">
              <ul className="space-y-3">
                {companyLinks.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-gray-300 hover:text-[#FF6B4D] transition-colors text-sm block"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionSection>
            <AccordionSection title="Services">
              <ul className="space-y-3">
                {serviceLinks.map((l) => (
                  <li key={l}>
                    <Link
                      href="/services"
                      className="text-gray-300 hover:text-[#FF6B4D] transition-colors text-sm block"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionSection>
            <AccordionSection title="Connect">
              <ul className="space-y-3">
                {connectLinks.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...(l.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-gray-300 hover:text-[#FF6B4D] transition-colors text-sm flex items-center gap-2"
                    >
                      {l.icon}
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </AccordionSection>
          </div>
          <div className="border-t border-gray-600 pt-6 text-center">
            <p className="text-gray-300 text-xs">
              © 2026 DigitalQatalyst. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs mt-1">Dubai, UAE</p>
          </div>
        </div>

        {/* ── Desktop ── */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-4 gap-12 mb-8">
            {/* Logo + newsletter */}
            <div>
              <div className="mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo/dq-logo-white.svg"
                  alt="DigitalQatalyst"
                  className="h-12 w-auto"
                />
                <p className="text-sm text-gray-300 mt-2">
                  Perfecting Life Transactions
                </p>
              </div>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                Stay updated with the latest digital transformation insights,
                solutions, and innovations from DigitalQatalyst.
              </p>
              <NewsletterInput
                email={email}
                setEmail={setEmail}
                isValid={isValid}
                setIsValid={setIsValid}
                submitted={submitted}
                handleSubmit={handleSubmit}
              />
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Company</h3>
              <ul className="space-y-4">
                {companyLinks.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-gray-300 hover:text-[#FF6B4D] transition-colors text-sm"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Services</h3>
              <ul className="space-y-4">
                {serviceLinks.map((l) => (
                  <li key={l}>
                    <Link
                      href="/services"
                      className="text-gray-300 hover:text-[#FF6B4D] transition-colors text-sm"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Connect</h3>
              <ul className="space-y-4">
                {connectLinks.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...(l.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-gray-300 hover:text-[#FF6B4D] transition-colors text-sm flex items-center gap-2"
                    >
                      {l.icon}
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-600 pt-6 flex items-center justify-between">
            <p className="text-gray-300 text-sm">
              © 2026 DigitalQatalyst. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">Dubai, UAE</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
