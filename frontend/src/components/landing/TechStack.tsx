import type { LandingContent } from "@/lib/landing-types";

export default function TechStack({ content }: { content: LandingContent }) {
  const tech = content.techItems || [];
  return (
    <section id="tech" className="border-t border-teal-100 bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl font-extrabold text-ink md:text-4xl">
          {content.techTitle}
        </h2>
        {content.techIntro && (
          <p className="mt-3 max-w-2xl text-ink/60">{content.techIntro}</p>
        )}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tech.map((t) => (
            <div key={t.title} className="border-r-2 border-teal-600/40 pr-5">
              <h3 className="font-display text-lg font-bold text-teal-700">
                {t.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
