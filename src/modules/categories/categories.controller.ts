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
import { CategoriesService } from "./categories.service";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { Roles } from "src/common/decorators/role.decorator";
import { Role } from "src/common/enums/role.enum";
import { AuthGuard } from "src/auth/guards/auth.guards";

@Controller("categories")
export class CategoriesController {
  constructor(
    private readonly categoryService: CategoriesService,
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Post()
  async upload(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  async getList(@Request() req) {
    const baseUrl = `${process.env.SITE_URL}${req.path}`;
    req.query._l = req.headers._l;

    let data = await this.categoryService.getAllCategories({
      ...req.query,
      baseUrl,
      _l: req.headers._l,
    });

    return data;
  }
  @Get(":id")
  async show(@Param("id") id: string, @Request() req) {
    const category = await this.categoryService.getCategoryById(
      +id,
      req.headers._l,
      req.query.fields
    );

    return category;
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Put(":id")
  async edit(@Param("id") id: string, @Body() updateDto: UpdateCategoryDto) {
    let updated = await this.categoryService.updateCategoryById(+id, updateDto);
    return updated;
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.categoryService.deleteCategoryById(+id);
  }
}
