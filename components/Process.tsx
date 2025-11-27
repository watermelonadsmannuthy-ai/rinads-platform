 "use client";

import { useInView } from "./useInView";
const STEPS = [
  {
    label: "01 · Discover",
    title: "Immerse in your brand and numbers.",
    body: "We start with a collaborative workshop and a deep dive into your analytics, funnels, and existing creative library."
  },
  {
    label: "02 · Design",
    title: "Shape the narrative and experience.",
    body: "We define positioning, messaging, and experience flows that feel native to your audience and channels."
  },
  {
    label: "03 · Launch",
    title: "Ship fast, learn deliberately.",
    body: "We launch in measured waves, prioritizing clean experiments over noisy one-off tests."
  },
  {
    label: "04 · Enable",
    title: "Equip your team for the next chapter.",
    body: "We document what worked, run playbook sessions, and build repeatable systems your team can own."
  }
];

export default function Process() {
  const { ref, inView } = useInView();

  return (
    <section
      id="process"
      ref={ref as any}
      className={`section-wrapper scroll-mt-20 space-y-10 md:space-y-12 transform-gpu transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-wm-accent-soft">
            Process
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            A clear path from idea to measurable impact.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-wm-muted">
          The exact tactics change by brand, but our operating rhythm stays
          consistent—so you always know what&apos;s happening and why.
        </p>
      </header>

      {/* Simple horizontal timeline layout inspired by the reference site */}
      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-3 bottom-3 hidden w-px bg-gradient-to-b from-wm-accent/80 via-slate-700 to-transparent md:block" />
        <div className="grid gap-6 md:grid-cols-4">
          {STEPS.map((step, index) => (
            <article
              key={step.label}
              className="group relative rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.55)] transition hover:-translate-y-1 hover:border-wm-accent-soft/80"
            >
              {/* Step indicator dot for larger screens */}
              <div className="hidden md:block">
                <span className="absolute -top-3 left-4 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-wm-accent to-emerald-300 shadow-[0_0_0_4px_rgba(15,23,42,0.9)]" />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                {step.label}
              </p>
              <h3 className="mt-2 text-sm font-semibold text-slate-50">
                {step.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-wm-muted">
                {step.body}
              </p>
              <p className="mt-3 text-[11px] font-medium text-wm-accent-soft/80">
                {index === 0 && "Workshop · Analytics review · Stakeholder sync"}
                {index === 1 &&
                  "Positioning · Journey mapping · Creative direction"}
                {index === 2 &&
                  "Channel setup · Launch roadmap · Weekly reviews"}
                {index === 3 &&
                  "Playbooks · Training sessions · Tooling recommendations"}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


