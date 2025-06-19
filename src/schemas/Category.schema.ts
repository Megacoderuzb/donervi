import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";
import { Counter } from "./Counter.schema";

export type CategoryDocument = Category & Document;

@Schema({
  versionKey: false,
  _id: false,
  timestamps: true,
})
export class Category {
  @Prop({ type: Number })
  _id: number;

  @Prop({ type: String, required: true })
  name_uz: string;

  @Prop({ type: String, required: true })
  name_ru: string;

  @Prop({ type: String, required: true })
  name_en: string;

  @Prop({
    type: {
      url: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
    },
    required: true,
  })
  photo_url: {
    id: string;
    url: string;
  };

  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: Number, default: 0 })
  deletedAt: number;

  @Prop({ type: Number })
  createdAt: number;
  @Prop({ type: Number })
  updatedAt: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.pre("find", function () {
  this.where({ deleted: false });
});
CategorySchema.pre("findOne", function () {
  this.where({ deleted: false });
});

CategorySchema.pre("save", async function (next) {
  if (this.isNew) {
    const counterModel = this.$model("Counter") as Model<Counter>;
    const counter = await counterModel.findByIdAndUpdate(
      "Category",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    if (counter) {
      this._id = counter.seq;
    }
  }
  next();
});
