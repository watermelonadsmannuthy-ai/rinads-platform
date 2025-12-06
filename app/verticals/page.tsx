import BusinessOSNav from "../../components/businessos/BusinessOSNav";
import VerticalSolutions from "../../components/businessos/VerticalSolutions";

export default function VerticalsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <BusinessOSNav />
      <main className="pt-16 md:pt-20">
        <VerticalSolutions />
      </main>
    </div>
  );
}

