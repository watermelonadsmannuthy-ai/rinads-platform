 "use client";

import { useInView } from "./useInView";
export default function About() {
  const { ref, inView } = useInView();

  return (
    <section
      id="about"
      ref={ref as any}
      className={`section-wrapper scroll-mt-20 grid gap-10 md:grid-cols-[1.2fr,0.8fr] md:items-center transform-gpu transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-wm-accent-soft">
          About
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
          A small, senior team obsessed with the craft of marketing.
        </h2>
        <p className="text-sm leading-relaxed text-wm-muted">
          Watermelon Ads &amp; Academy exists for teams who want more than
          “set-and-forget” media buying. We sit at the intersection of creative,
          performance, and education—helping you understand not just{" "}
          <span className="text-slate-200">what</span> is working, but{" "}
          <span className="text-slate-200">why</span>.
        </p>
        <p className="text-sm leading-relaxed text-wm-muted">
          Every engagement includes thoughtful onboarding, clear frameworks, and
          a shared scorecard so we are always rowing in the same direction.
        </p>
        <div className="mt-4 grid gap-4 text-sm text-slate-200 sm:grid-cols-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
              Offices
            </p>
            <p className="mt-1 font-semibold">Remote-first, globally present</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
              Core Focus
            </p>
            <p className="mt-1 font-semibold">Consumer &amp; education brands</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
              Collaboration
            </p>
            <p className="mt-1 font-semibold">Slack, async updates, deep dives</p>
          </div>
        </div>
      </div>

      <aside className="space-y-4 rounded-3xl border border-slate-800/80 bg-slate-950/40 p-5 shadow-soft-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-wm-accent-soft">
          How we&apos;re different
        </p>
        <ul className="space-y-3 text-[13px] leading-relaxed text-slate-200">
          <li className="flex gap-2">
            <span className="mt-[6px] h-[6px] w-[6px] flex-shrink-0 rounded-full bg-emerald-400" />
            <span>
              Senior-only team on every account. No handoffs to anonymous
              “execution pods”.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-[6px] h-[6px] w-[6px] flex-shrink-0 rounded-full bg-amber-300" />
            <span>
              Education baked into the engagement, from workshops to reusable
              templates.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-[6px] h-[6px] w-[6px] flex-shrink-0 rounded-full bg-wm-accent" />
            <span>
              Creative is treated as a product, not an afterthought—every asset
              has a job to do.
            </span>
          </li>
        </ul>
      </aside>
    </section>
  );
}


