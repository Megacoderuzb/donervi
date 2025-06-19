import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ProductService } from "./products.service";
import { UpdateProductDto } from "./dto/update-product.dto";
import { CreateProductDto } from "./dto/create-product.dto";
import { Roles } from "src/common/decorators/role.decorator";
import { Role } from "src/common/enums/role.enum";
import { AuthGuard } from "src/auth/guards/auth.guards";

@Controller("products")
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) {}
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Post()
  async upload(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  async getList(@Request() req) {
    req.query._l = req.headers._l;
    const baseUrl = `${process.env.SITE_URL}${req.path}`;
    return this.productService.getAllProducts(
      { ...req.query, baseUrl },
      req.query.fields
    );
  }

  @Get(":id")
  async show(@Param("id") id: string, @Request() req) {
    const product = await this.productService.getProductById(
      +id,
      req.headers._l,
      req.query.fields
    );

    return product;
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Put(":id")
  async edit(@Param("id") id: string, @Body() updateDto: UpdateProductDto) {
    let updated = await this.productService.updateProductById(+id, updateDto);

    return updated;
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.productService.removeProductById(+id);
  }
}
