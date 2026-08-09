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
      className="border-t border-teal-100 bg-sand px-6 py-24"
    >
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
        <div>
          <span className="font-display text-sm font-bold text-teal">
            للأطباء
          </span>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-ink md:text-4xl">
            {content.doctorsTitle}
          </h2>
          {content.doctorsIntro && (
            <p className="mt-4 max-w-md leading-relaxed text-ink/70">
              {content.doctorsIntro}
            </p>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f}
              className="flex items-start gap-2.5 rounded-xl bg-teal-50 p-4 text-sm leading-relaxed text-ink"
            >
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
              {f}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
