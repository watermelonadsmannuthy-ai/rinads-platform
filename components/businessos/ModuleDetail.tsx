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
  Check,
  ArrowLeft,
} from "lucide-react";
import RevealOnScroll from "../RevealOnScroll";
import Link from "next/link";

const moduleData: Record<
  string,
  {
    name: string;
    icon: any;
    description: string;
    features: string[];
    useCases: string[];
    verticals: string[];
  }
> = {
  "inventory-management": {
    name: "Inventory Management",
    icon: Package,
    description:
      "Complete inventory control system with real-time stock tracking, purchase order management, supplier relationships, and multi-location stock transfers.",
    features: [
      "Real-time stock tracking across all locations",
      "Purchase order creation and approval workflow",
      "Stock transfer between branches",
      "Supplier management and contact database",
      "Low stock alerts and reorder points",
      "Batch and serial number tracking",
      "Stock valuation and costing",
      "Inventory reports and analytics",
    ],
    useCases: [
      "Track product stock levels in real-time",
      "Manage supplier relationships and purchase orders",
      "Transfer stock between multiple locations",
      "Set up automated reorder alerts",
      "Generate inventory valuation reports",
    ],
    verticals: ["SalonOS", "ClinicOS", "RetailOS", "FinanceOS", "EduOS"],
  },
  "staff-management": {
    name: "Staff Management",
    icon: Users,
    description:
      "Comprehensive staff management system with profiles, attendance tracking, commission calculations, payroll, and role-based access control.",
    features: [
      "Staff profile management with documents",
      "Attendance tracking and timesheets",
      "Commission calculation based on sales",
      "Payroll processing and salary management",
      "Role-based access control (RBAC)",
      "Performance tracking and reviews",
      "Leave management",
      "Staff scheduling and shift management",
    ],
    useCases: [
      "Manage staff profiles and documents",
      "Track attendance and working hours",
      "Calculate commissions automatically",
      "Process payroll and salary payments",
      "Control access based on roles",
    ],
    verticals: ["SalonOS", "ClinicOS", "RetailOS", "FinanceOS", "EduOS"],
  },
  "financial-reports": {
    name: "Financial Reports",
    icon: BarChart,
    description:
      "Generate comprehensive financial reports including balance sheets, P&L statements, GST returns, and export data in multiple formats.",
    features: [
      "Balance sheet generation",
      "Profit & Loss statements",
      "GST return export (GSTR-1, GSTR-3B)",
      "PDF and Excel export formats",
      "Custom date range selection",
      "Comparative period analysis",
      "Cash flow statements",
      "Tax reports and compliance",
    ],
    useCases: [
      "Generate monthly financial reports",
      "Export GST returns for filing",
      "Compare performance across periods",
      "Export data for external analysis",
      "Track cash flow and profitability",
    ],
    verticals: ["SalonOS", "ClinicOS", "RetailOS", "FinanceOS", "EduOS"],
  },
  "ai-assistant": {
    name: "AI Assistant",
    icon: Zap,
    description:
      "Vertical-specific AI assistant that provides business insights, recommendations, and automated responses tailored to your industry.",
    features: [
      "Vertical-specific AI responses",
      "Business insights and recommendations",
      "Predictive analytics",
      "Natural language queries",
      "Automated report generation",
      "Trend analysis and forecasting",
      "Anomaly detection",
      "Custom AI workflows",
    ],
    useCases: [
      "Get industry-specific business insights",
      "Ask questions in natural language",
      "Receive automated recommendations",
      "Predict future trends and patterns",
      "Detect anomalies in business data",
    ],
    verticals: ["SalonOS", "ClinicOS", "RetailOS", "FinanceOS", "EduOS"],
  },
  automation: {
    name: "Automation",
    icon: Settings,
    description:
      "Powerful automation engine with webhooks, WhatsApp integration, email reminders, and custom workflow triggers.",
    features: [
      "Webhook triggers for external integrations",
      "WhatsApp automated messaging",
      "Email reminder automation",
      "Custom workflow builder",
      "Event-based actions",
      "Scheduled tasks and cron jobs",
      "API integrations",
      "Third-party app connections",
    ],
    useCases: [
      "Send automated appointment reminders",
      "Trigger actions based on events",
      "Integrate with external tools",
      "Automate customer communications",
      "Set up custom business workflows",
    ],
    verticals: ["SalonOS", "ClinicOS", "RetailOS", "FinanceOS", "EduOS"],
  },
  "multi-location": {
    name: "Multi-location",
    icon: Grid3x3,
    description:
      "Manage multiple branches, franchises, or locations from a single dashboard with branch-level data isolation and centralized reporting.",
    features: [
      "Unlimited location support",
      "Branch-level data isolation",
      "Stock transfers between locations",
      "Centralized reporting and analytics",
      "Location-specific settings",
      "Franchise management",
      "Multi-tenant architecture",
      "Location-based access control",
    ],
    useCases: [
      "Manage multiple store locations",
      "Transfer stock between branches",
      "Generate location-specific reports",
      "Support franchise operations",
      "Centralize business operations",
    ],
    verticals: ["SalonOS", "ClinicOS", "RetailOS", "FinanceOS", "EduOS"],
  },
  analytics: {
    name: "Analytics",
    icon: TrendingUp,
    description:
      "Real-time dashboards, business insights, performance tracking, and growth metrics with customizable KPIs.",
    features: [
      "Real-time business dashboards",
      "Custom KPI tracking",
      "Performance metrics",
      "Growth analytics",
      "Revenue forecasting",
      "Customer analytics",
      "Sales trends and patterns",
      "Exportable reports",
    ],
    useCases: [
      "Monitor business performance in real-time",
      "Track custom KPIs and metrics",
      "Analyze sales trends",
      "Forecast revenue growth",
      "Understand customer behavior",
    ],
    verticals: ["SalonOS", "ClinicOS", "RetailOS", "FinanceOS", "EduOS"],
  },
  documentation: {
    name: "Documentation",
    icon: FileText,
    description:
      "Comprehensive help center, API documentation, integration guides, and best practices for using BusinessOS.",
    features: [
      "Searchable help center",
      "API documentation (OpenAPI)",
      "Integration guides",
      "Video tutorials",
      "Best practices and tips",
      "FAQ section",
      "Release notes",
      "Developer resources",
    ],
    useCases: [
      "Find answers to common questions",
      "Integrate with external systems",
      "Learn best practices",
      "Watch video tutorials",
      "Access API documentation",
    ],
    verticals: ["SalonOS", "ClinicOS", "RetailOS", "FinanceOS", "EduOS"],
  },
};

export default function ModuleDetail({ slug }: { slug: string }) {
  const module = moduleData[slug];

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Module Not Found</h1>
          <Link href="/modules" className="text-red-500 hover:text-red-400 flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Back to Modules
          </Link>
        </div>
      </div>
    );
  }

  const Icon = module.icon;

  return (
    <div className="bg-black text-white min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <Link
            href="/modules"
            className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Modules
          </Link>
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          <div className="mb-12">
            <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center mb-6">
              <Icon size={32} className="text-red-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{module.name}</h1>
            <p className="text-xl text-gray-400 leading-relaxed">{module.description}</p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={200}>
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {module.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={300}>
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Use Cases</h2>
            <ul className="space-y-3">
              {module.useCases.map((useCase, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-300">{useCase}</span>
                </li>
              ))}
            </ul>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={400}>
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Available in Verticals</h2>
            <div className="flex flex-wrap gap-3">
              {module.verticals.map((vertical) => (
                <span
                  key={vertical}
                  className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 text-sm"
                >
                  {vertical}
                </span>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}





