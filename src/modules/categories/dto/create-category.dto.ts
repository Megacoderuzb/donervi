import { IsNotEmpty, IsObject, IsString } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name_uz: string;
  @IsString()
  @IsNotEmpty()
  name_ru: string;
  @IsString()
  @IsNotEmpty()
  name_en: string;

  @IsObject()
  @IsNotEmpty()
  photo_url: {
    id: string;
    url: string;
  };
}
