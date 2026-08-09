import type { LandingContent } from "@/lib/landing-types";

export default function WhyMedak({ content }: { content: LandingContent }) {
  const items = content.whyItems || [];
  return (
    <section
      id="why"
      className="border-t border-teal-100 bg-teal px-4 py-16 text-white sm:px-6 sm:py-20 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl md:text-5xl">
          {content.whyTitle}
        </h2>
        {content.whyIntro && (
          <p className="mt-4 max-w-2xl text-base text-white/80 sm:text-lg md:text-xl">
            {content.whyIntro}
          </p>
        )}

        <div className="mt-12 grid gap-8 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((r, i) => (
            <div
              key={`${r.title}-${i}`}
              className="border-r-2 border-teal-100/70 pr-5"
            >
              <span className="font-display text-sm font-bold text-teal-100 sm:text-base">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-xl font-bold sm:text-2xl">
                {r.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-white/75 sm:text-lg">
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
