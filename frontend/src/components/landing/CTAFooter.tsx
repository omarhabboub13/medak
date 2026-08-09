import type { LandingContent } from "@/lib/landing-types";
import { AppStoreBadge, PlayStoreBadge } from "./StoreBadges";

export default function CTAFooter({ content }: { content: LandingContent }) {
  return (
    <>
      <section
        id="download"
        className="relative overflow-hidden border-t border-teal-100 bg-teal-900 px-6 py-28 text-white"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-teal-100/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-sky/25 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <p className="font-display text-sm font-bold tracking-wide text-teal-100">
            {content.brandNameEn}
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold md:text-5xl">
            {content.downloadTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/75">
            {content.downloadSubtitle}
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <AppStoreBadge href={content.appStoreUrl} />
            <PlayStoreBadge href={content.playStoreUrl} />
          </div>
        </div>
      </section>

      <footer className="bg-teal-950 px-6 py-10 text-center text-sm text-white/50">
        <p className="font-display text-base text-white/90">
          {content.footerTagline}
        </p>
        <p className="mt-2">
          © {new Date().getFullYear()} {content.brandNameEn}
        </p>
      </footer>
    </>
  );
}
