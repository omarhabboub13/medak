"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import {
  addDoctorSlot,
  completeDoctorProfile,
  getMyDoctorProfile,
  listSpecialties,
  removeSlot,
  updateDoctor,
  updateMe,
  getSubscription,
  upsertSubscription,
} from "@/lib/medak";
import { DAY_NAMES, formatMoney } from "@/lib/format";
import { IRAQ_GOVERNORATES } from "@/lib/governorates";
import type { Specialty } from "@/lib/types";
import Loading from "@/components/ui/Loading";
import PageHeader from "@/components/ui/PageHeader";

type DoctorProfile = {
  id: string;
  bio?: string | null;
  yearsExperience: number;
  consultFee: string | number;
  clinicAddress?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  specialtyId: string;
  specialty?: Specialty;
  user: { fullName: string; governorate?: string | null };
  slots: Array<{
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }>;
};

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsComplete, setNeedsComplete] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [sub, setSub] = useState<{
    planName: string;
    price: string | number;
    expiresAt: string;
  } | null>(null);

  const [bio, setBio] = useState("");
  const [years, setYears] = useState("5");
  const [fee, setFee] = useState("25000");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("0");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [planName, setPlanName] = useState("أساسي");
  const [planPrice, setPlanPrice] = useState("50000");
  const [planExpiry, setPlanExpiry] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const specs = await listSpecialties();
      setSpecialties(specs);
      try {
        const p = (await getMyDoctorProfile()) as DoctorProfile;
        setProfile(p);
        setNeedsComplete(false);
        setBio(p.bio || "");
        setYears(String(p.yearsExperience));
        setFee(String(p.consultFee));
        setAddress(p.clinicAddress || "");
        setLat(p.latitude != null ? String(p.latitude) : "");
        setLng(p.longitude != null ? String(p.longitude) : "");
        setSpecialtyId(p.specialtyId);
        setGovernorate(p.user.governorate || "");
      } catch {
        setNeedsComplete(true);
        if (specs[0]) setSpecialtyId(specs[0].id);
      }
      const s = await getSubscription();
      if (s) {
        setSub(s);
        setPlanName(s.planName);
        setPlanPrice(String(s.price));
        setPlanExpiry(s.expiresAt.slice(0, 10));
      }
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : "تعذر التحميل");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    try {
      if (governorate) await updateMe({ governorate });
      const payload = {
        bio,
        yearsExperience: Number(years),
        consultFee: Number(fee),
        clinicAddress: address || undefined,
        latitude: lat ? Number(lat) : undefined,
        longitude: lng ? Number(lng) : undefined,
        specialtyId,
      };
      if (needsComplete) {
        await completeDoctorProfile(payload);
      } else if (profile) {
        await updateDoctor(profile.id, payload);
      }
      setMsg("تم حفظ الملف المهني");
      await load();
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : "فشل الحفظ");
    }
  }

  async function onAddSlot(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    try {
      await addDoctorSlot(profile.id, {
        dayOfWeek: Number(dayOfWeek),
        startTime,
        endTime,
      });
      await load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "فشل إضافة الفترة");
    }
  }

  async function onRemoveSlot(slotId: string) {
    try {
      await removeSlot(slotId);
      await load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "فشل الحذف");
    }
  }

  async function onSub(e: React.FormEvent) {
    e.preventDefault();
    try {
      await upsertSubscription({
        planName,
        price: Number(planPrice),
        expiresAt: new Date(planExpiry).toISOString(),
      });
      setMsg("تم تحديث الاشتراك");
      await load();
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : "فشل الاشتراك");
    }
  }

  if (loading) return <Loading />;

  return (
    <div dir="rtl" className="max-w-2xl space-y-8">
      <PageHeader
        title="الملف المهني"
        subtitle="إدارة بياناتك، الفترات، الموقع، والاشتراك"
      />
      {msg && (
        <p className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700">
          {msg}
        </p>
      )}

      <form
        onSubmit={saveProfile}
        className="rounded-xl bg-white border border-gray-100 p-5 space-y-3"
      >
        <h2 className="font-bold text-gray-800">
          {needsComplete ? "إكمال الملف" : "تحديث الملف"}
        </h2>
        <select
          required
          value={specialtyId}
          onChange={(e) => setSpecialtyId(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white"
        >
          {specialties.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nameAr}
            </option>
          ))}
        </select>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          placeholder="نبذة مهنية"
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="سنوات الخبرة"
            className="rounded-lg border border-gray-300 px-3 py-2"
          />
          <input
            type="number"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            placeholder="أتعاب الاستشارة"
            className="rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="عنوان العيادة"
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="خط العرض (للخريطة)"
            className="rounded-lg border border-gray-300 px-3 py-2"
          />
          <input
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="خط الطول (للخريطة)"
            className="rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
        <select
          value={governorate}
          onChange={(e) => setGovernorate(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white"
        >
          <option value="">المحافظة</option>
          {IRAQ_GOVERNORATES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-[var(--color-coral)] text-white font-semibold px-5 py-2.5"
        >
          حفظ
        </button>
      </form>

      {profile && (
        <div className="rounded-xl bg-white border border-gray-100 p-5 space-y-4">
          <h2 className="font-bold text-gray-800">فترات التوفّر (Slots)</h2>
          <ul className="space-y-2 text-sm">
            {profile.slots.map((s) => (
              <li
                key={s.id}
                className="flex justify-between items-center border border-gray-100 rounded-lg px-3 py-2"
              >
                <span>
                  {DAY_NAMES[s.dayOfWeek]} · {s.startTime} – {s.endTime}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveSlot(s.id)}
                  className="text-red-600 text-xs"
                >
                  حذف
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={onAddSlot} className="grid sm:grid-cols-4 gap-2">
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="rounded-lg border border-gray-300 px-2 py-2 bg-white text-sm"
            >
              {DAY_NAMES.map((d, i) => (
                <option key={d} value={i}>
                  {d}
                </option>
              ))}
            </select>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-lg border border-gray-300 px-2 py-2 text-sm"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="rounded-lg border border-gray-300 px-2 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-lg bg-[var(--color-teal)] text-white text-sm font-semibold"
            >
              إضافة
            </button>
          </form>
        </div>
      )}

      <form
        onSubmit={onSub}
        className="rounded-xl bg-white border border-gray-100 p-5 space-y-3"
      >
        <h2 className="font-bold text-gray-800">الاشتراك</h2>
        {sub && (
          <p className="text-sm text-gray-500">
            الحالي: {sub.planName} · {formatMoney(sub.price)} · ينتهي{" "}
            {new Date(sub.expiresAt).toLocaleDateString("ar-IQ")}
          </p>
        )}
        <input
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
          placeholder="اسم الباقة"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            value={planPrice}
            onChange={(e) => setPlanPrice(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2"
            placeholder="السعر"
          />
          <input
            type="date"
            required
            value={planExpiry}
            onChange={(e) => setPlanExpiry(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-[var(--color-teal)] text-white font-semibold px-5 py-2.5"
        >
          تفعيل / تحديث الباقة
        </button>
      </form>
    </div>
  );
}
