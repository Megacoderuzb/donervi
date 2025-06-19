import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from "@nestjs/common";
import { PromocodesService } from "./promocodes.service";
import { CreatePromocodeDto } from "./dto/create-promocode.dto";
import { UpdatePromocodeDto } from "./dto/update-promocode.dto";
import { Roles } from "src/common/decorators/role.decorator";
import { Role } from "src/common/enums/role.enum";
import { AuthGuard } from "src/auth/guards/auth.guards";

@Controller("promocodes")
export class PromocodesController {
  constructor(private readonly promocodesService: PromocodesService) {}

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() dto: CreatePromocodeDto) {
    try {
      return this.promocodesService.createPromocode(dto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async getList(@Request() req) {
    const baseUrl = `${process.env.SITE_URL}${req.path}`;
    return this.promocodesService.getAllPromocodes({
      ...req.query,
      baseUrl,
    });
  }

  @Get(":id")
  async show(@Param("id") id: string) {
    return this.promocodesService.getPromocodeById(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdatePromocodeDto) {
    return this.promocodesService.updatePromocodeById(id, dto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.promocodesService.removePromocodeById(id);
  }
}
