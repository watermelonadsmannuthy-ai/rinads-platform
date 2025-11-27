 "use client";

import { useInView } from "./useInView";
const SERVICES = [
  {
    title: "Paid Social & Performance Creative",
    description:
      "Strategy, creatives, and testing frameworks across Meta, TikTok, and YouTube focused purely on profitable growth.",
    items: [
      "Creative concepting & ad scriptwriting",
      "Full-funnel campaign architecture",
      "Weekly testing & optimization rhythm"
    ]
  },
  {
    title: "Conversion-Ready Landing Experiences",
    description:
      "Landing pages and funnels designed for speed, clarity, and action—built with experimentation in mind.",
    items: [
      "Messaging and value proposition design",
      "UX writing, layout & interaction design",
      "A/B testing and analytics instrumentation"
    ]
  },
  {
    title: "Academy & In-House Enablement",
    description:
      "Live workshops and playbooks tailored to your team so they can ship better campaigns in-house.",
    items: [
      "Custom training programs",
      "Creative review & feedback clinics",
      "Actionable templates and frameworks"
    ]
  }
];

export default function Services() {
  const { ref, inView } = useInView();

  return (
    <section
      id="services"
      ref={ref as any}
      className={`section-wrapper scroll-mt-20 space-y-10 md:space-y-12 transform-gpu transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-wm-accent-soft">
            Services
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            Built for teams who care about creative and numbers.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-wm-muted">
          From first impression to repeat purchase, we design and manage
          marketing journeys that feel human while staying deeply
          performance-driven.
        </p>
      </header>

      {/* Service cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {SERVICES.map((service) => (
          <article
            key={service.title}
            className="group flex flex-col rounded-2xl border border-slate-800/80 bg-slate-950/40 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.55)] transition hover:-translate-y-1 hover:border-wm-accent/70 hover:shadow-[0_28px_80px_rgba(0,0,0,0.8)]"
          >
            <h3 className="text-lg font-semibold text-slate-50">
              {service.title}
            </h3>
            <p className="mt-2 text-sm text-wm-muted">
              {service.description}
            </p>
            <ul className="mt-4 space-y-2 text-[13px] text-slate-200">
              {service.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-[6px] h-[6px] w-[6px] flex-shrink-0 rounded-full bg-gradient-to-br from-wm-accent to-emerald-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex-1" />
            <p className="mt-4 text-xs font-medium text-wm-accent-soft opacity-0 transition-opacity group-hover:opacity-100">
              Ideal for performance-led brands ready to scale.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}


