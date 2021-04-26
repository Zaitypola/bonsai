import { getModelForClass, prop } from '@typegoose/typegoose';
import * as uuid from 'uuid';

export class User {
  @prop({ default: uuid.v4 })
  _id: string;
  /**
   * Refactored publicId to be number to match the API store and to use the $mod operator.
   */
  @prop({ required: true })
  publicId!: number; // Fake Store API identifier used for matching users.

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
