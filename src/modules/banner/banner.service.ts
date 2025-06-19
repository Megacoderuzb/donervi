import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Banner, BannerDocument } from "src/schemas/Banner.schema";
import { Model } from "mongoose";
import { UpdateBannerDto } from "./dto/update-banner.dto";
import { CreateBannerDto } from "./dto/create-banner.dto";
import filterByLang from "src/common/filters/lang.filter";
import { paginate } from "src/common/utils/pagination.util";
import { bannerLangConfig } from "src/core/config/lang.config";

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name) private bannerModel: Model<BannerDocument>
  ) {}

  async createBanner(createBannerDto: CreateBannerDto) {
    return await this.bannerModel.create({ ...createBannerDto });
  }

  async getAllBanners(query) {
    const banners = await paginate(this.bannerModel, query);
    return filterByLang(banners.data, query._l, query.fields, bannerLangConfig);
  }

  async getBannerById(id: number, lang: string, fields: string) {
    const banner = await this.bannerModel.findById(id).lean();
    if (!banner) {
      throw new NotFoundException("Banner not found!!");
    }
    return filterByLang(banner, lang, fields, bannerLangConfig);
  }

  async updateBannerById(id: number, updateBannerDto: UpdateBannerDto) {
    return await this.bannerModel.findByIdAndUpdate(
      id,
      { ...updateBannerDto },
      { new: true }
    );
  }
  async deleteBannerById(id: number) {
    return await this.bannerModel.findByIdAndUpdate(
      id,
      { deleted: true, deletedAt: Date.now() },
      { new: true }
    );
  }
}
