import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertSubscriptionDto } from './dto/upsert-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  private async resolveDoctor(userId: string) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) throw new NotFoundException('Doctor profile not found');
    return doctor;
  }

  async getMine(userId: string) {
    const doctor = await this.resolveDoctor(userId);
    return this.prisma.doctorSubscription.findUnique({
      where: { doctorId: doctor.id },
    });
  }

  async upsert(userId: string, dto: UpsertSubscriptionDto) {
    const doctor = await this.resolveDoctor(userId);
    return this.prisma.doctorSubscription.upsert({
      where: { doctorId: doctor.id },
      create: {
        doctorId: doctor.id,
        planName: dto.planName,
        price: dto.price,
        expiresAt: new Date(dto.expiresAt),
        isActive: true,
      },
      update: {
        planName: dto.planName,
        price: dto.price,
        expiresAt: new Date(dto.expiresAt),
        isActive: true,
        startedAt: new Date(),
      },
    });
  }
}
