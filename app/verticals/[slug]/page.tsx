import BusinessOSNav from "../../../components/businessos/BusinessOSNav";
import VerticalPage from "../../../components/businessos/VerticalPage";

export default function VerticalDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <BusinessOSNav />
      <main className="pt-16 md:pt-20">
        <VerticalPage slug={params.slug} />
      </main>
    </div>
  );
}

