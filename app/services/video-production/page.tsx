// Video Production Service Page
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Video, Film, Camera, Edit } from 'lucide-react';

export default function VideoProductionPage() {
  const packages = [
    {
      id: 'basic',
      name: 'Basic Package',
      price: 29999,
      features: [
        '1-2 Minute Video',
        'Basic Editing',
        '1 Revision',
        'HD Quality',
        'Social Media Formats',
        '7-10 Day Delivery',
      ],
      popular: false,
    },
    {
      id: 'professional',
      name: 'Professional Package',
      price: 79999,
      features: [
        '3-5 Minute Video',
        'Professional Editing',
        'Color Grading',
        'Motion Graphics',
        '3 Revisions',
        '4K Quality',
        'Multiple Formats',
        '14-21 Day Delivery',
      ],
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium Package',
      price: 149999,
      features: [
        '5-10 Minute Video',
        'Cinematic Production',
        'Advanced Editing',
        'VFX & Animation',
        'Unlimited Revisions',
        '4K/8K Quality',
        'All Formats',
        'Dedicated Team',
        '30-45 Day Delivery',
      ],
      popular: false,
    },
  ];

  const services = [
    { icon: Video, title: 'Commercial Videos', description: 'TV commercials, online ads, and promotional content' },
    { icon: Film, title: 'Corporate Videos', description: 'Company profiles, training videos, and presentations' },
    { icon: Camera, title: 'Event Coverage', description: 'Live events, conferences, and celebrations' },
    { icon: Edit, title: 'Post-Production', description: 'Editing, color grading, and motion graphics' },
  ];

  async function handlePurchase(packageId: string) {
    window.location.href = `/checkout?service=video-production&package=${packageId}`;
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
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Video Production Services</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Professional video production from concept to delivery, tailored to your brand
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Video Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div key={idx} className="bg-white rounded-lg shadow p-6">
                <Icon className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            );
          })}
        </div>

        {/* Packages */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Production Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-lg shadow-lg p-6 ${
                  pkg.popular ? 'ring-2 ring-purple-600 scale-105' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="bg-purple-600 text-white text-center py-1 rounded-t-lg -mt-6 mx-6 mb-4 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">₹{pkg.price.toLocaleString()}</span>
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
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
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
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Amazing Videos?</h2>
          <p className="text-xl mb-8 opacity-90">
            Let's discuss your project and bring your vision to life
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-semibold"
            >
              Sign Up Free
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border-2 border-white rounded-lg hover:bg-white hover:text-purple-600 font-semibold"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

