import { IsString, MinLength } from 'class-validator';

export class AskAiDto {
  @IsString()
  @MinLength(2)
  question!: string;
}
