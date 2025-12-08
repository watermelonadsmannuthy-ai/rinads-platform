import BusinessOSNav from "../../components/businessos/BusinessOSNav";
import ModulesListing from "../../components/businessos/ModulesListing";

export default function ModulesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <BusinessOSNav />
      <main className="pt-16 md:pt-20">
        <ModulesListing />
      </main>
    </div>
  );
}





