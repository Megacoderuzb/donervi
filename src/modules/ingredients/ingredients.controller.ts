import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { IngredientsService } from "./ingredients.service";
import { CreateIngredientsDto } from "./dto/create-ingredients.dto";
import { UpdateIngredientDto } from "./dto/update-ingredients.dto";
import { Roles } from "src/common/decorators/role.decorator";
import { Role } from "src/common/enums/role.enum";
import { AuthGuard } from "src/auth/guards/auth.guards";

@Controller("ingredients")
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() dto: CreateIngredientsDto) {
    return this.ingredientsService.createIngredient(dto);
  }

  @Get()
  async getList(@Request() req) {
    const baseUrl = `${process.env.SITE_URL}${req.path}`;
    return this.ingredientsService.getAllIngredients(
      {
        ...req.query,
        baseUrl,
      },
      req.query.fields,
      req.headers._l
    );
  }

  @Get(":id")
  async show(@Request() req) {
    return this.ingredientsService.getIngredientById(
      req.params.id,
      req.headers._l,
      req.query.fields
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateIngredientDto) {
    return this.ingredientsService.updateIngredientById(id, dto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.ingredientsService.removeIngredientById(id);
  }
}
