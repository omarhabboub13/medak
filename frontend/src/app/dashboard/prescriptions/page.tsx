"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import {
  createPrescription,
  listMyAppointments,
  listMyPrescriptions,
} from "@/lib/medak";
import { formatDateTime } from "@/lib/format";
import type { Appointment, Prescription } from "@/lib/types";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";

function PrescriptionsContent() {
  const user = getCurrentUser();
  const isDoctor = user?.role === "DOCTOR";
  const params = useSearchParams();
  const preselect = params.get("appointmentId") || "";

  const [items, setItems] = useState<Prescription[]>([]);
  const [eligible, setEligible] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [appointmentId, setAppointmentId] = useState(preselect);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formOk, setFormOk] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [rx, appts] = await Promise.all([
        listMyPrescriptions(),
        isDoctor ? listMyAppointments() : Promise.resolve([] as Appointment[]),
      ]);
      setItems(rx);
      if (isDoctor) {
        setEligible(
          appts.filter(
            (a) =>
              (a.status === "CONFIRMED" || a.status === "COMPLETED") &&
              !a.prescription,
          ),
        );
      }
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "تعذر تحميل الوصفات",
      );
    } finally {
      setLoading(false);
    }
  }, [isDoctor]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (preselect) setAppointmentId(preselect);
  }, [preselect]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormOk(false);
    setSubmitting(true);
    try {
      await createPrescription({
        appointmentId,
        details: details.trim(),
      });
      setDetails("");
      setFormOk(true);
      await load();
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "تعذر إصدار الوصفة",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div dir="rtl">
      <PageHeader
        title="الوصفات الطبية"
        subtitle={
          isDoctor
            ? "أصدر وصفات لمواعيدك المكتملة أو المؤكدة"
            : "وصفاتك الإلكترونية من الأطباء"
        }
      />

      {isDoctor && (
        <form
          onSubmit={handleCreate}
          className="rounded-xl bg-white border border-gray-100 p-5 mb-6 space-y-4 max-w-xl"
        >
          <h2 className="font-bold text-gray-800">إصدار وصفة جديدة</h2>
          {formError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {formError}
            </div>
          )}
          {formOk && (
            <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
              تم إصدار الوصفة بنجاح
            </div>
          )}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">الموعد</label>
            <select
              required
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
            >
              <option value="">اختر موعداً</option>
              {eligible.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.patient?.user.fullName} — {formatDateTime(a.scheduledAt)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              تفاصيل الوصفة
            </label>
            <textarea
              required
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="الأدوية، الجرعات، والتعليمات..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !appointmentId}
            className="rounded-lg bg-[var(--color-coral)] text-white font-semibold px-5 py-2.5 hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "جارٍ الحفظ..." : "إصدار الوصفة"}
          </button>
        </form>
      )}

      {loading && <Loading />}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {error}
        </div>
      )}
      {!loading && !error && items.length === 0 && (
        <EmptyState title="لا توجد وصفات بعد" />
      )}

      <div className="space-y-3">
        {items.map((rx) => (
          <div
            key={rx.id}
            className="rounded-xl bg-white border border-gray-100 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h2 className="font-semibold text-gray-800">
                {isDoctor
                  ? rx.patient?.user.fullName
                  : rx.doctor?.user.fullName}
              </h2>
              <span className="text-xs text-gray-400">
                {formatDateTime(rx.createdAt)}
              </span>
            </div>
            {!isDoctor && rx.doctor?.specialty && (
              <p className="text-sm text-[var(--color-teal)] mb-2">
                {rx.doctor.specialty.nameAr}
              </p>
            )}
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
              {rx.details}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PrescriptionsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PrescriptionsContent />
    </Suspense>
  );
}
