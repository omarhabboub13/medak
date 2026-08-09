import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateSlotDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek!: number; // 0 = Sunday ... 6 = Saturday

  @IsString()
  startTime!: string; // "09:00"

  @IsString()
  endTime!: string; // "17:00"

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
