"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ApiError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import {
  addAttachment,
  getAppointment,
  listAttachments,
  listMessages,
  sendMessage,
} from "@/lib/medak";
import { CONSULT_LABELS, formatDateTime } from "@/lib/format";
import type { Appointment } from "@/lib/types";
import Loading from "@/components/ui/Loading";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";

export default function ConsultationPage() {
  const { id } = useParams<{ id: string }>();
  const me = getCurrentUser();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      senderId: string;
      content?: string | null;
      fileUrl?: string | null;
      createdAt: string;
    }>
  >([]);
  const [attachments, setAttachments] = useState<
    Array<{ id: string; fileUrl: string; fileType?: string | null }>
  >([]);
  const [text, setText] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    try {
      const [a, m, att] = await Promise.all([
        getAppointment(id),
        listMessages(id),
        listAttachments(id),
      ]);
      setAppointment(a);
      setMessages(m);
      setAttachments(att);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "تعذر فتح الاستشارة");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, [load]);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() && !fileUrl.trim()) return;
    setSending(true);
    try {
      await sendMessage(id, {
        content: text.trim() || undefined,
        fileUrl: fileUrl.trim() || undefined,
      });
      if (fileUrl.trim()) {
        await addAttachment(id, { fileUrl: fileUrl.trim() });
      }
      setText("");
      setFileUrl("");
      await load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "فشل الإرسال");
    } finally {
      setSending(false);
    }
  }

  if (loading) return <Loading />;
  if (error || !appointment) {
    return <p className="text-red-600">{error || "غير موجود"}</p>;
  }

  const otherName =
    me?.role === "DOCTOR"
      ? appointment.patient?.user.fullName
      : appointment.doctor?.user.fullName;

  return (
    <div dir="rtl" className="max-w-3xl">
      <PageHeader
        title={`استشارة مع ${otherName || "—"}`}
        subtitle={`${formatDateTime(appointment.scheduledAt)} · ${CONSULT_LABELS[appointment.consultationType]}`}
        action={<StatusBadge status={appointment.status} />}
      />

      {appointment.consultationType === "VIDEO" && (
        <div className="rounded-xl border border-teal-100 bg-teal-50 p-4 mb-4 text-sm text-teal-900">
          <p className="font-semibold">مكالمة الفيديو (Agora)</p>
          <p className="mt-1 text-teal-800/80">
            غرفة الفيديو جاهزة للربط بـ Agora RTC عند تفعيل المفاتيح. يمكنك
            المتابعة بالدردشة وتبادل الملفات الآن، وسيصلك إشعار عند دعوتك
            للانضمام.
          </p>
          <button
            type="button"
            className="mt-3 rounded-lg bg-[var(--color-teal)] text-white px-4 py-2 text-sm"
            onClick={() =>
              alert(
                "دعوة الانضمام أُرسلت للطرف الآخر (محاكاة إشعار محلي). ربط Agora قادم.",
              )
            }
          >
            اطلب الانضمام للفيديو
          </button>
        </div>
      )}

      <div className="rounded-xl bg-white border border-gray-100 flex flex-col h-[420px] mb-4">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">
              ابدأ الدردشة مع الطرف الآخر
            </p>
          )}
          {messages.map((m) => {
            const mine = m.senderId === me?.id;
            return (
              <div
                key={m.id}
                className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                  mine
                    ? "mr-auto bg-[var(--color-teal)] text-white"
                    : "ml-auto bg-gray-100 text-gray-800"
                }`}
              >
                {m.content && <p>{m.content}</p>}
                {m.fileUrl && (
                  <a
                    href={m.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-xs break-all"
                  >
                    مرفق
                  </a>
                )}
                <p
                  className={`text-[10px] mt-1 ${mine ? "text-white/70" : "text-gray-400"}`}
                >
                  {formatDateTime(m.createdAt)}
                </p>
              </div>
            );
          })}
        </div>
        <form
          onSubmit={onSend}
          className="border-t border-gray-100 p-3 space-y-2"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اكتب رسالة..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <input
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="رابط صورة أو ملف (اختياري)"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={sending}
              className="rounded-lg bg-[var(--color-coral)] text-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
            >
              إرسال
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl bg-white border border-gray-100 p-4">
        <h3 className="font-semibold text-gray-800 mb-2">مرفقات الموعد</h3>
        {attachments.length === 0 ? (
          <p className="text-sm text-gray-400">لا توجد مرفقات بعد</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {attachments.map((a) => (
              <li key={a.id}>
                <a
                  href={a.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--color-teal)] hover:underline break-all"
                >
                  {a.fileUrl}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link
        href="/dashboard/appointments"
        className="inline-block mt-4 text-sm text-[var(--color-teal)] hover:underline"
      >
        العودة للمواعيد
      </Link>
    </div>
  );
}
