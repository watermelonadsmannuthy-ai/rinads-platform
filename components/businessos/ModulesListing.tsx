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
  ArrowRight,
} from "lucide-react";
import RevealOnScroll from "../RevealOnScroll";
import Link from "next/link";

const modules = [
  {
    id: "inventory-management",
    name: "Inventory Management",
    icon: Package,
    description: "Track stock levels, manage purchase orders, handle stock transfers between locations, and maintain supplier relationships.",
    features: ["Real-time stock tracking", "Purchase order workflow", "Stock transfers", "Supplier management", "Low stock alerts"],
  },
  {
    id: "staff-management",
    name: "Staff Management",
    icon: Users,
    description: "Manage staff profiles, track attendance, calculate commissions, and handle payroll.",
    features: ["Staff profiles", "Attendance tracking", "Commission calculations", "Payroll management", "Role-based access"],
  },
  {
    id: "financial-reports",
    name: "Financial Reports",
    icon: BarChart,
    description: "Generate balance sheets, P&L statements, GST returns, and export data in PDF/Excel formats.",
    features: ["Balance sheets", "P&L statements", "GST returns", "PDF/Excel export", "Custom date ranges"],
  },
  {
    id: "ai-assistant",
    name: "AI Assistant",
    icon: Zap,
    description: "Vertical-specific AI insights, recommendations, and automated responses tailored to your business type.",
    features: ["Vertical-specific AI", "Business insights", "Predictive analytics", "Automated recommendations", "Natural language queries"],
  },
  {
    id: "automation",
    name: "Automation",
    icon: Settings,
    description: "Set up webhooks, automated reminders, WhatsApp notifications, and custom workflow triggers.",
    features: ["Webhook triggers", "WhatsApp automation", "Email reminders", "Custom workflows", "Event-based actions"],
  },
  {
    id: "multi-location",
    name: "Multi-location",
    icon: Grid3x3,
    description: "Manage multiple branches, franchises, or locations from a single dashboard with branch-level data isolation.",
    features: ["Branch management", "Stock transfers", "Centralized reporting", "Location-specific settings", "Franchise support"],
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: TrendingUp,
    description: "Real-time dashboards, business insights, performance tracking, and growth metrics.",
    features: ["Real-time dashboards", "Business insights", "Performance tracking", "Growth metrics", "Custom KPIs"],
  },
  {
    id: "documentation",
    name: "Documentation",
    icon: FileText,
    description: "Comprehensive help center, API documentation, and integration guides.",
    features: ["Help center", "API documentation", "Integration guides", "Video tutorials", "Best practices"],
  },
];

export default function ModulesListing() {
  return (
    <div className="bg-black text-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              All <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Modules</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Each module adapts to your vertical, providing industry-specific features and workflows.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, idx) => {
            const Icon = module.icon;
            return (
              <RevealOnScroll key={module.id} delay={idx * 100}>
                <Link
                  href={`/modules/${module.id}`}
                  className="group bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 hover:border-red-600/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(220,20,60,0.2)]"
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center mb-4 group-hover:bg-red-600/20 transition-colors duration-300">
                    <Icon size={24} className="text-gray-400 group-hover:text-red-500 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors">
                    {module.name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{module.description}</p>
                  <ul className="space-y-2 mb-4">
                    {module.features.slice(0, 3).map((feature) => (
                      <li key={feature} className="text-xs text-gray-500 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center text-red-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight className="ml-1" size={16} />
                  </div>
                </Link>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </div>
  );
}





