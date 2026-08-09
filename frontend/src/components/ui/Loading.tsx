export default function Loading({ label = "جارٍ التحميل..." }: { label?: string }) {
  return (
    <div className="py-16 text-center text-gray-400 text-sm">{label}</div>
  );
}
