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

export const DISCIPLINES = [
  { id: "01", title: "الأعمال المدنية", en: "Civil", items: ["التجهيز والبنية التحتية", "الحفر والردم والأساسات", "التشطيبات الفاخرة"] },
  { id: "02", title: "الحلول الميكانيكية", en: "Mechanical", items: ["التكييف المركزي HVAC", "أنظمة مكافحة الحريق", "السباكة والمياه المبردة"] },
  { id: "03", title: "الحلول الكهربائية", en: "Electrical", items: ["أنظمة الإضاءة والطاقة", "التأريض والصواعق", "الكابلات وحواملها"] },
  { id: "04", title: "التيار المنخفض", en: "Low Current", items: ["إدارة المباني BMS", "إنذار الحريق", "استدعاء الممرضين"] },
] as const;

export const PROJECTS = [
  { tag: "طبي", title: "مدينة الملك فهد الطبية", detail: "تجديد العناية المركزة للأعصاب", place: "الرياض" },
  { tag: "طب نووي", title: "مستشفى الملك عبدالعزيز", detail: "وحدة الطب النووي والحماية الإشعاعية", place: "الرياض" },
  { tag: "بنية تحتية", title: "مشروع قطار الشمال", detail: "التشطيبات وأنظمة التحكم والسلامة", place: "شمال المملكة" },
  { tag: "تقنية", title: "مجموعة MBC", detail: "استوديوهات البث المتكاملة", place: "الرياض" },
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
