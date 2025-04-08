import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose'
import { Category, CategoryType } from "../interface/category.interface";
import slugify from "slugify";

export type CategoryDocument = Category & Document;

export enum CategoryEnum {
    COURSE = 'COURSE',
    BLOG = 'BLOG'
}

@Schema({ timestamps: true })
export class CategoryModel extends Document implements Category {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true, enum: CategoryEnum })
    type: CategoryType;

    @Prop({ required: false, unique: true })
    slug: string;

    @Prop()
    createdAt: Date

    @Prop()
    updatedAt: Date
}

export const CategorySchema = SchemaFactory.createForClass(CategoryModel);

CategorySchema.pre('save', function (next) {
    if (this.name) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});