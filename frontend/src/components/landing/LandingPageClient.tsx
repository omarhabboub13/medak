"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import WhyMedak from "@/components/landing/WhyMedak";
import PatientFeatures from "@/components/landing/PatientFeatures";
import DoctorSection from "@/components/landing/DoctorSection";
import HowItWorks from "@/components/landing/HowItWorks";
import ForWhom from "@/components/landing/ForWhom";
import CTAFooter from "@/components/landing/CTAFooter";
import { LocaleProvider, useLocale } from "@/lib/LocaleProvider";
import {
  FALLBACK_LANDING,
  type LandingContent,
} from "@/lib/landing-types";

function LandingBody() {
  const { locale, dir } = useLocale();
  const [content, setContent] = useState<LandingContent>(FALLBACK_LANDING);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    fetch(`${base}/landing?lang=${locale}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data) setContent(data as LandingContent);
      })
      .catch(() => {
        if (!cancelled) setContent(FALLBACK_LANDING);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  if (loading && !content.heroTitle) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        ...
      </div>
    );
  }

  return (
    <main dir={dir} className="min-h-screen bg-sand text-ink">
      <Navbar content={content} />
      <Hero content={content} />
      <WhyMedak content={content} />
      <PatientFeatures content={content} />
      <DoctorSection content={content} />
      <HowItWorks content={content} />
      <ForWhom content={content} />
      <CTAFooter content={content} />
    </main>
  );
}

export default function LandingPageClient() {
  return (
    <LocaleProvider>
      <LandingBody />
    </LocaleProvider>
  );
}
