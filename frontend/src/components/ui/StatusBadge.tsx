import { STATUS_LABELS } from "@/lib/format";

const COLORS: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-800",
  CONFIRMED: "bg-teal-50 text-[var(--color-teal)]",
  CANCELLED: "bg-red-50 text-red-700",
  COMPLETED: "bg-gray-100 text-gray-700",
  DEPOSIT: "bg-emerald-50 text-emerald-700",
  WITHDRAWAL: "bg-blue-50 text-blue-700",
  PAYMENT: "bg-coral/10 text-[var(--color-coral)]",
  REFUND: "bg-purple-50 text-purple-700",
  FAILED: "bg-red-50 text-red-700",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
        COLORS[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}
