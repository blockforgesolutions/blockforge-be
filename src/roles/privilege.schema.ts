import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Privilege extends Document {
  @ApiProperty({
    example: 'CREATE_USER',
    description: 'Unique name of the privilege',
  })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({
    example: 'Can create new users',
    description: 'Description of what this privilege allows',
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    example: 'users',
    description: 'The resource this privilege applies to',
  })
  @Prop({ required: true })
  resource: string;

  @ApiProperty({
    example: 'create',
    description: 'The action allowed on the resource',
  })
  @Prop({ required: true })
  action: string;
}

export const PrivilegeSchema = SchemaFactory.createForClass(Privilege); 