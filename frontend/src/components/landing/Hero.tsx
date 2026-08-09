"use client";

import type { LandingContent } from "@/lib/landing-types";
import { useLocale } from "@/lib/LocaleProvider";

export default function Hero({ content }: { content: LandingContent }) {
  const { tt } = useLocale();

  return (
    <section className="relative overflow-hidden px-6 pt-16 pb-24 md:pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(7,169,151,0.12),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(170,250,241,0.45),_transparent_50%)]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <p className="font-display text-sm font-bold tracking-wide text-teal">
            {content.brandName} · {content.brandNameEn}
          </p>

          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-ink md:text-6xl">
            {content.heroTitle}{" "}
            <span className="text-teal">{content.heroHighlight}</span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/70">
            {content.heroSubtitle}
          </p>

          {content.heroSupport && (
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/55">
              {content.heroSupport}
            </p>
          )}

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#download"
              className="rounded-full bg-teal px-7 py-3.5 font-semibold text-white shadow-lg shadow-teal/25 transition hover:bg-teal-700"
            >
              {tt("ctaDownload")}
            </a>
            <a
              href="#how"
              className="rounded-full border border-teal/25 px-7 py-3.5 font-semibold text-teal transition hover:bg-teal-50"
            >
              {tt("ctaHow")}
            </a>
          </div>
        </div>

        <div className="relative flex h-72 items-center justify-center md:h-96">
          <svg viewBox="0 0 400 200" className="w-full max-w-md" fill="none">
            <path
              d="M0 100 H120 L145 40 L175 165 L205 60 L230 100 H400"
              stroke="#07A997"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pulse-path"
            />
            <circle cx="230" cy="100" r="7" fill="#FF842B" />
          </svg>
        </div>
      </div>
    </section>
  );
}
