const HIGHLIGHTS = [
  "Creative-first performance campaigns",
  "Conversion-optimized landing experiences",
  "Hands-on training for in-house teams"
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="section-wrapper flex flex-col items-start gap-10 pb-20 pt-16 md:flex-row md:items-center md:gap-16 md:pb-28 md:pt-20 lg:pt-24"
    >
      {/* Copy column */}
      <div className="flex-1 space-y-6 fade-up">
        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/90">
          RINADS
          <span className="h-1 w-1 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-normal text-emerald-200/80">
            Paid growth, creative craft, real learning
          </span>
        </p>

        <h1 className="text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl lg:text-[3.1rem]">
          Creative, data-led marketing
          <span className="block text-transparent bg-gradient-to-r from-wm-accent via-rose-400 to-amber-300 bg-clip-text">
            that feels as fresh as watermelon.
          </span>
        </h1>

        <p className="max-w-xl text-sm leading-relaxed text-wm-muted sm:text-base">
          Watermelon is a creative performance studio and learning partner for
          founders and marketing teams who want honest numbers and standout
          storytelling—not just more ad spend.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full bg-wm-accent px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-wm-accent/40 transition hover:-translate-y-0.5 hover:bg-wm-accent-soft hover:shadow-xl"
          >
            Schedule a Strategy Call
          </a>
          <a
            href="#portfolio"
            className="inline-flex items-center justify-center rounded-full border border-slate-600/80 bg-slate-900/40 px-5 py-3 text-sm font-medium text-slate-100 transition hover:border-wm-accent hover:text-wm-accent-soft"
          >
            View Selected Work
          </a>
        </div>

        <div className="mt-4 grid gap-3 text-xs text-wm-muted sm:grid-cols-3 sm:text-[13px]">
          {HIGHLIGHTS.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-900/40 px-3 py-2"
            >
              <span className="h-[6px] w-[6px] rounded-[999px] bg-gradient-to-r from-wm-accent to-emerald-400" />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Visual column */}
      <div className="relative mt-4 flex-1 md:mt-0">
        <div className="pointer-events-none absolute -inset-10 -z-10 bg-gradient-to-tr from-wm-accent/20 via-purple-500/10 to-emerald-400/10 blur-3xl" />
        <div className="relative overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900/80 p-5 shadow-soft-xl backdrop-blur">
          {/* Placeholder image area */}
          <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-800 via-slate-900 to-black sm:h-64">
            <div className="absolute inset-0 bg-[url('https://picsum.photos/800/500?grayscale')] bg-cover bg-center opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-tr from-wm-bg/90 via-wm-bg/40 to-transparent" />
            <div className="relative flex h-full flex-col justify-between p-4">
              <div className="space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-300/80">
                  Snapshot
                </p>
                <p className="max-w-xs text-sm font-medium text-slate-50">
                  4.3x return on ad spend for a DTC beverage launch in 90 days.
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300/80">
                <p>Paid Social · Email · Landing Page</p>
                <p className="font-semibold text-emerald-300">Case Study ↓</p>
              </div>
            </div>
          </div>

          {/* Stats strip inspired by reference layout */}
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-300/90">
            <div className="rounded-xl bg-slate-900/80 px-3 py-2">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Avg. ROAS
              </p>
              <p className="mt-1 text-lg font-semibold text-emerald-300">
                3.7x
              </p>
            </div>
            <div className="rounded-xl bg-slate-900/80 px-3 py-2">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Launches
              </p>
              <p className="mt-1 text-lg font-semibold text-amber-300">
                120+
              </p>
            </div>
            <div className="rounded-xl bg-slate-900/80 px-3 py-2">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Workshops
              </p>
              <p className="mt-1 text-lg font-semibold text-wm-accent-soft">
                80+
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


