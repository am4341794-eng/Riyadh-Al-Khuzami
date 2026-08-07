/**
 * Single source of truth for every string and data point on the page.
 * Sections read from here so copy can be edited (or translated) without
 * touching a single animation file.
 */

export const COMPANY = {
  nameAr: "رياض الخزامى المحدودة",
  nameEn: "Riyadh Al Khozamah Co.",
  tagline: "مزود خدمة متكامل للإنشاءات والأعمال المدنية وتجهيز المستشفيات",
  foundedYear: 1995,
  phone: "+966 11 227 0775",
  phoneHref: "tel:+966112270775",
  email: "info@riyadhalkozhama.com",
  website: "riyadh-alkhozhama.com",
  websiteHref: "https://riyadh-alkhozhama.com",
  whatsappHref: "https://wa.me/966112270775",
  profileHref: "/brand/profile.pdf",
  address: {
    street: "شارع الأمير سلطان بن عبدالعزيز",
    poBox: "ص.ب ٣٠١٣٢٨، الرياض ١٢٢٢٣",
    country: "المملكة العربية السعودية",
  },
} as const;

export const HERO = {
  eyebrow: "منذ ١٩٩٥ · المملكة العربية السعودية",
  titleLines: ["نبني المستقبل", "بمعايير ذهبية"],
  accentWordIndex: 1,
  lede:
    "خمسة وعشرون عاماً من الأعمال المدنية والتشطيبات وتجهيز المستشفيات، بخبرة هندسية تخدم الرؤية الجديدة للمملكة.",
  scrollHint: "مرّر للأسفل",
  marquee: "CIVIL · MEDICAL · INFRASTRUCTURE · SECURITY · MECHANICAL · ELECTRICAL",
} as const;

export const CHAPTERS = {
  logistics: {
    index: "٠٢",
    label: "التجهيز",
    title: "من المستودع",
    titleAccent: "يبدأ المشروع",
    body:
      "تعبئة الموقع، وإدارة المواد، وجدولة المعدات. كل حمولة تُحصى وتُوثّق قبل أن تغادر المستودع نحو الموقع.",
    notes: [
      { k: "المواد المعتمدة", v: "Saudi Ready Mix · Rajihi Steel" },
      { k: "إدارة المخزون", v: "جرد رقمي لحظي" },
      { k: "السلامة", v: "التزام تام بمعايير SHE" },
    ],
  },
  transport: {
    index: "٠٣",
    label: "النقل والإمداد",
    title: "أسطول يصل",
    titleAccent: "إلى كل منطقة",
    body:
      "شبكة نقل تغطي مناطق المملكة كافة، تنقل المعدات الثقيلة والأنظمة الطبية الدقيقة بجدولة صارمة تحفظ الموعد.",
    stats: [
      { k: "١٣", v: "منطقة مغطاة" },
      { k: "٢٤/٧", v: "متابعة لوجستية" },
      { k: "٩٨٪", v: "التزام بالمواعيد" },
    ],
  },
  horizon: {
    index: "٠٤",
    label: "التحوّل",
    title: "من الأرض",
    titleAccent: "إلى السماء",
    body:
      "حيث تتحول الخطوط الأرضية إلى مسارات عابرة للحدود — تحالفات دولية وسلاسل توريد تمتد خارج المملكة.",
  },
  sky: {
    index: "٠٥",
    label: "الآفاق",
    title: "شراكات",
    titleAccent: "عابرة للحدود",
    body:
      "شراكة استراتيجية مع شركة وادي النيل للمقاولات والاستثمارات العقارية تمنحنا عمقاً تنفيذياً وكوادر عالية المهارة.",
    highlights: [
      "أكثر من ٢٥٠ محطة سكة حديد و٣ موانئ رئيسية",
      "مستشفى وادي النيل ومستشفى شرم الشيخ الدولي",
      "٨٦ مبنى في العاصمة الإدارية الجديدة",
    ],
  },
} as const;

export type StatCard = {
  id: string;
  value: number;
  suffix: string;
  label: string;
  caption: string;
  /** 0–1, drives the card's progress meter. */
  progress: number;
};

export const STATS: StatCard[] = [
  {
    id: "projects",
    value: 100,
    suffix: "+",
    label: "مشروع منجز",
    caption: "بين مدني وطبي وبنية تحتية",
    progress: 0.92,
  },
  {
    id: "years",
    value: 25,
    suffix: "+",
    label: "سنة خبرة",
    caption: "في السوق السعودي منذ ١٩٩٥",
    progress: 0.78,
  },
  {
    id: "clients",
    value: 60,
    suffix: "+",
    label: "عميل حكومي وخاص",
    caption: "وزارات وهيئات وشركات كبرى",
    progress: 0.66,
  },
  {
    id: "team",
    value: 250,
    suffix: "+",
    label: "موظف ومتخصص",
    caption: "كوادر هندسية وفنية متعددة الجنسيات",
    progress: 0.85,
  },
];

export type SectorSlice = {
  id: string;
  label: string;
  value: number;
  color: string;
};

/** Feeds the donut chart in the statistics section. Values are percentages. */
export const SECTORS: SectorSlice[] = [
  { id: "medical", label: "المشاريع الطبية", value: 38, color: "var(--color-gold)" },
  { id: "civil", label: "الأعمال المدنية", value: 27, color: "var(--color-spectrum-2)" },
  { id: "gov", label: "المشاريع الحكومية", value: 21, color: "var(--color-spectrum-5)" },
  { id: "tech", label: "التقنية والأمنية", value: 14, color: "var(--color-spectrum-4)" },
];

export type CapacityBar = { id: string; label: string; value: number };

/** Feeds the animated bar chart — capability coverage per discipline. */
export const CAPACITY: CapacityBar[] = [
  { id: "civil", label: "أعمال مدنية", value: 96 },
  { id: "mechanical", label: "ميكانيكا وHVAC", value: 88 },
  { id: "electrical", label: "كهرباء", value: 91 },
  { id: "lowcurrent", label: "تيار منخفض", value: 84 },
  { id: "security", label: "أنظمة أمنية", value: 79 },
  { id: "it", label: "شبكات وتقنية", value: 73 },
];

export type Discipline = {
  id: string;
  title: string;
  en: string;
  summary: string;
  items: readonly string[];
};

/** The six engineering disciplines the company delivers under one contract. */
export const DISCIPLINES: readonly Discipline[] = [
  {
    id: "٠١",
    title: "الأعمال المدنية",
    en: "Civil",
    summary: "من تجهيز الموقع حتى التسليم النهائي بأعلى معايير الجودة.",
    items: [
      "التجهيز وإدارة الموقع",
      "البنية التحتية والحفر والردم",
      "أعمال التشطيبات الفاخرة",
      "الأثاث وتجهيز المواقع",
    ],
  },
  {
    id: "٠٢",
    title: "الحلول الميكانيكية",
    en: "Mechanical",
    summary: "أنظمة تكييف وإطفاء وسباكة مصمّمة لأحمال المنشآت الكبرى.",
    items: [
      "أنظمة التكييف المركزي HVAC",
      "أنظمة مكافحة الحريق",
      "السباكة والمياه المبردة",
    ],
  },
  {
    id: "٠٣",
    title: "الحلول الكهربائية",
    en: "Electrical",
    summary: "توزيع الطاقة والحماية من الجهد المنخفض إلى العالي.",
    items: [
      "أنظمة الإضاءة والطاقة",
      "أنظمة التأريض والصواعق",
      "تمديد الكابلات وحواملها",
    ],
  },
  {
    id: "٠٤",
    title: "أنظمة التيار المنخفض",
    en: "Low Current",
    summary: "العقل التشغيلي للمبنى: مراقبة وإنذار واستدعاء.",
    items: [
      "نظام إدارة المباني BMS",
      "نظام إنذار الحريق",
      "نظام استدعاء الممرضين",
    ],
  },
  {
    id: "٠٥",
    title: "الأنظمة الأمنية",
    en: "Security",
    summary: "حماية متكاملة للمنشآت الحساسة والمرافق الحكومية.",
    items: [
      "كاميرات المراقبة CCTV",
      "أنظمة التحكم بالدخول",
      "حلول بطاقات الفنادق وأمن المنازل",
    ],
  },
  {
    id: "٠٦",
    title: "تقنية المعلومات والشبكات",
    en: "IT & Networks",
    summary: "مراكز بيانات وشبكات مؤسسية جاهزة للتوسّع.",
    items: [
      "مراكز البيانات وغرف التحكم",
      "حلول الهواتف الشبكية IP",
      "تصميم وتنفيذ شبكات الشركات",
    ],
  },
] as const;

export type Project = {
  tag: string;
  title: string;
  detail: string;
  place: string;
};

/** Reference projects, as listed in the company profile. */
export const PROJECTS: readonly Project[] = [
  {
    tag: "طبي",
    title: "مدينة الملك فهد الطبية",
    detail: "تجديد العناية المركزة للأعصاب لـ ١٥ مريضاً وتركيب المعدات الطبية.",
    place: "الرياض",
  },
  {
    tag: "طب نووي",
    title: "مستشفى الملك عبدالعزيز",
    detail: "وحدة الطب النووي والحماية الإشعاعية وأنظمة الغازات الطبية.",
    place: "الرياض",
  },
  {
    tag: "مشاريع طبية",
    title: "مستشفى السجن المركزي",
    detail: "غرف العمليات والإفاقة وشبكة الغازات الطبية للأنظمة الكهروميكانيكية.",
    place: "القصيم والرياض",
  },
  {
    tag: "بنية تحتية",
    title: "مشروع قطار الشمال",
    detail: "التشطيبات والبنية التحتية ومنظومة أنظمة التحكم والسلامة للمحطات.",
    place: "شمال المملكة",
  },
  {
    tag: "أعمال مدنية",
    title: "أبراج موبايلي — ٨ وحدات",
    detail: "أنظمة التيار المنخفض والكهروميكانيكا مع الأعمال الخرسانية.",
    place: "جميع أنحاء المملكة",
  },
  {
    tag: "مشاريع حكومية",
    title: "جامعة الملك سعود",
    detail: "الإصلاحات الإنشائية وحقن الأساسات وعزل المياه.",
    place: "الرياض",
  },
  {
    tag: "بنية تحتية",
    title: "مشاريع وزارة النقل",
    detail: "الحفر والردم والأساسات وشبكات الصرف والمياه والكهرباء.",
    place: "منطقة الرياض",
  },
  {
    tag: "قصور وفلل",
    title: "قصر الأمير تركي بن سلطان",
    detail: "الأنظمة الكهروميكانيكية والتشطيبات الفاخرة والأنظمة الأمنية.",
    place: "الرياض",
  },
  {
    tag: "تقنية / بث",
    title: "مجموعة MBC",
    detail: "تصميم وتوريد وتركيب استوديوهات البث وأنظمة التحكم والإضاءة.",
    place: "الرياض",
  },
] as const;

/** Options offered by the project request form. */
export const REQUEST_SERVICES = [
  "الأعمال المدنية",
  "المشاريع الطبية (مستشفيات)",
  "الأنظمة الأمنية والتقنية",
  "الحلول الميكانيكية",
  "الحلول الكهربائية",
  "أخرى",
] as const;

export const CLIENTS = [
  "وزارة الدفاع",
  "وزارة الصحة",
  "وزارة الداخلية",
  "وزارة النقل",
  "وزارة التعليم",
  "شركة المياه الوطنية",
  "السعودية للكهرباء",
  "STC",
  "أرامكو الطبي",
  "جامعة الملك سعود",
  "الخطوط الحديدية السعودية",
  "مجموعة MBC",
] as const;

export const CTA = {
  eyebrow: "الخطوة التالية",
  titleLines: ["لنبنِ", "التالي معاً"],
  body:
    "شاركنا تفاصيل مشروعك وسيعود إليك فريقنا الهندسي بعرض فني وسعري خلال ٤٨ ساعة.",
  primary: { label: "اطلب عرض سعر", href: "https://wa.me/966112270775" },
  secondary: { label: "تحميل البروفايل", href: "/brand/profile.pdf" },
} as const;

export const FOOTER_LINKS = [
  { label: "من نحن", href: "#logistics" },
  { label: "مجالات التخصص", href: "#transport" },
  { label: "أبرز مشاريعنا", href: "#figures" },
  { label: "تواصل معنا", href: "#contact" },
] as const;
