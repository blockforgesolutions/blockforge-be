import { Document, Types } from "mongoose";
import { Lesson } from "../interface/lesson.interface";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type LessonDocument = Lesson & Document;

@Schema({ timestamps: true })
export class LessonModel extends Document implements Lesson {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
    course: Types.ObjectId;

    @Prop({ required: true })
    videoUrl: string;

    @Prop()
    quiz?: [string];

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const LessonSchema = SchemaFactory.createForClass(LessonModel);