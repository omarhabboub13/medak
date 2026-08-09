export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

export type ConsultationType = "VIDEO" | "CHAT" | "VOICE";

export type TransactionType =
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "PAYMENT"
  | "REFUND";

export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface Specialty {
  id: string;
  nameAr: string;
  nameEn: string;
  iconUrl?: string | null;
}

export interface DoctorListItem {
  id: string;
  specialtyId: string;
  bio?: string | null;
  yearsExperience: number;
  consultFee: string | number;
  clinicAddress?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isFeatured: boolean;
  ratingAvg: number;
  ratingCount: number;
  user: {
    fullName: string;
    avatarUrl?: string | null;
    governorate?: string | null;
  };
  specialty: Specialty;
}

export interface AvailabilitySlot {
  id: string;
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface DoctorDetail extends DoctorListItem {
  slots: AvailabilitySlot[];
  reviews?: Array<{
    id: string;
    rating: number;
    comment?: string | null;
    patient?: { user: { fullName: string } };
  }>;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduledAt: string;
  consultationType: ConsultationType;
  status: AppointmentStatus;
  couponCode?: string | null;
  amountPaid: string | number;
  notes?: string | null;
  doctor?: {
    id: string;
    specialty?: Specialty;
    user: { fullName: string; avatarUrl?: string | null };
  };
  patient?: {
    id: string;
    user: { fullName: string; avatarUrl?: string | null };
  };
  prescription?: { id: string } | null;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  details: string;
  fileUrl?: string | null;
  createdAt: string;
  doctor?: {
    specialty?: Specialty;
    user: { fullName: string };
  };
  patient?: {
    user: { fullName: string };
  };
}

export interface Wallet {
  id: string;
  userId: string;
  balance: string | number;
  bankAccount?: string | null;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  appointmentId?: string | null;
  type: TransactionType;
  status: TransactionStatus;
  amount: string | number;
  createdAt: string;
}
