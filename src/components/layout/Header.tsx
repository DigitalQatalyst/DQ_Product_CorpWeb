"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, X, ChevronRight, Building2, Package, Users, Phone } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const NAV = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Products", href: "/products" },
  { name: "Company", href: "/company" },
];

const MARKETPLACES = [
  { id: "services", name: "Service Marketplace", description: "Explore our comprehensive digital transformation services across all sectors", icon: Building2, href: "/marketplace/services" },
  { id: "products", name: "Product Marketplace", description: "Discover our digital accelerators: TMaaS, DTO4T, DTMP, DTMA, DTMI, DTMB, DWS", icon: Package, href: "/products" },
  { id: "careers", name: "Careers", description: "Discover exciting career opportunities and join our team of digital transformation experts", icon: Users, href: "/careers" },
];

// ── Explore Dropdown ──────────────────────────────────────────────────────────
function ExploreDropdown() {
  return (
    <NavigationMenu className="flex-0">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-auto bg-transparent px-2 py-1 text-white hover:bg-white/10 hover:text-gray-200 focus:bg-white/10 focus:text-white data-open:bg-white/10 data-popup-open:bg-white/10">
            Explore
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-0">
            <div className="w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800">Explore Marketplaces</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Discover DigitalQatalyst&apos;s services, products, and transformation resources
                </p>
              </div>
              <div className="py-1">
                {MARKETPLACES.map((m) => {
                  const Icon = m.icon;
                  return (
                    <NavigationMenuLink
                      key={m.id}
                      href={m.href}
                      className="flex items-start px-4 py-3 hover:bg-gray-50 transition-colors rounded-none"
                    >
                      <Icon size={20} className="text-[#FF6B4D] mt-0.5 shrink-0" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{m.name}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{m.description}</p>
                      </div>
                    </NavigationMenuLink>
                  );
                })}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

// ── Mobile Drawer ─────────────────────────────────────────────────────────────
function MobileDrawer() {
  const [open, setOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      const y = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${y}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
    } else {
      const y = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, Number.parseInt(y || "0") * -1);
    }
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      {/* Mobile: CTA + hamburger */}
      <div className="flex items-center space-x-2 md:hidden">
        <Link href="/consultation" onClick={close}
          className="px-3 py-2 bg-[#FF6B4D] text-white rounded-md hover:bg-[#E63D1A] transition-all font-medium text-sm"
        >
          Get In Touch
        </Link>
        <button onClick={() => setOpen(!open)} className="p-2 text-white hover:bg-white/10 rounded-md transition-all" aria-label="Open menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Tablet hamburger */}
      <div className="hidden md:flex lg:hidden items-center">
        <button onClick={() => setOpen(!open)} className="p-2 text-white hover:bg-white/10 rounded-md transition-all" aria-label="Open menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <>
          <button type="button" aria-label="Close menu" className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={close} />
          <div className="fixed top-0 right-0 h-full w-80 bg-linear-to-b from-gray-50 to-white shadow-xl z-50 lg:hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Menu</h2>
              <button onClick={close} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X size={20} className="text-gray-600" /></button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Main nav */}
              <div className="px-6 py-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Navigation</h3>
                <div className="space-y-1">
                  {NAV.map((item) => {
                    const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                      <Link key={item.name} href={item.href} onClick={close}
                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${active ? "bg-[#030F35]/10 text-[#030F35] border-l-4 border-[#030F35]" : "text-gray-700 hover:bg-gray-100"}`}
                      >
                        <span className="font-medium">{item.name}</span>
                        {active && <ChevronRight size={16} className="ml-auto text-[#030F35]" />}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-gray-200 mx-6 my-2" />

              {/* Explore */}
              <div className="px-6 py-4">
                <button
                  onClick={() => setExploreOpen(!exploreOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  <div className="flex items-center"><Building2 size={20} className="mr-3 text-gray-500" /><span>Explore Marketplaces</span></div>
                  <ChevronDown size={16} className={`text-gray-500 transition-transform ${exploreOpen ? "rotate-180" : ""}`} />
                </button>
                {exploreOpen && (
                  <div className="mt-2 ml-8 space-y-1">
                    {MARKETPLACES.map((m) => {
                      const Icon = m.icon;
                      return (
                        <Link key={m.id} href={m.href} onClick={close} className="flex items-start px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors">
                          <Icon size={16} className="text-[#FF6B4D] mt-0.5 shrink-0" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{m.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{m.description}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 mx-6 my-2" />

              <div className="px-6 py-4">
                <Link href="/consultation" onClick={close}
                  className="w-full flex items-center justify-between px-4 py-3 text-white bg-[#FF6B4D] hover:bg-[#E63D1A] rounded-lg transition-colors font-medium shadow-lg"
                >
                  <div className="flex items-center"><Phone size={20} className="mr-3" /><span>Get In Touch</span></div>
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────
export function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full min-h-[72px] bg-[#030F35] shadow-md text-white transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center px-4 py-2 rounded-md shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/dq-logo-white.svg" alt="DigitalQatalyst" className="h-12" />
          </Link>

          {/* Explore dropdown */}
          <div className="hidden lg:flex items-center">
            <ExploreDropdown />
          </div>

          {/* Center nav */}
          <nav className="hidden lg:flex flex-1 items-center justify-center space-x-8">
            {NAV.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link key={item.name} href={item.href}
                  className={`text-sm font-medium transition-colors ${active ? "text-white font-semibold" : "text-white/80 hover:text-[#FF6B4D]"}`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/consultation"
              className="flex items-center gap-2 bg-[#FF6B4D] text-white font-semibold px-6 py-2.5 rounded-lg shadow-lg hover:bg-[#E63D1A] transition-all duration-200"
            >
              Get In Touch <ArrowRight size={18} />
            </Link>
          </div>

          {/* Mobile / Tablet */}
          <MobileDrawer />
        </div>
      </div>
    </header>
  );
}
