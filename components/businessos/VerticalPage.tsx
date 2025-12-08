"use client";

import {
  Store,
  Stethoscope,
  ShoppingBag,
  Wallet,
  GraduationCap,
  Check,
  ArrowRight,
  BarChart,
  Users,
  Calendar,
  Package,
  TrendingUp,
} from "lucide-react";
import RevealOnScroll from "../RevealOnScroll";
import Link from "next/link";

const verticalData: Record<
  string,
  {
    name: string;
    icon: any;
    color: string;
    heroTitle: string;
    heroDescription: string;
    features: string[];
    modules: { name: string; description: string; icon: any }[];
    benefits: string[];
  }
> = {
  salonos: {
    name: "SalonOS",
    icon: Store,
    color: "from-pink-600 to-rose-600",
    heroTitle: "Complete Salon Management System",
    heroDescription:
      "Everything you need to run your salon, spa, or barbershop. From appointment booking to inventory tracking, staff management to commission calculations.",
    features: [
      "Smart Appointment Scheduling",
      "Staff Profile & Attendance",
      "Inventory & Stock Management",
      "Treatment & Service Sales",
      "Commission & Payroll",
      "Customer Management",
      "Multi-location Support",
      "Financial Reports & GST",
    ],
    modules: [
      { name: "Appointments", description: "Book, reschedule, and manage appointments", icon: Calendar },
      { name: "Staff", description: "Manage staff profiles, attendance, and commissions", icon: Users },
      { name: "Inventory", description: "Track products, stock levels, and purchases", icon: Package },
      { name: "Sales", description: "Process treatment sales and service bookings", icon: TrendingUp },
      { name: "Reports", description: "Financial reports, GST returns, and analytics", icon: BarChart },
    ],
    benefits: [
      "Reduce no-shows with automated reminders",
      "Track inventory in real-time",
      "Calculate commissions automatically",
      "Generate GST-compliant invoices",
      "Manage multiple locations from one dashboard",
    ],
  },
  clinicos: {
    name: "ClinicOS",
    icon: Stethoscope,
    color: "from-blue-600 to-cyan-600",
    heroTitle: "Healthcare Practice Management",
    heroDescription:
      "Streamline your clinic operations with patient management, appointment scheduling, medical billing, and compliance tracking.",
    features: [
      "Patient Records Management",
      "Appointment Scheduling",
      "Medical Billing & Invoicing",
      "Prescription Management",
      "Insurance Claims Processing",
      "Multi-doctor Support",
      "Compliance & Reporting",
      "Telemedicine Integration",
    ],
    modules: [
      { name: "Patients", description: "Comprehensive patient records and history", icon: Users },
      { name: "Appointments", description: "Schedule and manage patient visits", icon: Calendar },
      { name: "Billing", description: "Medical billing and insurance claims", icon: Wallet },
      { name: "Prescriptions", description: "Digital prescription management", icon: Package },
      { name: "Reports", description: "Medical reports and compliance tracking", icon: BarChart },
    ],
    benefits: [
      "HIPAA-compliant patient data management",
      "Automated appointment reminders",
      "Streamlined insurance claim processing",
      "Digital prescription management",
      "Multi-location clinic support",
    ],
  },
  retailos: {
    name: "RetailOS",
    icon: ShoppingBag,
    color: "from-green-600 to-emerald-600",
    heroTitle: "Retail Operations Management",
    heroDescription:
      "Power your retail business with POS, inventory management, multi-location support, and real-time analytics.",
    features: [
      "Point of Sale (POS) System",
      "Inventory Management",
      "Multi-location Support",
      "Supplier Management",
      "Stock Transfers",
      "Sales Analytics",
      "Customer Management",
      "Purchase Orders",
    ],
    modules: [
      { name: "POS", description: "Fast and reliable point of sale system", icon: ShoppingBag },
      { name: "Inventory", description: "Real-time stock tracking and management", icon: Package },
      { name: "Suppliers", description: "Manage suppliers and purchase orders", icon: Users },
      { name: "Locations", description: "Multi-store management and transfers", icon: Store },
      { name: "Analytics", description: "Sales reports and business insights", icon: BarChart },
    ],
    benefits: [
      "Real-time inventory tracking",
      "Seamless multi-location operations",
      "Automated purchase order workflows",
      "Comprehensive sales analytics",
      "Supplier relationship management",
    ],
  },
  financeos: {
    name: "FinanceOS",
    icon: Wallet,
    color: "from-amber-600 to-orange-600",
    heroTitle: "Financial Services Management",
    heroDescription:
      "Manage your financial advisory practice, CA firm, or accounting business with client management, compliance, and reporting tools.",
    features: [
      "Client Management",
      "Document Management",
      "Compliance Tracking",
      "Financial Reports",
      "GST Return Export",
      "Balance Sheet Generation",
      "Tax Planning Tools",
      "Audit Trail",
    ],
    modules: [
      { name: "Clients", description: "Comprehensive client profiles and history", icon: Users },
      { name: "Documents", description: "Secure document storage and management", icon: Package },
      { name: "Compliance", description: "Track deadlines and compliance requirements", icon: Check },
      { name: "Reports", description: "Financial reports and GST returns", icon: BarChart },
      { name: "Analytics", description: "Business insights and client analytics", icon: TrendingUp },
    ],
    benefits: [
      "GST-compliant reporting",
      "Automated compliance tracking",
      "Secure client data management",
      "Streamlined document workflows",
      "Comprehensive audit trails",
    ],
  },
  eduos: {
    name: "EduOS",
    icon: GraduationCap,
    color: "from-purple-600 to-indigo-600",
    heroTitle: "Education Management System",
    heroDescription:
      "Manage your school, coaching center, or training institute with student records, attendance, fee collection, and performance tracking.",
    features: [
      "Student Records Management",
      "Course & Curriculum Management",
      "Attendance Tracking",
      "Fee Collection & Invoicing",
      "Performance Reports",
      "Parent Portal",
      "Exam Management",
      "Multi-branch Support",
    ],
    modules: [
      { name: "Students", description: "Comprehensive student profiles and records", icon: Users },
      { name: "Courses", description: "Manage courses, classes, and curriculum", icon: GraduationCap },
      { name: "Attendance", description: "Track student attendance and absences", icon: Calendar },
      { name: "Fees", description: "Fee collection and invoice management", icon: Wallet },
      { name: "Reports", description: "Performance reports and analytics", icon: BarChart },
    ],
    benefits: [
      "Automated attendance tracking",
      "Streamlined fee collection",
      "Parent communication portal",
      "Performance analytics",
      "Multi-branch management",
    ],
  },
};

export default function VerticalPage({ slug }: { slug: string }) {
  const vertical = verticalData[slug];

  if (!vertical) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Vertical Not Found</h1>
          <Link href="/verticals" className="text-red-500 hover:text-red-400">
            ← Back to Verticals
          </Link>
        </div>
      </div>
    );
  }

  const Icon = vertical.icon;

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${vertical.color} opacity-10`}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br ${vertical.color} mb-6 shadow-lg`}>
                <Icon size={48} className="text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{vertical.heroTitle}</h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">{vertical.heroDescription}</p>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {vertical.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-4 hover:border-red-600/50 transition-colors"
                >
                  <Check size={20} className="text-green-500 mb-2" />
                  <p className="text-gray-300 text-sm">{feature}</p>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* Modules Section */}
      <div className="py-16 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Included Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vertical.modules.map((module, idx) => {
                const ModuleIcon = module.icon;
                return (
                  <div
                    key={idx}
                    className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 hover:border-red-600/50 transition-all"
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${vertical.color} flex items-center justify-center mb-4`}>
                      <ModuleIcon size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{module.name}</h3>
                    <p className="text-gray-400 text-sm">{module.description}</p>
                  </div>
                );
              })}
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Choose {vertical.name}?</h2>
            <div className="space-y-4">
              {vertical.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-4 bg-[#0a0a0a] border border-gray-800 rounded-xl p-4">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300">{benefit}</p>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealOnScroll>
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-8">Book a demo to see {vertical.name} in action.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book-demo"
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg transition-all shadow-[0_0_30px_rgba(220,20,60,0.3)]"
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





