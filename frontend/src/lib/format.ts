const moneyFmt = new Intl.NumberFormat("ar-IQ", {
  style: "decimal",
  maximumFractionDigits: 0,
});

const dateFmt = new Intl.DateTimeFormat("ar-IQ", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatMoney(value: string | number) {
  return `${moneyFmt.format(Number(value))} د.ع`;
}

export function formatDateTime(value: string | Date) {
  return dateFmt.format(new Date(value));
}

export const DAY_NAMES = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "قيد الانتظار",
  CONFIRMED: "مؤكد",
  CANCELLED: "ملغى",
  COMPLETED: "مكتمل",
  DEPOSIT: "إيداع",
  WITHDRAWAL: "سحب",
  PAYMENT: "دفع",
  REFUND: "استرداد",
  FAILED: "فشل",
};

export const CONSULT_LABELS: Record<string, string> = {
  VIDEO: "فيديو",
  CHAT: "دردشة",
  VOICE: "صوت",
};
