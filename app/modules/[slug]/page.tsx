import BusinessOSNav from "../../../components/businessos/BusinessOSNav";
import ModuleDetail from "../../../components/businessos/ModuleDetail";

export default function ModuleDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <BusinessOSNav />
      <main className="pt-16 md:pt-20">
        <ModuleDetail slug={params.slug} />
      </main>
    </div>
  );
}





