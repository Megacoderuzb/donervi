import { Module } from "@nestjs/common";
import { IngredientsController } from "./ingredients.controller";
import { IngredientsService } from "./ingredients.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Ingredient, IngredientSchema } from "src/schemas/Ingredients.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ingredient.name, schema: IngredientSchema },
    ]),
  ],
  controllers: [IngredientsController],
  providers: [IngredientsService],
})
export class IngredientsModule {}
