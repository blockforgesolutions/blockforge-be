import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';

@Schema({ timestamps: true })
export class EmailVerification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true })
  token: string;

  @Prop({ type: Date, expires: 86400 }) // 24 hours
  createdAt: Date;
}

export const EmailVerificationSchema = SchemaFactory.createForClass(EmailVerification); 