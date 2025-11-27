"use client";

import { FormEvent, useState } from "react";
import { useInView } from "./useInView";

export default function Contact() {
  const { ref, inView } = useInView();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      company: String(formData.get("company") || ""),
      budget: String(formData.get("budget") || ""),
      message: String(formData.get("message") || "")
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch (e) {
      console.error(e);
      setError("Unable to send message right now. Please try again later.");
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      ref={ref as any}
      className={`section-wrapper scroll-mt-20 grid gap-10 md:grid-cols-[1.1fr,0.9fr] md:items-start transform-gpu transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-wm-accent-soft">
          Contact
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
          Tell us about the growth chapter you&apos;re writing.
        </h2>
        <p className="text-sm leading-relaxed text-wm-muted">
          Share a bit about your brand, current challenges, and what success
          looks like over the next 6–12 months. We&apos;ll respond within two
          business days with next steps.
        </p>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-emerald-100">
          <p className="font-semibold uppercase tracking-[0.18em]">
            What to expect
          </p>
          <p className="mt-1 text-[13px] text-emerald-50/90">
            A 30-minute call focused on your goals, not a one-sided sales deck.
            If we&apos;re not a fit, we&apos;ll point you to resources that
            might help.
          </p>
        </div>
      </div>

      {/* Contact form wired to /api/contact */}
      <form
        className="space-y-4 rounded-3xl border border-slate-800/80 bg-slate-950/40 p-5 shadow-soft-xl"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="text-xs font-medium text-slate-200"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="h-9 w-full rounded-lg border border-slate-700/80 bg-slate-900/60 px-3 text-sm text-slate-50 outline-none transition focus:border-wm-accent focus:ring-1 focus:ring-wm-accent/70"
              placeholder="Your full name"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium text-slate-200"
            >
              Work email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="h-9 w-full rounded-lg border border-slate-700/80 bg-slate-900/60 px-3 text-sm text-slate-50 outline-none transition focus:border-wm-accent focus:ring-1 focus:ring-wm-accent/70"
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="company"
            className="text-xs font-medium text-slate-200"
          >
            Company / brand
          </label>
          <input
            id="company"
            name="company"
            type="text"
            className="h-9 w-full rounded-lg border border-slate-700/80 bg-slate-900/60 px-3 text-sm text-slate-50 outline-none transition focus:border-wm-accent focus:ring-1 focus:ring-wm-accent/70"
            placeholder="What are you building?"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="budget"
            className="text-xs font-medium text-slate-200"
          >
            Monthly marketing budget (approx.)
          </label>
          <select
            id="budget"
            name="budget"
            className="h-9 w-full rounded-lg border border-slate-700/80 bg-slate-900/60 px-3 text-sm text-slate-50 outline-none transition focus:border-wm-accent focus:ring-1 focus:ring-wm-accent/70"
            defaultValue=""
          >
            <option value="" disabled>
              Select a range
            </option>
            <option value="under-10k">Under $10K</option>
            <option value="10-30k">$10K–$30K</option>
            <option value="30-75k">$30K–$75K</option>
            <option value="75k-plus">$75K+</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="message"
            className="text-xs font-medium text-slate-200"
          >
            What would make this engagement a success?
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="w-full rounded-lg border border-slate-700/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-wm-accent focus:ring-1 focus:ring-wm-accent/70"
            placeholder="Share context, timelines, and any links that are helpful."
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-wm-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-wm-accent/40 transition hover:-translate-y-0.5 hover:bg-wm-accent-soft hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {status === "submitting" ? "Sending..." : "Request a Strategy Call"}
        </button>

        {status === "success" && (
          <p className="mt-1 text-[11px] font-medium text-emerald-300">
            Thank you—your message has been sent. We&apos;ll get back to you
            within two business days.
          </p>
        )}
        {status === "error" && error && (
          <p className="mt-1 text-[11px] font-medium text-rose-300">
            {error}
          </p>
        )}

        <p className="mt-1 text-[11px] text-slate-500">
          By submitting, you agree that we may contact you about services and
          content we think you&apos;ll find valuable. No spam, ever.
        </p>
      </form>
    </section>
  );
}


