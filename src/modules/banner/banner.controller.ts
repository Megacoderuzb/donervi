import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthGuard } from 'src/auth/guards/auth.guards';

@Controller('banners')
export class BannerController {
  constructor(
    private readonly bannerService: BannerService,
  ) {}


  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Post()
  async uploadBanner(@Body() createBannerDto: CreateBannerDto) {
    return this.bannerService.createBanner(createBannerDto);
  }

  @Get()
  async getBannersList(@Request() req) {
    const baseUrl = `${process.env.SITE_URL}${req.path}`;
    req.query._l = req.headers._l;
    req.query.fields = req.query.fields;


    const data = await this.bannerService.getAllBanners({
      ...req.query,
      baseUrl,
      _l: req.headers._l,
    });

    return data;
  }

  @Get(':id')
  async showBanner(@Request() req, @Param('id') id: string) {
    const banner = await this.bannerService.getBannerById(
      +id,
      req.headers._l,
      req.query.fields
    );

    return banner;
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Put(':id')
  async editBanner(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {
    return this.bannerService.updateBannerById(+id, updateBannerDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async removeBannerById(@Param('id') id: string) {
    return this.bannerService.deleteBannerById(+id);
  }
}