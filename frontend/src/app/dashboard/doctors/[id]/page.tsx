"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ApiError } from "@/lib/api";
import { createAppointment, getDoctor, toggleFavorite } from "@/lib/medak";
import {
  CONSULT_LABELS,
  DAY_NAMES,
  formatMoney,
} from "@/lib/format";
import type { ConsultationType, DoctorDetail } from "@/lib/types";
import Loading from "@/components/ui/Loading";
import PageHeader from "@/components/ui/PageHeader";

function buildSlotSuggestions(doctor: DoctorDetail) {
  const options: string[] = [];
  const now = new Date();
  for (let dayOffset = 1; dayOffset <= 14 && options.length < 12; dayOffset++) {
    const d = new Date(now);
    d.setDate(now.getDate() + dayOffset);
    d.setSeconds(0, 0);
    const dow = d.getDay();
    const slots = doctor.slots?.filter((s) => s.dayOfWeek === dow) || [];
    for (const s of slots) {
      const [hh, mm] = s.startTime.split(":").map(Number);
      const candidate = new Date(d);
      candidate.setHours(hh, mm || 0, 0, 0);
      if (candidate > now) {
        const pad = (n: number) => String(n).padStart(2, "0");
        options.push(
          `${candidate.getFullYear()}-${pad(candidate.getMonth() + 1)}-${pad(candidate.getDate())}T${pad(candidate.getHours())}:${pad(candidate.getMinutes())}`,
        );
      }
    }
  }
  return options;
}

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [doctor, setDoctor] = useState<DoctorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorited, setFavorited] = useState(false);

  const [step, setStep] = useState<"form" | "summary">("form");
  const [scheduledAt, setScheduledAt] = useState("");
  const [consultationType, setConsultationType] =
    useState<ConsultationType>("VIDEO");
  const [notes, setNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [booking, setBooking] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);
  const [bookOk, setBookOk] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await getDoctor(id);
        if (!cancelled) {
          setDoctor(d);
          const suggestions = buildSlotSuggestions(d);
          if (suggestions[0]) setScheduledAt(suggestions[0]);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : "تعذر تحميل بيانات الطبيب",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const suggestions = useMemo(
    () => (doctor ? buildSlotSuggestions(doctor) : []),
    [doctor],
  );

  async function onFavorite() {
    try {
      const res = await toggleFavorite(id);
      setFavorited(res.favorited);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "تعذر الحفظ في المفضلة");
    }
  }

  async function handleBook() {
    setBookError(null);
    setBookOk(false);
    setBooking(true);
    try {
      await createAppointment({
        doctorId: id,
        scheduledAt: new Date(scheduledAt).toISOString(),
        consultationType,
        notes: notes.trim() || undefined,
        couponCode: couponCode.trim() || undefined,
      });
      setBookOk(true);
      setTimeout(() => router.push("/dashboard/appointments"), 800);
    } catch (err) {
      setBookError(
        err instanceof ApiError
          ? err.message
          : "تعذر إتمام الحجز. تحقق من رصيد المحفظة.",
      );
      setStep("form");
    } finally {
      setBooking(false);
    }
  }

  if (loading) return <Loading />;
  if (error || !doctor) {
    return (
      <div dir="rtl" className="space-y-4">
        <p className="text-red-600">{error || "الطبيب غير موجود"}</p>
        <Link href="/dashboard/doctors" className="text-[var(--color-teal)]">
          العودة للأطباء
        </Link>
      </div>
    );
  }

  const mapUrl =
    doctor.latitude != null && doctor.longitude != null
      ? `https://www.openstreetmap.org/?mlat=${doctor.latitude}&mlon=${doctor.longitude}#map=16/${doctor.latitude}/${doctor.longitude}`
      : null;

  return (
    <div dir="rtl" className="max-w-3xl">
      <PageHeader
        title={doctor.user.fullName}
        subtitle={doctor.specialty.nameAr}
        action={
          <div className="flex gap-3 items-center">
            <button
              type="button"
              onClick={onFavorite}
              className="text-sm rounded-lg border border-amber-200 text-amber-700 px-3 py-1.5 hover:bg-amber-50"
            >
              {favorited ? "★ في المفضلة" : "☆ حفظ في المفضلة"}
            </button>
            <Link
              href="/dashboard/doctors"
              className="text-sm text-[var(--color-teal)] hover:underline"
            >
              ← كل الأطباء
            </Link>
          </div>
        }
      />

      <div className="rounded-xl bg-white border border-gray-100 p-5 mb-6 space-y-3">
        <p className="text-gray-600 text-sm leading-relaxed">
          {doctor.bio || "لا توجد نبذة متاحة."}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span>{doctor.yearsExperience} سنة خبرة</span>
          <span>
            ⭐ {doctor.ratingAvg.toFixed(1)} ({doctor.ratingCount})
          </span>
          <span className="font-semibold text-gray-800">
            {formatMoney(doctor.consultFee)}
          </span>
          {doctor.user.governorate && <span>{doctor.user.governorate}</span>}
          {doctor.clinicAddress && <span>{doctor.clinicAddress}</span>}
        </div>
        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-sm text-[var(--color-teal)] hover:underline"
          >
            عرض الموقع على الخريطة
          </a>
        )}
        {doctor.slots?.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-2">
              أوقات التوفر الأسبوعية
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              {doctor.slots.map((s) => (
                <li key={s.id}>
                  {DAY_NAMES[s.dayOfWeek]}: {s.startTime} – {s.endTime}
                </li>
              ))}
            </ul>
          </div>
        )}
        {doctor.reviews && doctor.reviews.length > 0 && (
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <p className="text-sm font-medium text-gray-700">التقييمات</p>
            {doctor.reviews.slice(0, 3).map((r) => (
              <p key={r.id} className="text-sm text-gray-500">
                ⭐ {r.rating} — {r.comment || "بدون تعليق"}
              </p>
            ))}
          </div>
        )}
      </div>

      {step === "form" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep("summary");
          }}
          className="rounded-xl bg-white border border-gray-100 p-5 space-y-4"
        >
          <h2 className="font-bold text-gray-800">حجز موعد</h2>
          {bookError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {bookError}
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                اختر من الفترات المتاحة
              </label>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setScheduledAt(s)}
                    className={`text-xs rounded-full border px-3 py-1.5 ${
                      scheduledAt === s
                        ? "border-[var(--color-teal)] bg-teal-50 text-[var(--color-teal)]"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    {new Date(s).toLocaleString("ar-IQ", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              أو حدد التاريخ والوقت يدويًا
            </label>
            <input
              type="datetime-local"
              required
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              نوع الاستشارة
            </label>
            <select
              value={consultationType}
              onChange={(e) =>
                setConsultationType(e.target.value as ConsultationType)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
            >
              {Object.entries(CONSULT_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              كود الخصم (اختياري)
            </label>
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              ملاحظات (اختياري)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-[var(--color-coral)] text-white font-semibold rounded-lg px-6 py-2.5 hover:opacity-90 transition"
          >
            مراجعة الملخص
          </button>
        </form>
      ) : (
        <div className="rounded-xl bg-white border border-gray-100 p-5 space-y-4">
          <h2 className="font-bold text-gray-800">ملخص الطلب قبل التأكيد</h2>
          {bookOk && (
            <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
              تم الحجز بنجاح، جارٍ التحويل...
            </div>
          )}
          <ul className="text-sm text-gray-600 space-y-2">
            <li>
              <strong>الطبيب:</strong> {doctor.user.fullName}
            </li>
            <li>
              <strong>التخصص:</strong> {doctor.specialty.nameAr}
            </li>
            <li>
              <strong>الوقت:</strong>{" "}
              {new Date(scheduledAt).toLocaleString("ar-IQ")}
            </li>
            <li>
              <strong>النوع:</strong> {CONSULT_LABELS[consultationType]}
            </li>
            <li>
              <strong>الرسوم:</strong> {formatMoney(doctor.consultFee)}
              {couponCode ? ` (كوبون: ${couponCode})` : ""}
            </li>
            {notes && (
              <li>
                <strong>ملاحظات:</strong> {notes}
              </li>
            )}
          </ul>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={booking}
              onClick={handleBook}
              className="rounded-lg bg-[var(--color-coral)] text-white font-semibold px-6 py-2.5 disabled:opacity-50"
            >
              {booking ? "جارٍ التأكيد..." : "تأكيد الدفع والحجز"}
            </button>
            <button
              type="button"
              onClick={() => setStep("form")}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm"
            >
              تعديل
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
