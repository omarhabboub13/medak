"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import {
  getWallet,
  listMyAppointments,
  listMyPrescriptions,
} from "@/lib/medak";
import { formatMoney } from "@/lib/format";
import type { Appointment, Prescription, Wallet } from "@/lib/types";
import Loading from "@/components/ui/Loading";
import PageHeader from "@/components/ui/PageHeader";

export default function DashboardHome() {
  const user = getCurrentUser();
  const isDoctor = user?.role === "DOCTOR";
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [a, p, w] = await Promise.all([
          listMyAppointments(),
          listMyPrescriptions(),
          getWallet(),
        ]);
        if (cancelled) return;
        setAppointments(a);
        setPrescriptions(p);
        setWallet(w);
      } catch {
        /* ignore for summary */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Loading />;

  const upcoming = appointments.filter(
    (a) => a.status === "PENDING" || a.status === "CONFIRMED",
  ).length;

  const cards = isDoctor
    ? [
        {
          label: "المواعيد القادمة",
          value: String(upcoming),
          href: "/dashboard/appointments",
        },
        {
          label: "الوصفات الصادرة",
          value: String(prescriptions.length),
          href: "/dashboard/prescriptions",
        },
        {
          label: "رصيد الأرباح",
          value: wallet ? formatMoney(wallet.balance) : "—",
          href: "/dashboard/earnings",
        },
      ]
    : [
        {
          label: "مواعيدي القادمة",
          value: String(upcoming),
          href: "/dashboard/appointments",
        },
        {
          label: "الوصفات",
          value: String(prescriptions.length),
          href: "/dashboard/prescriptions",
        },
        {
          label: "رصيد المحفظة",
          value: wallet ? formatMoney(wallet.balance) : "—",
          href: "/dashboard/wallet",
        },
      ];

  return (
    <div dir="rtl">
      <PageHeader
        title={`أهلاً، ${user?.fullName || ""}`}
        subtitle={
          isDoctor
            ? "إدارة مواعيدك ووصفاتك وأرباحك من هنا."
            : "احجز استشارة، تابع وصفاتك، وأدر محفظتك."
        }
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-xl bg-white border border-gray-100 px-5 py-4 hover:border-[var(--color-teal)] transition"
          >
            <div className="text-sm text-gray-500">{c.label}</div>
            <div className="mt-2 text-2xl font-bold text-[var(--color-teal)]">
              {c.value}
            </div>
          </Link>
        ))}
      </div>

      {!isDoctor && (
        <Link
          href="/dashboard/doctors"
          className="inline-flex items-center rounded-lg bg-[var(--color-coral)] text-white font-semibold px-5 py-2.5 hover:opacity-90 transition"
        >
          تصفح الأطباء واحجز الآن
        </Link>
      )}
    </div>
  );
}
