"use client";

import { getCurrentUser } from "@/lib/auth";

export default function DashboardHome() {
  const user = getCurrentUser();

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        أهلاً، {user?.fullName} 👋
      </h1>
      <p className="text-gray-500">هذه نظرة عامة على حسابك.</p>
    </div>
  );
}
