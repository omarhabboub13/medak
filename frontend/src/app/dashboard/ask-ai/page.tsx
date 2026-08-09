"use client";

import { useState } from "react";
import Link from "next/link";
import { ApiError } from "@/lib/api";
import { askAi } from "@/lib/medak";
import PageHeader from "@/components/ui/PageHeader";

export default function AskAiPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);
  const [actions, setActions] = useState<Array<{ label: string; href: string }>>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await askAi(question.trim());
      setAnswer(res.answer);
      setDisclaimer(res.disclaimer);
      setActions(res.suggestedActions || []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "تعذر الحصول على إجابة");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" className="max-w-2xl">
      <PageHeader
        title="المساعد الذكي (Ask AI)"
        subtitle="إجابات أولية لتوجيهك — ليست تشخيصًا طبيًا"
      />

      <form onSubmit={handleAsk} className="space-y-3 mb-6">
        <textarea
          required
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="مثال: لدي صداع منذ يومين، ماذا أفعل؟"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
        />
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[var(--color-coral)] text-white font-semibold px-5 py-2.5 disabled:opacity-50"
        >
          {loading ? "جارٍ التفكير..." : "اسأل المساعد"}
        </button>
      </form>

      {answer && (
        <div className="rounded-xl bg-white border border-gray-100 p-5 space-y-3">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {answer}
          </p>
          {disclaimer && (
            <p className="text-xs text-gray-400 border-t border-gray-100 pt-3">
              {disclaimer}
            </p>
          )}
          {actions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {actions.map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="text-sm rounded-full border border-teal-200 text-[var(--color-teal)] px-3 py-1 hover:bg-teal-50"
                >
                  {a.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
