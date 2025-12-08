import BusinessOSNav from "../../components/businessos/BusinessOSNav";
import FeaturesOverview from "../../components/businessos/FeaturesOverview";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <BusinessOSNav />
      <main className="pt-16 md:pt-20">
        <FeaturesOverview />
      </main>
    </div>
  );
}





