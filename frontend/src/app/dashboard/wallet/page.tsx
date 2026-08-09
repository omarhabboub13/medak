"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import { getWallet, listTransactions, topUpWallet } from "@/lib/medak";
import { formatDateTime, formatMoney } from "@/lib/format";
import type { Wallet, WalletTransaction } from "@/lib/types";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";

export default function WalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [txns, setTxns] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState("25000");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [w, t] = await Promise.all([getWallet(), listTransactions()]);
      setWallet(w);
      setTxns(t);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "تعذر تحميل المحفظة",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleTopUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await topUpWallet(Number(amount));
      setMsg("تم شحن المحفظة بنجاح");
      await load();
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : "فشل الشحن");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div dir="rtl" className="max-w-2xl">
      <PageHeader
        title="المحفظة"
        subtitle="اشحن رصيدك لدفع رسوم الاستشارات"
      />

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {error}
        </div>
      )}

      <div className="rounded-xl bg-[var(--color-teal)] text-white p-6 mb-6">
        <p className="text-sm text-white/80">الرصيد الحالي</p>
        <p className="text-3xl font-bold mt-1">
          {wallet ? formatMoney(wallet.balance) : "—"}
        </p>
      </div>

      <form
        onSubmit={handleTopUp}
        className="rounded-xl bg-white border border-gray-100 p-5 mb-6 space-y-3"
      >
        <h2 className="font-bold text-gray-800">شحن الرصيد</h2>
        {msg && (
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
            {msg}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            min={1}
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-[var(--color-coral)] text-white font-semibold px-5 py-2.5 hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "جارٍ الشحن..." : "شحن"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {[10000, 25000, 50000].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setAmount(String(v))}
              className="text-xs rounded-full border border-gray-200 px-3 py-1 text-gray-600 hover:border-[var(--color-teal)]"
            >
              {formatMoney(v)}
            </button>
          ))}
        </div>
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
