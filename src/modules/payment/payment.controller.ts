import { Controller, Param, Post } from "@nestjs/common";
import { PaymentService } from "./payment.service";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("click/:id")
  async click(@Param("id") id: string) {
    return this.paymentService.updateStatus(+id, "click");
  }

  @Post("payme/:id")
  async payment(@Param("id") id: string) {
    return this.paymentService.updateStatus(+id, "payme");
  }
}
