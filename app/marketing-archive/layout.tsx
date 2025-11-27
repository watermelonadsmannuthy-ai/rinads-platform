import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Subtle background gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-slate-900 via-wm-bg to-black" />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

