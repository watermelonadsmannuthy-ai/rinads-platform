import "./globals.css";

const siteUrl = "https://rinads.com";

export const metadata = {
  title: {
    default: "RINADS BusinessOS | All-in-One Business Operating System",
    template: "%s | RINADS BusinessOS"
  },
  description:
    "RINADS BusinessOS powers salons, clinics, retail stores, financial services, and education institutions with vertical-specific modules that adapt to your business.",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/favicon.svg"
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "RINADS BusinessOS | All-in-One Business Operating System",
    description:
      "One platform for every vertical. Complete business management for salons, clinics, retail, finance, and education.",
    siteName: "RINADS BusinessOS"
  },
  twitter: {
    card: "summary_large_image",
    title: "RINADS BusinessOS | All-in-One Business Operating System",
    description:
      "One platform for every vertical. Complete business management system."
  }
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-black text-white antialiased">
        <div className="relative min-h-screen flex flex-col">
          {/* Subtle background gradient */}
          <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-slate-900 via-black to-black"></div>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}


