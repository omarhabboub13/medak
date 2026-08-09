import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateLandingDto {
  @IsOptional() @IsString() brandName?: string;
  @IsOptional() @IsString() brandNameEn?: string;
  @IsOptional() @IsString() heroTitle?: string;
  @IsOptional() @IsString() heroHighlight?: string;
  @IsOptional() @IsString() heroSubtitle?: string;
  @IsOptional() @IsString() heroSupport?: string;
  @IsOptional() @IsString() whyTitle?: string;
  @IsOptional() @IsString() whyIntro?: string;
  @IsOptional() @IsArray() whyItems?: unknown[];
  @IsOptional() @IsString() patientsTitle?: string;
  @IsOptional() @IsString() patientsIntro?: string;
  @IsOptional() @IsArray() patientFeatures?: unknown[];
  @IsOptional() @IsString() doctorsTitle?: string;
  @IsOptional() @IsString() doctorsIntro?: string;
  @IsOptional() @IsArray() doctorFeatures?: unknown[];
  @IsOptional() @IsString() howTitle?: string;
  @IsOptional() @IsString() howIntro?: string;
  @IsOptional() @IsArray() howSteps?: unknown[];
  @IsOptional() @IsString() audienceTitle?: string;
  @IsOptional() @IsArray() audiences?: unknown[];
  @IsOptional() @IsString() techTitle?: string;
  @IsOptional() @IsString() techIntro?: string;
  @IsOptional() @IsArray() techItems?: unknown[];
  @IsOptional() @IsString() downloadTitle?: string;
  @IsOptional() @IsString() downloadSubtitle?: string;
  @IsOptional() @IsString() appStoreUrl?: string;
  @IsOptional() @IsString() playStoreUrl?: string;
  @IsOptional() @IsString() footerTagline?: string;
}
