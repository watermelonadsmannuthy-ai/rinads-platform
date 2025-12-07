"use client";

import BusinessOSNav from "../../components/businessos/BusinessOSNav";
import HelpCenter from "../../components/businessos/HelpCenter";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <BusinessOSNav />
      <main className="pt-16 md:pt-20">
        <HelpCenter />
      </main>
    </div>
  );
}

