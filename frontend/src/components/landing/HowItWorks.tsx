import type { LandingContent } from "@/lib/landing-types";

export default function HowItWorks({ content }: { content: LandingContent }) {
  const steps = content.howSteps || [];
  return (
    <section
      id="how"
      className="border-t border-teal-100 bg-white px-4 py-16 sm:px-6 sm:py-20 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl md:text-5xl">
          {content.howTitle}
        </h2>
        {content.howIntro && (
          <p className="mt-4 max-w-2xl text-base text-ink/60 sm:text-lg md:text-xl">
            {content.howIntro}
          </p>
        )}

        <ol className="mt-10 grid gap-8 sm:mt-14 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <li key={`${s.title}-${i}`} className="relative">
              <span className="font-display text-3xl font-extrabold text-teal/80 sm:text-4xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-teal sm:text-xl">
                {s.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-ink/65 sm:text-lg">
                {s.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
