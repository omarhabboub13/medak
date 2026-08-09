import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  private async assertParticipant(
    appointmentId: string,
    userId: string,
    role: string,
  ) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { patient: true, doctor: true },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');

    const ok =
      role === 'DOCTOR'
        ? appointment.doctor.userId === userId
        : appointment.patient.userId === userId;
    if (!ok) throw new ForbiddenException('Not a participant');
    if (
      appointment.status === 'CANCELLED'
    ) {
      throw new BadRequestException('Cannot chat on a cancelled appointment');
    }
    return appointment;
  }

  async listMessages(appointmentId: string, userId: string, role: string) {
    await this.assertParticipant(appointmentId, userId, role);
    return this.prisma.chatMessage.findMany({
      where: { appointmentId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(
    appointmentId: string,
    userId: string,
    role: string,
    dto: SendMessageDto,
  ) {
    await this.assertParticipant(appointmentId, userId, role);
    if (!dto.content?.trim() && !dto.fileUrl) {
      throw new BadRequestException('Message content or fileUrl required');
    }
    return this.prisma.chatMessage.create({
      data: {
        appointmentId,
        senderId: userId,
        content: dto.content?.trim() || null,
        fileUrl: dto.fileUrl || null,
      },
    });
  }

  async addAttachment(
    appointmentId: string,
    userId: string,
    role: string,
    fileUrl: string,
    fileType?: string,
  ) {
    await this.assertParticipant(appointmentId, userId, role);
    return this.prisma.attachment.create({
      data: { appointmentId, fileUrl, fileType },
    });
  }

  async listAttachments(appointmentId: string, userId: string, role: string) {
    await this.assertParticipant(appointmentId, userId, role);
    return this.prisma.attachment.findMany({
      where: { appointmentId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
