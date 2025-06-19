import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";
import { Counter } from "./Counter.schema";

export type PromocodeDocument = Promocode & Document;

export enum PromocodeType {
  PERCENTAGE = "percentage",
  AMOUNT = "amount",
}

@Schema({
  versionKey: false,
  _id: false,
  timestamps: true,
})
export class Promocode {
  @Prop({ type: Number })
  _id: number;

  @Prop({ type: String, required: true, unique: true })
  code: string;

  @Prop({ type: String, enum: PromocodeType, required: true })
  type: PromocodeType;

  @Prop({ type: Number })
  amount: number;

  @Prop({ type: Number })
  percentage: number;

  @Prop({ type: Number, required: true })
  minimal_order_amount: number;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: Number, default: 0 })
  deletedAt: number;
  @Prop({ type: Number })
  createdAt: number;
  @Prop({ type: Number })
  updatedAt: number;
}

export const PromocodeSchema = SchemaFactory.createForClass(Promocode);

PromocodeSchema.pre("find", function () {
  this.where({ deleted: false });
});
PromocodeSchema.pre("findOne", function () {
  this.where({ deleted: false });
});

PromocodeSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counterModel = this.$model("Counter") as Model<Counter>;
    const counter = await counterModel.findByIdAndUpdate(
      "Promocode",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    if (counter) {
      this._id = counter.seq;
    }
  }
  next();
});
