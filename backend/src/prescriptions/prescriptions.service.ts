import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';

@Injectable()
export class PrescriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreatePrescriptionDto) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor)
      throw new ForbiddenException('Only doctors can issue prescriptions');

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    if (appointment.doctorId !== doctor.id) {
      throw new ForbiddenException('Not authorized for this appointment');
    }

    const existing = await this.prisma.prescription.findUnique({
      where: { appointmentId: dto.appointmentId },
    });
    if (existing)
      throw new BadRequestException(
        'Prescription already issued for this appointment',
      );

    return this.prisma
      .$transaction([
        this.prisma.prescription.create({
          data: {
            appointmentId: dto.appointmentId,
            patientId: appointment.patientId,
            doctorId: doctor.id,
            details: dto.details,
            fileUrl: dto.fileUrl,
          },
        }),
        this.prisma.appointment.update({
          where: { id: dto.appointmentId },
          data: { status: 'COMPLETED' },
        }),
      ])
      .then(([prescription]) => prescription);
  }

  async findMyPrescriptions(userId: string, role: string) {
    if (role === 'DOCTOR') {
      const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
      if (!doctor) throw new NotFoundException('Doctor profile not found');
      return this.prisma.prescription.findMany({
        where: { doctorId: doctor.id },
        include: {
          patient: { include: { user: { select: { fullName: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) throw new NotFoundException('Patient profile not found');
    return this.prisma.prescription.findMany({
      where: { patientId: patient.id },
      include: {
        doctor: {
          include: { user: { select: { fullName: true } }, specialty: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
      include: {
        patient: { include: { user: { select: { fullName: true } } } },
        doctor: {
          include: { user: { select: { fullName: true } }, specialty: true },
        },
      },
    });
    if (!prescription) throw new NotFoundException('Prescription not found');
    return prescription;
  }
}
