"use client";

import { useState } from "react";
import { LanguageSwitcher, useLocale } from "@/lib/LocaleProvider";
import BrandLogo from "./BrandLogo";

export default function Navbar() {
  const { tt } = useLocale();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#why", label: tt("navWhy") },
    { href: "#patients", label: tt("navPatients") },
    { href: "#doctors", label: tt("navDoctors") },
    { href: "#how", label: tt("navHow") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-teal-100/60 bg-sand/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3">
        <a
          href="/"
          className="flex shrink-0 items-center self-center"
          aria-label="Medak home"
        >
          <BrandLogo />
        </a>

        <nav className="hidden items-center gap-6 text-base font-medium text-ink/70 lg:flex xl:gap-8 xl:text-lg">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-teal">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher className="hidden sm:flex" />
          <a
            href="#download"
            className="hidden rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 sm:inline-flex sm:text-base"
          >
            {tt("navDownload")}
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-teal/20 text-teal lg:hidden"
            aria-expanded={open}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              {open ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-teal-100 bg-sand px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-3 text-base font-medium text-ink/80 hover:bg-teal-50 hover:text-teal"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#download"
              className="mt-2 rounded-full bg-teal px-4 py-3 text-center text-base font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              {tt("navDownload")}
            </a>
            <div className="mt-3 flex justify-center sm:hidden">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
