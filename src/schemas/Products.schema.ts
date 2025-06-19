import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";
import { Counter } from "./Counter.schema";
import { Category } from "./Category.schema";

export type ProductDocument = Product & Document;

@Schema({
  versionKey: false,
  _id: false,
  timestamps: true,
})
export class Product {
  @Prop({ type: Number })
  _id: number;

  @Prop({ type: String, required: true })
  name_uz: string;
  @Prop({ type: String, required: true })
  name_ru: string;
  @Prop({ type: String, required: true })
  name_en: string;

  @Prop({ type: String, required: true })
  description_uz: string;

  @Prop({ type: String, required: true })
  description_ru: string;

  @Prop({ type: String, required: true })
  description_en: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true, ref: Category.name })
  category: number;

  @Prop({ type: Number })
  kkal: number;

  @Prop({ type: [
      {
        id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ] })
  photo_urls: {
    id: string;
    url: string;
  }[];

  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: Number, default: 0 })
  deletedAt: number;
  @Prop({ type: Number })
  createdAt: number;
  @Prop({ type: Number })
  updatedAt: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre("find", function () {
  this.where({ deleted: false });
});
ProductSchema.pre("findOne", function () {
  this.where({ deleted: false });
});

ProductSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counterModel = this.$model("Counter") as Model<Counter>;
    const counter = await counterModel.findByIdAndUpdate(
      "Product",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    if (counter) {
      this._id = counter.seq;
    }
  }

  next();
});
