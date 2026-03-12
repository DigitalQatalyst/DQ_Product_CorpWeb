import React from "react";
import { Button, Burger, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useDarkMode } from "../../../hooks/useDarkMode";

export function DtmiHeader() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const { isDarkMode } = useDarkMode();
  return (
    <header className="sticky top-0 z-50 w-full bg-[#030F35] shadow-md text-white">
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between gap-6">
          <div className="flex flex-row items-center">
            <a href="/" className="flex items-center px-4 py-2 rounded-md">
              <img
                src={isDarkMode ? "/images/DQ Logo White.svg" : "/images/DQ Logo Dark.svg"}
                alt="DigitalQatalyst"
                className="h-10"
              />
            </a>
          </div>
          <nav className="hidden lg:flex flex-1 items-center justify-center space-x-8">
            <a
              href="#"
              className="text-sm font-semibold text-white transition-colors border-b-2 border-[#FF6B4D] pb-1"
            >
              Home
            </a>
            <a
              href="#"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors flex items-center gap-1"
            >
              Services
              <ChevronDown size={16} />
            </a>
            <a
              href="#"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Products
            </a>
            <a
              href="#"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors flex items-center gap-1"
            >
              Insights
              <ChevronDown size={16} />
            </a>
            <a
              href="#"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors flex items-center gap-1"
            >
              Company
              <ChevronDown size={16} />
            </a>
          </nav>
          <div className="hidden lg:flex items-center gap-4">
            <Button
              className="flex flex-row items-center gap-2"
              styles={{
                root: {
                  backgroundColor: "#FF6B4D",
                  color: "white",
                  fontWeight: 600,
                  padding: "0 1.5rem",
                  height: "48px",
                  borderRadius: "9999px",
                  boxShadow: "0 10px 25px rgba(255,107,77,0.4)",
                  "&:hover": {
                    backgroundColor: "#e55a3d",
                  },
                },
              }}
            >
              <span className="inline-flex items-center gap-2">
                Get In Touch
                <ArrowRight size={18} />
              </span>
            </Button>
            <button
              className="flex flex-col gap-1 p-2 rounded-md hover:bg-white/10 transition-colors"
              onClick={toggle}
              aria-label="Open menu"
            >
              <span className="w-6 h-0.5 bg-white"></span>
              <span className="w-6 h-0.5 bg-white"></span>
              <span className="w-6 h-0.5 bg-white"></span>
            </button>
          </div>
          <div className="lg:hidden flex items-center ml-auto">
            <Burger opened={opened} onClick={toggle} size="sm" color="#fff" />
          </div>
        </div>
      </div>
      <Drawer opened={opened} onClose={close} position="right" size="xs">
        <div className="flex flex-col h-full p-4">
          <nav className="flex flex-col space-y-4 mt-8">
            <a
              href="#"
              className="px-3 py-2 text-base font-medium text-gray-900 hover:text-brand-coral transition-colors"
            >
              Home
            </a>
            <a
              href="#"
              className="px-3 py-2 text-base font-medium text-gray-700 hover:text-brand-coral transition-colors"
            >
              Services
            </a>
            <a
              href="#"
              className="px-3 py-2 text-base font-medium text-gray-700 hover:text-brand-coral transition-colors"
            >
              Products
            </a>
            <a
              href="#"
              className="px-3 py-2 text-base font-medium text-gray-700 hover:text-brand-coral transition-colors"
            >
              Insights
            </a>
            <a
              href="#"
              className="px-3 py-2 text-base font-medium text-gray-700 hover:text-brand-coral transition-colors"
            >
              Company
            </a>
          </nav>
          <div className="mt-auto">
            <Button
              fullWidth
              rightSection={<ArrowRight size={18} />}
              className="bg-brand-coral hover:bg-brand-coral/90"
              styles={{
                root: {
                  backgroundColor: "#FF6B4D",
                  color: "white",
                  fontWeight: 600,
                  padding: "0 1.5rem",
                  borderRadius: "9999px",
                  "&:hover": {
                    backgroundColor: "#e55a3d",
                  },
                },
              }}
            >
              Get In Touch
            </Button>
          </div>
        </div>
      </Drawer>
    </header>
  );
}
