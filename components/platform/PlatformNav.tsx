"use client";

import { useState } from "react";

interface PlatformNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function PlatformNav({
  activeTab,
  setActiveTab,
}: PlatformNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-40 bg-black/95 border-b border-red-900/30 backdrop-blur-md top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo Section */}
          <div
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer group"
            onClick={() => setActiveTab("agency")}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-red-600 to-red-900 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500 shadow-[0_0_15px_rgba(220,20,60,0.5)]">
              <span className="text-white font-bold text-lg md:text-xl">R</span>
            </div>
            <span className="text-white font-bold text-xl md:text-2xl tracking-tighter">
              RINADS
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            {["Agency", "Academy", "Connect", "Studio", "Community", "Contact"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item.toLowerCase())}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
                    activeTab === item.toLowerCase()
                      ? "text-white bg-red-600/20 border border-red-600/50 shadow-[0_0_10px_rgba(220,20,60,0.2)] scale-105"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setActiveTab("login")}
              className={`text-sm font-medium transition-colors ${
                activeTab === "login"
                  ? "text-white border-b-2 border-red-600"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setActiveTab("contact");
                window.scrollTo(0, 0);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(220,20,60,0.5)] border border-red-500 hover:shadow-red-500/50"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Header Actions */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold"
            >
              Let&apos;s Talk
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4 space-y-2">
            {["Agency", "Academy", "Connect", "Studio", "Community", "Contact"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveTab(item.toLowerCase());
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === item.toLowerCase()
                      ? "bg-red-600/20 text-red-400"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

