import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstname: string;

  @IsString()
  @IsOptional()
  lastname: string;

  @IsObject()
  @IsOptional()
  photo_url: {
    url: string;
    id: string;
  };
}
