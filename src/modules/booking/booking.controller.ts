import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Request,
  UseGuards,
  Inject,
} from "@nestjs/common";
import { BookingService } from "./booking.service";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { Roles } from "src/common/decorators/role.decorator";
import { Role } from "src/common/enums/role.enum";
import { AuthGuard } from "src/auth/guards/auth.guards";
import { convertUtcToTashkentTimestamp } from "src/common/helpers/date.helper";

@Controller("booking")
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
  ) {}

  @Roles(Role.USER)
  @UseGuards(AuthGuard)
  @Post()
  async create(@Request() req, @Body() dto) {
    dto.date = convertUtcToTashkentTimestamp(dto.date);
    return this.bookingService.createBooking({ ...dto, owner: req.user.id });
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Put(":id")
  async updateStatus(@Param("id") id: string, @Body() dto: UpdateBookingDto) {
    let updated = await this.bookingService.updateBookingStatusById(id, dto);

    return updated;
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Get()
  findAllForAdmin(@Request() req) {
    const baseUrl = `${process.env.SITE_URL}${req.path}`;

    return this.bookingService.findAllBookings({ ...req.query, baseUrl });
  }

  @Roles(Role.USER)
  @UseGuards(AuthGuard)
  @Get("/my-bookings")
  findAllForUser(@Request() req) {
    const baseUrl = `${process.env.SITE_URL}${req.path}`;
    return this.bookingService.findAllUserBookings(
      { ...req.query, baseUrl },
      +req.user.id
    );
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {

    const booking = await this.bookingService.findBookingById(id);

    return booking;
  }
}
