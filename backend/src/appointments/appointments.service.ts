import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  private async resolvePatientId(userId: string) {
    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) throw new NotFoundException('Patient profile not found');
    return patient.id;
  }

  async create(userId: string, dto: CreateAppointmentDto) {
    const patientId = await this.resolvePatientId(userId);

    const doctor = await this.prisma.doctor.findUnique({
      where: { id: dto.doctorId },
    });
    if (!doctor) throw new NotFoundException('Doctor not found');

    const scheduledAt = new Date(dto.scheduledAt);
    if (scheduledAt < new Date()) {
      throw new BadRequestException('Cannot book an appointment in the past');
    }

    // Prevent double-booking the same doctor at the same time
    const conflict = await this.prisma.appointment.findFirst({
      where: {
        doctorId: dto.doctorId,
        scheduledAt,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });
    if (conflict)
      throw new BadRequestException('This time slot is already booked');

    // Resolve price, applying a coupon if provided
    let amount = Number(doctor.consultFee);
    if (dto.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({
        where: { code: dto.couponCode },
      });
      if (!coupon || !coupon.isActive) {
        throw new BadRequestException('Invalid or inactive coupon');
      }
      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        throw new BadRequestException('Coupon has expired');
      }
      if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
        throw new BadRequestException('Coupon usage limit reached');
      }
      amount =
        coupon.discountType === 'PERCENT'
          ? amount - (amount * Number(coupon.discountValue)) / 100
          : amount - Number(coupon.discountValue);
      amount = Math.max(amount, 0);
    }

    // Check wallet balance
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (Number(wallet.balance) < amount) {
      throw new BadRequestException(
        'Insufficient wallet balance. Please top up.',
      );
    }

    // Run booking + payment atomically
    return this.prisma.$transaction(async (tx) => {
      const appointment = await tx.appointment.create({
        data: {
          patientId,
          doctorId: dto.doctorId,
          scheduledAt,
          consultationType: dto.consultationType,
          couponCode: dto.couponCode,
          amountPaid: amount,
          notes: dto.notes,
          status: 'PENDING',
        },
      });

      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } },
      });

      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          appointmentId: appointment.id,
          type: 'PAYMENT',
          status: 'COMPLETED',
          amount,
        },
      });

      if (dto.couponCode) {
        await tx.coupon.update({
          where: { code: dto.couponCode },
          data: { timesUsed: { increment: 1 } },
        });
      }

      return appointment;
    });
  }

  async findMyAppointments(userId: string, role: string) {
    if (role === 'DOCTOR') {
      const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
      if (!doctor) throw new NotFoundException('Doctor profile not found');
      return this.prisma.appointment.findMany({
        where: { doctorId: doctor.id },
        include: {
          patient: {
            include: { user: { select: { fullName: true, avatarUrl: true } } },
          },
          prescription: true,
        },
        orderBy: { scheduledAt: 'desc' },
      });
    }

    const patientId = await this.resolvePatientId(userId);
    return this.prisma.appointment.findMany({
      where: { patientId },
      include: {
        doctor: {
          include: {
            user: { select: { fullName: true, avatarUrl: true } },
            specialty: true,
          },
        },
        prescription: true,
      },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          include: { user: { select: { fullName: true, avatarUrl: true } } },
        },
        doctor: {
          include: {
            user: { select: { fullName: true, avatarUrl: true } },
            specialty: true,
          },
        },
        prescription: true,
        chatMessages: true,
        attachments: true,
      },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async updateStatus(
    id: string,
    userId: string,
    role: string,
    dto: UpdateAppointmentStatusDto,
  ) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');

    // Authorization: only the doctor on this appointment (or the patient, for cancellation) can update it
    if (role === 'DOCTOR') {
      const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
      if (!doctor || doctor.id !== appointment.doctorId) {
        throw new ForbiddenException(
          'Not authorized to update this appointment',
        );
      }
    } else {
      const patient = await this.prisma.patient.findUnique({
        where: { userId },
      });
      if (!patient || patient.id !== appointment.patientId) {
        throw new ForbiddenException(
          'Not authorized to update this appointment',
        );
      }
      if (dto.status !== 'CANCELLED') {
        throw new ForbiddenException('Patients can only cancel appointments');
      }
    }

    // Refund wallet on cancellation
    if (dto.status === 'CANCELLED' && appointment.status !== 'CANCELLED') {
      await this.refundAppointment(appointment.id);
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async reschedule(
    id: string,
    userId: string,
    role: string,
    scheduledAtIso: string,
  ) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    if (
      appointment.status === 'CANCELLED' ||
      appointment.status === 'COMPLETED'
    ) {
      throw new BadRequestException('Cannot reschedule this appointment');
    }

    const scheduledAt = new Date(scheduledAtIso);
    if (scheduledAt < new Date()) {
      throw new BadRequestException('Cannot book an appointment in the past');
    }

    if (role === 'DOCTOR') {
      const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
      if (!doctor || doctor.id !== appointment.doctorId) {
        throw new ForbiddenException('Not authorized');
      }
    } else {
      const patient = await this.prisma.patient.findUnique({
        where: { userId },
      });
      if (!patient || patient.id !== appointment.patientId) {
        throw new ForbiddenException('Not authorized');
      }
    }

    const conflict = await this.prisma.appointment.findFirst({
      where: {
        doctorId: appointment.doctorId,
        scheduledAt,
        status: { in: ['PENDING', 'CONFIRMED'] },
        NOT: { id },
      },
    });
    if (conflict) {
      throw new BadRequestException('This time slot is already booked');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { scheduledAt, status: 'PENDING' },
    });
  }

  private async refundAppointment(appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { patient: true },
    });
    if (!appointment) return;

    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: appointment.patient.userId },
    });
    if (!wallet) return;

    await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: appointment.amountPaid } },
      }),
      this.prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'REFUND',
          status: 'COMPLETED',
          amount: appointment.amountPaid,
        },
      }),
    ]);
  }
}
