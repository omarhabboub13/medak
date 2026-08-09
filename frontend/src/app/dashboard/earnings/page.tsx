"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import {
  getWallet,
  listTransactions,
  withdrawWallet,
} from "@/lib/medak";
import { formatDateTime, formatMoney } from "@/lib/format";
import type { Wallet, WalletTransaction } from "@/lib/types";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";

export default function EarningsPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [txns, setTxns] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [w, t] = await Promise.all([getWallet(), listTransactions()]);
      setWallet(w);
      setTxns(t);
      if (w.bankAccount) setBankAccount(w.bankAccount);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "تعذر تحميل الأرباح",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await withdrawWallet(Number(amount), bankAccount.trim() || undefined);
      setMsg("تم إرسال طلب السحب");
      setAmount("");
      await load();
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : "فشل طلب السحب");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div dir="rtl" className="max-w-2xl">
      <PageHeader
        title="الأرباح"
        subtitle="تابع رصيدك واطلب سحباً إلى حسابك البنكي"
      />

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {error}
        </div>
      )}

      <div className="rounded-xl bg-[var(--color-teal)] text-white p-6 mb-6">
        <p className="text-sm text-white/80">الرصيد المتاح</p>
        <p className="text-3xl font-bold mt-1">
          {wallet ? formatMoney(wallet.balance) : "—"}
        </p>
      </div>

      {txns.length > 0 && (
        <div className="rounded-xl bg-white border border-gray-100 p-5 mb-6">
          <h2 className="font-bold text-gray-800 mb-4">تقرير الأرباح (آخر العمليات)</h2>
          <div className="flex items-end gap-2 h-40">
            {txns.slice(0, 10).reverse().map((t) => {
              const max = Math.max(...txns.slice(0, 10).map((x) => Number(x.amount)), 1);
              const h = Math.max(8, (Number(t.amount) / max) * 100);
              return (
                <div key={t.id} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-[var(--color-coral)]/80"
                    style={{ height: `${h}%` }}
                    title={formatMoney(t.amount)}
                  />
                  <span className="text-[9px] text-gray-400 truncate w-full text-center">
                    {t.type.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <form
        onSubmit={handleWithdraw}
        className="rounded-xl bg-white border border-gray-100 p-5 mb-6 space-y-3"
      >
        <h2 className="font-bold text-gray-800">طلب سحب</h2>
        {msg && (
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
            {msg}
          </p>
        )}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">المبلغ</label>
          <input
            type="number"
            min={1}
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            رقم الحساب البنكي
          </label>
          <input
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-[var(--color-coral)] text-white font-semibold px-5 py-2.5 hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "جارٍ الإرسال..." : "طلب سحب"}
        </button>
      </form>

      <h2 className="font-bold text-gray-800 mb-3">سجل العمليات</h2>
      {txns.length === 0 ? (
        <EmptyState title="لا توجد عمليات بعد" />
      ) : (
        <div className="space-y-2">
          {txns.map((t) => (
            <div
              key={t.id}
              className="rounded-xl bg-white border border-gray-100 px-4 py-3 flex items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={t.type} />
                  <StatusBadge status={t.status} />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDateTime(t.createdAt)}
                </p>
              </div>
              <span className="font-semibold text-gray-800">
                {formatMoney(t.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
