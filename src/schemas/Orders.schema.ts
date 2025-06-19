import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";
import { Counter } from "./Counter.schema";
import { Product } from "./Products.schema";
import { Promocode } from "./Promocodes.schema";
import { Ingredient } from "./Ingredients.schema";

export type OrderDocument = Order & Document;

export enum PaymentTypes {
  "payme",
  "click",
}
export enum Status {
  CREATED = 1,
  WAIT_PAYMENT = 2,
  WAIT_DELIVERY = 3,
  COMPLETED = 4,
}

@Schema({
  versionKey: false,
  _id: false,
  timestamps: true,
})
export class Order {
  @Prop({ type: Number })
  _id: number;

  @Prop({
    type: [
      {
        name: {
          type: String,
        },
        lat: {
          type: String,
        },
        lon: {
          type: String,
        },
        home: {
          type: String,
        },
        enterce: {
          type: Number,
        },
        apartment: {
          type: Number,
        },
      },
    ],
  })
  delivery: {
    name: string;
    lat: string;
    lon: string;
    home: string;
    enterce: number;
    apartment: number;
  };

  @Prop({ type: String })
  comment: string;

  @Prop({ type: Number, ref: Promocode.name })
  promocode: number;

  @Prop({
    type: [
      {
        product: {
          type: Number,
          ref: Product.name,
        },
        quantity: { type: Number },
        ingredients: {
          type: [Number],
          ref: Ingredient.name,
        },
      },
    ],
  })
  products: {
    product: number;
    quantity: number;
    ingredients: number[];
  }[];

  @Prop({ type: Number, enum: Status, default: Status.CREATED })
  status: number;

  @Prop({ type: String, enum: PaymentTypes })
  payment: PaymentTypes;

  @Prop({ type: Number })
  total_amount: number;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: Number, default: 0 })
  deletedAt: number;
  @Prop({ type: Number })
  createdAt: number;
  @Prop({ type: Number })
  updatedAt: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.pre("find", function () {
  this.where({ deleted: false });
});
OrderSchema.pre("findOne", function () {
  this.where({ deleted: false });
});

OrderSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counterModel = this.$model("Counter") as Model<Counter>;
    const counter = await counterModel.findByIdAndUpdate(
      "Order",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    if (counter) {
      this._id = counter.seq;
    }
  }

  next();
});
