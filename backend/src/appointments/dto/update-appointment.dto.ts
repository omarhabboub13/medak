import { IsEnum } from 'class-validator';

export enum AppointmentStatusDto {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export class UpdateAppointmentStatusDto {
  @IsEnum(AppointmentStatusDto)
  status!: AppointmentStatusDto;
}
