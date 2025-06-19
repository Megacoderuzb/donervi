import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdatePromocodeDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  code: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  type: string;

  @IsNumber()
  @IsOptional()
  amount: number;

  @IsNumber()
  @IsOptional()
  percentage: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  minimal_order_amount: number;
}
