import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";
import { Counter } from "./Counter.schema";

export type BannerDocument = Banner & Document;

@Schema({
  versionKey: false,
  _id: false,
  timestamps: true,
})
export class Banner {
  @Prop({ type: Number })
  _id: number;

  @Prop({ type: String, required: true })
  name_uz: string;

  @Prop({ type: String, required: true })
  name_ru: string;

  @Prop({ type: String, required: true })
  name_en: string;

  @Prop({ type: String, required: true })
  botton_name_uz: string;

  @Prop({ type: String, required: true })
  botton_name_ru: string;

  @Prop({ type: String, required: true })
  botton_name_en: string;

  @Prop({ type: {}, required: true })
  photo_url: {
    id: string;
    url: string;
  };

  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: Number, default: Date.now() })
  deletedAt: number;
  @Prop({ type: Number })
  createdAt: number;
  @Prop({ type: Number })
  updatedAt: number;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);

BannerSchema.pre("find", function () {
  this.where({ deleted: false });
});
BannerSchema.pre("findOne", function () {
  this.where({ deleted: false });
});

BannerSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counterModel = this.$model("Counter") as Model<Counter>;
    const counter = await counterModel.findByIdAndUpdate(
      "Banners",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    if (counter) {
      this._id = counter.seq;
    }
  }

  next();
});
