"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { register } from "@/lib/auth";
import type { Role } from "@/lib/auth";
import { ApiError } from "@/lib/api";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("PATIENT");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ phone, password, fullName, role });
      router.push(role === "DOCTOR" ? "/dashboard/profile" : redirect);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
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
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-[var(--color-teal)]">
          إنشاء حساب
        </h1>
        <p className="text-center text-sm text-gray-500 -mt-1">
          سجّل برقم هاتفك للبدء
        </p>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">الاسم الكامل</label>
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">رقم الهاتف</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07700000003"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">كلمة المرور</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">نوع الحساب</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
          >
            <option value="PATIENT">مريض</option>
            <option value="DOCTOR">طبيب</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-coral)] text-white font-semibold rounded-lg py-2.5 hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "جارٍ التسجيل..." : "تسجيل"}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled
            className="rounded-lg border border-gray-200 text-gray-400 text-sm py-2 cursor-not-allowed"
            title="قريبًا"
          >
            Google
          </button>
          <button
            type="button"
            disabled
            className="rounded-lg border border-gray-200 text-gray-400 text-sm py-2 cursor-not-allowed"
            title="قريبًا"
          >
            Apple
          </button>
        </div>
        <p className="text-center text-xs text-gray-400">
          تسجيل Google و Apple قريبًا
        </p>

        <p className="text-center text-sm text-gray-500">
          لديك حساب؟{" "}
          <Link href="/login" className="text-[var(--color-teal)] hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
