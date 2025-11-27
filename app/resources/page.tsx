const ARTICLES = [
  {
    slug: "creative-briefs-that-dont-kill-ideas",
    title: "Creative briefs that don’t kill ideas",
    summary:
      "How RINADS structures briefs so performance goals are clear without boxing in creative teams.",
    readingTime: "7 min read",
    category: "Playbook"
  },
  {
    slug: "testing-roadmap-for-paid-social",
    title: "A 90-day testing roadmap for paid social",
    summary:
      "A simple sequence of tests to move from guesswork to a disciplined experimentation cadence.",
    readingTime: "9 min read",
    category: "Performance"
  },
  {
    slug: "turning-insights-into-creative",
    title: "Turning customer insights into scroll-stopping creative",
    summary:
      "Practical ways to mine reviews, calls, and chats for angles that actually change ad performance.",
    readingTime: "8 min read",
    category: "Creative"
  }
];

export default function ResourcesPage() {
  return (
    <div className="space-y-12 pb-20 pt-16 md:pb-24 md:pt-20 lg:pt-24">
      <section className="section-wrapper space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-wm-accent-soft">
          Resources
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
          Playbooks from the RINADS team.
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-wm-muted sm:text-base">
          Short, practical pieces on creative performance, experimentation, and
          building marketing teams that keep learning. Use them with your team,
          adapt them, or bring them to a workshop.
        </p>
      </section>

      <section className="section-wrapper">
        <div className="grid gap-6 md:grid-cols-3">
          {ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="group flex h-full flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-950/40 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] transition hover:-translate-y-1 hover:border-wm-accent-soft/80 hover:shadow-[0_26px_80px_rgba(0,0,0,0.9)]"
            >
              <div className="space-y-3">
                <p className="inline-flex items-center rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300">
                  {article.category}
                </p>
                <h2 className="text-lg font-semibold text-slate-50">
                  {article.title}
                </h2>
                <p className="text-sm leading-relaxed text-wm-muted">
                  {article.summary}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <p>{article.readingTime}</p>
                <a
                  href="#"
                  className="text-wm-accent-soft transition-colors group-hover:text-wm-accent"
                >
                  Coming soon
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}


