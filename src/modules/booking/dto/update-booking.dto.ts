import { IsEnum, IsOptional } from "class-validator";
import { BookingStatus } from "src/schemas/Booking.schema";

export class UpdateBookingDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
