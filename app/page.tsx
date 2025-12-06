"use client";

import BusinessOSNav from "../components/businessos/BusinessOSNav";
import BusinessOSHomepage from "../components/businessos/Homepage";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <BusinessOSNav />
      <main className="pt-16 md:pt-20">
        <BusinessOSHomepage />
      </main>
    </div>
  );
}

