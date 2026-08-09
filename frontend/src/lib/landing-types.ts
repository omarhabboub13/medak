export type WhyItem = { title: string; desc: string };
export type FeatureBlock = { title: string; items: string[] };
export type StepItem = { title: string; desc: string };
export type AudienceItem = { title: string; desc: string };
export type TechItem = { title: string; desc: string };

export interface LandingContent {
  id: string;
  brandName: string;
  brandNameEn: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroSupport?: string | null;
  whyTitle: string;
  whyIntro?: string | null;
  whyItems: WhyItem[];
  patientsTitle: string;
  patientsIntro?: string | null;
  patientFeatures: FeatureBlock[];
  doctorsTitle: string;
  doctorsIntro?: string | null;
  doctorFeatures: string[];
  howTitle: string;
  howIntro?: string | null;
  howSteps: StepItem[];
  audienceTitle: string;
  audiences: AudienceItem[];
  techTitle: string;
  techIntro?: string | null;
  techItems: TechItem[];
  downloadTitle: string;
  downloadSubtitle: string;
  appStoreUrl?: string | null;
  playStoreUrl?: string | null;
  footerTagline: string;
  updatedAt?: string;
}

export const FALLBACK_LANDING: LandingContent = {
  id: "main",
  brandName: "مدك",
  brandNameEn: "Medak",
  heroTitle: "منصة الرعاية الصحية",
  heroHighlight: "بين يديك",
  heroSubtitle:
    "ابحث عن الأطباء، واحجز مواعيدك، واحصل على استشارة رقمية ووصفة طبية في أي وقت وأي مكان.",
  heroSupport:
    "مدك هو تطبيق رعاية صحية عن بُعد يربطك بأفضل الأطباء عبر الفيديو والدردشة — كل ذلك من هاتفك.",
  whyTitle: "لماذا مدك؟",
  whyIntro: "رعاية صحية عن بُعد متكاملة — مصممة حول ثقتك ووقتك.",
  whyItems: [
    { title: "استشارة موثوقة", desc: "من أي مكان دون عناء الانتقال." },
    { title: "توفير الوقت", desc: "احجز مواعيدك إلكترونيًا." },
    { title: "تواصل مباشر", desc: "فيديو أو دردشة أو صوت." },
    { title: "سجل منظم", desc: "وصفات وسجل طبي في مكان واحد." },
    { title: "مساعد ذكي", desc: "إجابات أولية لاستفساراتك." },
    { title: "بالعربية بالكامل", desc: "واجهة عصرية وسهلة." },
  ],
  patientsTitle: "المزايا الرئيسية للمرضى",
  patientsIntro: "كل رحلتك الصحية في مكان واحد.",
  patientFeatures: [
    {
      title: "البحث عن الأطباء",
      items: ["تصفّح حسب التخصص", "فلاتر متقدمة", "حفظ المفضّلين"],
    },
  ],
  doctorsTitle: "المزايا الرئيسية للأطباء",
  doctorsIntro: "لوحة متكاملة لإدارة عيادتك الرقمية.",
  doctorFeatures: [
    "إدارة الملف المهني",
    "إدارة المواعيد والفترات",
    "إصدار الوصفات",
    "الأرباح والسحوبات",
  ],
  howTitle: "كيف يعمل مدك؟",
  howIntro: "خمس خطوات بسيطة.",
  howSteps: [
    { title: "سجّل الدخول", desc: "برقم هاتفك أو Google/Apple." },
    { title: "ابحث عن الطبيب", desc: "حسب التخصص أو الموقع." },
    { title: "احجز موعدك", desc: "واختر الوقت المناسب." },
    { title: "استشر طبيبك", desc: "عبر الفيديو أو الدردشة." },
    { title: "استلم وصفتك", desc: "واحفظها في التطبيق." },
  ],
  audienceTitle: "لمن هذا التطبيق؟",
  audiences: [
    { title: "المرضى", desc: "استشارة سريعة وموثوقة عن بُعد." },
    { title: "الأطباء", desc: "إدارة العيادة الرقمية بمرونة." },
  ],
  techTitle: "أبرز التقنيات",
  techIntro: "Flutter · Agora · Firebase · خرائط · RTL",
  techItems: [
    { title: "Flutter", desc: "Android و iOS بأداء أصلي." },
    { title: "Agora RTC", desc: "مكالمات فيديو عالية الجودة." },
    { title: "Firebase", desc: "إشعارات وقاعدة بيانات سحابية." },
  ],
  downloadTitle: "حمّل التطبيق الآن",
  downloadSubtitle: "متوفّر قريبًا على App Store و Google Play",
  appStoreUrl: "",
  playStoreUrl: "",
  footerTagline: "مدك — صحتك تبدأ من هاتفك.",
};
