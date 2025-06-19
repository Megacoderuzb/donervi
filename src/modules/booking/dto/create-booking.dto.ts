import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class UserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  phone: string;
}

export class CreateBookingDto {
  @IsNumber()
  date: number;

  @IsNumber()
  visitors_quantity: number;

  @IsNumber()
  owner: number;

  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @IsOptional()
  comment?: string;
}
