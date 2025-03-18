import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from 'src/roles/role.schema';

export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: false, default: '' })
  phone: string;

  @Prop()
  password?: string;

  @Prop({ type: Types.ObjectId, ref: 'Role' })
  role: Role;

  @Prop({ type: String, enum: AuthProvider, required: true })
  provider: AuthProvider;

  @Prop()
  providerId?: string;

  @Prop()
  picture?: string;

  @Prop({ type: Boolean, default: false })
  isPhoneVerified: boolean;

  @Prop({ type: Boolean, default: false })
  isEmailVerified: boolean;

  @Prop()
  resetToken?: string;

  @Prop()
  resetShortToken?: string;

  @Prop()
  resetTokenExpiresAt?: Date;

  @Prop({ default: true })
  isActive: boolean;

}

export const UserSchema = SchemaFactory.createForClass(User); 