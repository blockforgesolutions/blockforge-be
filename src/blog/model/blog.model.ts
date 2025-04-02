import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, Types } from 'mongoose'
import slugify from "slugify";
import { Blog } from "../interface/blog.interface";

export type BlogDocument = Blog & Document;

@Schema({ timestamps: true })
export class BlogModel extends Document implements Blog {
    @Prop({ type: Object, required: true })
    title: { tr: string; en: string; };

    @Prop({ type: String, required: false, unique: true })
    slug: string;

    @Prop({ required: true })
    heroUrl: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'CategoryModel' }] })
    categories: MongooseSchema.Types.ObjectId[];

    @Prop({ required: true })
    coverUrl: string;

    @Prop({ required: true })
    duration: string;

    @Prop({ type: Object, required: true })
    description: { tr: string; en: string; };

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    author: Types.ObjectId;

    @Prop({ type: Object, required: true })
    content: { tr: string; en: string; };

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(BlogModel);

BlogSchema.pre('save', function (next) {
    if (this.title.en) {
        this.slug = slugify(this.title.en, { lower: true, strict: true });
    }
    next();
});