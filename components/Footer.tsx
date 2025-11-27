export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/40">
      <div className="section-wrapper flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2 text-sm text-slate-300">
          <p className="font-semibold text-slate-50">
            RINADS
          </p>
          <p className="max-w-md text-xs text-slate-400">
            Creative performance marketing and education for digital-first
            brands ready for their next chapter of growth.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <a
            href="#services"
            className="transition-colors hover:text-wm-accent-soft"
          >
            Services
          </a>
          <a
            href="#portfolio"
            className="transition-colors hover:text-wm-accent-soft"
          >
            Work
          </a>
          <a
            href="#about"
            className="transition-colors hover:text-wm-accent-soft"
          >
            About
          </a>
          <a
            href="#contact"
            className="transition-colors hover:text-wm-accent-soft"
          >
            Contact
          </a>
        </div>
      </div>

      <div className="border-t border-slate-900/80">
        <div className="section-wrapper flex flex-col items-center justify-between gap-3 py-4 text-[11px] text-slate-500 sm:flex-row">
          <p>© {year} RINADS. All rights reserved.</p>
          <p className="text-[10px]">
            Site built with Next.js, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}


