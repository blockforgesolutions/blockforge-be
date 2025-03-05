import { Document, Types } from "mongoose";
import { Progress } from "../interface/progress.interface";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


export type ProgressDocument = Progress & Document;

@Schema({ timestamps: true })
export class ProgressModel extends Document implements Progress {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
    courseId: Types.ObjectId;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Lesson' }] })
    completedLessons: [Types.ObjectId];

    @Prop({ required: true, default: 0 })
    progressPercentage: number;
}

export const ProgressSchema = SchemaFactory.createForClass(ProgressModel);