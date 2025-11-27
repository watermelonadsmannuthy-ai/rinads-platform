 "use client";

import { useInView } from "./useInView";
const TESTIMONIALS = [
  {
    name: "Leah Martinez",
    role: "Co-founder, Tidewave Beverages",
    quote:
      "Watermelon pushed our thinking on creative and measurement. We went from guessing to running thoughtful experiments every week.",
    badge: "DTC · Beverage"
  },
  {
    name: "Dr. Arun Patel",
    role: "Founder, Northbridge Learning",
    quote:
      "They helped us simplify our story without dumbing it down. Trial-to-paid improved and our team now speaks the same growth language.",
    badge: "SaaS · EdTech"
  },
  {
    name: "Sofia Kim",
    role: "VP Growth, Commonline Studio",
    quote:
      "It feels like having an embedded growth partner. The academy sessions were just as valuable as the campaigns themselves.",
    badge: "Marketplace · Creative"
  }
];

export default function Testimonials() {
  const { ref, inView } = useInView();

  return (
    <section
      id="testimonials"
      ref={ref as any}
      className={`section-wrapper scroll-mt-20 space-y-10 md:space-y-12 transform-gpu transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-wm-accent-soft">
            Testimonials
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            Partners who treat growth as a craft, not a checklist.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-wm-muted">
          We work with leaders who want long-term partners, not short-term
          vendors. Here&apos;s what a few of them have shared.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            className="group flex h-full flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-950/40 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] transition hover:-translate-y-1 hover:border-wm-accent-soft/70"
          >
            <blockquote className="text-[13px] leading-relaxed text-slate-200">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-300">
              <div>
                <p className="font-semibold text-slate-50">{t.name}</p>
                <p className="text-[11px] text-slate-400">{t.role}</p>
              </div>
              <span className="rounded-full bg-slate-900/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-wm-accent-soft">
                {t.badge}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}


