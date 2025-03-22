import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose'
import { Module } from "../interface/module.interface";

export type ModuleDocument = Module & Document;

@Schema({ timestamps: true })
export class ModuleModel extends Document implements Module {
    @Prop({ required: true })
    title: string
    @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
    course: Types.ObjectId

    @Prop()
    createdAt: Date
    @Prop()
    updatedAt: Date
}

export const ModuleSchema = SchemaFactory.createForClass(ModuleModel);