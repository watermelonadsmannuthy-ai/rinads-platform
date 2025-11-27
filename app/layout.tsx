import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const siteUrl = "https://rinads.com";

export const metadata: Metadata = {
  title: {
    default: "RINADS | Creative Performance Marketing Studio",
    template: "%s | RINADS",
  },
  description:
    "RINADS helps ambitious brands grow through creative-first performance marketing, storytelling, and education.",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "RINADS | Creative Performance Marketing Studio",
    description:
      "Creative, data-led performance marketing and education for digital-first brands.",
    siteName: "RINADS",
  },
  twitter: {
    card: "summary_large_image",
    title: "RINADS | Creative Performance Marketing Studio",
    description:
      "Creative-first performance marketing studio and academy for ambitious brands.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Platform page (homepage) has its own navigation, so we don't wrap it
  // For other pages (marketing-archive, resources, etc.), use Navbar/Footer
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-wm-bg text-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}


