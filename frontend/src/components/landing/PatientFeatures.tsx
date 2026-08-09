import type { LandingContent } from "@/lib/landing-types";

export default function PatientFeatures({
  content,
}: {
  content: LandingContent;
}) {
  const features = content.patientFeatures || [];
  return (
    <section id="patients" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <span className="font-display text-sm font-bold text-teal">
          للمرضى
        </span>
        <h2 className="mt-2 font-display text-3xl font-extrabold text-ink md:text-4xl">
          {content.patientsTitle}
        </h2>
        {content.patientsIntro && (
          <p className="mt-3 max-w-xl text-ink/60">{content.patientsIntro}</p>
        )}

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-teal-100 bg-white p-8 transition hover:border-teal/40 hover:shadow-md"
            >
              <h3 className="font-display text-xl font-bold text-teal">
                {f.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {(f.items || []).map((it) => (
                  <li
                    key={it}
                    className="flex items-start gap-2 text-sm leading-relaxed text-ink/70"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
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
