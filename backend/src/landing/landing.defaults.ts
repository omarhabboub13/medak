export type LandingLocale = 'ar' | 'en' | 'ku';

export const LANDING_LOCALES: LandingLocale[] = ['ar', 'en', 'ku'];

export const LOCALE_META: Record<
  LandingLocale,
  { label: string; native: string; dir: 'rtl' | 'ltr'; htmlLang: string }
> = {
  ar: { label: 'Arabic', native: 'العربية', dir: 'rtl', htmlLang: 'ar' },
  en: { label: 'English', native: 'English', dir: 'ltr', htmlLang: 'en' },
  ku: { label: 'Kurdish', native: 'کوردی', dir: 'rtl', htmlLang: 'ckb' },
};

const sharedUrls = {
  appStoreUrl: '',
  playStoreUrl: '',
};

export const defaultLandingByLocale: Record<
  LandingLocale,
  Record<string, unknown>
> = {
  ar: {
    brandName: 'مدك',
    brandNameEn: 'Medak',
    heroTitle: 'منصة الرعاية الصحية',
    heroHighlight: 'بين يديك',
    heroSubtitle:
      'ابحث عن الأطباء، واحجز مواعيدك، واحصل على استشارة رقمية ووصفة طبية في أي وقت وأي مكان.',
    heroSupport:
      'مدك هو تطبيق رعاية صحية عن بُعد يربطك بأفضل الأطباء والاختصاصيين عبر الفيديو والدردشة، مع وصفات إلكترونية — كل ذلك من هاتفك.',
    whyTitle: 'لماذا مدك؟',
    whyIntro: 'رعاية صحية عن بُعد متكاملة — مصممة حول ثقتك ووقتك.',
    whyItems: [
      {
        title: 'استشارة موثوقة',
        desc: 'استشارة طبية موثوقة من أي مكان دون عناء الانتقال.',
      },
      {
        title: 'توفير الوقت',
        desc: 'حجز المواعيد إلكترونيًا واختيار الوقت المناسب لك.',
      },
      {
        title: 'تواصل مباشر',
        desc: 'مع الطبيب بالفيديو أو الدردشة أو الصوت.',
      },
      {
        title: 'سجل منظم',
        desc: 'سجل طبي ووصفات إلكترونية منظّمة في مكان واحد.',
      },
      {
        title: 'مساعد ذكي',
        desc: 'ذكاء اصطناعي للإجابة عن استفساراتك الصحية الأولية.',
      },
      {
        title: 'بالعربية بالكامل',
        desc: 'دعم كامل للغة العربية وواجهة عصرية سهلة الاستخدام.',
      },
    ],
    patientsTitle: 'المزايا الرئيسية للمرضى',
    patientsIntro:
      'من البحث والحجز إلى الاستشارة والوصفة والمحفظة — كل رحلتك الصحية في مكان واحد.',
    patientFeatures: [
      {
        title: 'البحث عن الأطباء والاختصاصات',
        items: [
          'تصفّح الأطباء حسب التخصص',
          'قوائم الأطباء المميّزين',
          'بحث ذكي مع فلاتر متقدمة',
          'تفاصيل الطبيب والتقييمات والموقع',
          'حفظ الأطباء المفضّلين',
        ],
      },
      {
        title: 'حجز المواعيد',
        items: [
          'اختيار التاريخ والوقت المتاح',
          'تأكيد الحجز بخطوات بسيطة',
          'كوبونات الخصم',
          'إدارة وإلغاء وإعادة جدولة المواعيد',
        ],
      },
      {
        title: 'الاستشارات والمساعد الذكي',
        items: [
          'مكالمات فيديو عالية الجودة',
          'دردشة وتبادل الملفات',
          'مساعد ذكاء اصطناعي للأسئلة الأولية',
        ],
      },
      {
        title: 'الوصفات والمحفظة',
        items: [
          'وصفات إلكترونية',
          'محفظة رقمية للشحن والدفع',
          'دعم العربية والإنجليزية والكردية',
        ],
      },
    ],
    doctorsTitle: 'المزايا الرئيسية للأطباء',
    doctorsIntro:
      'يوفّر مدك لوحة متكاملة للأطباء لإدارة عياداتهم الرقمية.',
    doctorFeatures: [
      'إنشاء وإدارة الملف المهني',
      'إدارة المواعيد والفترات الزمنية',
      'استقبال طلبات المرضى',
      'إصدار الوصفات الطبية إلكترونيًا',
      'إدارة المرضى',
      'تقارير الأرباح',
      'المحفظة والسحوبات',
      'الاشتراكات وموقع العيادة على الخريطة',
    ],
    howTitle: 'كيف يعمل مدك؟',
    howIntro: 'خمس خطوات بسيطة من التسجيل حتى استلام الوصفة الطبية.',
    howSteps: [
      { title: 'سجّل الدخول', desc: 'عبر رقم هاتفك أو Google/Apple.' },
      { title: 'ابحث عن الطبيب', desc: 'حسب التخصص أو الموقع.' },
      { title: 'احجز موعدك', desc: 'اختر الوقت وأتمم الدفع.' },
      { title: 'استشر طبيبك', desc: 'عبر الفيديو أو الدردشة.' },
      { title: 'استلم وصفتك', desc: 'واحفظها في سجلك.' },
    ],
    audienceTitle: 'لمن هذا التطبيق؟',
    audiences: [
      {
        title: 'المرضى',
        desc: 'الباحثون عن استشارة طبية سريعة وموثوقة دون الانتقال.',
      },
      {
        title: 'الأطباء والاختصاصيون',
        desc: 'الراغبون في تقديم خدماتهم رقميًا وإدارة عياداتهم بمرونة.',
      },
    ],
    techTitle: 'أبرز التقنيات',
    techIntro: '',
    techItems: [],
    downloadTitle: 'حمّل التطبيق الآن',
    downloadSubtitle: 'متوفّر قريبًا على App Store و Google Play',
    footerTagline: 'مدك — صحتك تبدأ من هاتفك.',
    ...sharedUrls,
  },
  en: {
    brandName: 'Medak',
    brandNameEn: 'Medak',
    heroTitle: 'Healthcare',
    heroHighlight: 'in your hands',
    heroSubtitle:
      'Find doctors, book appointments, and get digital consultations and e-prescriptions anytime, anywhere.',
    heroSupport:
      'Medak is a telemedicine app that connects you with top specialists via video and chat — with electronic prescriptions, all from your phone.',
    whyTitle: 'Why Medak?',
    whyIntro: 'Complete remote care — built around your trust and your time.',
    whyItems: [
      {
        title: 'Trusted care',
        desc: 'Reliable medical consultation from anywhere.',
      },
      {
        title: 'Save time',
        desc: 'Book appointments online at a time that suits you.',
      },
      {
        title: 'Direct contact',
        desc: 'Talk to your doctor by video, chat, or voice.',
      },
      {
        title: 'Organized records',
        desc: 'Medical history and e-prescriptions in one place.',
      },
      {
        title: 'Smart assistant',
        desc: 'AI answers for initial health questions.',
      },
      {
        title: 'Multilingual',
        desc: 'Arabic, English, and Kurdish with a modern UI.',
      },
    ],
    patientsTitle: 'For patients',
    patientsIntro:
      'From search and booking to consultation, prescriptions, and wallet — your full health journey.',
    patientFeatures: [
      {
        title: 'Find doctors & specialties',
        items: [
          'Browse by specialty',
          'Featured specialists',
          'Smart search and filters',
          'Ratings, details, and map location',
          'Save favorite doctors',
        ],
      },
      {
        title: 'Book appointments',
        items: [
          'Pick available date and time',
          'Simple booking steps',
          'Discount coupons',
          'Manage, cancel, or reschedule',
        ],
      },
      {
        title: 'Remote care & AI',
        items: [
          'High-quality video calls',
          'Chat and file sharing',
          'Ask AI for initial guidance',
        ],
      },
      {
        title: 'Prescriptions & wallet',
        items: [
          'Electronic prescriptions',
          'In-app wallet for payments',
          'Arabic, English, and Kurdish support',
        ],
      },
    ],
    doctorsTitle: 'For doctors',
    doctorsIntro: 'A complete digital clinic dashboard for doctors.',
    doctorFeatures: [
      'Professional profile management',
      'Availability slots and schedule',
      'Patient booking requests',
      'Issue e-prescriptions',
      'Patient management',
      'Earnings reports',
      'Wallet and withdrawals',
      'Subscriptions and clinic map location',
    ],
    howTitle: 'How Medak works',
    howIntro: 'Five simple steps from sign-in to your prescription.',
    howSteps: [
      { title: 'Sign in', desc: 'With phone, Google, or Apple.' },
      { title: 'Find a doctor', desc: 'By specialty or location.' },
      { title: 'Book', desc: 'Choose a time and pay.' },
      { title: 'Consult', desc: 'By video or chat.' },
      { title: 'Get your Rx', desc: 'Saved in your records.' },
    ],
    audienceTitle: 'Who is it for?',
    audiences: [
      {
        title: 'Patients',
        desc: 'Anyone who wants fast, trusted care without travel.',
      },
      {
        title: 'Doctors & specialists',
        desc: 'Professionals who want to offer care digitally with flexible clinic tools.',
      },
    ],
    techTitle: 'Technology',
    techIntro: '',
    techItems: [],
    downloadTitle: 'Download the app',
    downloadSubtitle: 'Coming soon on the App Store and Google Play',
    footerTagline: 'Medak — your health starts on your phone.',
    ...sharedUrls,
  },
  ku: {
    brandName: 'مێدەک',
    brandNameEn: 'Medak',
    heroTitle: 'سەکۆی چاودێری تەندروستی',
    heroHighlight: 'لە دەستتدایە',
    heroSubtitle:
      'دکتۆر بدۆزەرەوە، کاتی حجز بکە، و ڕاوێژ و وەسفەی ئەلیکترۆنی لە هەر کات و شوێنێک وەربگرە.',
    heroSupport:
      'مێدەک ئەپی تەلەمێدیسینە کە بە ڤیدیۆ و چات پەیوەندیت بە پسپۆڕەکان دەکات — لەگەڵ وەسفەی ئەلیکترۆنی، هەمووی لە مۆبایلەکەت.',
    whyTitle: 'بۆچی مێدەک؟',
    whyIntro: 'چاودێری تەواو لە دوورەوە — بۆ متمانە و کاتت دروستکراوە.',
    whyItems: [
      {
        title: 'ڕاوێژی متمانەپێکراو',
        desc: 'ڕاوێژی پزیشکی لە هەر شوێنێک بەبێ گەشتکردن.',
      },
      {
        title: 'کات پاشەکەوت بکە',
        desc: 'حجزکردنی ئەلیکترۆنی لە کاتی گونجاو بۆ تۆ.',
      },
      {
        title: 'پەیوەندی ڕاستەوخۆ',
        desc: 'لەگەڵ دکتۆر بە ڤیدیۆ، چات یان دەنگ.',
      },
      {
        title: 'تۆماری ڕێکخراو',
        desc: 'مێژووی پزیشکی و وەسفەکان لە یەک شوێن.',
      },
      {
        title: 'یاریدەدەری زیر',
        desc: 'وەڵامی سەرەتایی بۆ پرسیارە تەندروستییەکان.',
      },
      {
        title: 'سێ زمان',
        desc: 'عەرەبی، ئینگلیزی و کوردی بە ڕووکاری مۆدێرن.',
      },
    ],
    patientsTitle: 'سوودەکان بۆ نەخۆش',
    patientsIntro:
      'لە گەڕان و حجزەوە تا ڕاوێژ، وەسفە و جزدان — هەموو گەشتەکەت لە یەک شوێن.',
    patientFeatures: [
      {
        title: 'دۆزینەوەی دکتۆر و پسپۆڕی',
        items: [
          'گەڕان بەپێی پسپۆڕی',
          'دکتۆرە تایبەتەکان',
          'گەڕانی زیر و فلتەر',
          'هەڵسەنگاندن و شوێن لەسەر نەخشە',
          'پاشەکەوتکردنی دکتۆری دڵخواز',
        ],
      },
      {
        title: 'حجزکردنی کات',
        items: [
          'هەڵبژاردنی بەروار و کات',
          'هەنگاوی ئاسان بۆ پشتڕاستکردنەوە',
          'کوپۆنی داشکاندن',
          'بەڕێوەبردن، هەڵوەشاندنەوە و دووبارە کاتدانان',
        ],
      },
      {
        title: 'ڕاوێژ و یاریدەدەری زیر',
        items: [
          'پەیوەندی ڤیدیۆی کوالێتی بەرز',
          'چات و ناردنی فایل',
          'Ask AI بۆ ڕێنمایی سەرەتایی',
        ],
      },
      {
        title: 'وەسفە و جزدان',
        items: [
          'وەسفەی ئەلیکترۆنی',
          'جزدانی ناو ئەپ بۆ پارەدان',
          'پشتگیری عەرەبی، ئینگلیزی و کوردی',
        ],
      },
    ],
    doctorsTitle: 'سوودەکان بۆ دکتۆر',
    doctorsIntro: 'داشبۆردێکی تەواو بۆ بەڕێوەبردنی کلینیکی دیجیتاڵی.',
    doctorFeatures: [
      'بەڕێوەبردنی پڕۆفایلی پیشەیی',
      'کاتەکانی بەردەستبوون',
      'وەرگرتنی داواکاری نەخۆش',
      'دەرکردنی وەسفەی ئەلیکترۆنی',
      'بەڕێوەبردنی نەخۆشەکان',
      'ڕاپۆرتی قازانج',
      'جزدان و وەرگرتنەوەی پارە',
      'بەشداریکردن و شوێنی کلینیک لەسەر نەخشە',
    ],
    howTitle: 'مێدەک چۆن کار دەکات؟',
    howIntro: 'پێنج هەنگاوی ئاسان لە چوونەژوورەوە تا وەسفە.',
    howSteps: [
      { title: 'بچۆ ژوورەوە', desc: 'بە ژمارەی مۆبایل یان Google/Apple.' },
      { title: 'دکتۆر بدۆزەرەوە', desc: 'بەپێی پسپۆڕی یان شوێن.' },
      { title: 'کات حجز بکە', desc: 'کات هەڵبژێرە و پارە بدە.' },
      { title: 'ڕاوێژ بکە', desc: 'بە ڤیدیۆ یان چات.' },
      { title: 'وەسفەکەت وەربگرە', desc: 'لە تۆمارەکەتدا بمێنێتەوە.' },
    ],
    audienceTitle: 'بۆ کێیە؟',
    audiences: [
      {
        title: 'نەخۆشەکان',
        desc: 'ئەوانەی دەیانەوێت ڕاوێژی خێرا و متمانەپێکراو بەبێ گەشت.',
      },
      {
        title: 'دکتۆر و پسپۆڕەکان',
        desc: 'ئەوانەی دەیانەوێت خزمەتگوزاری دیجیتاڵی و کلینیکی نەرم پێشکەش بکەن.',
      },
    ],
    techTitle: 'تەکنەلۆژیا',
    techIntro: '',
    techItems: [],
    downloadTitle: 'ئەپەکە دابەزێنە',
    downloadSubtitle: 'بەمزووان لە App Store و Google Play',
    footerTagline: 'مێدەک — تەندروستیت لە مۆبایلەکەتەوە دەست پێدەکات.',
    ...sharedUrls,
  },
};
