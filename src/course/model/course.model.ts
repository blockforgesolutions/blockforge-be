import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose'
import { Course } from "../interface/course.interface";

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class CourseModel extends Document implements Course {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    instructor: Types.ObjectId;

    @Prop({ type: String, default: '/images/default-thumbnail.png' })
    thumbnail?: string;

    @Prop({ type: Number, default: 0, required: true })
    price: number;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const CourseSchema = SchemaFactory.createForClass(CourseModel);