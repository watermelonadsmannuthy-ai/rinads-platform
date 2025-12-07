import BusinessOSNav from "../../components/businessos/BusinessOSNav";
import LatestFeatures from "../../components/businessos/LatestFeatures";

export default function WhatsNewPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <BusinessOSNav />
      <main className="pt-16 md:pt-20">
        <LatestFeatures />
      </main>
    </div>
  );
}

