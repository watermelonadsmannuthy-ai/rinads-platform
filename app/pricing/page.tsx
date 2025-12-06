import BusinessOSNav from "../../components/businessos/BusinessOSNav";
import Pricing from "../../components/businessos/Pricing";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <BusinessOSNav />
      <main className="pt-16 md:pt-20">
        <Pricing />
      </main>
    </div>
  );
}

