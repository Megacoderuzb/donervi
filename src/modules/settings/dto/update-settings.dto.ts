import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSettingDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone_number: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  is_working: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  facebook: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  linkedin: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  instagram: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  telegram: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address: string;
}
