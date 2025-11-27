"use client";

import {
  Layout,
  TrendingUp,
  Search,
  MousePointerClick,
  Video,
  Target,
  Instagram,
  Palette,
  Smartphone,
  ArrowRight,
  Play,
  Zap,
  BarChart,
  Cpu,
  RefreshCw,
} from "lucide-react";
import RevealOnScroll from "../RevealOnScroll";

interface HeroAgencyProps {
  setActiveTab?: (tab: string) => void;
}

const services = [
  { title: "Web Design", icon: Layout, desc: "Immersive, award-winning UI/UX experiences." },
  { title: "Digital Marketing", icon: TrendingUp, desc: "Data-driven growth strategies & campaigns." },
  { title: "SEO", icon: Search, desc: "Rank #1 on Google with organic optimization." },
  { title: "Google Ads", icon: MousePointerClick, desc: "High-ROI PPC & Performance Marketing." },
  { title: "Video Production", icon: Video, desc: "Cinematic commercials & viral reels." },
  { title: "SEM", icon: Target, desc: "Strategic Search Engine Marketing." },
  { title: "Social Media", icon: Instagram, desc: "Community management & brand voice." },
  { title: "Branding", icon: Palette, desc: "Logo, identity, and full brand guidelines." },
  { title: "App Development", icon: Smartphone, desc: "Native iOS & Android mobile solutions." },
];

export default function HeroAgency({ setActiveTab }: HeroAgencyProps) {
  return (
    <div className="bg-black">
      {/* Hero Section */}
      <div className="relative pt-20 overflow-hidden min-h-screen flex items-center">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,20,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,20,0.5)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 text-left space-y-8 z-10">
            <RevealOnScroll delay={100}>
              <div className="inline-flex items-center px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium backdrop-blur-sm">
                <Zap size={14} className="mr-2" />
                The Future of Digital Ecosystems
              </div>
            </RevealOnScroll>

            <div className="space-y-2">
              <RevealOnScroll delay={200}>
                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
                  We Build <br />
                </h1>
              </RevealOnScroll>
              <RevealOnScroll delay={400}>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-orange-600">
                    Digital Empires
                  </span>
                </h1>
              </RevealOnScroll>
            </div>

            <RevealOnScroll delay={600}>
              <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                From Kerala to the World. Rinads fuses creative agency services with cutting-edge AI technology to scale your brand.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={800}>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => setActiveTab && setActiveTab("contact")}
                  className="group px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg transition-all shadow-[0_0_30px_rgba(220,20,60,0.3)] hover:shadow-[0_0_40px_rgba(220,20,60,0.5)] flex items-center justify-center border border-red-500 overflow-hidden relative"
                >
                  <span className="relative z-10 flex items-center">
                    Start Your Project{" "}
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </span>
                </button>
                <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-gray-700 hover:border-gray-500 text-white rounded-lg font-bold text-lg transition-all flex items-center justify-center backdrop-blur-sm group">
                  <Play className="mr-2 group-hover:scale-110 transition-transform" size={20} /> View Showreel
                </button>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={1000}>
              <div className="pt-8 flex items-center gap-8 text-gray-500 border-t border-gray-800 mt-8">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-white">500+</span>
                  <span className="text-sm">Clients</span>
                </div>
                <div className="w-px h-10 bg-gray-800"></div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-white">10M+</span>
                  <span className="text-sm">Reach</span>
                </div>
                <div className="w-px h-10 bg-gray-800"></div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-white">Global</span>
                  <span className="text-sm">Presence</span>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Hero Visual */}
          <div className="w-full md:w-1/2 mt-16 md:mt-0 relative">
            <RevealOnScroll delay={500}>
              <div className="relative z-10 bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 shadow-2xl transform hover:rotate-0 transition-transform duration-700 animate-[float_6s_ease-in-out_infinite]">
                <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-gray-500 text-xs font-mono flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    rinads_live_analytics.json
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black p-4 rounded-xl border border-gray-800 hover:border-red-900 transition-colors">
                    <p className="text-gray-400 text-xs uppercase tracking-wider">ROI (This Month)</p>
                    <p className="text-green-400 text-3xl font-bold mt-1">+245%</p>
                    <div className="mt-2 w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full w-3/4 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                    </div>
                  </div>
                  <div className="bg-black p-4 rounded-xl border border-gray-800 hover:border-red-900 transition-colors">
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Active Leads</p>
                    <p className="text-red-400 text-3xl font-bold mt-1">1,204</p>
                    <div className="mt-2 w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full w-1/2 shadow-[0_0_10px_rgba(220,20,60,0.5)]"></div>
                    </div>
                  </div>
                  <div className="col-span-2 bg-gradient-to-br from-gray-900 to-black p-4 rounded-xl border border-gray-800 h-40 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                      <BarChart size={80} className="text-red-600" />
                    </div>
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <Cpu className="text-red-500" size={24} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold">Transparent Dashboard</h3>
                        <p className="text-gray-400 text-sm">Real-time client access</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded border border-green-900">SEO: Rank #1</span>
                      <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded border border-blue-900">Ads: Optimized</span>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>

      {/* Services Grid Section */}
      <div className="py-24 relative border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Our <span className="text-red-600">Services</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Everything you need to scale. From creative foundations to performance-driven growth.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <RevealOnScroll key={idx} delay={idx * 100}>
                  <div className="group p-6 rounded-2xl bg-[#0a0a0a] border border-gray-800 hover:border-red-600/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(220,20,60,0.2)]">
                    <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center mb-4 group-hover:bg-red-600/20 transition-colors duration-300">
                      <Icon size={24} className="text-gray-400 group-hover:text-red-500 transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{service.desc}</p>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

