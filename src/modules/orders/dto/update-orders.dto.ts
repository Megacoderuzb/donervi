import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { PaymentTypes, Status } from "src/schemas/Orders.schema";

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  delivery: {
    name: string;
    lat: string;
    lon: string;
    home: string;
    enterce: number;
    apartment: number;
  };

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  promocode: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  home: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  comment: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  enterce: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  apartment: string;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  total_amount: number;

  @IsArray()
  @IsOptional()
  @IsNotEmpty()
  products: [object];

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  payment: PaymentTypes;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  status: Status;
}
