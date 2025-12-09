// Digital Marketing Service Page
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Calendar, Users, TrendingUp } from 'lucide-react';

export default function DigitalMarketingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const packages = [
    {
      id: 'starter',
      name: 'Starter',
      price: 9999,
      period: 'month',
      features: [
        'Social Media Management (3 platforms)',
        '10 Posts per Month',
        'Content Creation',
        'Basic Analytics',
        'Email Support',
      ],
      popular: false,
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 24999,
      period: 'month',
      features: [
        'Social Media Management (5 platforms)',
        '30 Posts per Month',
        'Content Creation + Graphics',
        'PPC Campaign Management',
        'SEO Optimization',
        'Advanced Analytics',
        'Priority Support',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 49999,
      period: 'month',
      features: [
        'Unlimited Platforms',
        'Unlimited Posts',
        'Full Content Production',
        'Multi-Channel Campaigns',
        'Advanced SEO + SEM',
        'Dedicated Account Manager',
        'Custom Reporting',
        '24/7 Support',
      ],
      popular: false,
    },
  ];

  async function handlePurchase(packageId: string) {
    // Redirect to checkout with service selection
    window.location.href = `/checkout?service=digital-marketing&package=${packageId}`;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            RINADS
          </Link>
          <div className="flex gap-4">
            <Link href="/services" className="text-gray-600 hover:text-gray-900">
              Services
            </Link>
            <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Digital Marketing Services</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Comprehensive digital marketing solutions to grow your online presence and drive results
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow p-6">
            <TrendingUp className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Performance-Driven</h3>
            <p className="text-gray-600">
              Data-driven strategies with real-time analytics and ROI tracking
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <Users className="w-8 h-8 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
            <p className="text-gray-600">
              Experienced marketers managing your campaigns 24/7
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <Calendar className="w-8 h-8 text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Content Calendar</h3>
            <p className="text-gray-600">
              AI-powered content scheduling and optimization
            </p>
          </div>
        </div>

        {/* Packages */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-lg shadow-lg p-6 ${
                  pkg.popular ? 'ring-2 ring-blue-600 scale-105' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="bg-blue-600 text-white text-center py-1 rounded-t-lg -mt-6 mx-6 mb-4 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">₹{pkg.price.toLocaleString()}</span>
                  <span className="text-gray-600">/{pkg.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePurchase(pkg.id)}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    pkg.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started <ArrowRight className="w-4 h-4 inline ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start with a free consultation and see how we can help
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold"
            >
              Sign Up Free
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border-2 border-white rounded-lg hover:bg-white hover:text-blue-600 font-semibold"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

