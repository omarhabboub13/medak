"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import {
  listMyAppointments,
  rescheduleAppointment,
  updateAppointmentStatus,
} from "@/lib/medak";
import {
  CONSULT_LABELS,
  formatDateTime,
  formatMoney,
} from "@/lib/format";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";

export default function AppointmentsPage() {
  const user = getCurrentUser();
  const isDoctor = user?.role === "DOCTOR";
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await listMyAppointments());
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "تعذر تحميل المواعيد",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id: string, status: AppointmentStatus) {
    setBusyId(id);
    try {
      await updateAppointmentStatus(id, status);
      await load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "فشل تحديث الحالة");
    } finally {
      setBusyId(null);
    }
  }

  async function onReschedule(id: string) {
    const value = window.prompt(
      "أدخل التاريخ والوقت الجديد (YYYY-MM-DDTHH:mm)",
    );
    if (!value) return;
    setBusyId(id);
    try {
      await rescheduleAppointment(id, new Date(value).toISOString());
      await load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "فشلت إعادة الجدولة");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div dir="rtl">
      <PageHeader
        title={isDoctor ? "المواعيد" : "مواعيدي"}
        subtitle={
          isDoctor
            ? "أكد أو أكمل مواعيد مرضاك"
            : "تابع حجوزاتك وألغِ عند الحاجة"
        }
        action={
          !isDoctor ? (
            <Link
              href="/dashboard/doctors"
              className="rounded-lg bg-[var(--color-coral)] text-white text-sm font-semibold px-4 py-2 hover:opacity-90"
            >
              حجز جديد
            </Link>
          ) : undefined
        }
      />

      {loading && <Loading />}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {error}
        </div>
      )}
      {!loading && !error && items.length === 0 && (
        <EmptyState
          title="لا توجد مواعيد بعد"
          hint={isDoctor ? undefined : "احجز من صفحة الأطباء"}
        />
      )}

      <div className="space-y-3">
        {items.map((a) => {
          const name = isDoctor
            ? a.patient?.user.fullName
            : a.doctor?.user.fullName;
          const sub = isDoctor
            ? CONSULT_LABELS[a.consultationType]
            : a.doctor?.specialty?.nameAr;

          return (
            <div
              key={a.id}
              className="rounded-xl bg-white border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-semibold text-gray-800">{name}</h2>
                  <StatusBadge status={a.status} />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDateTime(a.scheduledAt)}
                  {sub ? ` · ${sub}` : ""}
                  {` · ${CONSULT_LABELS[a.consultationType]}`}
                  {` · ${formatMoney(a.amountPaid)}`}
                </p>
                {a.notes && (
                  <p className="text-sm text-gray-400 mt-1">{a.notes}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {(a.status === "PENDING" || a.status === "CONFIRMED") && (
                  <Link
                    href={`/dashboard/appointments/${a.id}`}
                    className="text-sm rounded-lg bg-[var(--color-teal)] text-white px-3 py-1.5"
                  >
                    استشارة / دردشة
                  </Link>
                )}
                {isDoctor && a.status === "PENDING" && (
                  <button
                    disabled={busyId === a.id}
                    onClick={() => setStatus(a.id, "CONFIRMED")}
                    className="text-sm rounded-lg border border-teal-200 text-[var(--color-teal)] px-3 py-1.5 disabled:opacity-50"
                  >
                    تأكيد
                  </button>
                )}
                {isDoctor &&
                  (a.status === "PENDING" || a.status === "CONFIRMED") && (
                    <button
                      disabled={busyId === a.id}
                      onClick={() => setStatus(a.id, "COMPLETED")}
                      className="text-sm rounded-lg border border-gray-300 px-3 py-1.5 disabled:opacity-50"
                    >
                      إكمال
                    </button>
                  )}
                {(a.status === "PENDING" || a.status === "CONFIRMED") && (
                  <>
                    <button
                      disabled={busyId === a.id}
                      onClick={() => onReschedule(a.id)}
                      className="text-sm rounded-lg border border-gray-300 px-3 py-1.5 disabled:opacity-50"
                    >
                      إعادة جدولة
                    </button>
                    <button
                      disabled={busyId === a.id}
                      onClick={() => setStatus(a.id, "CANCELLED")}
                      className="text-sm rounded-lg text-red-600 border border-red-200 px-3 py-1.5 disabled:opacity-50"
                    >
                      إلغاء
                    </button>
                  </>
                )}
                {isDoctor &&
                  (a.status === "CONFIRMED" || a.status === "COMPLETED") &&
                  !a.prescription && (
                    <Link
                      href={`/dashboard/prescriptions?appointmentId=${a.id}`}
                      className="text-sm rounded-lg bg-[var(--color-coral)] text-white px-3 py-1.5"
                    >
                      وصفة طبية
                    </Link>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
