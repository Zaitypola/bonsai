import { getModelForClass, prop } from '@typegoose/typegoose';
import * as uuid from 'uuid';

export class Product {
  @prop({ default: uuid.v4 })
  _id: string;

  @prop({ required: true })
  publicId!: string;

  @prop({ required: true })
  title!: string;

  @prop({ required: true })
  price!: number;

  @prop({ required: true })
  description!: string;

  @prop()
  category?: string;

  @prop()
  image?: string;

  @prop()
  createdAt: Date;

  @prop()
  updatedAt: Date;

  @prop()
  _v: number;
}

export const dBProduct = getModelForClass(Product, {
  schemaOptions: { timestamps: true },
});
