import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { Counter } from './Counter.schema';

export type TranslationDocument = Translation & Document;

@Schema({
  timestamps: true,
  versionKey: false,
  _id: false,
})
export class Translation {
  @Prop({ type: Number })
  _id: number;

  @Prop({ required: true, type: String })
  message: string;

  @Prop({ type: String })
  uz?: string;

  @Prop({ type: String })
  ru?: string;

  @Prop({ type: String })
  en?: string;
}

export const TranslationSchema = SchemaFactory.createForClass(Translation);
TranslationSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counterModel = this.$model('Counter') as Model<Counter>;
    const counter = await counterModel.findByIdAndUpdate(
      'translations',
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    if (counter) {
      this._id = counter.seq;
    }
  }
  next();
});
