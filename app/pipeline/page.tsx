"use client";

import PipelineBoard from "@/components/businessos/PipelineBoard";
import BusinessOSNav from "@/components/businessos/BusinessOSNav";

export default function PipelinePage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <BusinessOSNav />
      <div className="pt-16 md:pt-20">
        <PipelineBoard />
      </div>
    </div>
  );
}

