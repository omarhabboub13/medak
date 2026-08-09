import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CompleteDoctorProfileDto {
  @IsString()
  specialtyId!: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsNumber()
  @Min(0)
  yearsExperience!: number;

  @IsNumber()
  @Min(0)
  consultFee!: number;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  clinicAddress?: string;
}
