"use client";

import { useState } from "react";
import PlatformNav from "../components/platform/PlatformNav";
import MobileBottomNav from "../components/platform/MobileBottomNav";
import LoginSection from "../components/platform/LoginSection";
import HeroAgency from "../components/platform/HeroAgency";
import AcademySection from "../components/platform/AcademySection";
import ConnectSection from "../components/platform/ConnectSection";
import StudioSection from "../components/platform/StudioSection";
import CommunitySection from "../components/platform/CommunitySection";
import ContactSection from "../components/platform/ContactSection";

export default function PlatformPage() {
  const [activeTab, setActiveTab] = useState("agency");

  const renderContent = () => {
    switch (activeTab) {
      case "login":
        return <LoginSection setActiveTab={setActiveTab} />;
      case "academy":
        return <AcademySection setActiveTab={setActiveTab} />;
      case "connect":
        return <ConnectSection />;
      case "studio":
        return <StudioSection />;
      case "community":
        return <CommunitySection />;
      case "contact":
        return <ContactSection />;
      case "agency":
      default:
        return <HeroAgency setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <PlatformNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="pt-16 md:pt-20">{renderContent()}</main>
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

