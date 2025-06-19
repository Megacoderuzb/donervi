import { Module } from "@nestjs/common";
import { PromocodesController } from "./promocodes.controller";
import { PromocodesService } from "./promocodes.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Promocode, PromocodeSchema } from "src/schemas/Promocodes.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Promocode.name, schema: PromocodeSchema },
    ]),
  ],
  controllers: [PromocodesController],
  providers: [PromocodesService],
})
export class PromocodesModule {}
