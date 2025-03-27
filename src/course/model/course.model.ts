import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose'
import { Course } from "../interface/course.interface";
import slugify from "slugify";

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

    @Prop({ type: String, required: false, unique:true })
    slug: string

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const CourseSchema = SchemaFactory.createForClass(CourseModel);

CourseSchema.pre('save', function (next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});