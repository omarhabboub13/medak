import type { LandingContent } from "@/lib/landing-types";

export default function HowItWorks({ content }: { content: LandingContent }) {
  const steps = content.howSteps || [];
  return (
    <section id="how" className="border-t border-teal-100 bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl font-extrabold text-ink md:text-4xl">
          {content.howTitle}
        </h2>
        {content.howIntro && (
          <p className="mt-3 max-w-lg text-ink/60">{content.howIntro}</p>
        )}

        <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <li key={`${s.title}-${i}`} className="relative">
              <span className="font-display text-3xl font-extrabold text-teal/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-teal">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
