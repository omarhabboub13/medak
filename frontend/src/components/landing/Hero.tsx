"use client";

import type { LandingContent } from "@/lib/landing-types";
import { useLocale } from "@/lib/LocaleProvider";

/**
 * Sharp ECG complexes — dense beats alternating heavy / light amplitude.
 * Same geometry language as the original single-spike path.
 */
const BEATS: { x: number; strength: "heavy" | "light" }[] = [
  { x: 28, strength: "light" },
  { x: 62, strength: "heavy" },
  { x: 98, strength: "light" },
  { x: 132, strength: "heavy" },
  { x: 168, strength: "light" },
  { x: 202, strength: "heavy" },
  { x: 238, strength: "light" },
  { x: 272, strength: "heavy" },
  { x: 308, strength: "light" },
  { x: 342, strength: "heavy" },
  { x: 376, strength: "light" },
];

function buildSharpPulsePath(y = 100) {
  let d = `M0 ${y}`;
  for (const beat of BEATS) {
    const heavy = beat.strength === "heavy";
    const up = heavy ? 58 : 28;
    const down = heavy ? 42 : 18;
    const w = heavy ? 14 : 10;
    const x = beat.x;

    d += ` H${x - w}`;
    d += ` L${x - w * 0.45} ${y}`;
    d += ` L${x - w * 0.2} ${y - up * 0.12}`;
    d += ` L${x} ${y - up}`;
    d += ` L${x + w * 0.35} ${y + down}`;
    d += ` L${x + w * 0.7} ${y}`;
  }
  d += ` H400`;
  return d;
}

const PULSE_PATH = buildSharpPulsePath(100);
const LAST = BEATS[BEATS.length - 1];
const END_X = LAST.x + (LAST.strength === "heavy" ? 10 : 7);
const END_Y = 100;

export default function Hero({ content }: { content: LandingContent }) {
  const { tt } = useLocale();

  return (
    <section className="relative overflow-hidden px-4 sm:px-6 pt-12 pb-16 sm:pt-16 sm:pb-24 md:pt-24 md:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(7,169,151,0.12),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(170,250,241,0.45),_transparent_50%)]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 sm:gap-12 lg:grid-cols-2">
        <div className="min-w-0 text-center lg:text-start">
          <h1 className="mt-1 font-display text-4xl font-extrabold leading-[1.15] text-ink sm:text-5xl md:text-6xl lg:text-7xl">
            {content.heroTitle}{" "}
            <span className="text-teal">{content.heroHighlight}</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink/70 sm:mt-6 sm:text-lg md:text-xl lg:mx-0">
            {content.heroSubtitle}
          </p>

          {content.heroSupport && (
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink/55 sm:mt-4 sm:text-base lg:mx-0">
              {content.heroSupport}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4 lg:justify-start">
            <a
              href="#download"
              className="rounded-full bg-teal px-6 py-3 text-base font-semibold text-white shadow-lg shadow-teal/25 transition hover:bg-teal-700 sm:px-8 sm:py-3.5 sm:text-lg"
            >
              {tt("ctaDownload")}
            </a>
            <a
              href="#how"
              className="rounded-full border border-teal/25 px-6 py-3 text-base font-semibold text-teal transition hover:bg-teal-50 sm:px-8 sm:py-3.5 sm:text-lg"
            >
              {tt("ctaHow")}
            </a>
          </div>
        </div>

        <div className="relative mx-auto flex h-56 w-full max-w-lg items-center justify-center sm:h-72 md:h-96 lg:max-w-none">
          <svg
            viewBox="0 0 400 200"
            className="relative w-full"
            fill="none"
            aria-hidden
          >
            <path
              d={PULSE_PATH}
              stroke="#07A997"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="miter"
              className="pulse-path"
            />
            <circle
              cx={END_X}
              cy={END_Y}
              r="7"
              fill="#FF842B"
              className="pulse-end-dot"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
