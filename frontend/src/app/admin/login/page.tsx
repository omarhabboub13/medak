"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCurrentUser, login, clearSession } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import {
  LanguageSwitcher,
  LocaleProvider,
  useLocale,
} from "@/lib/LocaleProvider";

function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/admin";
  const { dir, tt } = useLocale();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    if (u?.role === "ADMIN") {
      router.replace("/admin");
      return;
    }
    if (u || document.cookie.includes("medak_token=")) {
      clearSession();
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(phone, password);
      if (user.role !== "ADMIN") {
        clearSession();
        setError("Admin only");
        return;
      }
      router.replace(redirect.startsWith("/admin") ? redirect : "/admin");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 401 ? "Invalid credentials" : err.message);
      } else {
        setError("Error");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      dir={dir}
      className="min-h-screen flex items-center justify-center bg-[var(--color-sand)] px-4"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 space-y-5"
      >
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--color-teal)]">
            {tt("loginTitle")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{tt("loginSubtitle")}</p>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            {tt("phone")}
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07700000000"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            {tt("password")}
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-coral)] text-white font-semibold rounded-lg py-2.5 hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? tt("loggingIn") : tt("login")}
        </button>

        <p className="text-center text-sm text-gray-500">
          <a href="/" className="text-[var(--color-teal)] hover:underline">
            {tt("backHome")}
          </a>
        </p>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <LocaleProvider>
      <Suspense fallback={null}>
        <AdminLoginForm />
      </Suspense>
    </LocaleProvider>
  );
}
