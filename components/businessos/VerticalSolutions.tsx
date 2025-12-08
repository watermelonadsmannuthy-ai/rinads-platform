"use client";

import {
  Store,
  Stethoscope,
  ShoppingBag,
  Wallet,
  GraduationCap,
  ArrowRight,
  Check,
  BarChart,
  Users,
  Calendar,
  Package,
} from "lucide-react";
import RevealOnScroll from "../RevealOnScroll";
import Link from "next/link";

const verticals = [
  {
    id: "salonos",
    name: "SalonOS",
    icon: Store,
    description: "Complete salon management system for beauty salons, spas, and barbershops.",
    color: "from-pink-600 to-rose-600",
    features: ["Appointment Scheduling", "Staff Management", "Inventory Tracking", "Treatment Sales", "Commission Calculations"],
    useCases: ["Beauty Salons", "Spas", "Barbershops", "Nail Studios"],
  },
  {
    id: "clinicos",
    name: "ClinicOS",
    icon: Stethoscope,
    description: "Healthcare practice management for clinics, dental practices, and medical centers.",
    color: "from-blue-600 to-cyan-600",
    features: ["Patient Records", "Appointment Booking", "Medical Billing", "Prescription Management", "Insurance Claims"],
    useCases: ["Medical Clinics", "Dental Practices", "Physiotherapy", "Diagnostic Centers"],
  },
  {
    id: "retailos",
    name: "RetailOS",
    icon: ShoppingBag,
    description: "Retail operations management for stores, franchises, and multi-location businesses.",
    color: "from-green-600 to-emerald-600",
    features: ["POS System", "Inventory Management", "Multi-location Support", "Supplier Management", "Sales Analytics"],
    useCases: ["Retail Stores", "Franchises", "Chain Stores", "E-commerce Warehouses"],
  },
  {
    id: "financeos",
    name: "FinanceOS",
    icon: Wallet,
    description: "Financial services management for advisory firms, accounting practices, and consultants.",
    color: "from-amber-600 to-orange-600",
    features: ["Client Management", "Compliance Tracking", "Financial Reports", "GST Returns", "Document Management"],
    useCases: ["CA Firms", "Financial Advisors", "Tax Consultants", "Accounting Practices"],
  },
  {
    id: "eduos",
    name: "EduOS",
    icon: GraduationCap,
    description: "Education management system for schools, coaching centers, and training institutes.",
    color: "from-purple-600 to-indigo-600",
    features: ["Student Records", "Course Management", "Attendance Tracking", "Fee Collection", "Performance Reports"],
    useCases: ["Schools", "Coaching Centers", "Training Institutes", "Tuition Centers"],
  },
];

export default function VerticalSolutions() {
  return (
    <div className="bg-black text-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Vertical</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Each vertical is pre-configured with industry-specific workflows, terminology, and
              compliance features tailored to your business type.
            </p>
          </div>
        </RevealOnScroll>

        <div className="space-y-12">
          {verticals.map((vertical, idx) => {
            const Icon = vertical.icon;
            return (
              <RevealOnScroll key={vertical.id} delay={idx * 150}>
                <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 md:p-12 hover:border-red-600/50 transition-all duration-500">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${vertical.color} flex items-center justify-center shadow-lg`}
                      >
                        <Icon size={40} className="text-white" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-3xl font-bold text-white mb-2">{vertical.name}</h2>
                          <p className="text-gray-400 text-lg">{vertical.description}</p>
                        </div>
                        <Link
                          href={`/verticals/${vertical.id}`}
                          className="hidden md:flex items-center text-red-500 hover:text-red-400 font-medium transition-colors"
                        >
                          Learn More <ArrowRight className="ml-2" size={20} />
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">
                            Key Features
                          </h3>
                          <ul className="space-y-2">
                            {vertical.features.map((feature) => (
                              <li key={feature} className="flex items-center text-gray-400">
                                <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">
                            Perfect For
                          </h3>
                          <ul className="space-y-2">
                            {vertical.useCases.map((useCase) => (
                              <li key={useCase} className="flex items-center text-gray-400">
                                <Check size={16} className="text-blue-500 mr-2 flex-shrink-0" />
                                {useCase}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-800">
                        <Link
                          href={`/verticals/${vertical.id}`}
                          className="md:hidden inline-flex items-center text-red-500 hover:text-red-400 font-medium transition-colors"
                        >
                          Learn More <ArrowRight className="ml-2" size={20} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </div>
  );
}





