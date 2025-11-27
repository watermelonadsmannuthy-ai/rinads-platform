"use client";

import { Globe, MessageSquare, Users } from "lucide-react";
import RevealOnScroll from "../RevealOnScroll";

export default function CommunitySection() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>

      <div className="text-center max-w-3xl relative z-10">
        <div className="inline-block p-6 rounded-full bg-gray-900/50 mb-8 border border-gray-800 backdrop-blur-xl animate-[bounce_3s_infinite]">
          <Globe size={64} className="text-red-600 animate-[spin_10s_linear_infinite]" />
        </div>
        <RevealOnScroll>
          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            Join the <span className="text-red-600">Rinads Network</span>
          </h2>
          <p className="text-gray-400 text-xl mb-12 leading-relaxed">
            Rinads isn&apos;t just a platform; it&apos;s a movement. Connect with{" "}
            <span className="text-white font-bold">10,000+</span> creators, marketers, and business
            owners. Collaborate on projects, share assets, and grow together.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
          <RevealOnScroll delay={200}>
            <button className="group relative bg-[#5865F2] hover:bg-[#4752C4] text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center transition-all overflow-hidden w-full">
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <MessageSquare className="mr-3" /> Join Discord Server
            </button>
          </RevealOnScroll>
          <RevealOnScroll delay={300}>
            <button className="group relative bg-[#0077b5] hover:bg-[#006396] text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center transition-all overflow-hidden w-full">
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <Users className="mr-3" /> LinkedIn Group
            </button>
          </RevealOnScroll>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 text-center border-t border-gray-800 pt-8">
          <div>
            <div className="text-3xl font-bold text-white">24/7</div>
            <div className="text-sm text-gray-500">Support</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">50+</div>
            <div className="text-sm text-gray-500">Daily Jobs</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">Free</div>
            <div className="text-sm text-gray-500">Resources</div>
          </div>
        </div>
      </div>
    </div>
  );
}

