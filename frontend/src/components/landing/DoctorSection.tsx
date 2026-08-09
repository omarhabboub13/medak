import type { LandingContent } from "@/lib/landing-types";

export default function DoctorSection({
  content,
}: {
  content: LandingContent;
}) {
  const features = content.doctorFeatures || [];
  return (
    <section
      id="doctors"
      className="border-t border-teal-100 bg-sand px-4 py-16 sm:px-6 sm:py-20 md:py-24"
    >
      <div className="mx-auto grid max-w-6xl gap-10 sm:gap-12 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-ink sm:text-4xl md:text-5xl">
            {content.doctorsTitle}
          </h2>
          {content.doctorsIntro && (
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink/70 sm:text-lg md:text-xl">
              {content.doctorsIntro}
            </p>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f}
              className="flex items-start gap-2.5 rounded-xl bg-teal-50 p-4 text-base leading-relaxed text-ink sm:text-lg"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
              {f}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
