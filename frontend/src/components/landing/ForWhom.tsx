import type { LandingContent } from "@/lib/landing-types";

export default function ForWhom({ content }: { content: LandingContent }) {
  const audiences = content.audiences || [];
  return (
    <section className="border-t border-teal-100 bg-sand px-4 py-16 sm:px-6 sm:py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl md:text-5xl">
          {content.audienceTitle}
        </h2>
        <div className="mt-10 grid gap-8 sm:mt-12 md:grid-cols-2">
          {audiences.map((a) => (
            <div key={a.title} className="border-r-2 border-teal pr-6">
              <h3 className="font-display text-xl font-bold text-teal sm:text-2xl">
                {a.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-ink/70 sm:text-lg md:text-xl">
                {a.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
