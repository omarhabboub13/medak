import PageHeader from "@/components/ui/PageHeader";

const FAQS = [
  {
    q: "كيف أحجز موعدًا؟",
    a: "من صفحة الأطباء اختر طبيبًا، حدّد وقتًا من الفترات المتاحة، راجع ملخص الطلب، ثم أكّد الدفع من المحفظة.",
  },
  {
    q: "كيف أشحن المحفظة؟",
    a: "من قسم المحفظة اختر مبلغًا واضغط شحن. الشحن حالياً محاكى للتطوير وسيُربط ببوابة دفع لاحقًا.",
  },
  {
    q: "هل يمكنني إلغاء أو إعادة جدولة الموعد؟",
    a: "نعم من مواعيدي: الإلغاء يعيد المبلغ للمحفظة، وإعادة الجدولة متاحة للمواعيد غير المكتملة.",
  },
  {
    q: "ما أنواع الاستشارة؟",
    a: "فيديو، دردشة، أو صوت. غرفة الدردشة والمرفقات متاحة لكل موعد مؤكد، والفيديو يُربط بـ Agora عند التفعيل.",
  },
  {
    q: "هل المساعد الذكي بديل عن الطبيب؟",
    a: "لا. Ask AI يقدّم توجيهًا أوليًا فقط. للحالات الطبية احجز استشارة مع طبيب عبر مدك.",
  },
  {
    q: "كيف يسجّل الطبيب ملفه؟",
    a: "بعد التسجيل كطبيب، أكمل الملف المهني من صفحة الملف (التخصص، الأتعاب، الموقع، والفترات).",
  },
];

export default function HelpPage() {
  return (
    <div dir="rtl" className="max-w-2xl">
      <PageHeader
        title="مركز المساعدة"
        subtitle="أسئلة شائعة حول استخدام منصة مدك"
      />
      <div className="space-y-3">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="rounded-xl bg-white border border-gray-100 p-4 group"
          >
            <summary className="font-semibold text-gray-800 cursor-pointer list-none flex justify-between gap-3">
              {f.q}
              <span className="text-gray-400 group-open:rotate-45 transition">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
