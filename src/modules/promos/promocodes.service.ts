import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Promocode, PromocodeDocument } from "src/schemas/Promocodes.schema";
import { CreatePromocodeDto } from "./dto/create-promocode.dto";
import { UpdatePromocodeDto } from "./dto/update-promocode.dto";
import { paginate } from "src/common/utils/pagination.util";

@Injectable()
export class PromocodesService {
  constructor(
    @InjectModel(Promocode.name)
    private promoModel: Model<PromocodeDocument>
  ) {}

  async createPromocode(dto: CreatePromocodeDto) {
    return this.promoModel.create(dto).catch((error) => {
      throw new BadRequestException(error.message);
    });
  }

  async getAllPromocodes(query) {
    return paginate(this.promoModel, query);
  }

  async getPromocodeById(id: string) {
    return this.promoModel.findById(id);
  }

  async updatePromocodeById(id: string, dto: UpdatePromocodeDto) {
    return await this.promoModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
  }

  async removePromocodeById(id: string) {
    return this.promoModel.findByIdAndUpdate(
      id,
      { deleted: true, deletedAt: Date.now() },
      { new: true }
    );
  }
}
