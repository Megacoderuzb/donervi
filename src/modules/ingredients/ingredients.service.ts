import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Ingredient, IngredientDocument } from "src/schemas/Ingredients.schema";
import { CreateIngredientsDto } from "./dto/create-ingredients.dto";
import { UpdateIngredientDto } from "./dto/update-ingredients.dto";
import { paginate } from "src/common/utils/pagination.util";
import filterByLang from "src/common/filters/lang.filter";
import { ingredientLangConfig } from "src/core/config/lang.config";

@Injectable()
export class IngredientsService {
  constructor(
    @InjectModel(Ingredient.name)
    private ingredientModel: Model<IngredientDocument>
  ) {}

  async createIngredient(dto: CreateIngredientsDto) {
    return await this.ingredientModel.create(dto);
  }

  async getAllIngredients(query, fields: string, lang: string) {
    let data = await paginate(this.ingredientModel, query);
    return filterByLang(data.data, lang, fields, ingredientLangConfig);
  }

  async getIngredientById(id: string, lang: string, fields: string) {
    let data = await this.ingredientModel.findById(id);
    if (!data) {
      throw new NotFoundException("There is no any ingredients!!!");
    }
    return filterByLang(data, lang, fields, ingredientLangConfig);
  }

  async updateIngredientById(id: string, dto: UpdateIngredientDto) {
    return await this.ingredientModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async removeIngredientById(id: string) {
    return await this.ingredientModel.findByIdAndUpdate(
      id,
      { deleted: true, deletedAt: Date.now() },
      { new: true }
    );
  }
}
