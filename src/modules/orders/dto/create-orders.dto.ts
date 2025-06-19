import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from "class-validator";
import { PaymentTypes } from "src/schemas/Orders.schema";

export class CreateOrderDto {
  @IsObject()
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
  @IsNotEmpty()
  promocode: number;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsArray()
  @IsNotEmpty()
  products: {
    product: number;
    quantity: number;
    ingredients: number[];
  }[];

  @IsString()
  @IsNotEmpty()
  payment: PaymentTypes;
}
