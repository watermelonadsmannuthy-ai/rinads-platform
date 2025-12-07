"use client";

import { Search, Book, Video, FileText, MessageCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import RevealOnScroll from "../RevealOnScroll";
import Link from "next/link";

const categories = [
  {
    name: "Getting Started",
    icon: Book,
    articles: ["Welcome to BusinessOS", "Setting up your account", "Choosing your vertical", "First steps after signup"],
  },
  {
    name: "Features & Modules",
    icon: FileText,
    articles: ["Inventory Management Guide", "Staff Management Overview", "Financial Reports Explained", "AI Assistant Usage"],
  },
  {
    name: "Video Tutorials",
    icon: Video,
    articles: ["Platform Overview (5 min)", "Setting up Inventory (10 min)", "Managing Staff (8 min)", "Generating Reports (6 min)"],
  },
  {
    name: "API & Integrations",
    icon: MessageCircle,
    articles: ["API Documentation", "Webhook Setup", "Third-party Integrations", "Custom Integrations"],
  },
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-black text-white min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Help <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Center</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8">Find answers, tutorials, and guides to help you get the most out of BusinessOS.</p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </RevealOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {categories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <RevealOnScroll key={category.name} delay={idx * 100}>
                <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 hover:border-red-600/50 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                      <Icon size={20} className="text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white">{category.name}</h2>
                  </div>
                  <ul className="space-y-2">
                    {category.articles.map((article) => (
                      <li key={article}>
                        <Link href="#" className="flex items-center justify-between text-gray-400 hover:text-white transition-colors py-2">
                          <span>{article}</span>
                          <ArrowRight size={16} className="opacity-0 group-hover:opacity-100" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
        <RevealOnScroll delay={500}>
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Still need help?</h2>
            <p className="text-gray-400 mb-6">Can&apos;t find what you&apos;re looking for? Our support team is here to help.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book-demo" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all">Contact Support</Link>
              <Link href="mailto:support@rinads.com" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-gray-700 text-white rounded-lg font-medium transition-all">Email Us</Link>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}
