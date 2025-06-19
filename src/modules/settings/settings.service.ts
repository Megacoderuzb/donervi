import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from 'src/schemas/Setting.schema';
import { UpdateSettingDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting.name)
    private readonly settingModel: Model<SettingDocument>,
  ) {}
  async get() {
    return {
      data: await this.settingModel.findOne(),
    };
  }
  async update(UpdateSettingDto: UpdateSettingDto) {
    return {
      data: await this.settingModel.findOneAndUpdate({}, UpdateSettingDto, {
        new: true,
        upsert: true,
      }),
    };
  }
}
