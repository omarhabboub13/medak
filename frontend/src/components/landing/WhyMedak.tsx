import type { LandingContent } from "@/lib/landing-types";

export default function WhyMedak({ content }: { content: LandingContent }) {
  const items = content.whyItems || [];
  return (
    <section
      id="why"
      className="border-t border-teal-100 bg-teal px-6 py-24 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl font-extrabold md:text-4xl">
          {content.whyTitle}
        </h2>
        {content.whyIntro && (
          <p className="mt-3 max-w-lg text-white/80">{content.whyIntro}</p>
        )}

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((r, i) => (
            <div
              key={`${r.title}-${i}`}
              className="border-r-2 border-teal-100/70 pr-5"
            >
              <span className="font-display text-sm font-bold text-teal-100">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-xl font-bold">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
