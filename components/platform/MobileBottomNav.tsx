"use client";

import {
  Home,
  GraduationCap,
  Sparkles,
  Users,
  MessageSquare,
} from "lucide-react";

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
}: MobileBottomNavProps) {
  const navItems = [
    { id: "agency", icon: Home, label: "Home" },
    { id: "academy", icon: GraduationCap, label: "Learn" },
    { id: "studio", icon: Sparkles, label: "Studio" },
    { id: "connect", icon: Users, label: "Connect" },
    { id: "contact", icon: MessageSquare, label: "Contact" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-black/95 border-t border-gray-800 pb-safe pt-2 px-6 flex justify-between items-center z-50 backdrop-blur-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              window.scrollTo(0, 0);
            }}
            className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ${
              activeTab === item.id
                ? "text-red-500 scale-110"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <Icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

