import { Module } from "@nestjs/common";
import { TelegramService } from "./telegram.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Booking, BookingSchema } from "src/schemas/Booking.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
