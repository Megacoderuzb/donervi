import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name_uz: string;
  @IsString()
  @IsNotEmpty()
  name_ru: string;
  @IsString()
  @IsNotEmpty()
  name_en: string;

  @IsString()
  @IsNotEmpty()
  description_uz: string;
  @IsString()
  @IsNotEmpty()
  description_ru: string;
  @IsString()
  @IsNotEmpty()
  description_en: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  category: number;

  @IsNumber()
  kkal: number;

  @IsArray()
  @IsNotEmpty()
  photo_urls: {
    id: string;
    url: string;
  }[];
}
