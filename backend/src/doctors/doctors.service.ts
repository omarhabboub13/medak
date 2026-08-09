import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompleteDoctorProfileDto } from './dto/complete-profile.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { CreateSlotDto } from './dto/create-slot.dto';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  // Called once, right after a DOCTOR registers, to finish setting up their profile
  async completeProfile(userId: string, dto: CompleteDoctorProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== 'DOCTOR') {
      throw new BadRequestException(
        'Only doctor accounts can complete a doctor profile',
      );
    }

    const existing = await this.prisma.doctor.findUnique({ where: { userId } });
    if (existing)
      throw new BadRequestException('Doctor profile already exists');

    return this.prisma.doctor.create({
      data: {
        userId,
        specialtyId: dto.specialtyId,
        bio: dto.bio,
        yearsExperience: dto.yearsExperience,
        consultFee: dto.consultFee,
        latitude: dto.latitude,
        longitude: dto.longitude,
        clinicAddress: dto.clinicAddress,
      },
    });
  }

  // Search + filter doctors: by specialty, governorate/location, featured, search text
  async findAll(filters: {
    specialtyId?: string;
    governorate?: string;
    featured?: string;
    search?: string;
  }) {
    const userFilter: Record<string, unknown> = {};
    if (filters.search) {
      userFilter.fullName = { contains: filters.search };
    }
    if (filters.governorate) {
      userFilter.governorate = filters.governorate;
    }

    return this.prisma.doctor.findMany({
      where: {
        isApproved: true,
        ...(filters.specialtyId && { specialtyId: filters.specialtyId }),
        ...(filters.featured === 'true' && { isFeatured: true }),
        ...(Object.keys(userFilter).length > 0 && { user: userFilter }),
      },
      include: {
        user: {
          select: { fullName: true, avatarUrl: true, governorate: true },
        },
        specialty: true,
      },
      orderBy: [{ isFeatured: 'desc' }, { ratingAvg: 'desc' }],
    });
  }

  async findMyProfile(userId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            fullName: true,
            avatarUrl: true,
            governorate: true,
            phone: true,
            email: true,
          },
        },
        specialty: true,
        slots: { orderBy: { dayOfWeek: 'asc' } },
        subscription: true,
      },
    });
    if (!doctor) throw new NotFoundException('Doctor profile not found');
    return doctor;
  }

  async findOne(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        user: {
          select: { fullName: true, avatarUrl: true, governorate: true },
        },
        specialty: true,
        slots: { where: { isActive: true } },
        reviews: {
          include: {
            patient: { include: { user: { select: { fullName: true } } } },
          },
        },
      },
    });
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }

  async findByUserId(userId: string) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) throw new NotFoundException('Doctor profile not found');
    return doctor;
  }

  async update(doctorId: string, dto: UpdateDoctorDto) {
    return this.prisma.doctor.update({ where: { id: doctorId }, data: dto });
  }

  // Availability slots
  async addSlot(doctorId: string, dto: CreateSlotDto) {
    return this.prisma.availabilitySlot.create({
      data: { doctorId, ...dto },
    });
  }

  async getSlots(doctorId: string) {
    return this.prisma.availabilitySlot.findMany({
      where: { doctorId, isActive: true },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async removeSlot(slotId: string) {
    return this.prisma.availabilitySlot.delete({ where: { id: slotId } });
  }

  // Favorites
  async toggleFavorite(userId: string, doctorId: string) {
    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) throw new NotFoundException('Patient profile not found');

    const existing = await this.prisma.favoriteDoctor.findUnique({
      where: { patientId_doctorId: { patientId: patient.id, doctorId } },
    });
    if (existing) {
      await this.prisma.favoriteDoctor.delete({ where: { id: existing.id } });
      return { favorited: false };
    }
    await this.prisma.favoriteDoctor.create({
      data: { patientId: patient.id, doctorId },
    });
    return { favorited: true };
  }

  async getFavorites(userId: string) {
    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) throw new NotFoundException('Patient profile not found');

    return this.prisma.favoriteDoctor.findMany({
      where: { patientId: patient.id },
      include: {
        doctor: {
          include: {
            user: { select: { fullName: true, avatarUrl: true } },
            specialty: true,
          },
        },
      },
    });
  }
}
