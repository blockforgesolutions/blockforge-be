import { Document, Types } from "mongoose";
import { Lesson } from "../interface/lesson.interface";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import slugify from "slugify";

export type LessonDocument = Lesson & Document;

@Schema({ timestamps: true })
export class LessonModel extends Document implements Lesson {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ type: Types.ObjectId, ref: 'Module', required: true })
    moduleId: Types.ObjectId;

    @Prop({ required: true })
    videoUrl: string;

    @Prop()
    quiz?: [string];

    @Prop({required:false, unique:true, type: String})
    slug: string

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const LessonSchema = SchemaFactory.createForClass(LessonModel);

LessonSchema.pre('save', function (next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});