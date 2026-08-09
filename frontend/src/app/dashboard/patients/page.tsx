"use client";

import { useEffect, useMemo, useState } from "react";
import { ApiError } from "@/lib/api";
import { listMyAppointments } from "@/lib/medak";
import { formatDateTime } from "@/lib/format";
import type { Appointment } from "@/lib/types";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";

interface PatientRow {
  patientId: string;
  fullName: string;
  appointments: Appointment[];
}

export default function PatientsPage() {
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listMyAppointments();
        if (!cancelled) setItems(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : "تعذر تحميل المرضى",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const patients = useMemo(() => {
    const map = new Map<string, PatientRow>();
    for (const a of items) {
      if (!a.patient) continue;
      const existing = map.get(a.patientId);
      if (existing) {
        existing.appointments.push(a);
      } else {
        map.set(a.patientId, {
          patientId: a.patientId,
          fullName: a.patient.user.fullName,
          appointments: [a],
        });
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      a.fullName.localeCompare(b.fullName, "ar"),
    );
  }, [items]);

  return (
    <div dir="rtl">
      <PageHeader
        title="المرضى"
        subtitle="المرضى الذين حجزوا مواعيد معك"
        action={
          <span className="text-sm text-gray-400">{patients.length} مريض</span>
        }
      />

      {loading && <Loading />}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {error}
        </div>
      )}
      {!loading && !error && patients.length === 0 && (
        <EmptyState title="لا يوجد مرضى بعد" hint="سيظهرون هنا بعد أول حجز" />
      )}

      <div className="space-y-3">
        {patients.map((p) => {
          const latest = p.appointments[0];
          return (
            <div
              key={p.patientId}
              className="rounded-xl bg-white border border-gray-100 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold text-gray-800">{p.fullName}</h2>
                <span className="text-sm text-gray-500">
                  {p.appointments.length} موعد
                </span>
              </div>
              {latest && (
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                  <span>آخر موعد: {formatDateTime(latest.scheduledAt)}</span>
                  <StatusBadge status={latest.status} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
