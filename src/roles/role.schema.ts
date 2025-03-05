import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Privilege } from './privilege.schema';
import { User } from '../user/user.schema';

@Schema({ timestamps: true })
export class Role extends Document {
  @ApiProperty({
    example: 'MANAGER',
    description: 'Unique name of the role',
  })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({
    example: 'System Administrator',
    description: 'Description of the role',
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    example: 'USER',
    description: 'Parent role that this role inherits from',
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role' })
  parent?: Role;

  @ApiProperty({
    type: [String],
    description: 'List of privileges assigned to this role',
  })
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Privilege' }] })
  privileges: Privilege[];

  @ApiProperty({
    description: 'User who created this role',
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy?: User;
}

export const RoleSchema = SchemaFactory.createForClass(Role); 