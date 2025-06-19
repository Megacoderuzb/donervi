import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order, OrderDocument, Status } from "src/schemas/Orders.schema";
import { UpdateOrderDto } from "../orders/dto/update-orders.dto";

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>
  ) {}

  async updateStatus(id: number, payment: string) {
    return await this.orderModel.findByIdAndUpdate(
      id,
      { status: Status.WAIT_DELIVERY, payment },
      { new: true }
    );
  }
}
