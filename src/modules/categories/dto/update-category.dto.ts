import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name_uz: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name_ru: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name_en: string;

  @IsObject()
  @IsNotEmpty()
  @IsOptional()
  photo_url: {
    id: string;
    url: string;
  };
}
