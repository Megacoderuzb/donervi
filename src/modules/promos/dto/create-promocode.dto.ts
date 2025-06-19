import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePromocodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsOptional()
  amount: number;

  @IsNumber()
  @IsOptional()
  percentage: number;

  @IsNumber()
  @IsNotEmpty()
  minimal_order_amount: number;
}
