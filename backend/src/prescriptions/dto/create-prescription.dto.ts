import { IsOptional, IsString } from 'class-validator';

export class CreatePrescriptionDto {
  @IsString()
  appointmentId!: string;

  @IsString()
  details!: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;
}
