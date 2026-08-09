import type { LandingContent } from "@/lib/landing-types";

export default function ForWhom({ content }: { content: LandingContent }) {
  const audiences = content.audiences || [];
  return (
    <section className="border-t border-teal-100 bg-sand px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl font-extrabold text-ink md:text-4xl">
          {content.audienceTitle}
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {audiences.map((a) => (
            <div key={a.title} className="border-r-2 border-teal pr-6">
              <h3 className="font-display text-xl font-bold text-teal">
                {a.title}
              </h3>
              <p className="mt-3 leading-relaxed text-ink/70">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
