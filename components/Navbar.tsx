"use client";

import { useState } from "react";

const NAV_ITEMS = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#portfolio" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "#contact" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-wm-bg/70 backdrop-blur-md">
      <div className="section-wrapper flex items-center justify-between py-4">
        {/* Brand */}
        <a href="#hero" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-wm-accent to-rose-400 text-sm font-semibold shadow-lg shadow-wm-accent/40">
            R
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-wide uppercase text-slate-100">
              RINADS
            </p>
            <p className="text-[11px] text-slate-400">Performance Studio</p>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-200 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-wm-accent-soft"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full bg-wm-accent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-md shadow-wm-accent/40 transition hover:-translate-y-0.5 hover:bg-wm-accent-soft hover:shadow-lg"
          >
            Book a Call
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-100 md:hidden"
          aria-label="Toggle navigation"
        >
          <span className="absolute h-[1.5px] w-4 bg-slate-100 transition-transform duration-200 ease-out data-[open=true]:translate-y-0.5 data-[open=true]:rotate-45" data-open={open} />
          <span className="absolute h-[1.5px] w-4 bg-slate-100 transition-opacity duration-150 ease-out data-[open=true]:opacity-0" data-open={open} />
          <span className="absolute h-[1.5px] w-4 bg-slate-100 transition-transform duration-200 ease-out data-[open=true]:-translate-y-0.5 data-[open=true]:-rotate-45" data-open={open} />
        </button>
      </div>

      {/* Mobile nav drawer */}
      {open && (
        <nav className="border-t border-slate-800/80 bg-wm-bg/95 px-4 py-4 md:hidden">
          <div className="section-wrapper flex flex-col gap-3 text-sm font-medium text-slate-100">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-1 transition-colors hover:text-wm-accent-soft"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-wm-accent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-md shadow-wm-accent/30 transition hover:bg-wm-accent-soft"
            >
              Book a Call
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}


