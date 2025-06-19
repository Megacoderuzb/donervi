import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateIngredientsDto {
  @IsString()
  @IsNotEmpty()
  name_uz: string;
  @IsString()
  @IsNotEmpty()
  name_ru: string;
  @IsString()
  @IsNotEmpty()
  name_en: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
