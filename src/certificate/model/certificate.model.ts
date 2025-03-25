import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose'
import { Certificate } from "../interface/certificate.interface";

export type CertificateDocument = Certificate & Document;

@Schema({ timestamps: true })
export class CertificateModel {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId
    
    @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
    courseId: Types.ObjectId
    
    @Prop({ required: true })
    certificateUrl: string

    @Prop()
    createdAt: Date
    @Prop()
    updatedAt: Date
}

export const CertificateSchema = SchemaFactory.createForClass(CertificateModel);