"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { listDoctors, listFavorites, listSpecialties } from "@/lib/medak";
import { formatMoney } from "@/lib/format";
import { IRAQ_GOVERNORATES } from "@/lib/governorates";
import type { DoctorListItem, Specialty } from "@/lib/types";
import { ApiError } from "@/lib/api";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorListItem[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [search, setSearch] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listSpecialties().then(setSpecialties).catch(() => undefined);
    listFavorites()
      .then((rows) => setFavoriteIds(new Set(rows.map((r) => r.doctor.id))))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const t = setTimeout(async () => {
      try {
        const data = await listDoctors({
          search: search.trim() || undefined,
          specialtyId: specialtyId || undefined,
          governorate: governorate || undefined,
          featured: featuredOnly || undefined,
        });
        if (!cancelled) setDoctors(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : "تعذر تحميل قائمة الأطباء",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [search, specialtyId, governorate, featuredOnly]);

  const visible = useMemo(() => {
    if (!favoritesOnly) return doctors;
    return doctors.filter((d) => favoriteIds.has(d.id));
  }, [doctors, favoritesOnly, favoriteIds]);

  return (
    <div dir="rtl">
      <PageHeader
        title="الأطباء"
        subtitle="ابحث حسب التخصص أو المحافظة واحجز استشارة عن بُعد"
        action={<span className="text-sm text-gray-400">{visible.length} طبيب</span>}
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث بالاسم..."
          className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
        />
        <select
          value={specialtyId}
          onChange={(e) => setSpecialtyId(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
        >
          <option value="">كل التخصصات</option>
          {specialties.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nameAr}
            </option>
          ))}
        </select>
        <select
          value={governorate}
          onChange={(e) => setGovernorate(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)]"
        >
          <option value="">كل المحافظات</option>
          {IRAQ_GOVERNORATES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-4 text-sm text-gray-600 px-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => setFeaturedOnly(e.target.checked)}
            />
            المميّزون
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={favoritesOnly}
              onChange={(e) => setFavoritesOnly(e.target.checked)}
            />
            المفضّلون
          </label>
        </div>
      </div>

      {loading && <Loading />}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {error}
        </div>
      )}
      {!loading && !error && visible.length === 0 && (
        <EmptyState title="لا يوجد أطباء مطابقون" hint="جرّب فلاتر أخرى" />
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((d) => (
          <Link
            key={d.id}
            href={`/dashboard/doctors/${d.id}`}
            className="rounded-xl bg-white border border-gray-100 p-5 hover:border-[var(--color-teal)] transition"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-bold text-gray-800">{d.user.fullName}</h2>
                <p className="text-sm text-[var(--color-teal)] mt-0.5">
                  {d.specialty.nameAr}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {d.isFeatured && (
                  <span className="text-xs bg-[var(--color-coral)]/10 text-[var(--color-coral)] px-2 py-0.5 rounded-full">
                    مميز
                  </span>
                )}
                {favoriteIds.has(d.id) && (
                  <span className="text-xs text-amber-600">★ مفضّل</span>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3 line-clamp-2">
              {d.bio || "لا توجد نبذة"}
            </p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-500">
                ⭐ {d.ratingAvg.toFixed(1)} · {d.user.governorate || "—"}
              </span>
              <span className="font-semibold text-gray-800">
                {formatMoney(d.consultFee)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
