import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export enum ConsultationTypeDto {
  VIDEO = 'VIDEO',
  CHAT = 'CHAT',
  VOICE = 'VOICE',
}

export class CreateAppointmentDto {
  @IsString()
  doctorId!: string;

  @IsDateString()
  scheduledAt!: string;

  @IsEnum(ConsultationTypeDto)
  consultationType!: ConsultationTypeDto;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
