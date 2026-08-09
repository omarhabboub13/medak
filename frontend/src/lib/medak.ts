import { apiDelete, apiGet, apiPatch, apiPost } from "./api";
import type {
  Appointment,
  AppointmentStatus,
  ConsultationType,
  DoctorDetail,
  DoctorListItem,
  Prescription,
  Specialty,
  Wallet,
  WalletTransaction,
} from "./types";

export function listDoctors(params?: {
  specialtyId?: string;
  search?: string;
  featured?: boolean;
  governorate?: string;
}) {
  const q = new URLSearchParams();
  if (params?.specialtyId) q.set("specialtyId", params.specialtyId);
  if (params?.search) q.set("search", params.search);
  if (params?.featured) q.set("featured", "true");
  if (params?.governorate) q.set("governorate", params.governorate);
  const qs = q.toString();
  return apiGet<DoctorListItem[]>(`/doctors${qs ? `?${qs}` : ""}`, {
    auth: false,
  });
}

export function getDoctor(id: string) {
  return apiGet<DoctorDetail>(`/doctors/${id}`, { auth: false });
}

export function getMyDoctorProfile() {
  return apiGet<DoctorDetail & { subscription?: unknown; slots: unknown[] }>(
    "/doctors/me",
  );
}

export function listFavorites() {
  return apiGet<Array<{ doctor: DoctorListItem }>>("/doctors/favorites");
}

export function listSpecialties() {
  return apiGet<Specialty[]>("/specialties", { auth: false });
}

export function listMyAppointments() {
  return apiGet<Appointment[]>("/appointments/me");
}

export function getAppointment(id: string) {
  return apiGet<Appointment>(`/appointments/${id}`);
}

export function createAppointment(data: {
  doctorId: string;
  scheduledAt: string;
  consultationType: ConsultationType;
  notes?: string;
  couponCode?: string;
}) {
  return apiPost<Appointment>("/appointments", data);
}

export function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
) {
  return apiPatch<Appointment>(`/appointments/${id}/status`, { status });
}

export function rescheduleAppointment(id: string, scheduledAt: string) {
  return apiPatch<Appointment>(`/appointments/${id}/reschedule`, {
    scheduledAt,
  });
}

export function listMyPrescriptions() {
  return apiGet<Prescription[]>("/prescriptions/me");
}

export function createPrescription(data: {
  appointmentId: string;
  details: string;
  fileUrl?: string;
}) {
  return apiPost<Prescription>("/prescriptions", data);
}

export function getWallet() {
  return apiGet<Wallet>("/wallet/me");
}

export function topUpWallet(amount: number) {
  return apiPost<Wallet>("/wallet/top-up", { amount });
}

export function withdrawWallet(amount: number, bankAccount?: string) {
  return apiPost<Wallet>("/wallet/withdraw", { amount, bankAccount });
}

export function listTransactions() {
  return apiGet<WalletTransaction[]>("/wallet/transactions");
}

export function toggleFavorite(doctorId: string) {
  return apiPost<{ favorited: boolean }>(`/doctors/${doctorId}/favorite`);
}

export function addDoctorSlot(
  doctorId: string,
  data: { dayOfWeek: number; startTime: string; endTime: string },
) {
  return apiPost(`/doctors/${doctorId}/slots`, data);
}

export function removeSlot(slotId: string) {
  return apiDelete(`/doctors/slots/${slotId}`);
}

export function updateDoctor(
  doctorId: string,
  data: Record<string, unknown>,
) {
  return apiPatch(`/doctors/${doctorId}`, data);
}

export function completeDoctorProfile(data: Record<string, unknown>) {
  return apiPost("/doctors/complete-profile", data);
}

export function listMessages(appointmentId: string) {
  return apiGet<
    Array<{
      id: string;
      senderId: string;
      content?: string | null;
      fileUrl?: string | null;
      createdAt: string;
    }>
  >(`/appointments/${appointmentId}/messages`);
}

export function sendMessage(
  appointmentId: string,
  data: { content?: string; fileUrl?: string },
) {
  return apiPost(`/appointments/${appointmentId}/messages`, data);
}

export function listAttachments(appointmentId: string) {
  return apiGet<
    Array<{ id: string; fileUrl: string; fileType?: string | null }>
  >(`/appointments/${appointmentId}/attachments`);
}

export function addAttachment(
  appointmentId: string,
  data: { fileUrl: string; fileType?: string },
) {
  return apiPost(`/appointments/${appointmentId}/attachments`, data);
}

export function askAi(question: string) {
  return apiPost<{
    question: string;
    answer: string;
    disclaimer: string;
    suggestedActions: Array<{ label: string; href: string }>;
  }>("/ai/ask", { question });
}

export function getSubscription() {
  return apiGet<{
    id: string;
    planName: string;
    price: string | number;
    expiresAt: string;
    isActive: boolean;
  } | null>("/subscriptions/me");
}

export function upsertSubscription(data: {
  planName: string;
  price: number;
  expiresAt: string;
}) {
  return apiPost("/subscriptions/me", data);
}

export function updateMe(data: {
  fullName?: string;
  governorate?: string;
  language?: string;
}) {
  return apiPatch("/users/me", data);
}
