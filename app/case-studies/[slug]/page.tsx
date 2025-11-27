const CASE_STUDIES: Record<
  string,
  {
    title: string;
    headline: string;
    summary: string;
    metrics: string[];
    services: string[];
  }
> = {
  "dtc-beverage-launch": {
    title: "DTC Beverage Launch",
    headline:
      "Turning founder stories into a launch that felt handcrafted, not hyped.",
    summary:
      "RINADS partnered with a beverage brand to introduce a new product line in a crowded category. Instead of chasing lowest-funnel discounts, we built creative around the founder’s story, ingredients, and rituals—then aligned landing experiences and lifecycle flows to match.",
    metrics: [
      "4.3x blended ROAS in the first 90 days",
      "38% of customers opted into post-purchase education flows",
      "Creative fatigue pushed out by 3–4 weeks through structured testing"
    ],
    services: [
      "Paid social strategy and creative direction",
      "Landing page design and messaging",
      "Email & SMS flows for launch and retention"
    ]
  },
  "edtech-subscription": {
    title: "EdTech Subscription",
    headline: "Reframing value to turn more trial users into advocates.",
    summary:
      "An education platform had strong sign-up numbers but flat trial-to-paid conversion. We repositioned the product around outcomes, simplified onboarding journeys, and built a testing roadmap that focused on clarity over cleverness.",
    metrics: [
      "+62% trial-to-paid conversion over 16 weeks",
      "Churn in the first 60 days dropped by 21%",
      "Support tickets about \"where to start\" reduced by 40%"
    ],
    services: [
      "Onboarding UX and in-app messaging",
      "Experimentation roadmap and measurement",
      "Lifecycle and winback campaigns"
    ]
  },
  "fashion-marketplace": {
    title: "Fashion Marketplace",
    headline: "Aligning campaigns, creative, and onsite experience.",
    summary:
      "A multi-brand fashion marketplace wanted campaigns that felt cohesive from ad to checkout. We refreshed creative, clarified seasonal narratives, and made sure that collection pages supported the promises made in ads.",
    metrics: [
      "+118% revenue quarter-over-quarter",
      "Return visitor revenue grew 2.1x",
      "Time on key collection pages increased by 34%"
    ],
    services: [
      "Seasonal campaign strategy",
      "Creative direction and production support",
      "Analytics instrumentation and reporting"
    ]
  }
};

type CaseStudyPageProps = {
  params: { slug: string };
};

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const study = CASE_STUDIES[params.slug];

  if (!study) {
    return (
      <div className="section-wrapper py-16">
        <h1 className="text-2xl font-semibold text-slate-50">
          Case study coming soon.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-wm-muted">
          We&apos;re still publishing details for this engagement. In the
          meantime, reach out and we&apos;ll walk you through relevant work on a
          call.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 pt-16 md:pb-24 md:pt-20 lg:pt-24">
      <section className="section-wrapper space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-wm-accent-soft">
          Case Study
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
          {study.title}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-wm-muted sm:text-base">
          {study.headline}
        </p>
      </section>

      <section className="section-wrapper grid gap-10 md:grid-cols-[1.2fr,0.8fr] md:items-start">
        <div className="space-y-6">
          <p className="text-sm leading-relaxed text-wm-muted">
            {study.summary}
          </p>
          <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-950/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Key Outcomes
            </p>
            <ul className="mt-1 space-y-2 text-sm text-slate-200">
              {study.metrics.map((metric) => (
                <li key={metric} className="flex gap-2">
                  <span className="mt-1 h-[6px] w-[6px] flex-shrink-0 rounded-full bg-emerald-300" />
                  <span>{metric}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-4 rounded-2xl border border-slate-800/80 bg-slate-950/40 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            How RINADS helped
          </p>
          <ul className="space-y-2 text-sm text-slate-200">
            {study.services.map((service) => (
              <li key={service} className="flex gap-2">
                <span className="mt-1 h-[6px] w-[6px] flex-shrink-0 rounded-full bg-wm-accent-soft" />
                <span>{service}</span>
              </li>
            ))}
          </ul>
          <p className="pt-3 text-[13px] text-wm-muted">
            Interested in a similar engagement?{" "}
            <a
              href="/#contact"
              className="text-wm-accent-soft underline-offset-2 hover:underline"
            >
              Book a short strategy call with the team
            </a>
            .
          </p>
        </aside>
      </section>
    </div>
  );
}


