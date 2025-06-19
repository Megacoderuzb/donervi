import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product, ProductDocument } from "src/schemas/Products.schema";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { paginate } from "src/common/utils/pagination.util";
import filterByLang from "src/common/filters/lang.filter";
import { productPopulateConfig } from "src/core/config/populate.config";
import { productLangConfig } from "src/core/config/lang.config";

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) {}

  async createProduct(createProductDto: CreateProductDto) {
    return await this.productModel.create({ ...createProductDto });
  }

  async getAllProducts(query, fields: string) {
    const data: any = await paginate(
      this.productModel,
      query,
      productPopulateConfig
    );
    if (!data) {
      throw new NotFoundException("There is no any products !!!");
    }
    return filterByLang(data.data, query._l, fields, productLangConfig);
  }
  async getProductById(id: number, lang: string, fields: string) {
    const product = await this.productModel
      .findOne({ _id: id })
      .populate(productPopulateConfig);
    if (!product) {
      throw new NotFoundException();
    }
    return filterByLang(product, lang, fields, productLangConfig);
  }

  async updateProductById(id: number, updateProductDto: UpdateProductDto) {
    return await this.productModel
      .findByIdAndUpdate(id, { ...updateProductDto }, { new: true })
      .populate(productPopulateConfig);
  }
  async removeProductById(id: number) {
    return await this.productModel.findByIdAndUpdate(
      id,
      { deleted: true, deletedAt: Date.now() },
      { new: true }
    );
  }
}
