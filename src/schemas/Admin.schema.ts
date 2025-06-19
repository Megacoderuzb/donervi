import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";
import { Counter } from "./Counter.schema";
import { Role } from "src/common/enums/role.enum";

export type AdminDocument = Admin & Document;

@Schema({
  versionKey: false,
  _id: false,
  timestamps: true,
})
export class Admin {
  @Prop({ type: Number })
  _id: number;

  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: false })
  firstname: string;

  @Prop({ type: String, required: false })
  lastname: string;

  @Prop({
    type: Object,
    default: {
      url: "https://cdn.myproje.uz/large/67529f70b63e267661939b25.webp",
      id: "1",
    },
  })
  photo_url: {
    url: string;
    id: string;
  };

  @Prop({
    type: String,
    enum: Role,
    default: Role.ADMIN,
  })
  role: Role;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: Number, default: 0 })
  deletedAt: number;

  @Prop({ type: Number})
  createdAt: number;
  @Prop({ type: Number})
  updatedAt: number;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

AdminSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counterModel = this.$model("Counter") as Model<Counter>;
    const counter = await counterModel.findByIdAndUpdate(
      "admins",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    if (counter) {
      this._id = counter.seq;
    }
  }
  next();
});
