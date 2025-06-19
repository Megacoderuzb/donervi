import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category, CategoryDocument } from "src/schemas/Category.schema";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { paginate } from "src/common/utils/pagination.util";
import filterByLang from "src/common/filters/lang.filter";
import { categoryLangConfig } from "src/core/config/lang.config";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const data = await this.categoryModel.create({ ...createCategoryDto });

    return { data };
  }

  async getAllCategories(query) {
    let data: any = await paginate(this.categoryModel, query);
    data.data = filterByLang(
      data.data,
      query._l,
      query.fields,
      categoryLangConfig
    );

    return data;
  }

  async getCategoryById(id: number, lang: string, fields: string) {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException("Not found!!!");
    }
    return filterByLang(category, lang, fields, categoryLangConfig);
  }

  async updateCategoryById(id: number, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryModel.findByIdAndUpdate(
      id,
      { ...updateCategoryDto },
      { new: true }
    );
  }
  async deleteCategoryById(id: number) {
    return await this.categoryModel.findByIdAndUpdate(
      id,
      { deleted: true, deletedAt: Date.now() },
      { new: true }
    );
  }
}
