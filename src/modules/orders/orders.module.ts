import { Module } from "@nestjs/common";
import { OrderController } from "./orders.controller";
import { OrderService } from "./orders.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "src/schemas/Orders.schema";
import { Promocode, PromocodeSchema } from "src/schemas/Promocodes.schema";
import { Product, ProductSchema } from "src/schemas/Products.schema";
import { Ingredient, IngredientSchema } from "src/schemas/Ingredients.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Promocode.name, schema: PromocodeSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Ingredient.name, schema: IngredientSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrdersModule {}
