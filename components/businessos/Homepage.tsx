"use client";

import {
  Store,
  Stethoscope,
  ShoppingBag,
  Wallet,
  GraduationCap,
  Grid3x3,
  ArrowRight,
  Zap,
  BarChart,
  Users,
  Settings,
  FileText,
  Calendar,
  Package,
  TrendingUp,
} from "lucide-react";
import RevealOnScroll from "../RevealOnScroll";
import Link from "next/link";
import LatestFeatures from "./LatestFeatures";

const verticals = [
  {
    id: "salonos",
    name: "SalonOS",
    icon: Store,
    description: "Complete salon management: appointments, inventory, staff, and payments.",
    color: "from-pink-600 to-rose-600",
  },
  {
    id: "clinicos",
    name: "ClinicOS",
    icon: Stethoscope,
    description: "Healthcare practice management: patient records, scheduling, billing.",
    color: "from-blue-600 to-cyan-600",
  },
  {
    id: "retailos",
    name: "RetailOS",
    icon: ShoppingBag,
    description: "Retail operations: POS, inventory, multi-location, analytics.",
    color: "from-green-600 to-emerald-600",
  },
  {
    id: "financeos",
    name: "FinanceOS",
    icon: Wallet,
    description: "Financial services: client management, compliance, reporting.",
    color: "from-amber-600 to-orange-600",
  },
  {
    id: "eduos",
    name: "EduOS",
    icon: GraduationCap,
    description: "Education management: student records, courses, attendance, fees.",
    color: "from-purple-600 to-indigo-600",
  },
];

const modules = [
  { name: "Inventory Management", icon: Package, desc: "Stock tracking, PO, transfers" },
  { name: "Staff Management", icon: Users, desc: "Profiles, attendance, commissions" },
  { name: "Financial Reports", icon: BarChart, desc: "Balance sheets, GST, exports" },
  { name: "AI Assistant", icon: Zap, desc: "Vertical-specific AI insights" },
  { name: "Automation", icon: Settings, desc: "Webhooks, WhatsApp, reminders" },
  { name: "Multi-location", icon: Grid3x3, desc: "Branch management, transfers" },
  { name: "Analytics", icon: TrendingUp, desc: "Business insights & dashboards" },
  { name: "Documentation", icon: FileText, desc: "Help center, API docs" },
];

export default function BusinessOSHomepage() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-20 overflow-hidden min-h-screen flex items-center">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,20,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,20,0.5)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <RevealOnScroll delay={100}>
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium backdrop-blur-sm mb-8">
              <Zap size={14} className="mr-2" />
              All-in-One Business Operating System
            </div>
          </RevealOnScroll>

          <div className="space-y-6 mb-12">
            <RevealOnScroll delay={200}>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
                One Platform.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-orange-600">
                  Every Vertical.
                </span>
              </h1>
            </RevealOnScroll>

            <RevealOnScroll delay={400}>
              <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                RINADS BusinessOS powers salons, clinics, retail stores, financial services, and
                education institutions with vertical-specific modules that adapt to your business.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={600}>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/book-demo"
                  className="group px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg transition-all shadow-[0_0_30px_rgba(220,20,60,0.3)] hover:shadow-[0_0_40px_rgba(220,20,60,0.5)] flex items-center justify-center border border-red-500"
                >
                  Book a Demo
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link
                  href="/pricing"
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-gray-700 hover:border-gray-500 text-white rounded-lg font-bold text-lg transition-all flex items-center justify-center backdrop-blur-sm"
                >
                  View Pricing
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>

      {/* Vertical Solutions Section */}
      <div className="py-24 relative border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Built for Your <span className="text-red-600">Industry</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Each vertical comes pre-configured with industry-specific workflows, terminology,
                and compliance features.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {verticals.map((vertical, idx) => {
              const Icon = vertical.icon;
              return (
                <RevealOnScroll key={vertical.id} delay={idx * 100}>
                  <Link
                    href={`/verticals/${vertical.id}`}
                    className="group p-6 rounded-2xl bg-[#0a0a0a] border border-gray-800 hover:border-red-600/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(220,20,60,0.2)]"
                  >
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${vertical.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors">
                      {vertical.name}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{vertical.description}</p>
                    <div className="mt-4 flex items-center text-red-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn more <ArrowRight className="ml-1" size={16} />
                    </div>
                  </Link>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modules Grid Section */}
      <div className="py-24 relative border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Powerful <span className="text-red-600">Modules</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Mix and match modules to build the perfect system for your business. Each module
                adapts to your vertical.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, idx) => {
              const Icon = module.icon;
              return (
                <RevealOnScroll key={module.name} delay={idx * 100}>
                  <Link
                    href={`/modules/${module.name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="group p-6 rounded-2xl bg-[#0a0a0a] border border-gray-800 hover:border-red-600/50 transition-all duration-500 hover:-translate-y-1"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center mb-4 group-hover:bg-red-600/20 transition-colors duration-300">
                      <Icon size={20} className="text-gray-400 group-hover:text-red-500 transition-colors duration-300" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-500 transition-colors">
                      {module.name}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{module.desc}</p>
                  </Link>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </div>

      {/* Latest Features Section */}
      <LatestFeatures />

      {/* CTA Section */}
      <div className="py-24 relative border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Start your free trial or book a personalized demo to see BusinessOS in action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book-demo"
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg transition-all shadow-[0_0_30px_rgba(220,20,60,0.3)] hover:shadow-[0_0_40px_rgba(220,20,60,0.5)]"
              >
                Book a Demo
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-gray-700 hover:border-gray-500 text-white rounded-lg font-bold text-lg transition-all"
              >
                View Pricing
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </div>
  );
}

