"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";
import BusinessOSNav from "../components/businessos/BusinessOSNav";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white">
      <BusinessOSNav />
      <main className="pt-16 md:pt-20 min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-orange-600 mb-4">
              404
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-600 mx-auto mb-8"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          <div className="space-y-4 mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg transition-all shadow-[0_0_30px_rgba(220,20,60,0.3)] hover:shadow-[0_0_40px_rgba(220,20,60,0.5)]"
            >
              <Home size={20} />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="ml-4 inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-gray-700 hover:border-gray-500 text-white rounded-lg font-bold text-lg transition-all"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>

          <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-center gap-2">
              <Search size={20} className="text-red-500" />
              Popular Pages
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <Link
                href="/verticals"
                className="text-gray-400 hover:text-red-500 transition-colors text-sm"
              >
                → Vertical Solutions
              </Link>
              <Link
                href="/modules"
                className="text-gray-400 hover:text-red-500 transition-colors text-sm"
              >
                → Modules
              </Link>
              <Link
                href="/features"
                className="text-gray-400 hover:text-red-500 transition-colors text-sm"
              >
                → Features
              </Link>
              <Link
                href="/pricing"
                className="text-gray-400 hover:text-red-500 transition-colors text-sm"
              >
                → Pricing
              </Link>
              <Link
                href="/book-demo"
                className="text-gray-400 hover:text-red-500 transition-colors text-sm"
              >
                → Book Demo
              </Link>
              <Link
                href="/help"
                className="text-gray-400 hover:text-red-500 transition-colors text-sm"
              >
                → Help Center
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

