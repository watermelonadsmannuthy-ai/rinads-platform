import BusinessOSNav from "../../components/businessos/BusinessOSNav";
import BookDemo from "../../components/businessos/BookDemo";

export default function BookDemoPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <BusinessOSNav />
      <main className="pt-16 md:pt-20">
        <BookDemo />
      </main>
    </div>
  );
}





