"use client";

import type { LandingContent } from "@/lib/landing-types";
import { LanguageSwitcher, useLocale } from "@/lib/LocaleProvider";

export default function Navbar({ content }: { content: LandingContent }) {
  const { tt } = useLocale();

  return (
    <header className="sticky top-0 z-50 border-b border-teal-100/60 bg-sand/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <a href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-display text-2xl font-extrabold text-teal">
            {content.brandName}
          </span>
          <span className="hidden text-sm text-ink/50 sm:inline">
            {content.brandNameEn}
          </span>
        </a>

        <nav className="hidden items-center gap-6 text-sm font-medium text-ink/70 lg:flex">
          <a href="#why" className="transition hover:text-teal">
            {tt("navWhy")}
          </a>
          <a href="#patients" className="transition hover:text-teal">
            {tt("navPatients")}
          </a>
          <a href="#doctors" className="transition hover:text-teal">
            {tt("navDoctors")}
          </a>
          <a href="#how" className="transition hover:text-teal">
            {tt("navHow")}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <a
            href="#download"
            className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            {tt("navDownload")}
          </a>
        </div>
      </div>
    </header>
  );
}
