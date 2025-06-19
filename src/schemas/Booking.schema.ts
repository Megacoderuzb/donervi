import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";
import { Counter } from "./Counter.schema";
import { User } from "./User.schema";

export type BookingDocument = Booking & Document;

export enum BookingStatus {
  IN_PROCESS = 1,
  ACCEPTED = 2,
  REJECTED = -1,
}

@Schema({
  versionKey: false,
  _id: false,
  timestamps: true,
})
export class Booking {
  @Prop({ type: Number })
  _id: number;

  @Prop({ type: Number, required: true })
  date: number;

  @Prop({ required: true, min: 1 })
  visitors_quantity: number;

  @Prop({ type: Number, ref: User.name })
  owner: number;

  @Prop({
    required: true,
    type: {
      name: String,
      surname: String,
      phone: String,
    },
  })
  user: {
    name: string;
    surname: string;
    phone: string;
  };

  @Prop({ type: String })
  comment: string;

  @Prop({ enum: BookingStatus, default: BookingStatus.IN_PROCESS })
  status: BookingStatus;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: Number, default: 0 })
  deletedAt: number;

  @Prop({ type: Number })
  createdAt: number;

  @Prop({ type: Number })
  updatedAt: number;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

BookingSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counterModel = this.$model("Counter") as Model<Counter>;
    const counter = await counterModel.findByIdAndUpdate(
      "Booking",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    if (counter) {
      this._id = counter.seq;
    }
  }
  next();
});

BookingSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updated_at: Date.now() });
  next();
});
