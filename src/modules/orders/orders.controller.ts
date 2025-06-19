import {
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
import { OrderService } from "./orders.service";
import { UpdateOrderDto } from "./dto/update-orders.dto";
import { CreateOrderDto } from "./dto/create-orders.dto";
import { Roles } from "src/common/decorators/role.decorator";
import { Role } from "src/common/enums/role.enum";
import { AuthGuard } from "src/auth/guards/auth.guards";
import { Status } from "src/schemas/Orders.schema";

@Controller("orders")
export class OrderController {
  constructor(private readonly OrderService: OrderService) {}

  @Post()
  async upload(@Body() createOrderDto: CreateOrderDto) {
    return this.OrderService.createOrder(createOrderDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Get()
  async getList(@Request() req) {
    const baseUrl = `${process.env.SITE_URL}${req.path}`;
    return this.OrderService.getOrdersList({ ...req.query, baseUrl });
  }

  @Get(":id")
  async show(@Param("id") id: string) {
    return this.OrderService.showOrder(+id);
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Put(":id")
  async edit(@Param("id") id: string, @Body() updateDto: UpdateOrderDto) {
    return this.OrderService.updateOrder(+id, updateDto);
  }

  @Post("confirm/:id")
  async updateStatus(@Param("id") id: string) {
    return this.OrderService.updateStatus(+id, Status.WAIT_PAYMENT);
  }
  @Post("pay/:id")
  async pay(@Param("id") id: string, @Body("payment") payment: string) {
    return this.OrderService.pay(+id, payment);
  }
  @Post("complete/:id")
  async complateOrder(@Param("id") id: string) {
    return this.OrderService.updateStatus(+id, Status.COMPLETED);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.OrderService.removeOrder(+id);
  }
}
