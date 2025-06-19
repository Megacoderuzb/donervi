import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type SettingDocument = Setting & Document;

@Schema({
  versionKey: false,
})
export class Setting {
  @Prop({ type: Boolean, default: true })
  is_working: boolean;

  @Prop({ type: String, required: false })
  phone_number: string;

  @Prop({ type: String, required: false })
  email: string;

  @Prop({ type: String, required: false })
  facebook: string;

  @Prop({ type: String, required: false })
  linkedin: string;

  @Prop({ type: String, required: false })
  instagram: string;

  @Prop({ type: String, required: false })
  telegram: string;

  @Prop({ type: String, required: false })
  address: string;
  @Prop({ type: Number })
  createdAt: number;
  @Prop({ type: Number })
  updatedAt: number;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
