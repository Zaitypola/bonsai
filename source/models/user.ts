import { getModelForClass, prop } from '@typegoose/typegoose';
import * as uuid from 'uuid';

export class User {
  @prop({ default: uuid.v4 })
  _id: string;

  @prop({ required: true })
  publicId!: string; // Fake Store API identifier used for matching products.

  @prop({ required: true })
  email!: string;

  @prop({ required: true })
  username!: string;

  @prop({ required: true })
  phone?: string;

  @prop()
  createdAt: Date;

  @prop()
  updatedAt: Date;

  @prop()
  _v: number;
}

export const dbUser = getModelForClass(User, {
  schemaOptions: { timestamps: true },
});
