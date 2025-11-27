 "use client";

import { useInView } from "./useInView";
const CASE_STUDIES = [
  {
    label: "DTC Beverage Launch",
    result: "4.3x ROAS in 90 days",
    description:
      "Launched a new beverage line with a creative-first paid social strategy, landing page redesign, and email flows.",
    tags: ["Meta Ads", "Landing Page", "Email Flows"],
    href: "/case-studies/dtc-beverage-launch"
  },
  {
    label: "EdTech Subscription",
    result: "+62% trial-to-paid",
    description:
      "Reframed the product story, restructured onboarding, and introduced an always-on experimentation roadmap.",
    tags: ["Onboarding UX", "Experimentation", "Lifecycle"],
    href: "/case-studies/edtech-subscription"
  },
  {
    label: "Fashion Marketplace",
    result: "+118% revenue QoQ",
    description:
      "Rolled out seasonal campaigns, refreshed creative, and aligned paid media with on-site experience.",
    tags: ["Campaign Strategy", "Creative Direction", "Analytics"],
    href: "/case-studies/fashion-marketplace"
  }
];

export default function Portfolio() {
  const { ref, inView } = useInView();

  return (
    <section
      id="portfolio"
      ref={ref as any}
      className={`section-wrapper scroll-mt-20 space-y-10 md:space-y-12 transform-gpu transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-wm-accent-soft">
            Selected Work
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            Case studies from brands that bet on creative and strategy.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-wm-muted">
          We work with consumer and education brands that are serious about
          compounding growth. Here are a few snapshots–details available on a
          quick call.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        {/* Highlighted case with large visual */}
        <a
          href="/case-studies/dtc-beverage-launch"
          className="group relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/40 shadow-soft-xl transition hover:-translate-y-1 hover:border-wm-accent-soft/80 hover:shadow-[0_30px_90px_rgba(0,0,0,0.9)]"
        >
          <div className="absolute inset-0 bg-[url('https://picsum.photos/1200/700')] bg-cover bg-center opacity-60 transition duration-500 group-hover:scale-105 group-hover:opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-wm-bg/70 to-wm-bg/10" />
          <div className="relative flex h-full flex-col justify-between p-6 md:p-7 lg:p-8">
            <div className="space-y-3 md:space-y-4">
              <p className="inline-flex items-center rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-wm-accent-soft">
                Feature Case Study
              </p>
              <h3 className="max-w-md text-2xl font-semibold text-slate-50">
                Launching a new beverage into a saturated market—without
                shouting.
              </h3>
              <p className="max-w-lg text-sm text-slate-200/90">
                We turned founder stories into scroll-stopping creative, paired
                with landing experiences that let the product and people speak
                for themselves.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4 text-xs text-slate-200/90">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  Result
                </p>
                <p className="mt-1 text-lg font-semibold text-emerald-300">
                  4.3x return on ad spend
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-slate-100">
                  Paid Social
                </span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-slate-100">
                  Landing Page
                </span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-slate-100">
                  Email &amp; SMS
                </span>
              </div>
            </div>
          </div>
        </a>

        {/* Smaller list of additional cases */}
        <div className="space-y-4">
          {CASE_STUDIES.map((cs) => (
            <a
              key={cs.label}
              href={cs.href}
              className="group block rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 transition hover:-translate-y-1 hover:border-wm-accent-soft/80 hover:bg-slate-950/80 hover:shadow-[0_22px_70px_rgba(0,0,0,0.8)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-50">
                    {cs.label}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-emerald-300">
                    {cs.result}
                  </p>
                </div>
                <span className="rounded-full bg-slate-900/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300">
                  In Detail →
                </span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-wm-muted">
                {cs.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-200">
                {cs.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-900/60 px-2.5 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}


