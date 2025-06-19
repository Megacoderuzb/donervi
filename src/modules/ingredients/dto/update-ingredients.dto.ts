import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateIngredientDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name_uz: string;

  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @IsString()
  @IsNotEmpty()
  name_en: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  price: number;
}
