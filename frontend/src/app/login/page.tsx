"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/auth";
import { ApiError } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(phone, password);
      router.push(redirect);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.status === 401
            ? "رقم الهاتف أو كلمة المرور غير صحيحة"
            : err.message,
        );
      } else {
        setError("حدث خطأ، حاول مرة أخرى");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-[var(--color-sand)] px-4"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 space-y-5"
      >
        <h1 className="text-2xl font-bold text-center text-[var(--color-teal)]">
          تسجيل الدخول
        </h1>
        <p className="text-center text-sm text-gray-500 -mt-2">
          مدك — منصة الرعاية الصحية بين يديك
        </p>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            رقم الهاتف
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07700000001"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            كلمة المرور
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-coral)] text-white font-semibold rounded-lg py-2.5 hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "جارٍ الدخول..." : "دخول"}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled
            className="rounded-lg border border-gray-200 text-gray-400 text-sm py-2 cursor-not-allowed"
          >
            Google
          </button>
          <button
            type="button"
            disabled
            className="rounded-lg border border-gray-200 text-gray-400 text-sm py-2 cursor-not-allowed"
          >
            Apple
          </button>
        </div>
        <p className="text-center text-xs text-gray-400">
          تسجيل Google و Apple قريبًا
        </p>

        <p className="text-center text-sm text-gray-500">
          ليس لديك حساب؟{" "}
          <a href="/register" className="text-[var(--color-teal)] hover:underline">
            إنشاء حساب
          </a>
          {" · "}
          <a href="/" className="text-[var(--color-teal)] hover:underline">
            الرئيسية
          </a>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
