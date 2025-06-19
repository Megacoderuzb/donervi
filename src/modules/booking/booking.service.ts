import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Booking, BookingDocument } from "src/schemas/Booking.schema";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { TelegramService } from "../telegram/telegram.service";
import { paginate } from "src/common/utils/pagination.util";
import { bookingPopulateConfig } from "src/core/config/populate.config";

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private telegramService: TelegramService
  ) {}

  async createBooking(createDto: CreateBookingDto) {
    try {
      const data = await this.bookingModel.create(createDto);
      await this.telegramService.notifyAdmin(data);
      return data;
    } catch (error) {
      return error.message;
    }
  }

  async updateBookingStatusById(id: string, updateDto: UpdateBookingDto) {
    return await this.bookingModel.findByIdAndUpdate(id, updateDto, {
      new: true,
    });
  }

  async findAllBookings(query) {
    return paginate(this.bookingModel, query, bookingPopulateConfig);
  }

  async findAllUserBookings(query, id: number) {
    query.filter = { ...query.filter, owner: id };
    return await paginate(this.bookingModel, query, bookingPopulateConfig);
  }

  async findBookingById(id: string) {
    return await this.bookingModel.findById(id);
  }
}
