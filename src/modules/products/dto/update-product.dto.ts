import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

export class UpdateProductDto {
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

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description_uz: string;
  
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description_ru: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description_en: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  category: number;

  @IsOptional()
  @IsString()
  kkal: number;

  @IsOptional()
  @IsObject()
  @IsNotEmpty()
  photo_urls: {
    id: string;
    url: string;
  }[];
}
