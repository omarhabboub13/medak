import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SpecialtiesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.specialty.findMany({
      orderBy: { nameAr: 'asc' },
    });
  }

  async findOne(id: string) {
    const specialty = await this.prisma.specialty.findUnique({ where: { id } });
    if (!specialty) throw new NotFoundException('Specialty not found');
    return specialty;
  }

  create(data: { nameAr: string; nameEn: string; iconUrl?: string }) {
    return this.prisma.specialty.create({ data });
  }

  update(
    id: string,
    data: Partial<{ nameAr: string; nameEn: string; iconUrl: string }>,
  ) {
    return this.prisma.specialty.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.specialty.delete({ where: { id } });
  }
}
