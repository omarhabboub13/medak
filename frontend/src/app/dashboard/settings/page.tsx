"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import { updateMe } from "@/lib/medak";
import { IRAQ_GOVERNORATES } from "@/lib/governorates";
import PageHeader from "@/components/ui/PageHeader";

export default function SettingsPage() {
  const [language, setLanguage] = useState("ar");
  const [governorate, setGovernorate] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("medak_lang");
    if (saved) setLanguage(saved);
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    try {
      localStorage.setItem("medak_lang", language);
      document.documentElement.lang = language === "ku" ? "ckb" : language;
      await updateMe({ language, governorate: governorate || undefined });
      setMsg("تم حفظ الإعدادات");
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : "فشل الحفظ");
    }
  }

  return (
    <div dir="rtl" className="max-w-lg">
      <PageHeader
        title="الإعدادات"
        subtitle="اللغة والمحافظة لعرض الخدمات القريبة"
      />
      <form
        onSubmit={save}
        className="rounded-xl bg-white border border-gray-100 p-5 space-y-4"
      >
        {msg && (
          <p className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            {msg}
          </p>
        )}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">اللغة</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white"
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
            <option value="ku">کوردی</option>
          </select>
          <p className="text-xs text-gray-400">
            الواجهة الأساسية بالعربية؛ تفضيل اللغة يُحفظ لحسابك وللجوال لاحقًا.
          </p>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">المحافظة</label>
          <select
            value={governorate}
            onChange={(e) => setGovernorate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white"
          >
            <option value="">اختر المحافظة</option>
            {IRAQ_GOVERNORATES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-[var(--color-coral)] text-white font-semibold px-5 py-2.5"
        >
          حفظ
        </button>
      </form>
    </div>
  );
}
