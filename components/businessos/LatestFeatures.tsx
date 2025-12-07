"use client";

import { Sparkles, Calendar, ArrowRight, Zap, BarChart, Settings, Package, Users, TrendingUp, FileText, Grid3x3, Wallet, GraduationCap, Store, Stethoscope, ShoppingBag } from "lucide-react";
import RevealOnScroll from "../RevealOnScroll";
import Link from "next/link";
import { latestFeatures, formatFeatureDate } from "../../data/latest-features";

// Icon mapping
const iconMap: Record<string, any> = {
  Zap,
  BarChart,
  Settings,
  Package,
  Users,
  TrendingUp,
  FileText,
  Grid3x3,
  Wallet,
  GraduationCap,
  Store,
  Stethoscope,
  ShoppingBag,
};

export default function LatestFeatures() {
  return (
    <div className="bg-black text-white py-24 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium backdrop-blur-sm mb-6">
              <Sparkles size={14} className="mr-2" />
              What&apos;s New
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Features</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Stay up to date with the newest features and improvements to BusinessOS.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {latestFeatures.map((feature, idx) => {
            const Icon = iconMap[feature.icon] || Zap;
            return (
              <RevealOnScroll key={feature.id} delay={idx * 100}>
                <div className="group bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 hover:border-red-600/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(220,20,60,0.2)]">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-600/20 to-orange-600/20 flex items-center justify-center group-hover:from-red-600/30 group-hover:to-orange-600/30 transition-colors">
                        <Icon size={24} className="text-red-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-red-500 uppercase tracking-wider">{feature.category}</span>
                          {feature.badge && (
                            <span className="px-2 py-0.5 bg-red-600/20 text-red-400 text-xs font-bold rounded-full border border-red-500/30">
                              {feature.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar size={12} className="text-gray-500" />
                          <span className="text-xs text-gray-500">{formatFeatureDate(feature.date)}</span>
                        </div>
                      </div>
                    </div>
                    {feature.link && (
                      <Link
                        href={feature.link}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowRight size={20} className="text-red-500" />
                      </Link>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                  {feature.link && (
                    <Link
                      href={feature.link}
                      className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 text-sm font-medium mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Learn more <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        <RevealOnScroll delay={400}>
          <div className="mt-12 text-center">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-gray-700 hover:border-gray-500 text-white rounded-lg font-medium transition-all"
            >
              View All Features <ArrowRight size={18} />
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}

