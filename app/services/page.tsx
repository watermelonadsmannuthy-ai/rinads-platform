// Services Landing Page
'use client';

import Link from 'next/link';
import { Megaphone, Video, Palette, TrendingUp, Users, Search } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      id: 'digital-marketing',
      name: 'Digital Marketing',
      icon: Megaphone,
      description: 'Comprehensive digital marketing services including social media management, PPC, SEO, and content marketing.',
      features: ['Social Media Management', 'PPC Advertising', 'SEO Optimization', 'Content Marketing', 'Analytics & Reporting'],
      link: '/services/digital-marketing',
      color: 'blue',
    },
    {
      id: 'video-production',
      name: 'Video Production',
      icon: Video,
      description: 'Professional video production services for commercials, social media content, corporate videos, and more.',
      features: ['Commercial Videos', 'Social Media Content', 'Corporate Videos', 'Event Coverage', 'Post-Production'],
      link: '/services/video-production',
      color: 'purple',
    },
    {
      id: 'branding',
      name: 'Branding',
      icon: Palette,
      description: 'Complete branding solutions including logo design, brand identity, style guides, and brand strategy.',
      features: ['Logo Design', 'Brand Identity', 'Style Guides', 'Brand Strategy', 'Rebranding'],
      link: '/services/branding',
      color: 'pink',
    },
    {
      id: 'lead-generation',
      name: 'Lead Generation',
      icon: TrendingUp,
      description: 'Data-driven lead generation campaigns to grow your business with qualified prospects.',
      features: ['Campaign Management', 'Lead Qualification', 'CRM Integration', 'Analytics', 'ROI Tracking'],
      link: '/services/lead-generation',
      color: 'green',
    },
    {
      id: 'social-media',
      name: 'Social Media Management',
      icon: Users,
      description: 'Full-service social media management with content creation, scheduling, and community management.',
      features: ['Content Creation', 'Scheduling', 'Community Management', 'Influencer Outreach', 'Performance Analytics'],
      link: '/services/social-media',
      color: 'orange',
    },
    {
      id: 'seo',
      name: 'SEO Services',
      icon: Search,
      description: 'Search engine optimization to improve your website visibility and organic traffic.',
      features: ['Keyword Research', 'On-Page SEO', 'Technical SEO', 'Link Building', 'Performance Monitoring'],
      link: '/services/seo',
      color: 'indigo',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            RINADS
          </Link>
          <div className="flex gap-4">
            <Link href="/demo" className="text-gray-600 hover:text-gray-900">
              Demo
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl opacity-90">
            Comprehensive digital marketing and production services to grow your business
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              purple: 'bg-purple-100 text-purple-600',
              pink: 'bg-pink-100 text-pink-600',
              green: 'bg-green-100 text-green-600',
              orange: 'bg-orange-100 text-orange-600',
              indigo: 'bg-indigo-100 text-indigo-600',
            };

            return (
              <Link
                key={service.id}
                href={service.link}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition group"
              >
                <div className={`w-12 h-12 rounded-lg ${colorClasses[service.color as keyof typeof colorClasses]} flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-1 mb-4">
                  {service.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-500 flex items-center gap-2">
                      <span className="text-blue-600">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="text-blue-600 font-medium group-hover:underline">
                  Learn More →
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Contact us today to discuss your project
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Sign Up Free
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border border-white rounded-lg hover:bg-white hover:text-gray-900 font-semibold"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

