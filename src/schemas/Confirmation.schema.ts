import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";
import { Counter } from "./Counter.schema";

export type ConfirmationDocument = Confirmation & Document;

@Schema({
  timestamps: true,
  versionKey: false,
  _id: false,
})
export class Confirmation {
  @Prop({ type: Number })
  _id: number;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: String, required: true })
  uuid: string;

  @Prop({ type: String, required: true })
  code: string;

  @Prop({ type: String, required: true })
  data: string;

  @Prop({ type: Date, required: true })
  expiredAt: Date;
  @Prop({ type: Number })
  createdAt: number;
  @Prop({ type: Number })
  updatedAt: number;
}

export const ConfirmationSchema = SchemaFactory.createForClass(Confirmation);
ConfirmationSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counterModel = this.$model("Counter") as Model<Counter>;
    const counter = await counterModel.findByIdAndUpdate(
      "confirmation",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    if (counter) {
      this._id = counter.seq;
    }
  }
  next();
});
