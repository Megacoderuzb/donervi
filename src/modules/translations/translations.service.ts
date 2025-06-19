import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  Translation,
  TranslationDocument,
} from "src/schemas/Translation.schema";

@Injectable()
export class TranslationsService {
  constructor(
    @InjectModel(Translation.name)
    private readonly translationModel: Model<TranslationDocument>
  ) {}

  async findAll() {
    const translations = await this.translationModel.find();
    return {
      data: translations.map((translation) => ({
        id: translation._id,
        message: translation.message,
        uz: translation.uz || null,
        ru: translation.ru || null,
        en: translation.en || null,
      })),
    };
  }

  async findByLang(lang: string) {
    const translations = await this.translationModel.find();
    const result: Record<string, string | null> = {};

    translations.forEach((translation) => {
      result[translation.message] = translation[lang] || null;
    });

    return result;
  }

  async search(message: string) {
    const regex = new RegExp(message, "i");
    const translations = await this.translationModel.find({
      message: { $regex: regex },
    });

    return {
      data: translations.map((translation) => ({
        id: translation._id,
        message: translation.message,
        uz: translation.uz || null,
        ru: translation.ru || null,
        en: translation.en || null,
      })),
    };
  }

  async create(lang: string, message: string, text: string) {
    const findTranslation = await this.translationModel.findOne({ message });
    if (findTranslation) {
      const updatedTranslation = await this.translationModel.findByIdAndUpdate(
        findTranslation._id,
        { $set: { [lang]: text } },
        { new: true }
      );
      if (!updatedTranslation) {
        return { message: "smth" };
      }
      return updatedTranslation;
    } else {
      const body: object = {};
      body[lang] = text;
      const translation = await this.translationModel.create({
        message,
        ...body,
      });
      return translation;
    }
  }

  async update(id: string, lang: string, text: string) {
    const findTranslation = await this.translationModel.findById(id);
    if (!findTranslation) {
      throw new Error("Translation not found");
    }

    const updatedTranslation = await this.translationModel.findByIdAndUpdate(
      id,
      { $set: { [lang]: text } },
      { new: true }
    );
    return updatedTranslation;
  }
}
