"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth";
import type { AuthUser } from "@/lib/auth";

const PATIENT_LINKS = [
  { href: "/dashboard", label: "الرئيسية" },
  { href: "/dashboard/appointments", label: "مواعيدي" },
  { href: "/dashboard/doctors", label: "الأطباء" },
  { href: "/dashboard/prescriptions", label: "الوصفات الطبية" },
  { href: "/dashboard/wallet", label: "المحفظة" },
  { href: "/dashboard/ask-ai", label: "المساعد الذكي" },
  { href: "/dashboard/settings", label: "الإعدادات" },
  { href: "/dashboard/help", label: "المساعدة" },
];

const DOCTOR_LINKS = [
  { href: "/dashboard", label: "الرئيسية" },
  { href: "/dashboard/appointments", label: "المواعيد" },
  { href: "/dashboard/patients", label: "المرضى" },
  { href: "/dashboard/prescriptions", label: "الوصفات الطبية" },
  { href: "/dashboard/earnings", label: "الأرباح" },
  { href: "/dashboard/profile", label: "الملف المهني" },
  { href: "/dashboard/settings", label: "الإعدادات" },
  { href: "/dashboard/help", label: "المساعدة" },
];

export default function Sidebar({ user }: { user: AuthUser }) {
  const pathname = usePathname();
  const links = user.role === "DOCTOR" ? DOCTOR_LINKS : PATIENT_LINKS;

  return (
    <aside
      dir="rtl"
      className="w-64 shrink-0 h-screen sticky top-0 bg-white border-l border-gray-200 flex flex-col"
    >
      <div className="px-6 py-5 border-b border-gray-200">
        <Link href="/" className="text-xl font-bold text-[var(--color-teal)]">
          مدك
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const active =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-[var(--color-teal)] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-200">
        <div className="text-sm text-gray-500 mb-2 px-2">{user.fullName}</div>
        <button
          onClick={logout}
          className="w-full text-right text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg px-4 py-2 transition"
        >
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
