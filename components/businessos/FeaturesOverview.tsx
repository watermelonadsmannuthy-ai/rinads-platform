"use client";

import {
  Package,
  Users,
  BarChart,
  Zap,
  Settings,
  Grid3x3,
  TrendingUp,
  FileText,
  Calendar,
  Wallet,
  ShoppingBag,
  Check,
} from "lucide-react";
import RevealOnScroll from "../RevealOnScroll";
import Link from "next/link";

const features = [
  {
    category: "Core Operations",
    items: [
      { name: "Inventory Management", icon: Package, desc: "Track stock, manage purchases, handle transfers" },
      { name: "Staff Management", icon: Users, desc: "Profiles, attendance, payroll, commissions" },
      { name: "Multi-location Support", icon: Grid3x3, desc: "Manage branches, franchises, chains" },
      { name: "Financial Reports", icon: BarChart, desc: "Balance sheets, P&L, GST returns" },
    ],
  },
  {
    category: "AI & Automation",
    items: [
      { name: "AI Assistant", icon: Zap, desc: "Vertical-specific AI insights and recommendations" },
      { name: "Automation Workflows", icon: Settings, desc: "Webhooks, triggers, automated reminders" },
      { name: "WhatsApp Integration", icon: ShoppingBag, desc: "Automated customer communications" },
      { name: "Predictive Analytics", icon: TrendingUp, desc: "Business insights and forecasting" },
    ],
  },
  {
    category: "Business Intelligence",
    items: [
      { name: "Real-time Dashboards", icon: BarChart, desc: "Live business metrics and KPIs" },
      { name: "Custom Reports", icon: FileText, desc: "Generate PDF/Excel reports on demand" },
      { name: "Export Capabilities", icon: Package, desc: "Export data for external analysis" },
      { name: "Performance Tracking", icon: TrendingUp, desc: "Track growth and key metrics" },
    ],
  },
];

export default function FeaturesOverview() {
  return (
    <div className="bg-black text-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Features</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Everything you need to run your business efficiently. Mix and match modules to build
              the perfect system for your needs.
            </p>
          </div>
        </RevealOnScroll>

        <div className="space-y-16">
          {features.map((category, catIdx) => (
            <RevealOnScroll key={category.category} delay={catIdx * 200}>
              <div>
                <h2 className="text-2xl font-bold text-white mb-8">{category.category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.items.map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={feature.name}
                        className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 hover:border-red-600/50 transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center mb-4">
                          <Icon size={24} className="text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{feature.name}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <RevealOnScroll delay={600}>
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Explore Modules?</h2>
            <p className="text-gray-400 mb-8">See detailed information about each module and how they work.</p>
            <Link
              href="/modules"
              className="inline-flex items-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg transition-all shadow-[0_0_30px_rgba(220,20,60,0.3)]"
            >
              Browse All Modules
            </Link>
          </RevealOnScroll>
        </div>
      </div>
    </div>
  );
}





