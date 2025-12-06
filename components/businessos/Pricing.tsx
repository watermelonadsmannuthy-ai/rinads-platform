"use client";

import { Check, ArrowRight } from "lucide-react";
import RevealOnScroll from "../RevealOnScroll";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "₹2,999",
    period: "per month",
    description: "Perfect for small businesses getting started",
    features: [
      "Up to 2 locations",
      "Basic inventory management",
      "Staff management (up to 10)",
      "Financial reports",
      "Email support",
      "Mobile app access",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "₹7,999",
    period: "per month",
    description: "For growing businesses with multiple locations",
    features: [
      "Up to 5 locations",
      "Advanced inventory & stock transfers",
      "Staff management (unlimited)",
      "AI Assistant included",
      "Automation workflows",
      "Priority support",
      "Custom reports",
      "API access",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large organizations with complex needs",
    features: [
      "Unlimited locations",
      "Everything in Professional",
      "Dedicated account manager",
      "Custom integrations",
      "On-premise deployment option",
      "SLA guarantee",
      "Training & onboarding",
      "White-label options",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <div className="bg-black text-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Simple, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Transparent</span> Pricing
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Choose the plan that fits your business. All plans include a 14-day free trial.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <RevealOnScroll key={plan.name} delay={idx * 150}>
              <div
                className={`relative bg-[#0a0a0a] border rounded-3xl p-8 ${
                  plan.popular
                    ? "border-red-600 shadow-[0_0_40px_rgba(220,20,60,0.2)] scale-105"
                    : "border-gray-800 hover:border-gray-700"
                } transition-all`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period !== "pricing" && (
                      <span className="text-gray-400 text-sm">/{plan.period}</span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.name === "Enterprise" ? "/book-demo" : "/book-demo"}
                  className={`block w-full text-center py-3 rounded-lg font-bold transition-all ${
                    plan.popular
                      ? "bg-red-600 hover:bg-red-700 text-white shadow-[0_0_20px_rgba(220,20,60,0.3)]"
                      : "bg-white/5 hover:bg-white/10 border border-gray-700 text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={600}>
          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-4">All plans include:</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300">
              <span className="flex items-center gap-2">
                <Check size={16} className="text-green-500" /> 14-day free trial
              </span>
              <span className="flex items-center gap-2">
                <Check size={16} className="text-green-500" /> No credit card required
              </span>
              <span className="flex items-center gap-2">
                <Check size={16} className="text-green-500" /> Cancel anytime
              </span>
              <span className="flex items-center gap-2">
                <Check size={16} className="text-green-500" /> Data export
              </span>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}

