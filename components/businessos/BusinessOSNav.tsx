"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, LogOut, User } from "lucide-react";
import { isAuthenticated, getCurrentUser, logout } from "@/lib/auth";

export default function BusinessOSNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setUserEmail(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { label: "Verticals", href: "/verticals" },
    { label: "Features", href: "/features" },
    { label: "Modules", href: "/modules" },
    { label: "Pipeline", href: "/pipeline" },
    { label: "What's New", href: "/whats-new" },
    { label: "Pricing", href: "/pricing" },
    { label: "Help", href: "/help" },
  ];

  return (
    <nav className="fixed w-full z-40 bg-black/95 border-b border-red-900/30 backdrop-blur-md top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-red-600 to-red-900 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500 shadow-[0_0_15px_rgba(220,20,60,0.5)]">
              <span className="text-white font-bold text-lg md:text-xl">R</span>
            </div>
            <span className="text-white font-bold text-xl md:text-2xl tracking-tighter">
              RINADS
            </span>
            <span className="hidden md:inline text-gray-400 text-sm ml-2">BusinessOS</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full text-gray-400 hover:text-white hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {authenticated ? (
              <>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <User size={16} />
                  <span>{userEmail}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-400 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/book-demo"
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(220,20,60,0.5)] border border-red-500 hover:shadow-red-500/50"
                >
                  Book Demo
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {authenticated ? (
              <button
                onClick={handleLogout}
                className="bg-gray-800 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1"
              >
                <LogOut size={14} />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold"
              >
                Sign In
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-lg transition-colors text-gray-400 hover:text-white hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

