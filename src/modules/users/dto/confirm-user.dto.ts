import { IsNotEmpty, IsNumber } from 'class-validator';

export class ConfirmUserDto {
  @IsNotEmpty()
  @IsNumber()
  code: number;
}
