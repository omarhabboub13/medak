import type { LandingContent } from "@/lib/landing-types";

export default function PatientFeatures({
  content,
}: {
  content: LandingContent;
}) {
  const features = content.patientFeatures || [];
  return (
    <section id="patients" className="px-4 py-16 sm:px-6 sm:py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mt-2 font-display text-3xl font-extrabold text-ink sm:text-4xl md:text-5xl">
          {content.patientsTitle}
        </h2>
        {content.patientsIntro && (
          <p className="mt-4 max-w-2xl text-base text-ink/60 sm:text-lg md:text-xl">
            {content.patientsIntro}
          </p>
        )}

        <div className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-teal-100 bg-white p-6 transition hover:border-teal/40 hover:shadow-md sm:p-8"
            >
              <h3 className="font-display text-xl font-bold text-teal sm:text-2xl">
                {f.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {(f.items || []).map((it) => (
                  <li
                    key={it}
                    className="flex items-start gap-2 text-base leading-relaxed text-ink/70 sm:text-lg"
                  >
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
