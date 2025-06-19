import { Module } from "@nestjs/common";
import { PaymentsController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { Order, OrderSchema } from "src/schemas/Orders.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentService],
})
export class PaymentModule {}
