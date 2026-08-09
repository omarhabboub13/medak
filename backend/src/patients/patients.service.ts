import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async getMyProfile(userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            fullName: true,
            phone: true,
            email: true,
            avatarUrl: true,
            governorate: true,
            language: true,
          },
        },
      },
    });
    if (!patient) throw new NotFoundException('Patient profile not found');
    return patient;
  }

  async updateMyProfile(userId: string, dto: UpdatePatientDto) {
    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) throw new NotFoundException('Patient profile not found');

    return this.prisma.patient.update({
      where: { userId },
      data: {
        ...(dto.dateOfBirth && { dateOfBirth: new Date(dto.dateOfBirth) }),
        ...(dto.gender && { gender: dto.gender }),
        ...(dto.medicalNotes && { medicalNotes: dto.medicalNotes }),
      },
    });
  }
}
