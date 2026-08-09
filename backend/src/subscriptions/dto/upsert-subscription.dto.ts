import { IsDateString, IsNumber, IsString, Min } from 'class-validator';

export class UpsertSubscriptionDto {
  @IsString()
  planName!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsDateString()
  expiresAt!: string;
}
