import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateAdminDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastname: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password: string;

  @IsObject()
  @IsOptional()
  photo_url: {
    url: string;
    id: string;
  };
}
